# AH Gifts delivery calendar setup

The storefront uses a private Google Apps Script web app as its booking engine. The script reads the owner’s primary Google Calendar, calculates driving time with Google Maps, locks concurrent requests, and creates a private calendar event that includes the outbound and return drive.

## Booking rules

- Origin is Durham Regional Police West Division, 1710 Kingston Road East, Pickering, Ontario L1V 1C6.
- Customer windows are 30 minutes.
- Booking hours are 10:00 a.m. to 8:00 p.m. Eastern.
- Customers must give at least four hours’ notice and can book up to 60 days ahead.
- A route longer than 90 minutes each way is outside the current delivery area.
- The calendar event begins at estimated departure and ends at estimated return. Any overlapping Google Calendar event removes that customer window from availability.
- The final booking check runs inside a script lock, preventing two customers from claiming the same or overlapping window at once.

## Google Apps Script

1. Create a standalone Apps Script project in the calendar owner’s Google account.
2. Copy `integrations/google-apps-script/delivery-booking.gs` into `Code.gs`.
3. Replace the project manifest with `integrations/google-apps-script/appsscript.json`.
4. In Project Settings, add a script property named `BOOKING_SECRET` with a long random value.
5. Deploy as a web app that executes as the owner and is accessible to anyone.
6. Authorize Calendar, Maps, and external request access.

## Vercel

Add these variables to Production and Preview, then redeploy:

```text
DELIVERY_BOOKING_SCRIPT_URL=https://script.google.com/macros/s/.../exec
DELIVERY_BOOKING_SECRET=the-same-random-value
```

The secret stays server-side. The customer browser calls the Next.js API routes and never receives the Apps Script URL or secret.

## Refining later

Edit the `DELIVERY` constants at the top of the Apps Script to change hours, slot length, lead time, booking horizon, service radius, or origin. Create a new Apps Script deployment version after changing the script.
