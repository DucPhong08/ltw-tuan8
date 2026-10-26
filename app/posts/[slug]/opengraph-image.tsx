import { OG_SIZE, renderOgImage } from "@/lib/og-image";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";

// Mỗi bài viết một ảnh OG sinh từ tiêu đề + tóm tắt.
export const alt = `Ảnh bìa bài viết trên ${SITE.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return renderOgImage({
    label: post?.author.name ? `Bài viết · ${post.author.name}` : "Bài viết",
    title: post?.title ?? SITE.name,
    subtitle: post?.excerpt ?? SITE.description,
  });
}
