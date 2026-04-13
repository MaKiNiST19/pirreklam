import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
