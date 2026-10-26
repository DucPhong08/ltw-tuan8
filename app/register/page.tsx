import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = { title: "Đăng ký", robots: { index: false, follow: false } };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm space-y-6">
      <h1 className="text-2xl font-bold">Đăng ký</h1>
      <RegisterForm />
      <p className="text-center text-sm text-slate-600">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-indigo-700 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
