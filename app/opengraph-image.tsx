import { OG_SIZE, renderOgImage } from "@/lib/og-image";
import { SITE } from "@/lib/site";

// Ảnh OG mặc định của trang chủ (và mọi trang con không tự khai ảnh riêng).
export const alt = `${SITE.name} — ${SITE.description}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    label: "Blog lập trình web",
    title: "Next.js, Auth.js & SEO thực chiến",
    subtitle: SITE.description,
  });
}
