import "server-only";
import { cookies } from "next/headers";
import { isValidSession, SESSION_COOKIE } from "./auth";

/**
 * Защита server actions «в глубину». Next 16: Server Functions — это POST на
 * тот же роут, и matcher proxy.ts может их не покрыть (см. docs proxy.md,
 * «Execution order»). Поэтому каждая мутация проверяет сессию сама.
 */
export async function requireAdmin(): Promise<void> {
  const jar = await cookies(); // Next 15+: cookies() асинхронный
  if (!(await isValidSession(jar.get(SESSION_COOKIE)?.value))) {
    throw new Error("Не авторизован");
  }
}

/** Мягкая проверка (для UI, без исключения). */
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return isValidSession(jar.get(SESSION_COOKIE)?.value);
}
