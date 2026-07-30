import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import sharp from "sharp";

/**
 * Загрузка изображений из админки: public/uploads/YYYY/MM/<slug>-<hex>.webp.
 * Всё конвертируется в WebP и уменьшается до 1920px по длинной стороне.
 */

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_DIMENSION = 1920;
const MAX_SLUG_LENGTH = 60;

export type UploadResult =
  | { ok: true; url: string; width: number; height: number; bytes: number }
  | { ok: false; error: string };

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
  ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

/** RU→latin для SEO-имён файлов: «Крыльцо Paradyz» → «krylco-paradyz». */
export function translitSlug(input: string): string {
  return input
    .toLowerCase()
    .split("")
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join("")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/, "");
}

function uploadsRoot(): string {
  return process.env.UPLOADS_DIR ?? path.join(process.cwd(), "public", "uploads");
}

function fileName(originalName: string | undefined, ext: string): string {
  const slug = translitSlug((originalName ?? "").replace(/\.[^.]*$/, ""));
  if (!slug) return `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  return `${slug}-${randomBytes(3).toString("hex")}.${ext}`;
}

function extFromMime(mime: string): string | null {
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/avif") return "avif";
  if (mime === "image/gif") return "gif";
  return null;
}

export async function saveUploadedImage(file: File, name?: string): Promise<UploadResult> {
  if (file.size === 0) return { ok: false, error: "Пустой файл" };
  if (file.size > MAX_BYTES) {
    return { ok: false, error: `Файл больше ${Math.round(MAX_BYTES / 1024 / 1024)} МБ` };
  }
  if (!extFromMime(file.type)) return { ok: false, error: "Нужен JPG, PNG, WebP, AVIF или GIF" };

  const buf = Buffer.from(await file.arrayBuffer());
  let img = sharp(buf, { failOn: "error" });
  const meta = await img.metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (!w || !h) return { ok: false, error: "Не удалось прочитать изображение" };

  if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
    img = img.resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true });
  }
  const out = await img.webp({ quality: 88 }).toBuffer({ resolveWithObject: true });

  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dir = path.join(uploadsRoot(), yyyy, mm);
  await fs.mkdir(dir, { recursive: true });
  const nameOut = fileName(name ?? file.name, "webp");
  await fs.writeFile(path.join(dir, nameOut), out.data);

  return {
    ok: true,
    url: `/uploads/${yyyy}/${mm}/${nameOut}`,
    width: out.info.width,
    height: out.info.height,
    bytes: out.info.size,
  };
}

export async function deleteUpload(urlPath: string): Promise<boolean> {
  if (!urlPath.startsWith("/uploads/")) return false;
  const rel = urlPath.slice("/uploads/".length);
  if (rel.includes("..") || path.isAbsolute(rel)) return false; // traversal
  try {
    await fs.unlink(path.join(uploadsRoot(), rel));
    return true;
  } catch {
    return false;
  }
}
