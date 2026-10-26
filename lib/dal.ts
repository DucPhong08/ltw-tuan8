// LỚP 2 + 3 — Data Access Layer: page và Server Action đều gọi qua đây.
// Khác proxy: đọc role MỚI NHẤT từ DB, không tin role cũ trong JWT
// (admin vừa bị hạ quyền thì JWT vẫn ghi "admin" cho tới khi hết hạn).
import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toRole, type Role } from "@/lib/roles";

export interface CurrentUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: Role;
}

/** User hiện tại theo DB, hoặc null nếu chưa đăng nhập / user đã bị xoá. `cache` → 1 lần truy vấn mỗi request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, role: true },
  });
  return user ? { ...user, role: toRole(user.role) } : null;
});

/** Dùng trong page: chưa đăng nhập → /login, sai role → /forbidden. */
export async function requireRole(roles: readonly Role[], callbackUrl: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  if (!roles.includes(user.role)) redirect("/forbidden");
  return user;
}

export class AuthorizationError extends Error {}

/** Dùng trong Server Action: action là endpoint POST công khai, gọi được mà không cần qua UI → luôn kiểm tra lại. */
export async function assertRole(roles: readonly Role[]): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new AuthorizationError("Bạn cần đăng nhập.");
  if (!roles.includes(user.role)) throw new AuthorizationError("Bạn không có quyền thực hiện thao tác này.");
  return user;
}
