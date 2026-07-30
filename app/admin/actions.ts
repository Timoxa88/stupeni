"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyPassword, sessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
import { BASE_PATH } from "@/lib/base";

// Открытый редирект: пускаем только относительные пути одного источника.
function safeNext(raw: string): string {
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\")) return raw;
  return "/admin";
}

export async function login(formData: FormData): Promise<{ error: string } | void> {
  const pass = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? "/admin"));
  if (!verifyPassword(pass)) return { error: "Неверный пароль" };

  const jar = await cookies();
  jar.set(SESSION_COOKIE, await sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // Деплой на подпуть (br2nd.tech/stupeni): кука должна жить в пределах базы.
    path: BASE_PATH || "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect(next);
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete({ name: SESSION_COOKIE, path: BASE_PATH || "/" });
  redirect("/admin/login");
}
