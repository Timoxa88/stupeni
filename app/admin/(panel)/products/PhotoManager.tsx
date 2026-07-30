"use client";

import { useState } from "react";
import { withBase } from "@/lib/base";

/**
 * Менеджер фото артикула: загрузка в /api/upload, порядок, удаление.
 * Значение уходит скрытым полем `photos` (JSON-массив URL).
 */
export function PhotoManager({ initial }: { initial: string[] }) {
  const [photos, setPhotos] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    const added: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch(withBase("/api/upload"), { method: "POST", body: fd });
        const data = (await res.json()) as { ok: boolean; url?: string; error?: string };
        if (data.ok && data.url) added.push(data.url);
        else setError(data.error ?? "Не удалось загрузить файл");
      } catch {
        setError("Сеть недоступна");
      }
    }
    if (added.length) setPhotos((p) => [...p, ...added]);
    setBusy(false);
  }

  const move = (i: number, dir: -1 | 1) => {
    setPhotos((p) => {
      const next = [...p];
      const j = i + dir;
      if (j < 0 || j >= next.length) return p;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <div>
      <input type="hidden" name="photos" value={JSON.stringify(photos)} />
      <div className="flex flex-wrap gap-3">
        {photos.map((url, i) => (
          <div key={`${url}-${i}`} className="w-32">
            {/* eslint-disable-next-line @next/next/no-img-element -- превью админки, оптимизация не нужна */}
            <img
              src={withBase(url)}
              alt=""
              className="h-24 w-32 rounded-lg border border-sand-divider object-cover"
            />
            <div className="mt-1 flex items-center justify-between gap-1">
              <div className="flex gap-1">
                <button type="button" className="a-btn a-btn-ghost a-btn-sm px-2" onClick={() => move(i, -1)}>
                  ←
                </button>
                <button type="button" className="a-btn a-btn-ghost a-btn-sm px-2" onClick={() => move(i, 1)}>
                  →
                </button>
              </div>
              <button
                type="button"
                className="a-btn a-btn-danger a-btn-sm px-2"
                onClick={() => setPhotos((p) => p.filter((_, k) => k !== i))}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {photos.length === 0 ? <p className="a-muted text-sm">Фото из каталога (не переопределены).</p> : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="a-btn a-btn-ghost a-btn-sm cursor-pointer">
          {busy ? "Загружаем…" : "Загрузить фото"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={busy}
            onChange={(e) => void upload(e.target.files)}
          />
        </label>
        {photos.length ? (
          <button type="button" className="a-btn a-btn-ghost a-btn-sm" onClick={() => setPhotos([])}>
            Вернуть фото каталога
          </button>
        ) : null}
        {error ? <span className="text-xs font-semibold text-[#a3261a]">{error}</span> : null}
      </div>
    </div>
  );
}
