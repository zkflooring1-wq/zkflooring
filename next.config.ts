import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {
        source: "/:path*.(webp|png|jpg|jpeg|gif|svg|ico|ttf|woff2|woff)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.(css|js)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/admin-login.php",
        destination: "http://localhost:3001/admin-login.php",
        permanent: false,
      },
      {
        source: "/admin",
        destination: "http://localhost:3001/dashboard",
        permanent: false,
      },
      {
        source: "/admin/:path*",
        destination: "http://localhost:3001/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
