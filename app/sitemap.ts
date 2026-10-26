import type { MetadataRoute } from "next";

import { getPublishedPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const latest = posts[0]?.updatedAt;

  return [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    ...posts.map((post) => ({
      url: absoluteUrl(`/posts/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
