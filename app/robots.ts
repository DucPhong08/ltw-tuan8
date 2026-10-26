import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Trang riêng tư không cần index (vẫn được bảo vệ bằng auth — robots.txt KHÔNG phải cơ chế bảo mật).
      disallow: ["/admin", "/dashboard", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
