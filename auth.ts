import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

import { prisma } from "@/lib/prisma";
import { toRole } from "@/lib/roles";
import { loginSchema } from "@/lib/validation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Adapter lưu user + liên kết tài khoản GitHub vào DB.
  adapter: PrismaAdapter(prisma),
  // Credentials provider bắt buộc dùng JWT (Auth.js không tạo DB session cho Credentials).
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    // Đọc AUTH_GITHUB_ID / AUTH_GITHUB_SECRET từ env.
    GitHub,
    Credentials({
      name: "Email & mật khẩu",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        // Tài khoản chỉ đăng nhập bằng GitHub thì không có passwordHash.
        if (!user?.passwordHash) return null;

        const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!isValid) return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image, role: toRole(user.role) };
      },
    }),
  ],
  callbacks: {
    // Chạy khi tạo/đọc JWT: lúc đăng nhập `user` có giá trị → chép id + role vào token.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = toRole(user.role);
      }
      return token;
    },
    // Đưa id + role từ token ra session để page/proxy đọc được.
    session({ session, token }) {
      if (token.id) session.user.id = token.id;
      session.user.role = toRole(token.role);
      return session;
    },
  },
});
