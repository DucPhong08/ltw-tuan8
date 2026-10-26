# LTWNC Blog — Bài tập tuần 8 (Next.js)

**Sinh viên thực hiện:** B23DCCC127

Tích hợp Auth.js (NextAuth v5) gồm GitHub OAuth và email/mật khẩu, phân quyền admin/user ở 3 lớp (Middleware, Page, Server Action), SEO cho trang công khai (canonical, opengraph-image, JSON-LD).

Báo cáo: **[BAO-CAO.md](BAO-CAO.md)**

## Yêu cầu

- Node.js 20 trở lên (đã chạy thử trên Node 24)
- Một GitHub OAuth App có Redirect URI là `http://localhost:3000/api/auth/callback/github`

## Cài đặt và chạy

```bash
npm install                 # tự chạy prisma generate
cp .env.example .env.local  # rồi điền AUTH_SECRET, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET
npm run setup               # tạo DB SQLite (prisma/dev.db) + nạp dữ liệu mẫu — BẮT BUỘC sau khi clone

npm run dev                 # chế độ dev: http://localhost:3000
# hoặc bản production (dùng khi đo Lighthouse):
npm run build && npm start
```

> File `.env` (chỉ chứa `DATABASE_URL`, đọc bởi Prisma CLI) đã có sẵn. Mọi bí mật để trong `.env.local`.

## Tài khoản mẫu

| Email | Mật khẩu | Vai trò |
|---|---|---|
| `admin@example.com` | `Admin@123` | admin |
| `user@example.com` | `User@1234` | user |

Đăng nhập bằng GitHub hoặc đăng ký mới thì tài khoản có vai trò `user`. Admin đổi vai trò ở trang `/admin`. Role nằm trong JWT, nên người được **nâng** quyền phải đăng nhập lại mới vào được `/admin`.

## Thử phân quyền nhanh

1. Chưa đăng nhập, vào `/dashboard` hoặc `/admin`: bị chuyển về `/login` (lớp 1, Middleware).
2. Đăng nhập `user@example.com`, vào `/admin`: bị chuyển sang `/forbidden`.
3. Vẫn tài khoản user, ở `/dashboard` có khung vàng **"Kiểm thử lớp 3"**. Bấm hai nút trong đó thì server từ chối (lớp 3, Server Action).
4. Lớp 2 bắt được trường hợp mà lớp 1 bỏ sót:
   - Admin nâng `user@example.com` lên admin.
   - User đăng nhập lại và vào được `/admin`.
   - Admin hạ user đó về `user`.
   - User F5 trang `/admin`: JWT vẫn ghi `admin` nên Middleware cho qua, nhưng page đọc role từ DB nên chuyển sang `/forbidden`.

## Cấu trúc chính

```
auth.ts                       Cấu hình Auth.js: GitHub + Credentials, callback jwt/session gắn role
proxy.ts                      LỚP 1 — Middleware (Next.js 16 đổi tên middleware.ts → proxy.ts)
lib/dal.ts                    LỚP 2 + 3 — requireRole() cho page, assertRole() cho Server Action
actions/                      Server Actions (auth, posts, admin) — mỗi action tự kiểm tra quyền
types/next-auth.d.ts          Mở rộng kiểu Session / User / JWT có role
app/page.tsx                  Trang chủ: metadata + canonical + JSON-LD (WebSite, Blog)
app/posts/[slug]/             Trang bài viết: generateMetadata + JSON-LD (BlogPosting) + opengraph-image
app/opengraph-image.tsx       Ảnh OG trang chủ
app/sitemap.ts, app/robots.ts Sitemap và robots.txt
prisma/schema.prisma, seed.ts Schema DB + dữ liệu mẫu
reports/                      Lighthouse trước/sau, ảnh chụp màn hình, ảnh OG
```
