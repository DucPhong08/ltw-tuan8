import Link from "next/link";
import { Suspense } from "react";

import { UserMenu } from "./UserMenu";

// Phần tĩnh của header nằm trong HTML prerender; chỉ UserMenu (đọc cookie) stream theo request.
export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex min-h-14 max-w-4xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-sm">
        <Link href="/" className="text-base font-bold text-indigo-700">
          LTWNC Blog
        </Link>
        <Link href="/about" className="text-slate-700 hover:text-indigo-700">
          Giới thiệu
        </Link>
        <Suspense fallback={<div className="ml-auto h-8 w-40" aria-hidden="true" />}>
          <UserMenu />
        </Suspense>
      </nav>
    </header>
  );
}
