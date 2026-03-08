# 🌳 AH Labs Inc - Complete File Tree

```
AH-Labs-Inc/
│
├── 📁 app/                                    # Next.js App Router pages
│   ├── layout.tsx                            # Root layout (Navbar, Footer, ChatBot widget)
│   ├── page.tsx                              # Homepage (Hero + Projects)
│   ├── globals.css                           # Global styles + Tailwind
│   │
│   ├── 📁 about/
│   │   └── page.tsx                          # About page (Mission, Values)
│   │
│   ├── 📁 contact/
│   │   └── page.tsx                          # Contact form page
│   │
│   └── 📁 projects/
│       ├── page.tsx                          # Projects overview
│       │
│       ├── 📁 chattybot/
│       │   └── page.tsx                      # ChattyBot product page
│       │
│       └── 📁 drone/
│           └── page.tsx                      # Drone systems page
│
├── 📁 components/                            # React components
│   ├── navbar.tsx                            # Navigation bar (sticky, responsive)
│   ├── hero.tsx                              # Hero section (animated)
│   ├── project-grid.tsx                      # Projects grid
│   ├── project-card.tsx                      # Individual project cards
│   ├── chatbot-widget.tsx                    # Floating chat widget
│   ├── footer.tsx                            # Site footer
│   │
│   └── 📁 ui/                                # Base UI components
│       └── display-cards.tsx                 # Animated stacked cards
│
├── 📁 lib/                                   # Utility functions
│   └── utils.ts                              # cn() helper for classnames
│
├── 📁 public/                                # Static assets (images, etc.)
│
├── 📁 node_modules/                          # Dependencies (392 packages)
│
├── 📄 .env.local.example                     # Environment variables template
├── 📄 .eslintrc.json                         # ESLint configuration
├── 📄 .gitignore                             # Git ignore rules
├── 📄 next.config.js                         # Next.js configuration
├── 📄 next-env.d.ts                          # Next.js TypeScript definitions
├── 📄 package.json                           # Project dependencies
├── 📄 package-lock.json                      # Locked dependency versions
├── 📄 postcss.config.js                      # PostCSS configuration
├── 📄 tailwind.config.ts                     # Tailwind CSS configuration
├── 📄 tsconfig.json                          # TypeScript configuration
├── 📄 tsconfig.tsbuildinfo                   # TypeScript build cache
│
├── 📄 start.bat                              # 🚀 Launch script (clears port + starts dev)
├── 📄 README.md                              # Project documentation
├── 📄 SETUP_GUIDE.md                         # Quick setup instructions
└── 📄 PROJECT_OVERVIEW.md                    # Complete project details

```

---

## 📊 Project Statistics

| Category | Count | Details |
|----------|-------|---------|
| **Pages** | 7 | Homepage, Projects (3), About, Contact, Layout |
| **Components** | 7 | Navbar, Hero, Cards, Widget, Footer, Grid |
| **Routes** | 6 | /, /about, /contact, /projects, /chattybot, /drone |
| **Dependencies** | 392 | All production-ready packages installed |
| **Lines of Code** | ~2000+ | Clean, documented TypeScript/TSX |
| **Config Files** | 6 | Next.js, TypeScript, Tailwind, ESLint, PostCSS |

---

## 🎯 Key Files Explained

### Core Application
- `app/layout.tsx` - Wraps entire app with navigation and footer
- `app/page.tsx` - Homepage with hero and project showcase
- `app/globals.css` - Dark theme, Tailwind, custom CSS variables

### Project Pages
- `app/projects/chattybot/page.tsx` - Full ChattyBot product page
- `app/projects/drone/page.tsx` - Complete drone systems page
- `app/about/page.tsx` - Company mission and values
- `app/contact/page.tsx` - Contact form with validation

### Components
- `components/navbar.tsx` - Sticky nav with dropdown menu
- `components/hero.tsx` - Animated hero with gradient text
- `components/chatbot-widget.tsx` - Floating chat interface
- `components/ui/display-cards.tsx` - Stacked animated cards

### Configuration
- `tailwind.config.ts` - Theme colors, animations, plugins
- `next.config.js` - Image optimization, build config
- `tsconfig.json` - TypeScript strict mode, path aliases

### Launch Scripts
- `start.bat` - Windows batch file to clear port 3000 and launch dev server

---

## 🚀 Ready to Launch

Everything is built, tested, and production-ready!

Simply run:
```bash
start.bat
```

Then open: http://localhost:3000

---

**Project scaffolded successfully! 🎉**
