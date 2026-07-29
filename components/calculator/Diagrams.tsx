/**
 * Схемы-подсказки калькулятора. Поля формы называются буквами (N, W, d, h) —
 * схема делает их самообъясняющимися: видно, где у марша проступь, а где
 * подступёнок, без знания терминов. Чистый инлайн-SVG, без библиотек.
 *
 * SVG декоративный (aria-hidden): расшифровка букв продублирована текстом
 * в легенде под схемой.
 */

const INK = "#3A342C";
const ACCENT = "#E0703F";
const SIDE = "#F3F1EC";
const TOP = "#E7E0D2";
const BACK = "#DBD2BF";

function Arrow({
  id,
  x1,
  y1,
  x2,
  y2,
}: {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={ACCENT}
      strokeWidth="1.8"
      markerStart={`url(#${id})`}
      markerEnd={`url(#${id})`}
    />
  );
}

function ArrowDefs({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 8 8"
        refX="4"
        refY="4"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0 0.8 L7.2 4 L0 7.2 Z" fill={ACCENT} />
      </marker>
    </defs>
  );
}

const label = { fontSize: 13, fontWeight: 700, fill: ACCENT } as const;

/** Разрез лестничного марша: N ступеней, ширина W, проступь d, подступёнок h. */
export function StairDiagram({ className = "" }: { className?: string }) {
  return (
    <figure className={className}>
      <svg viewBox="0 0 300 200" role="presentation" aria-hidden className="w-full max-w-xs">
        <ArrowDefs id="st-arr" />
        {/* задняя грань */}
        <polygon points="230,60 264,46 264,166 230,180" fill={BACK} stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
        {/* верхние плоскости проступей */}
        <polygon points="20,140 90,140 124,126 54,126" fill={TOP} stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
        <polygon points="90,100 160,100 194,86 124,86" fill={TOP} stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
        <polygon points="160,60 230,60 264,46 194,46" fill={TOP} stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
        {/* боковой профиль */}
        <polygon
          points="20,180 20,140 90,140 90,100 160,100 160,60 230,60 230,180"
          fill={SIDE}
          stroke={INK}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* d — глубина проступи (по верху второй ступени) */}
        <Arrow id="st-arr" x1={92} y1={93} x2={158} y2={93} />
        <text x={125} y={88} textAnchor="middle" style={label}>d</text>
        {/* h — высота подступёнка (третий подъём) */}
        <Arrow id="st-arr" x1={151} y1={62} x2={151} y2={98} />
        <text x={143} y={84} textAnchor="end" style={label}>h</text>
        {/* W — ширина марша (в глубину сцены) */}
        <Arrow id="st-arr" x1={234} y1={74} x2={266} y2={61} />
        <text x={258} y={80} textAnchor="middle" style={label}>W</text>
        {/* N — счёт ступеней */}
        {[[55, 158], [125, 118], [195, 78]].map(([x, y], i) => (
          <text key={i} x={x} y={y} textAnchor="middle" fontSize="11" fontWeight={600} fill={INK}>
            {i + 1}
          </text>
        ))}
        <text x={20} y={196} fontSize="12" fontWeight={700} fill={INK}>
          N = ступеней в марше
        </text>
      </svg>
      <figcaption className="mt-1 text-xs leading-relaxed text-stone/80">
        W — ширина марша · d — глубина проступи · h — высота подступёнка
      </figcaption>
    </figure>
  );
}

/** Участок террасы: длина × ширина, вычет (бассейн/клумба) — не облицовывается. */
export function TerraceDiagram({ className = "" }: { className?: string }) {
  return (
    <figure className={className}>
      <svg viewBox="0 0 300 180" role="presentation" aria-hidden className="w-full max-w-xs">
        <ArrowDefs id="tr-arr" />
        {/* плитка участка */}
        <rect x={34} y={22} width={240} height={116} fill={SIDE} stroke={INK} strokeWidth="1.6" />
        {[94, 154, 214].map((x) => (
          <line key={x} x1={x} y1={22} x2={x} y2={138} stroke={INK} strokeWidth="0.5" opacity="0.35" />
        ))}
        {[61, 100].map((y) => (
          <line key={y} x1={34} y1={y} x2={274} y2={y} stroke={INK} strokeWidth="0.5" opacity="0.35" />
        ))}
        {/* вычет */}
        <circle cx={210} cy={78} r={30} fill="#fff" stroke={ACCENT} strokeWidth="1.6" strokeDasharray="5 4" />
        <text x={210} y={82} textAnchor="middle" fontSize="11" fontWeight={600} fill={ACCENT}>
          вычет
        </text>
        {/* длина */}
        <Arrow id="tr-arr" x1={36} y1={156} x2={272} y2={156} />
        <text x={154} y={172} textAnchor="middle" style={label}>длина</text>
        {/* ширина */}
        <Arrow id="tr-arr" x1={16} y1={24} x2={16} y2={136} />
        <text x={12} y={84} textAnchor="middle" style={label} transform="rotate(-90 12 84)">
          ширина
        </text>
      </svg>
      <figcaption className="mt-1 text-xs leading-relaxed text-stone/80">
        Вычеты — бассейн, клумба, колонна: их площадь не облицовывается
      </figcaption>
    </figure>
  );
}
