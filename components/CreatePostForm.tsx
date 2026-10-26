"use client";

import { useActionState, useEffect, useRef } from "react";

import { createPost } from "@/actions/posts";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";

import { FormMessage } from "./FormMessage";

export function CreatePostForm() {
  const [state, formAction, isPending] = useActionState(createPost, INITIAL_ACTION_STATE);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="card space-y-4">
      <label className="block space-y-1 text-sm">
        <span>Tiêu đề</span>
        <input name="title" required minLength={5} maxLength={120} className="input" />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Tóm tắt</span>
        <input name="excerpt" required minLength={10} maxLength={200} className="input" />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Nội dung (cách đoạn bằng một dòng trống)</span>
        <textarea name="content" required minLength={20} rows={6} className="input" />
      </label>
      <FormMessage state={state} />
      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending ? "Đang đăng…" : "Đăng bài"}
      </button>
    </form>
  );
}
