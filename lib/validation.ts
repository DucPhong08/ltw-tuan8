import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email không hợp lệ").trim().toLowerCase(),
  password: z.string().min(1, "Nhập mật khẩu"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Tên tối thiểu 2 ký tự").max(50),
  email: z.email("Email không hợp lệ").trim().toLowerCase(),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự").max(72),
});

export const postSchema = z.object({
  title: z.string().trim().min(5, "Tiêu đề tối thiểu 5 ký tự").max(120),
  excerpt: z.string().trim().min(10, "Tóm tắt tối thiểu 10 ký tự").max(200),
  content: z.string().trim().min(20, "Nội dung tối thiểu 20 ký tự").max(10000),
});
