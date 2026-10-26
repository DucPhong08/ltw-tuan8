import type { Metadata } from "next";
import Link from "next/link";
import type { Graph } from "schema-dts";

import { JsonLd } from "@/components/JsonLd";
import { formatDate } from "@/lib/format";
import { getPublishedPosts } from "@/lib/posts";
import { absoluteUrl, SITE } from "@/lib/site";

export const metadata: Metadata = {
  // `absolute` → trang chủ không bị nối "| LTWNC Blog" lần nữa.
  title: { absolute: `${SITE.name} — Next.js, Auth.js và SEO` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: SITE.name, description: SITE.description },
};

type PublishedPosts = Awaited<ReturnType<typeof getPublishedPosts>>;

/** WebSite + Blog (kèm danh sách bài) — giúp Google hiểu đây là trang chủ của một blog. */
function buildHomeJsonLd(posts: PublishedPosts): Graph {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: absoluteUrl("/"),
        name: SITE.name,
        description: SITE.description,
        inLanguage: "vi-VN",
      },
      {
        "@type": "Blog",
        "@id": absoluteUrl("/#blog"),
        url: absoluteUrl("/"),
        name: SITE.name,
        isPartOf: { "@id": absoluteUrl("/#website") },
        blogPost: posts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          url: absoluteUrl(`/posts/${post.slug}`),
          datePublished: post.createdAt.toISOString(),
          dateModified: post.updatedAt.toISOString(),
          author: { "@type": "Person", name: post.author.name ?? "Ẩn danh" },
        })),
      },
    ],
  };
}

export default async function HomePage() {
  const posts = await getPublishedPosts();

  return (
    <div className="space-y-8">
      <JsonLd data={buildHomeJsonLd(posts)} />
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Blog lập trình web nâng cao</h1>
        <p className="max-w-2xl text-slate-700">
          Ghi chép về Next.js App Router, xác thực với Auth.js, phân quyền nhiều lớp và tối ưu SEO. Đăng nhập để viết
          bài của riêng bạn.
        </p>
      </section>

      <section aria-labelledby="latest-posts" className="space-y-4">
        <h2 id="latest-posts" className="text-xl font-semibold">
          Bài viết mới nhất
        </h2>
        {posts.length === 0 ? (
          <p className="text-slate-600">Chưa có bài viết nào.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {posts.map((post) => (
              <li key={post.id} className="card flex flex-col gap-2">
                <h3 className="text-lg font-semibold">
                  <Link href={`/posts/${post.slug}`} className="hover:text-indigo-700">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm text-slate-700">{post.excerpt}</p>
                <p className="mt-auto text-xs text-slate-600">
                  {post.author.name ?? "Ẩn danh"} · <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt)}</time>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
