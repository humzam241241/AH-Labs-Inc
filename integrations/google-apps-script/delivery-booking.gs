const DELIVERY = Object.freeze({
  ORIGIN: "Durham Regional Police West Division, 1710 Kingston Road East, Pickering, ON L1V 1C6",
  TIME_ZONE: "America/Toronto",
  OPEN_HOUR: 10,
  CLOSE_HOUR: 20,
  SLOT_MINUTES: 30,
  MIN_NOTICE_HOURS: 4,
  MAX_ADVANCE_DAYS: 60,
  MAX_DRIVE_MINUTES: 90,
});

function doPost(event) {
  try {
    const input = JSON.parse(event.postData.contents || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("BOOKING_SECRET");
    if (!expectedSecret || input.secret !== expectedSecret) return json_({ ok: false, error: "Unauthorized." });
    if (input.action === "availability") return json_(availability_(input));
    if (input.action === "book") return json_(book_(input));
    return json_({ ok: false, error: "Unknown action." });
  } catch (error) {
    return json_({ ok: false, error: error && error.message ? error.message : "Booking service error." });
  }
}

function availability_(input) {
  validateDate_(input.date);
  validateAddress_(input.address);
  const travelMinutes = travelMinutes_(input.address);
  const day = parseLocalDate_(input.date);
  validateBookingDay_(day);
  const calendar = CalendarApp.getDefaultCalendar();
  const slots = [];
  for (let minute = DELIVERY.OPEN_HOUR * 60; minute + DELIVERY.SLOT_MINUTES <= DELIVERY.CLOSE_HOUR * 60; minute += DELIVERY.SLOT_MINUTES) {
    const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(minute / 60), minute % 60, 0, 0);
    const end = new Date(start.getTime() + DELIVERY.SLOT_MINUTES * 60000);
    if (isBookable_(calendar, start, end, travelMinutes)) slots.push(slot_(start, end));
  }
  return { ok: true, date: input.date, address: input.address, origin: DELIVERY.ORIGIN, travelMinutes: travelMinutes, slots: slots };
}

function book_(input) {
  validateAddress_(input.address);
  if (!input.customerName || String(input.customerName).trim().length < 2) throw new Error("Enter the customer name.");
  if (!input.requestId) throw new Error("Missing booking request ID.");
  const windowStart = new Date(input.slotStart);
  if (isNaN(windowStart.getTime())) throw new Error("Choose a valid delivery time.");
  const windowEnd = new Date(windowStart.getTime() + DELIVERY.SLOT_MINUTES * 60000);
  validateBookingDay_(new Date(windowStart.getFullYear(), windowStart.getMonth(), windowStart.getDate()));
  if (windowStart.getMinutes() % DELIVERY.SLOT_MINUTES !== 0 || windowStart.getSeconds() !== 0) throw new Error("Choose a listed delivery time.");
  if (windowStart.getHours() < DELIVERY.OPEN_HOUR || windowEnd.getHours() > DELIVERY.CLOSE_HOUR || (windowEnd.getHours() === DELIVERY.CLOSE_HOUR && windowEnd.getMinutes() > 0)) throw new Error("Choose a delivery time within booking hours.");

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw new Error("Another booking is being processed. Try again.");
  try {
    const calendar = CalendarApp.getDefaultCalendar();
    const existing = calendar.getEventsForDay(windowStart);
    const duplicate = existing.find(function(event) { return event.getDescription().indexOf("Request ID: " + input.requestId) !== -1; });
    if (duplicate) return bookingResponse_(duplicate, windowStart, windowEnd, Number(duplicate.getTag("travelMinutes") || 0));

    const travelMinutes = travelMinutes_(input.address);
    if (!isBookable_(calendar, windowStart, windowEnd, travelMinutes)) throw new Error("That time is no longer available. Choose another slot.");
    const blockStart = new Date(windowStart.getTime() - travelMinutes * 60000);
    const blockEnd = new Date(windowEnd.getTime() + travelMinutes * 60000);
    const bookingId = "AHG-" + Utilities.getUuid().slice(0, 8).toUpperCase();
    const description = [
      "AH Gifts delivery booking",
      "Booking ID: " + bookingId,
      "Request ID: " + input.requestId,
      "Customer window: " + format_(windowStart) + "–" + Utilities.formatDate(windowEnd, DELIVERY.TIME_ZONE, "h:mm a"),
      "Estimated drive each way: " + travelMinutes + " minutes from " + DELIVERY.ORIGIN,
      "",
      "Customer: " + input.customerName,
      "Phone: " + (input.phone || "Not provided"),
      "Email: " + (input.email || "Not provided"),
      "Order or item: " + (input.order || "Not provided"),
      "Notes: " + (input.notes || "None"),
      "Delivery address: " + input.address,
    ].join("\n");
    const event = calendar.createEvent("AH Gifts delivery — " + input.customerName, blockStart, blockEnd, { description: description, location: input.address });
    event.setVisibility(CalendarApp.Visibility.PRIVATE);
    event.setTag("bookingId", bookingId);
    event.setTag("requestId", input.requestId);
    event.setTag("travelMinutes", String(travelMinutes));
    return bookingResponse_(event, windowStart, windowEnd, travelMinutes);
  } finally {
    lock.releaseLock();
  }
}

