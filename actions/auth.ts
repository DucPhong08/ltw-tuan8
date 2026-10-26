"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import type { ActionState } from "@/lib/action-state";
import { prisma } from "@/lib/prisma";
import { safeCallbackUrl } from "@/lib/routes";
import { loginSchema, registerSchema } from "@/lib/validation";

export async function loginWithCredentials(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  try {
    await signIn("credentials", { ...parsed.data, redirectTo: safeCallbackUrl(formData.get("callbackUrl")) });
    return { ok: true, message: "" };
  } catch (error) {
    // Không phân biệt "sai email" và "sai mật khẩu" để không lộ email nào đã đăng ký.
    if (error instanceof AuthError) return { ok: false, message: "Email hoặc mật khẩu không đúng." };
    throw error; // signIn thành công ném NEXT_REDIRECT — phải ném tiếp để Next chuyển trang.
  }
}

export async function loginWithGitHub(formData: FormData): Promise<void> {
  await signIn("github", { redirectTo: safeCallbackUrl(formData.get("callbackUrl")) });
}

export async function register(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { name, email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) return { ok: false, message: "Email này đã được dùng." };

  // Role KHÔNG lấy từ form — luôn là "user". Chỉ admin mới nâng quyền được.
  await prisma.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 12), role: "user" },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
    return { ok: true, message: "" };
  } catch (error) {
    if (error instanceof AuthError) return { ok: false, message: "Tạo tài khoản xong nhưng đăng nhập lỗi, hãy đăng nhập lại." };
    throw error;
  }
}

export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
