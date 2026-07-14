import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Place photos come from Google Places + platform thumbnails; widen at build time.
    remotePatterns: [
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
    ],
  },
};

export default nextConfig;
