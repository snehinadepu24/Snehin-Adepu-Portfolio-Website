import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Full Next.js on Vercel — no static export
  // Cloudflare handles DNS, Vercel is the origin
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Tells the bundler to tree-shake only the used exports from these
    // large packages — reduces per-chunk size and speeds up compilation
    optimizePackageImports: ["lucide-react", "motion", "@react-three/drei"],
  },
};

export default nextConfig;
