// Tạo 2 tài khoản mẫu (admin + user) và vài bài viết. Chạy lại nhiều lần không bị trùng (upsert).
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ACCOUNTS = [
  { email: "admin@example.com", name: "Quản trị viên", password: "Admin@123", role: "admin" },
  { email: "user@example.com", name: "Người dùng mẫu", password: "User@1234", role: "user" },
] as const;

const POSTS = [
  {
    slug: "xac-thuc-voi-authjs-trong-nextjs",
    title: "Xác thực với Auth.js trong Next.js App Router",
    excerpt: "Cách tích hợp GitHub OAuth và đăng nhập email/mật khẩu bằng Auth.js v5, lưu người dùng với Prisma.",
    content:
      "Auth.js v5 cung cấp một hàm auth() dùng được ở mọi nơi phía server: Server Component, Route Handler, Server Action và Proxy.\n\nKhi dùng Credentials provider, phiên đăng nhập bắt buộc lưu bằng JWT. Adapter Prisma vẫn được dùng để lưu thông tin tài khoản OAuth và liên kết với người dùng.\n\nMật khẩu luôn được băm bằng bcrypt trước khi lưu, và thông báo lỗi không phân biệt sai email hay sai mật khẩu.",
    author: "admin@example.com",
  },
  {
    slug: "phan-quyen-ba-lop-middleware-page-server-action",
    title: "Phân quyền ba lớp: Middleware, Page và Server Action",
    excerpt: "Vì sao chỉ chặn ở Middleware là chưa đủ, và cách kiểm tra lại quyền ở page lẫn Server Action.",
    content:
      "Middleware (Proxy trong Next.js 16) chạy trước mọi request và chỉ đọc JWT nên rất nhanh, nhưng chỉ là kiểm tra lạc quan.\n\nMỗi page được bảo vệ phải tự kiểm tra lại quyền dựa trên dữ liệu mới nhất trong cơ sở dữ liệu.\n\nServer Action là một endpoint POST công khai: bất kỳ ai biết action ID đều gọi được, nên mỗi action phải tự xác thực và phân quyền.",
    author: "admin@example.com",
  },
  {
    slug: "toi-uu-seo-voi-metadata-api",
    title: "Tối ưu SEO với Metadata API, Open Graph và JSON-LD",
    excerpt: "Thêm canonical, ảnh Open Graph sinh động và dữ liệu có cấu trúc JSON-LD cho trang công khai.",
    content:
      "Metadata API của Next.js cho phép khai báo title, description và canonical ngay trong layout hoặc page.\n\nFile opengraph-image.tsx sinh ảnh chia sẻ mạng xã hội cho từng bài viết bằng ImageResponse.\n\nJSON-LD giúp công cụ tìm kiếm hiểu trang đang mô tả một bài viết, một tổ chức hay một website.",
    author: "user@example.com",
  },
];

async function main() {
  for (const { password, ...account } of ACCOUNTS) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.upsert({
      where: { email: account.email },
      update: { role: account.role, passwordHash },
      create: { ...account, passwordHash },
    });
  }

  for (const { author, ...post } of POSTS) {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: author } });
    await prisma.post.upsert({ where: { slug: post.slug }, update: {}, create: { ...post, authorId: user.id } });
  }

  console.log("Seed xong:", ACCOUNTS.map((a) => `${a.email} / ${a.password} (${a.role})`).join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
