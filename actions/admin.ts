"use server";

import type { ActionState } from "@/lib/action-state";
import { assertRole, AuthorizationError } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { isRole } from "@/lib/roles";

/** Chỉ admin. Thử gọi action này bằng tài khoản user → bị từ chối dù proxy/page không chặn. */
export async function updateUserRole(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const admin = await assertRole(["admin"]);
    const userId = String(formData.get("userId") ?? "");
    const role = formData.get("role");

    if (!isRole(role)) return { ok: false, message: "Vai trò không hợp lệ." };
    // Tự hạ quyền mình có thể khiến hệ thống không còn admin nào.
    if (userId === admin.id) return { ok: false, message: "Không thể tự đổi vai trò của chính mình." };

    const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!target) return { ok: false, message: "Người dùng không tồn tại." };

    await prisma.user.update({ where: { id: userId }, data: { role } });
    return { ok: true, message: `Đã đổi vai trò thành "${role}".` };
  } catch (error) {
    if (error instanceof AuthorizationError) return { ok: false, message: error.message };
    throw error;
  }
}
