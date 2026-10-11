# Snehin Adepu | Engineering Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12+-88D400?style=flat-square)](https://gsap.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://www.snehinadepu.me/)

A high-performance, visually stunning personal portfolio website showcasing engineering work, ML systems, and backend architecture. Built with cutting-edge web technologies, optimized for speed and accessibility.

**Live Site:** [snehinadepu.me](https://www.snehinadepu.me/)

---

## 🚀 Performance Optimizations

This site is engineered for **maximum performance** and smooth user experience across all devices:

### Rendering Performance

- **Lazy Loading & Code Splitting:** Heavy 3D components dynamically imported with `next/dynamic` to reduce initial bundle size
- **requestAnimationFrame Optimization:** All animations use rAF loops with smart pausing when components scroll out of view
- **Vector3 Pre-allocation:** 3D math operations (Three.js) use pre-allocated scratch vectors to eliminate heap allocations (~1,920 GC events/sec prevented in hero section)
- **Batched GSAP ScrollTriggers:** Reduced from ~15 individual triggers to 6 batched triggers via `ScrollTrigger.batch()` for efficient scroll event handling
- **IntersectionObserver Visibility Gates:** Aurora (WebGL), CobeGlobe, and 3D scenes pause rendering when off-screen; resume on scroll back

### Image & Media Optimization

- **Cloudflare Image Optimization:** All images served through Cloudflare's CDN with automatic format conversion (WebP/AVIF), responsive sizing, and aggressive caching
- **Frame Preloading Strategy:** 50-frame video scrubber preloads first 18 frames immediately, defers remaining 32 frames with 600ms stagger to avoid blocking
- **Next.js Image Component:** Automatic optimization with AVIF/WebP fallbacks, layout-stable rendering, and responsive sizing

### CSS & Animation Optimizations

- **GPU-Accelerated Transforms:** All animations use `transform` and `opacity` (composited properties), never layout-triggering properties like `width/height`
- **Will-Change Lifecycle:** `will-change` only applied during animations, cleared after completion to free GPU compositing layers
- **CSS Containment:** Heavy background decorators use `contain: layout paint` to prevent layout recalc cascades
- **Removed Native Smooth Scroll:** Disabled `scroll-behavior: smooth` to prevent conflicts with GSAP ScrollTrigger

### JavaScript Bundle Optimization

- **Tree-Shaking:** Three.js and motion libraries optimized via Next.js `optimizePackageImports`
- **Dynamic Imports:** Client-only components imported with `{ ssr: false }` to avoid hydration mismatches
- **Debounced Resize:** Resize listeners debounced 120ms to prevent layout thrash on mobile address bar hide/show

### Event Handling & DOM

- **Shared Mouse Listeners:** Single global `mousemove` listener with rAF dispatch replaces per-instance listeners in Magnet components (6 handlers → 1)
- **Imperative Updates:** FrameScrubPortrait scroll events use direct DOM mutations (`ref.textContent`, `ref.style`) instead of React state updates (eliminated 60 re-renders/sec)
- **Passive Event Listeners:** All scroll/resize listeners use `{ passive: true }` to prevent render-blocking

### 3D & Canvas Performance

- **Removed MSAA Antialiasing:** Aurora and 3D scenes use `antialias: false` (smooth gradients don't need MSAA)
- **Responsive DPR Capping:** Mobile devices capped at 2× DPI ratio to prevent overdraw on high-DPI screens
- **PerformanceMonitor Fallback:** R3F `PerformanceMonitor` auto-downgrades DPR on slow devices

### Media Carousel

- **Hardware-Accelerated Scroll:** Drag-to-scroll carousel uses `transform: translateX()` on RAF loop, not CSS animation
- **Pause on Interaction:** Auto-scroll pauses on hover, keyboard focus, and drag operations
- **Touch & Mouse Support:** Native touch handling with momentum-aware scrolling

---

## ✨ Features

- **Interactive 3D Scenes**
  - HeroLattice: Deep learning neural network visualization with 32 animated data pulses
  - PipelineScene: LLM/RAG pipeline architecture with flowing particle streams (2 instances)
  - LoadBalancer3D: GCP load balancing visualization with request particle emitters
  - CobeGlobe: Animated 3D globe with marker locations (Hyderabad, SF, London, Tokyo, Indianapolis)

- **Advanced Scroll Interactions**
  - FrameScrubPortrait: 50-frame video scrubbing synchronized to scroll position
  - ScrollReveal: Fade-in animations with staggered delays and IntersectionObserver gating
  - GSAP ScrollTrigger: Batched scroll animations with parallax backgrounds
  - SplitHeading: Word-level text reveal animations with Framer Motion

- **Media Gallery**
  - Infinite auto-scrolling carousel with YouTube videos and LinkedIn posts
  - Drag-to-scroll and touch swipe support
  - Pause-on-hover and keyboard navigation
  - Respects `prefers-reduced-motion`

- **Premium UI Components**
  - CustomCursor: Spring-physics follow cursor with contextual badges
  - SpotlightCard: Ambient glow cards with pointer tracking and idle animations
  - Magnet: Magnetic hover effect with global event batching
  - DecryptedText: Hacker-style text decryption animation with configurable reveal patterns

- **Accessibility**
  - ARIA labels on all interactive elements
  - Skip links and keyboard navigation support
  - `prefers-reduced-motion` respected across all animations
  - Semantic HTML structure with proper heading hierarchy

- **SEO & Metadata**
  - Dynamic sitemap generation from project data
  - Open Graph and Twitter Card metadata
  - Canonical URLs
  - robots.txt for search engines

---

## 🛠️ Technology Stack

### Framework & Build

- **Next.js 14+** with App Router, Server Components, and Static Generation
- **React 18** with concurrent rendering
- **TypeScript** for type safety and DX
- **Vercel** for global edge deployment and serverless functions

### Animation & Interaction

- **GSAP 3.12** with ScrollTrigger plugin for scroll-driven animations
- **Framer Motion** for component-level animations and variants
- **Three.js & React Three Fiber (R3F)** for 3D rendering with automatic WebGL optimization
- **Cobe** for interactive 3D globe
- **OGL** (Open Game Library) for lightweight WebGL rendering (Aurora component)

### Styling & Design

- **CSS Modules** for scoped styling and zero-runtime CSS-in-JS
- **CSS Variables** for theming and dynamic values
- **PostCSS** for vendor prefixing and optimizations

### Performance & DevOps

- **Cloudflare** for image optimization, caching, and global CDN
- **Vercel Analytics** for Core Web Vitals monitoring
- **GitHub Actions** for CI/CD (linting, TypeScript checks, automated deploys)

### UI & Utilities

- **Lucide React** for icon system (16 handcrafted icons per component)
- **Vaul Drawer** for mobile navigation drawer
- **canvas-confetti** for celebration effects
- **Intersection Observer API** for scroll-based visibility detection

---

## 📂 Project Structure

```
Snehin-Adepu-Portfolio-Website/
├── app/
│   ├── page.tsx                    # Homepage with all sections
│   ├── page.module.css             # Homepage styles
│   ├── layout.tsx                  # Root layout with metadata & fonts
│   ├── globals.css                 # Global CSS variables & reset
│   ├── robots.ts                   # robots.txt generation
│   ├── sitemap.ts                  # Dynamic sitemap from project data
│   ├── work/
│   │   ├── page.tsx               # Work showcase index
│   │   ├── [slug]/page.tsx        # Case study detail page
│   │   └── [slug]/case-study.module.css
│   └── lab/
│       └── page.tsx               # Research & projects lab
├── components/
│   ├── Aurora.tsx                  # WebGL aurora background
│   ├── CobeGlobe.tsx              # Interactive 3D globe
│   ├── CustomCursor.tsx           # Spring-follow cursor
│   ├── DecryptedText.tsx          # Hacker-style text reveal
│   ├── FrameScrubPortrait.tsx     # Scroll-sync frame scrubber
│   ├── HeroLattice.tsx            # Deep learning neural net 3D
│   ├── LoadBalancer3D.tsx         # GCP load balancer 3D
│   ├── Magnet.tsx                 # Magnetic hover buttons
│   ├── MediaCarousel.tsx          # Drag-scrollable media gallery
│   ├── Nav.tsx                    # Navigation bar
│   ├── NumberTicker.tsx           # Animated number counter
│   ├── PipelineScene.tsx          # LLM/RAG pipeline 3D
│   ├── RocketLaunchOverlay.tsx    # Resume download animation
│   ├── ScrollReveal.tsx           # Scroll-triggered fade-in
│   ├── SpotlightCard.tsx          # Ambient glow card
│   ├── SplitHeading.tsx           # Word-level text animation
│   ├── Threads.tsx                # WebGL2 animated lines
│   └── Footer.tsx                 # Footer links & tech stack
├── content/
│   └── data.ts                     # Project metadata & experience data
├── public/
│   ├── frames/                    # 50 frame images for scrubber
│   ├── favicon.ico                # Favicon
│   ├── og-image.jpg               # Open Graph image
│   ├── profile.png                # Profile photo
│   ├── robots.txt                 # Search engine directives
│   └── Snehin-Adepu-Resume.pdf   # Downloadable resume
├── next.config.ts                 # Next.js config with optimizations
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript config
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/snehinadepu24/Snehin-Adepu-Portfolio-Website.git
   cd Snehin-Adepu-Portfolio-Website
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables** (optional):
   ```bash
   cp .env.example .env.local
   ```

### Development

Start the local development server with hot-module replacement:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. Changes auto-refresh instantly.

### Production Build

Build optimized static assets:

```bash
npm run build
npm start
```

Or preview the production build locally:

```bash
npm run build
npm run preview
```

### Linting & Type Checking

```bash
npm run lint          # ESLint
npm run type-check    # TypeScript
```

---

## 📊 Performance Metrics

**Target Metrics (Lighthouse):**

- ⚡ Performance: 90+
- ♿ Accessibility: 95+
- 🎯 Best Practices: 95+
- 🔍 SEO: 100

**Core Web Vitals:**

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

Achieved through lazy loading, image optimization, CSS containment, and rAF-batching.

---

## 🔗 API Routes

- `GET /sitemap.xml` — Dynamic sitemap for search engines
- `GET /robots.txt` — Search engine crawl directives

---

## 📜 License

This project is proprietary. All rights reserved © Snehin Adepu 2024-2026.

---

## 📧 Contact

- **Email:** [adepu.snehin@gmail.com](mailto:adepu.snehin@gmail.com)
- **GitHub:** [@snehinadepu24](https://github.com/snehinadepu24)
- **LinkedIn:** [Snehin Adepu](https://www.linkedin.com/in/snehin-adepu-1774b928b/)
- **Website:** [snehinadepu.me](https://www.snehinadepu.me/)
