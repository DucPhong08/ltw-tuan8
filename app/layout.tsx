import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SiteHeader } from "@/components/SiteHeader";
import { SITE } from "@/lib/site";

import "./globals.css";

// display "optional": font về kịp thì dùng, không kịp thì giữ font hệ thống — tránh vẽ lại chữ lần 2 trên mạng chậm.
const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter", display: "optional" });

// SEO mặc định cho toàn site. Canonical KHÔNG đặt ở đây (sẽ thành canonical "/" cho mọi trang) — mỗi trang tự khai.
export const metadata: Metadata = {
  // Gốc để ghép URL tương đối của canonical / og:image thành URL tuyệt đối.
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { type: "website", siteName: SITE.name, locale: SITE.locale },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-600">
          LTWNC — Bài tập tuần 8 · B23DCCC127 · Next.js + Auth.js
        </footer>
      </body>
    </html>
  );
}
