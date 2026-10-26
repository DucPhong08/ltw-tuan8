import type { Role } from "@/lib/roles";

/** Route cần đăng nhập → role tối thiểu. Proxy và tài liệu đọc chung một bảng này. */
export const PROTECTED_ROUTES: { prefix: string; roles: readonly Role[] }[] = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/dashboard", roles: ["admin", "user"] },
];

/** Đã đăng nhập thì không cần vào lại các trang này. */
export const AUTH_ROUTES = ["/login", "/register"];

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

/** Chỉ chấp nhận đường dẫn nội bộ — chặn open redirect kiểu ?callbackUrl=https://evil.com hoặc //evil.com. */
export function safeCallbackUrl(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_LOGIN_REDIRECT;
  }
  return value;
}
