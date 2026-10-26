import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/lib/prisma";

/** Tag chung cho mọi dữ liệu bài viết công khai — Server Action gọi updateTag(POSTS_TAG) sau khi sửa. */
export const POSTS_TAG = "posts";

/** Truy vấn công khai, cache lại → trang chủ được prerender thành HTML tĩnh. */
export async function getPublishedPosts() {
  "use cache";
  cacheLife("hours");
  cacheTag(POSTS_TAG);

  return prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      createdAt: true,
      updatedAt: true,
      author: { select: { name: true } },
    },
  });
}

/** Dùng chung cho page, generateMetadata và opengraph-image — `use cache` gộp thành 1 lần truy vấn. */
export async function getPostBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(POSTS_TAG);

  return prisma.post.findFirst({
    where: { slug, published: true },
    include: { author: { select: { name: true } } },
  });
}
