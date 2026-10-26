/** Thông tin site dùng chung cho metadata, JSON-LD, sitemap, robots. */
export const SITE = {
  name: "LTWNC Blog",
  description:
    "Blog lập trình web nâng cao: Next.js App Router, xác thực với Auth.js, phân quyền nhiều lớp và tối ưu SEO.",
  locale: "vi_VN",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;

/** URL tuyệt đối — JSON-LD không tự ghép với metadataBase như Metadata API. */
export function absoluteUrl(path: string): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
