// LỚP 1 — Middleware (Next.js 16 đổi tên file middleware.ts → proxy.ts, chức năng giữ nguyên).
// Kiểm tra "lạc quan": chỉ đọc JWT trong cookie, KHÔNG truy vấn DB → nhanh, chạy trước mọi request.
// Không phải lớp duy nhất: page (lớp 2) và Server Action (lớp 3) kiểm tra lại với DB.
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT, PROTECTED_ROUTES } from "@/lib/routes";

export const proxy = auth((req) => {
  const { pathname, search } = req.nextUrl;
  const user = req.auth?.user;

  if (AUTH_ROUTES.includes(pathname)) {
    return user ? NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl)) : NextResponse.next();
  }

  const rule = PROTECTED_ROUTES.find((r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`));
  if (!rule) return NextResponse.next();

  if (!user) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (!rule.roles.includes(user.role)) {
    return NextResponse.redirect(new URL("/forbidden", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
};
