export const ROLES = ["admin", "user"] as const;

export type Role = (typeof ROLES)[number];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** DB lưu role dạng String — ép về Role an toàn, giá trị lạ coi như "user" (quyền thấp nhất). */
export function toRole(value: unknown): Role {
  return isRole(value) ? value : "user";
}
