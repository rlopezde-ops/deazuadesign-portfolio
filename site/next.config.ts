import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages hosting. `/leadership` exports to `leadership.html`, and internal
  // links use those `*.html` URLs. The rewrite gives `next dev` the same paths.
  ...(process.env.NODE_ENV === "development"
    ? { rewrites: async () => [{ source: "/:path*.html", destination: "/:path*" }] }
    : { output: "export" }),
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
