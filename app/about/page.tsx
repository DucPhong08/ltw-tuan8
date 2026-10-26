import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Giới thiệu dự án LTWNC Blog: Next.js App Router, đăng nhập GitHub/email với Auth.js, phân quyền admin/user.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

export default function AboutPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Giới thiệu</h1>
      <p className="text-slate-700">
        LTWNC Blog là dự án bài tập tuần 8 môn Lập trình Web nâng cao (Sinh viên thực hiện: B23DCCC127): một blog nhỏ dựng bằng Next.js App Router, đăng
        nhập bằng GitHub hoặc email/mật khẩu qua Auth.js, phân quyền admin/user ở ba lớp (Middleware, Page, Server
        Action).
      </p>
      <ul className="list-disc space-y-1 pl-6 text-slate-700">
        <li>Người dùng (user): đọc bài, viết bài, xoá bài của chính mình.</li>
        <li>Quản trị viên (admin): mọi quyền của user, xoá bài bất kỳ, đổi vai trò người dùng.</li>
      </ul>
    </div>
  );
}
