import type { NextConfig } from "next";

/**
 * When building for GitHub Pages (project site served at
 * `https://<user>.github.io/<repo>/`) we need a base path/asset prefix and a
 * fully static export. The `GITHUB_PAGES` env var is set by the deploy workflow
 * so local dev keeps serving from `/` with normal behaviour.
 */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repository = "dreamkit";
const apiProxyOrigin = process.env.API_PROXY_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  ...(isGithubPages ? { output: "export" as const } : { output: "standalone" }),
  trailingSlash: true,
  basePath: isGithubPages ? `/${repository}` : undefined,
  assetPrefix: isGithubPages ? `/${repository}/` : undefined,
  async rewrites() {
    if (isGithubPages) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${apiProxyOrigin}/api/:path*`,
      },
    ];
  },
  images: {
    // GitHub Pages has no image optimization server, so serve images as-is.
    unoptimized: true,
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
