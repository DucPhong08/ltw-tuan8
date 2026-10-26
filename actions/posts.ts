"use server";

import { updateTag } from "next/cache";

import type { ActionState } from "@/lib/action-state";
import { assertRole, AuthorizationError } from "@/lib/dal";
import { POSTS_TAG } from "@/lib/posts";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { postSchema } from "@/lib/validation";

// LỚP 3 — mỗi Server Action tự kiểm tra quyền. Không dựa vào việc nút bấm bị ẩn trên UI:
// ai biết action ID cũng gửi POST thẳng được.

export async function createPost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await assertRole(["admin", "user"]);

    const parsed = postSchema.safeParse({
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
    });
    if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

    const base = slugify(parsed.data.title) || "bai-viet";
    const isTaken = await prisma.post.findUnique({ where: { slug: base }, select: { id: true } });
    const slug = isTaken ? `${base}-${Date.now().toString(36)}` : base;

    await prisma.post.create({ data: { ...parsed.data, slug, authorId: user.id } });
    // Xoá cache bài viết công khai ngay → trang chủ thấy bài mới liền (read-your-own-writes).
    updateTag(POSTS_TAG);
    return { ok: true, message: "Đã đăng bài." };
  } catch (error) {
    if (error instanceof AuthorizationError) return { ok: false, message: error.message };
    throw error;
  }
}

/** User chỉ xoá được bài của mình; admin xoá được mọi bài. */
export async function deletePost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await assertRole(["admin", "user"]);
    const postId = String(formData.get("postId") ?? "");

    const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
    if (!post) return { ok: false, message: "Bài viết không tồn tại." };
    if (user.role !== "admin" && post.authorId !== user.id) {
      return { ok: false, message: "Bạn không có quyền xoá bài của người khác." };
    }

    await prisma.post.delete({ where: { id: postId } });
    updateTag(POSTS_TAG);
    return { ok: true, message: "Đã xoá bài." };
  } catch (error) {
    if (error instanceof AuthorizationError) return { ok: false, message: error.message };
    throw error;
  }
}
