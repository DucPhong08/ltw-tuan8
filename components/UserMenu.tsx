import Link from "next/link";

import { logout } from "@/actions/auth";
import { auth } from "@/auth";

export async function UserMenu() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <div className="ml-auto flex items-center gap-3">
        <Link href="/login" className="text-slate-700 hover:text-indigo-700">
          Đăng nhập
        </Link>
        <Link href="/register" className="btn-primary py-1.5">
          Đăng ký
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link href="/dashboard" className="text-slate-700 hover:text-indigo-700">
        Dashboard
      </Link>
      {/* Ẩn link chỉ là UX — không phải bảo mật. Bảo mật nằm ở proxy + page + action. */}
      {user.role === "admin" && (
        <Link href="/admin" className="text-slate-700 hover:text-indigo-700">
          Quản trị
        </Link>
      )}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-slate-600">
          {user.name ?? user.email}{" "}
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-semibold uppercase text-slate-700">
            {user.role}
          </span>
        </span>
        <form action={logout}>
          <button type="submit" className="btn-outline py-1.5">
            Đăng xuất
          </button>
        </form>
      </div>
    </>
  );
}
