"use client";

import { useActionState } from "react";

import { updateUserRole } from "@/actions/admin";
import { deletePost } from "@/actions/posts";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";

import { FormMessage } from "./FormMessage";

// Khu vực DEMO cho báo cáo: cố tình cho user bấm gọi action vượt quyền,
// để thấy lớp 3 (Server Action) từ chối dù UI không chặn.
export function SecurityTestPanel({ otherPosts }: { otherPosts: { id: string; title: string }[] }) {
  const [deleteState, deleteAction, isDeleting] = useActionState(deletePost, INITIAL_ACTION_STATE);
  const [roleState, roleAction, isUpdating] = useActionState(updateUserRole, INITIAL_ACTION_STATE);

  return (
    <section className="card space-y-4 border-amber-300 bg-amber-50">
      <h2 className="text-lg font-semibold">Kiểm thử lớp 3 — gọi Server Action vượt quyền</h2>
      <p className="text-sm text-slate-700">
        Nút ở đây cố tình KHÔNG bị ẩn. Mọi yêu cầu đều tới server, và server tự từ chối.
      </p>

      <form action={deleteAction} className="flex flex-wrap items-center gap-2">
        <select name="postId" className="input w-auto" aria-label="Bài viết của người khác">
          {otherPosts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        <button type="submit" disabled={isDeleting || otherPosts.length === 0} className="btn-danger">
          Xoá bài của người khác
        </button>
      </form>
      <FormMessage state={deleteState} />

      <form action={roleAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="userId" value="any-user-id" />
        <input type="hidden" name="role" value="admin" />
        <button type="submit" disabled={isUpdating} className="btn-danger">
          Gọi action admin: updateUserRole
        </button>
      </form>
      <FormMessage state={roleState} />
    </section>
  );
}
