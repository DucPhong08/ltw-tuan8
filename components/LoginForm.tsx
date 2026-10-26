"use client";

import { useActionState } from "react";

import { loginWithCredentials, loginWithGitHub } from "@/actions/auth";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";

import { FormMessage } from "./FormMessage";
import { GitHubIcon } from "./GitHubIcon";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, isPending] = useActionState(loginWithCredentials, INITIAL_ACTION_STATE);

  return (
    <div className="card space-y-5">
      <form action={loginWithGitHub}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <button type="submit" className="btn-outline w-full">
          <GitHubIcon /> Đăng nhập với GitHub
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="h-px flex-1 bg-slate-200" /> hoặc <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <label className="block space-y-1 text-sm">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" className="input" />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Mật khẩu</span>
          <input name="password" type="password" required autoComplete="current-password" className="input" />
        </label>
        <FormMessage state={state} />
        <button type="submit" disabled={isPending} className="btn-primary w-full">
          {isPending ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
