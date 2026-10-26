import type { Metadata } from "next";
import Link from "next/link";

import { DeletePostForm } from "@/components/DeletePostForm";
import { RoleForm } from "@/components/RoleForm";
import { requireRole } from "@/lib/dal";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { toRole } from "@/lib/roles";

export const metadata: Metadata = { title: "Quản trị", robots: { index: false, follow: false } };

// Trang cá nhân hoá theo user: render chặn (không có static shell) để redirect của lớp 2 chạy trước khi gửi HTML.
export const instant = false;

export default async function AdminPage() {
  // LỚP 2 — đọc role từ DB: user bị hạ quyền sau khi đăng nhập (JWT còn ghi admin) vẫn bị chặn ở đây.
  const admin = await requireRole(["admin"], "/admin");

  const [users, posts] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, email: true, role: true, passwordHash: true, accounts: { select: { provider: true } } },
    }),
    prisma.post.findMany({ orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Quản trị</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Người dùng ({users.length})</h2>
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-2">Tên</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Đăng nhập bằng</th>
                <th className="px-4 py-2">Vai trò</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const methods = [u.passwordHash ? "Mật khẩu" : null, ...u.accounts.map((a) => a.provider)].filter(Boolean);
                return (
                  <tr key={u.id} className="border-t border-slate-200">
                    <td className="px-4 py-2">{u.name ?? "—"}</td>
                    <td className="px-4 py-2">{u.email ?? "—"}</td>
                    <td className="px-4 py-2">{methods.join(", ")}</td>
                    <td className="px-4 py-2">
                      {u.id === admin.id ? (
                        <span className="font-semibold">{u.role} (bạn)</span>
                      ) : (
                        <RoleForm userId={u.id} role={toRole(u.role)} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Tất cả bài viết ({posts.length})</h2>
        <ul className="space-y-2">
          {posts.map((post) => (
            <li key={post.id} className="card flex items-center justify-between gap-4 p-4">
              <div>
                <Link href={`/posts/${post.slug}`} className="font-medium hover:text-indigo-700">
                  {post.title}
                </Link>
                <p className="text-xs text-slate-600">
                  {post.author.name ?? "Ẩn danh"} · {formatDate(post.createdAt)}
                </p>
              </div>
              <DeletePostForm postId={post.id} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
