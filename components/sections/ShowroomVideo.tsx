"use client";

import { useRef, useState } from "react";
import { withBase } from "@/lib/base";

/**
 * Видео шоурума в карточке адреса — по образцу ShowroomsSection fintherm
 * (просьба Кирилла 30.07.2026): клик — play/pause, звук выключен, зацикленно,
 * preload="none" (2,4–2,6 МБ на ролик не грузятся, пока не нажали).
 * Ролики общие с fintherm — шоурумы одни и те же (public/videos/).
 */
export function ShowroomVideo({ src, city }: { src: string; city: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? `Пауза — видео шоурума ${city}` : `Смотреть видео шоурума ${city}`}
      className="relative block aspect-[2/1] w-full overflow-hidden rounded-t-card bg-graphite-deep"
    >
      <video
        ref={ref}
        src={withBase(src)}
        muted
        playsInline
        loop
        preload="none"
        className="h-full w-full object-cover"
        onEnded={() => setPlaying(false)}
      />
      {!playing ? (
        <span className="absolute inset-0 grid place-items-center bg-ink/30 transition">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 shadow-lift backdrop-blur">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-clinker" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      ) : null}
      <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-ink">
        Видео шоу-рума
      </span>
    </button>
  );
}
