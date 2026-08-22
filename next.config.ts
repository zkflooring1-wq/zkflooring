import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-bc67e2c069bd4bbeac1a9624c01f79db.r2.dev",
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