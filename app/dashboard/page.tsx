import type { Metadata } from "next";
import Link from "next/link";

import { CreatePostForm } from "@/components/CreatePostForm";
import { DeletePostForm } from "@/components/DeletePostForm";
import { SecurityTestPanel } from "@/components/SecurityTestPanel";
import { requireRole } from "@/lib/dal";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

// Trang cá nhân hoá theo user: render chặn (không có static shell) để redirect của lớp 2 chạy trước khi gửi HTML.
export const instant = false;

export default async function DashboardPage() {
  // LỚP 2 — page tự kiểm tra lại, không giả định proxy đã chặn.
  const user = await requireRole(["admin", "user"], "/dashboard");

  const [myPosts, otherPosts] = await Promise.all([
    prisma.post.findMany({ where: { authorId: user.id }, orderBy: { createdAt: "desc" } }),
    prisma.post.findMany({
      where: { authorId: { not: user.id } },
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-600">
          Xin chào {user.name ?? user.email} — vai trò <strong>{user.role}</strong>.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Viết bài mới</h2>
        <CreatePostForm />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Bài của tôi ({myPosts.length})</h2>
        {myPosts.length === 0 ? (
          <p className="text-slate-600">Bạn chưa có bài nào.</p>
        ) : (
          <ul className="space-y-2">
            {myPosts.map((post) => (
              <li key={post.id} className="card flex items-center justify-between gap-4 p-4">
                <div>
                  <Link href={`/posts/${post.slug}`} className="font-medium hover:text-indigo-700">
                    {post.title}
                  </Link>
                  <p className="text-xs text-slate-600">{formatDate(post.createdAt)}</p>
                </div>
                <DeletePostForm postId={post.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {user.role === "user" && <SecurityTestPanel otherPosts={otherPosts} />}
    </div>
  );
}
