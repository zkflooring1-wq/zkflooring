import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-2655d63d177643869a1153fc999fe104.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vsdvpvmnwmpwvjmcckju.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;