function isBookable_(calendar, windowStart, windowEnd, travelMinutes) {
  const nowWithNotice = new Date(Date.now() + DELIVERY.MIN_NOTICE_HOURS * 3600000);
  if (windowStart < nowWithNotice) return false;
  const blockStart = new Date(windowStart.getTime() - travelMinutes * 60000);
  const blockEnd = new Date(windowEnd.getTime() + travelMinutes * 60000);
  return !calendar.getEvents(blockStart, blockEnd).some(function(event) {
    return event.getStartTime() < blockEnd && event.getEndTime() > blockStart;
  });
}

function travelMinutes_(address) {
  const directions = Maps.newDirectionFinder().setOrigin(DELIVERY.ORIGIN).setDestination(address).setMode(Maps.DirectionFinder.Mode.DRIVING).getDirections();
  const route = directions.routes && directions.routes[0];
  const leg = route && route.legs && route.legs[0];
  if (!leg || !leg.duration || !leg.duration.value) throw new Error("We could not calculate a driving route to that address. Check the address and postal code.");
  const minutes = Math.max(5, Math.ceil((leg.duration.value / 60) / 5) * 5);
  if (minutes > DELIVERY.MAX_DRIVE_MINUTES) throw new Error("That address is outside the current delivery area.");
  return minutes;
}

function validateBookingDay_(day) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDay = new Date(today.getTime() + DELIVERY.MAX_ADVANCE_DAYS * 86400000);
  if (day < today || day > lastDay) throw new Error("Choose a date within the next " + DELIVERY.MAX_ADVANCE_DAYS + " days.");
}

function validateDate_(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date || ""))) throw new Error("Choose a valid delivery date.");
}

function validateAddress_(address) {
  if (!address || String(address).trim().length < 8 || String(address).length > 240) throw new Error("Enter a complete delivery address.");
}

function parseLocalDate_(date) {
  const parts = date.split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
}

function slot_(start, end) {
  return { start: start.toISOString(), end: end.toISOString(), label: Utilities.formatDate(start, DELIVERY.TIME_ZONE, "h:mm a") + "–" + Utilities.formatDate(end, DELIVERY.TIME_ZONE, "h:mm a") };
}

function bookingResponse_(event, windowStart, windowEnd, travelMinutes) {
  return {
    ok: true,
    bookingId: event.getTag("bookingId"),
    customerWindow: format_(windowStart) + "–" + Utilities.formatDate(windowEnd, DELIVERY.TIME_ZONE, "h:mm a"),
    departureTime: format_(event.getStartTime()),
    estimatedReturnTime: format_(event.getEndTime()),
    travelMinutes: travelMinutes,
  };
}

function format_(date) {
  return Utilities.formatDate(date, DELIVERY.TIME_ZONE, "EEE, MMM d 'at' h:mm a");
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
