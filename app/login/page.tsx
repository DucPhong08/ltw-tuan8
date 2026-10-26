import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/components/LoginForm";
import { safeCallbackUrl } from "@/lib/routes";

// Mã lỗi Auth.js gắn vào ?error= khi đăng nhập thất bại.
const OAUTH_ERRORS: Record<string, string> = {
  CredentialsSignin: "Email hoặc mật khẩu không đúng.",
  OAuthAccountNotLinked: "Email của tài khoản GitHub này đã được đăng ký bằng mật khẩu. Hãy đăng nhập bằng email/mật khẩu.",
  AccessDenied: "Bạn đã từ chối cấp quyền cho ứng dụng.",
  Configuration: "Cấu hình đăng nhập GitHub chưa đúng (kiểm tra AUTH_GITHUB_ID / AUTH_GITHUB_SECRET).",
};

async function LoginContent({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { callbackUrl, error } = await searchParams;
  const errorKey = typeof error === "string" ? error : undefined;
  const oauthError = errorKey ? (OAUTH_ERRORS[errorKey] ?? "Đăng nhập thất bại, vui lòng thử lại.") : undefined;

  return (
    <>
      {oauthError && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {oauthError}
        </p>
      )}
      <LoginForm callbackUrl={safeCallbackUrl(callbackUrl)} />
    </>
  );
}

export const metadata: Metadata = { title: "Đăng nhập", robots: { index: false, follow: false } };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="mx-auto max-w-sm space-y-6">
      <h1 className="text-2xl font-bold">Đăng nhập</h1>
      <Suspense fallback={<div className="card h-80" aria-hidden="true" />}>
        <LoginContent searchParams={searchParams} />
      </Suspense>
      <p className="text-center text-sm text-slate-600">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-indigo-700 hover:underline">
          Đăng ký
        </Link>
      </p>
    </div>
  );
}
