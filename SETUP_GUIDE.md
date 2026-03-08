# AH Labs Inc - Quick Setup Guide

## ✅ Project Setup Complete!

Your modern SaaS website has been fully scaffolded and is ready to launch.

## 🚀 Getting Started

### Start the Development Server

**Option 1: Use the start script (Recommended)**

Simply double-click `start.bat` or run from command line:

```bash
start.bat
```

**Option 2: Manual start**

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
AH Labs Inc/
├── app/
│   ├── layout.tsx              # Root layout with navbar & footer
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles
│   ├── about/
│   │   └── page.tsx            # About page
│   ├── contact/
│   │   └── page.tsx            # Contact form page
│   └── projects/
│       ├── page.tsx            # Projects overview
│       ├── chattybot/
│       │   └── page.tsx        # ChattyBot details
│       └── drone/
│           └── page.tsx        # Drone systems details
├── components/
│   ├── navbar.tsx              # Navigation bar
│   ├── hero.tsx                # Hero section
│   ├── project-grid.tsx        # Projects grid
│   ├── project-card.tsx        # Individual project cards
│   ├── chatbot-widget.tsx      # Live chatbot widget
│   ├── footer.tsx              # Footer
│   └── ui/
│       └── display-cards.tsx   # Animated stacked cards
├── lib/
│   └── utils.ts                # Utility functions
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── start.bat                   # Launch script
```

## 🎨 Features Included

### Pages
- **Homepage**: Hero section with animated cards + project grid
- **Projects**: Overview of ChattyBot and Drone Systems
- **ChattyBot Page**: Detailed product page with features
- **Drone Systems Page**: Technical specs and roadmap
- **About Page**: Company mission and values
- **Contact Page**: Contact form with validation

### Components
- Responsive navbar with dropdown
- Animated hero section
- Live chatbot widget (configurable)
- Project cards with hover effects
- Professional footer
- Glassmorphism effects throughout

### Technical Features
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion animations
- Dark mode by default
- Fully responsive design
- SEO optimized

## 🤖 Configuring the ChatBot Widget

To connect your live chatbot:

1. Create a `.env.local` file in the root directory
2. Add your chatbot URL:

```env
NEXT_PUBLIC_CHATBOT_URL=https://your-chatbot-url.com
```

3. Restart the dev server

Without this configuration, the widget will show a demo mode.

## 🎯 What's Working

✅ All pages are fully functional
✅ Responsive design (mobile/tablet/desktop)
✅ Smooth animations with Framer Motion
✅ Live chatbot widget
✅ Contact form (UI only - needs backend)
✅ Professional SaaS design
✅ All dependencies installed

## 🔧 Customization

### Update Colors
Edit `tailwind.config.ts` and `app/globals.css`

### Modify Content
- Hero text: `components/hero.tsx`
- Projects: `components/project-grid.tsx`
- Contact info: `components/footer.tsx`

### Add New Pages
Create new folders in `/app` with a `page.tsx` file

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚢 Deploy to Vercel

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 🎉 You're All Set!

Run `start.bat` and visit http://localhost:3000 to see your new website!

---

Built with ❤️ by AH Labs Inc
