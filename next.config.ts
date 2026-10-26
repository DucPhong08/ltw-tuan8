import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Tailwind sinh CSS nhỏ → chèn thẳng vào <head>, bỏ request CSS chặn render (cải thiện FCP/LCP).
  experimental: { inlineCss: true },
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
