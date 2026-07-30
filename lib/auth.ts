/**
 * Авторизация админки (как на the-one-temp): один пароль из ADMIN_PASS,
 * в куке — необратимый самоистекающий токен HMAC-SHA256, а не пароль.
 *
 * Web Crypto доступен и в Node-рантайме (route handlers, server actions),
 * и в рантайме proxy.ts — поэтому одна и та же проверка работает везде.
 */

const COOKIE_NAME = "stupeni-admin-session";
const DEFAULT_PASS = "stupeni";

// Версионируемый «солёный» payload. Смена версии (или ADMIN_PASS) инвалидирует
// все ранее выданные сессии.
const SESSION_PAYLOAD = "stupeni-admin-session-v1";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 дней

export function expectedPassword(): string {
  return process.env.ADMIN_PASS ?? DEFAULT_PASS;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

/** Проверка пароля с формы логина против ADMIN_PASS. */
export function verifyPassword(input: string | undefined | null): boolean {
  if (!input) return false;
  return timingSafeEqual(input, expectedPassword());
}

async function hmacHex(message: string, key: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Значение куки: `<exp>.<sig>`, где sig = HMAC(payload·exp, ADMIN_PASS). */
export async function sessionToken(ttlMs: number = SESSION_TTL_MS): Promise<string> {
  const exp = Date.now() + ttlMs;
  const sig = await hmacHex(`${SESSION_PAYLOAD}.${exp}`, expectedPassword());
  return `${exp}.${sig}`;
}

/** Проверка куки: формат, срок жизни и подпись (constant-time). */
export async function isValidSession(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = await hmacHex(`${SESSION_PAYLOAD}.${expStr}`, expectedPassword());
  return timingSafeEqual(sig, expected);
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = SESSION_TTL_MS / 1000;
