import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dreamkit.vn",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
