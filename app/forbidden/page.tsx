import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Không có quyền truy cập", robots: { index: false, follow: false } };

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <p className="text-5xl font-bold text-red-600">403</p>
      <h1 className="text-2xl font-bold">Không có quyền truy cập</h1>
      <p className="text-slate-700">Trang này chỉ dành cho quản trị viên.</p>
      <Link href="/dashboard" className="btn-primary">
        Về Dashboard
      </Link>
    </div>
  );
}
