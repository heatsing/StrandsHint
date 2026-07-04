import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "strands_admin";

function expectedToken() {
  const password = process.env.ADMIN_PASSWORD || "change-me";
  return Buffer.from(`admin:${password}`).toString("base64url");
}

export function isAdminLoggedIn() {
  return cookies().get(COOKIE_NAME)?.value === expectedToken();
}

export function requireAdmin() {
  if (!isAdminLoggedIn()) redirect("/admin/login");
}

export function setAdminCookie() {
  cookies().set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAdminCookie() {
  cookies().delete(COOKIE_NAME);
}
