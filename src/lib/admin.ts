import type { User } from "firebase/auth";

export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@gmail.com";

export function isAdminUser(user: User | null | undefined) {
  return Boolean(user?.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
}
