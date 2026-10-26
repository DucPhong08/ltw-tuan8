"use client";

import { useActionState } from "react";

import { register } from "@/actions/auth";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";

import { FormMessage } from "./FormMessage";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, INITIAL_ACTION_STATE);

  return (
    <form action={formAction} className="card space-y-4">
      <label className="block space-y-1 text-sm">
        <span>Họ tên</span>
        <input name="name" required minLength={2} autoComplete="name" className="input" />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Email</span>
        <input name="email" type="email" required autoComplete="email" className="input" />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Mật khẩu (tối thiểu 8 ký tự)</span>
        <input name="password" type="password" required minLength={8} autoComplete="new-password" className="input" />
      </label>
      <FormMessage state={state} />
      <button type="submit" disabled={isPending} className="btn-primary w-full">
        {isPending ? "Đang tạo tài khoản…" : "Tạo tài khoản"}
      </button>
    </form>
  );
}
