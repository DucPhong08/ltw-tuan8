import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };

const FONT_DIR = join(process.cwd(), "node_modules/@fontsource/inter/files");

/** Font mặc định của ImageResponse chỉ có chữ Latin → nạp thêm subset tiếng Việt để không vỡ dấu. */
async function loadFonts() {
  const files = [
    ["latin", 400],
    ["vietnamese", 400],
    ["latin", 700],
    ["vietnamese", 700],
  ] as const;
  return Promise.all(
    files.map(async ([subset, weight]) => ({
      name: "Inter",
      data: await readFile(join(FONT_DIR, `inter-${subset}-${weight}-normal.woff`)),
      weight,
      style: "normal" as const,
    })),
  );
}

/** Khuôn ảnh Open Graph dùng chung cho trang chủ và từng bài viết. */
export async function renderOgImage({ title, subtitle, label }: { title: string; subtitle: string; label: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #312e81 0%, #4f46e5 55%, #6366f1 100%)",
          color: "white",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, fontWeight: 700, letterSpacing: 2, opacity: 0.85 }}>
          {label.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: title.length > 50 ? 60 : 72, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
          <div style={{ fontSize: 30, opacity: 0.9, lineHeight: 1.4 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 700 }}>{SITE.name}</div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}
