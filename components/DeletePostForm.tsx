"use client";

import { useActionState } from "react";

import { deletePost } from "@/actions/posts";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";

export function DeletePostForm({ postId }: { postId: string }) {
  const [state, formAction, isPending] = useActionState(deletePost, INITIAL_ACTION_STATE);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("Xoá bài viết này?")) e.preventDefault();
      }}
      className="flex items-center gap-2"
    >
      <input type="hidden" name="postId" value={postId} />
      {!state.ok && state.message && <span className="text-xs text-red-700">{state.message}</span>}
      <button type="submit" disabled={isPending} className="btn-danger py-1.5">
        {isPending ? "Đang xoá…" : "Xoá"}
      </button>
    </form>
  );
}
