import type { Graph, Thing, WithContext } from "schema-dts";

/**
 * Nhúng dữ liệu có cấu trúc schema.org. Thay "<" bằng < để chuỗi do người dùng nhập
 * (vd. tiêu đề bài "</script><script>…") không thoát ra khỏi thẻ script — chống XSS.
 */
export function JsonLd({ data }: { data: WithContext<Thing> | Graph }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
