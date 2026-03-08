# AH Labs Inc - Modern SaaS Website

A professional, modern SaaS-style website showcasing AI automation tools and autonomous drone systems.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Framer Motion** (animations)
- **Lucide React** (icons)

## Getting Started

### Installation

1. Install dependencies:

```bash
npm install
```

2. (Optional) Configure ChatBot URL:

Create a `.env.local` file and add:

```
NEXT_PUBLIC_CHATBOT_URL=https://your-chatbot-url.com
```

### Running the Development Server

#### Option 1: Using the start script (Windows)

```bash
start.bat
```

This will automatically clear port 3000 and start the dev server.

#### Option 2: Manual start

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  layout.tsx          # Root layout with navbar, footer
  page.tsx            # Homepage
  /projects
    page.tsx          # Projects overview
    /chattybot
      page.tsx        # ChattyBot project page
    /drone
      page.tsx        # Drone systems page
  /about
    page.tsx          # About page
  /contact
    page.tsx          # Contact page with form

/components
  /ui
    display-cards.tsx # Stacked cards component
  navbar.tsx          # Navigation bar
  hero.tsx            # Hero section
  project-grid.tsx    # Projects grid
  project-card.tsx    # Individual project card
  chatbot-widget.tsx  # Live chatbot widget
  footer.tsx          # Footer

/lib
  utils.ts            # Utility functions
```

## Features

### Homepage
- Animated hero section with gradient backgrounds
- Stacked display cards with framer-motion animations
- Featured projects grid
- Responsive design (mobile, tablet, desktop)

### Projects
- **ChattyBot**: AI customer support and automation platform
  - Lead capture and CRM integration
  - SMS/email automation
  - Calendar booking
  - Knowledge base retrieval
  - Live chatbot widget demo

- **Autonomous Drones**: Advanced aerial robotics
  - Computer vision and object detection
  - Sensor fusion (IMU, GPS, LiDAR)
  - NVIDIA Jetson compute platform
  - Autonomous navigation

### Live ChatBot Widget
- Floating widget in bottom right
- Configurable via environment variable
- Demo mode with sample messages
- Expandable chat panel

### Design Features
- Dark mode by default
- Glassmorphism effects
- Blur backgrounds
- Gradient accents
- Smooth animations
- Professional SaaS aesthetic

## Deployment

### Vercel (Recommended)

```bash
npm run build
```

Deploy to Vercel with one click or via CLI:

```bash
vercel
```

## Customization

### Updating Content
- Edit project data in `/components/project-grid.tsx`
- Modify hero cards in `/components/hero.tsx`
- Update contact info in `/components/footer.tsx`

### Styling
- Global styles: `/app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Colors and themes are configured via CSS variables

### ChatBot Integration
Set `NEXT_PUBLIC_CHATBOT_URL` in `.env.local` to connect your chatbot iframe.

## License

All rights reserved - AH Labs Inc © 2026
