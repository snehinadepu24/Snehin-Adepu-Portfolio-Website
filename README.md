# Snehin Adepu | Engineering Portfolio

A visually stunning, interactive, and responsive personal portfolio website built with modern web technologies. The site features premium design aesthetics, smooth animations, and advanced scroll-based interactions to showcase engineering projects, skills, and experience with a highly polished user experience.

## ✨ Features

- **Smooth Video Scrubbing:** Custom canvas-based rendering approach to eliminate seeking artifacts, seamlessly synchronized with the user's scroll position.
- **Floating Action Button (FAB):** A dynamic contact button that expands on hover to reveal social links (GitHub, LinkedIn, Email, Phone) and intelligently hides when the main contact section is in view.
- **Premium Aesthetics:** Sleek dark mode design with glassmorphism, glowing gold and blue accents, customized scrollbars, and dynamic hover effects.
- **Interactive Timelines & Showcases:** beautifully animated experience timeline and project cards that fade and glide into view on scroll.
- **3D Integrations:** Prepared for 3D elements utilizing Three.js.
- **Fully Responsive:** Painstakingly tailored to look flawless on both desktop monitors and mobile screens.

## 🛠️ Technology Stack

- **Core:** HTML5, modern Vanilla CSS3, Vanilla JavaScript
- **Graphics/Animation:** Three.js (via CDN), Canvas API for video manipulation
- **Build Tool:** Vite (for rapid development and optimized production bundling)
- **Typography:** Google Fonts (Inter, JetBrains Mono)

## 📂 Project Structure

```text
Snehin-Adepu-Portfolio-Website/
├── public/                 # Static assets (images, videos, icons)
├── src/
│   └── index.css           # Global CSS utilities and variables
├── index.html              # Main HTML structure including embedded styles & logic
├── package.json            # Project dependencies and NPM scripts
├── vite.config.ts          # Vite configuration and path aliases
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) installed on your computer.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/snehinadepu24/Snehin-Adepu-Portfolio-Website.git
   cd Snehin-Adepu-Portfolio-Website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Development

To start the local development server with hot-module replacement (HMR), run:

```bash
npm run dev
```
Navigate to `http://localhost:5173` (or the URL shown in your terminal) to view the site in your browser.

### Production Build

To build the static assets for production deployment, run:

```bash
npm run build
```
This will generate a `dist/` folder containing the optimized and minified files ready to be hosted on platforms like GitHub Pages, Vercel, Netlify, etc.

To preview the built production site locally:
```bash
npm run preview
```

## 📜 License

This project is proprietary. All rights reserved by Snehin Adepu.
