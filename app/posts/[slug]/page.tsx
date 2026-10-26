import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Graph } from "schema-dts";

import { JsonLd } from "@/components/JsonLd";
import { formatDate } from "@/lib/format";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { absoluteUrl, SITE } from "@/lib/site";

/** Prerender sẵn các bài đã có lúc build; bài mới đăng sau đó được render lần đầu rồi lưu cache (ISR). */
export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Không tìm thấy bài viết", robots: { index: false } };

  const path = `/posts/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: path },
    authors: post.author.name ? [{ name: post.author.name }] : undefined,
    openGraph: {
      type: "article",
      url: path,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.author.name ? [post.author.name] : undefined,
    },
  };
}

type Post = NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>;

/** BlogPosting + BreadcrumbList — đủ điều kiện cho kết quả tìm kiếm dạng bài viết có đường dẫn. */
function buildPostJsonLd(post: Post): Graph {
  const url = absoluteUrl(`/posts/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: post.title,
        description: post.excerpt,
        image: `${url}/opengraph-image`,
        datePublished: post.createdAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        inLanguage: "vi-VN",
        author: { "@type": "Person", name: post.author.name ?? "Ẩn danh" },
        publisher: { "@type": "Organization", name: SITE.name, url: absoluteUrl("/") },
        isPartOf: { "@id": absoluteUrl("/#blog") },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: post.title, item: url },
        ],
      },
    ],
  };
}

async function PostContent({ params }: Pick<PageProps<"/posts/[slug]">, "params">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="space-y-6">
      <JsonLd data={buildPostJsonLd(post)} />
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-sm text-slate-600">
          {post.author.name ?? "Ẩn danh"} · <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
        </p>
        <p className="text-lg text-slate-700">{post.excerpt}</p>
      </header>
      <div className="space-y-4 leading-7 text-slate-800">
        {post.content.split(/\n\s*\n/).map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

export default function PostPage({ params }: PageProps<"/posts/[slug]">) {
  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb">
        <Link href="/" className="text-sm text-indigo-700 hover:underline">
          ← Tất cả bài viết
        </Link>
      </nav>
      <Suspense fallback={<p className="text-slate-600">Đang tải bài viết…</p>}>
        <PostContent params={params} />
      </Suspense>
    </div>
  );
}
