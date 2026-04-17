import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // WebP only. AVIF at the same nominal quality is more aggressive on
    // flat product photography (subtle gradients get smoothed) and users
    // reported product images looking blurrier than the old WordPress site.
    // WebP is closer to the old JPEG fidelity at q>=90.
    formats: ["image/webp"],
    // Next.js 16 requires explicit `qualities` allowlist; default is [75]
    // only, which silently downgrades any <Image quality={...}> value.
    // Allow 75 (low-priority/lazy), 90 (cards), 95 (hero/gallery).
    qualities: [75, 90, 95],
    // Cache optimised image responses for 60 days on Vercel's edge.
    minimumCacheTTL: 60 * 60 * 24 * 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pirreklam.com.tr",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  // Compression is enabled by default (gzip); keep explicit for clarity.
  compress: true,
  async redirects() {
    return [
      { source: "/shop/", destination: "/", permanent: true },
      { source: "/basket/", destination: "/sepet/", permanent: true },
      { source: "/checkout/", destination: "/sepet/", permanent: true },
      { source: "/giris-yap-kayit-ol/", destination: "/", permanent: true },
      { source: "/feed/", destination: "/", permanent: true },
      { source: "/comments/feed/", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      // Global security headers (unchanged)
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      // Long-lived immutable caching for Next.js build artifacts
      // (hashed filenames make this safe forever).
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Long cache for static assets in /public (logos, hero bg, icons).
      // Revalidate daily so manual uploads propagate quickly.
      {
        source: "/:asset(.+\\.(?:webp|avif|jpg|jpeg|png|svg|ico|woff2?|ttf))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
