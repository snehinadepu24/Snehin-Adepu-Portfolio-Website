# Portfolio Revamp — Execution Plan

Based on your [plan](file:///D:/Snehin-Adepu-Portfolio-Website/.cursor/plans/portfolio_complete_revamp_1e7783b8.plan.md), here's the concrete step-by-step execution:

---

## Step 1: Scaffold Next.js App Router _(current)_
- [ ] Initialize Next.js App Router in-repo
- [ ] Move `public/` assets (frames, profile, favicons, OG)
- [ ] Set up `next/font` with Instrument Serif, Geist, IBM Plex Mono
- [ ] Restore SEO metadata + JSON-LD in `app/layout.tsx`
- [ ] Configure TypeScript, ESLint
- [ ] Remove old Vite config and inline HTML

## Step 2: Visual System — Tokens, Typography, Nav, Homepage Layout
- [ ] Design tokens CSS (copper `#C45C26`, bone `#F3EEE6`, warm black `#0C0B09`, muted ink `#8A847A`)
- [ ] 12-column grid system, large margins, asymmetric layouts
- [ ] `SA` monogram nav with solid bar (not glass)
- [ ] Mobile nav with Vaul drawer
- [ ] Homepage sections without 3D: Hero, Selected Work, Experience, Capabilities, Lab, About, Contact

## Step 3: Hero Signature — Frame Scrubber + 3D Lattice
- [ ] Port 57-frame scrubber as `FrameScrubPortrait` React component
- [ ] R3F lattice (procedural `Line`/`Segments`, no GLB)
- [ ] SVG fallback for `prefers-reduced-motion`
- [ ] `dynamic(..., { ssr: false })`, pause when offscreen

## Step 4: Content & Case Studies
- [ ] Typed content JSON (projects, experience, achievements — verified copy only)
- [ ] `/work` index route
- [ ] `/work/[slug]` case-study routes (JanSamadhan, Monument/SAM, Loomylabs, Alfago)
- [ ] `/lab` route (IoT paper, irrigation, 3D restoration, AWS pipeline)
- [ ] Real screenshots via `next/image`

## Step 5: Motion & Accessibility
- [ ] GSAP + ScrollTrigger + SplitText registration
- [ ] SplitText line-mask reveals on headlines
- [ ] ScrollTrigger pin for project rows
- [ ] `prefers-reduced-motion`: skip SplitText, freeze frame 1, skip WebGL
- [ ] Keyboard nav, focus states, contrast, skip link, semantic landmarks

## Step 6: QA & Performance
- [ ] `next build` — zero errors
- [ ] ESLint clean
- [ ] Lighthouse audit vs current live site
- [ ] Mobile testing, WebGL-off testing
- [ ] Verify all links (résumé, contact, demos)

---

> [!IMPORTANT]
> **Starting with Step 1 now.** Each step will be committed before moving to the next.
