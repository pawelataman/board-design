// ── Sticker Library ─────────────────────────────────────────────────
// Self-contained SVG data-URLs. No dependency on any store types.

export type StickerCategory = "shapes" | "nature" | "typo" | "icons";

export interface StickerLibraryItem {
  id: string;
  name: string;
  url: string;
  category: StickerCategory;
}

const svg = (inner: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">${inner}</svg>`,
  )}`;

export const STICKER_LIBRARY: StickerLibraryItem[] = [
  // ── Shapes ──────────────────────────────────────────────
  {
    id: "hex-frame",
    name: "Hex Frame",
    url: svg(
      '<polygon points="120,40 190,80 190,160 120,200 50,160 50,80" fill="none" stroke="#f8fafc" stroke-width="10"/>',
    ),
    category: "shapes",
  },
  {
    id: "double-ring",
    name: "Double Ring",
    url: svg(
      '<circle cx="120" cy="120" r="66" fill="none" stroke="#7dd3fc" stroke-width="8"/><circle cx="120" cy="120" r="48" fill="none" stroke="#f8fafc" stroke-width="6"/>',
    ),
    category: "shapes",
  },
  {
    id: "tri-stack",
    name: "Tri Stack",
    url: svg(
      '<polygon points="120,52 180,148 60,148" fill="none" stroke="#fb923c" stroke-width="10"/><polygon points="120,72 166,140 74,140" fill="none" stroke="#fbbf24" stroke-width="7"/><polygon points="120,90 150,132 90,132" fill="none" stroke="#f8fafc" stroke-width="5"/>',
    ),
    category: "shapes",
  },
  {
    id: "cross-burst",
    name: "Cross Burst",
    url: svg(
      '<line x1="120" y1="44" x2="120" y2="196" stroke="#f8fafc" stroke-width="14" stroke-linecap="round"/><line x1="44" y1="120" x2="196" y2="120" stroke="#f8fafc" stroke-width="14" stroke-linecap="round"/><line x1="66" y1="66" x2="174" y2="174" stroke="#7dd3fc" stroke-width="8" stroke-linecap="round"/><line x1="174" y1="66" x2="66" y2="174" stroke="#7dd3fc" stroke-width="8" stroke-linecap="round"/>',
    ),
    category: "shapes",
  },
  {
    id: "wave-lines",
    name: "Wave Lines",
    url: svg(
      '<path d="M30,100 Q75,60 120,100 T210,100" fill="none" stroke="#5eead4" stroke-width="10" stroke-linecap="round"/><path d="M30,130 Q75,90 120,130 T210,130" fill="none" stroke="#7dd3fc" stroke-width="8" stroke-linecap="round"/><path d="M30,158 Q75,120 120,158 T210,158" fill="none" stroke="#c4b5fd" stroke-width="6" stroke-linecap="round"/>',
    ),
    category: "shapes",
  },
  {
    id: "diamond-cut",
    name: "Diamond Cut",
    url: svg(
      '<rect x="65" y="65" width="110" height="110" rx="8" transform="rotate(45 120 120)" fill="none" stroke="#f8fafc" stroke-width="10"/><rect x="82" y="82" width="76" height="76" rx="4" transform="rotate(45 120 120)" fill="#7dd3fc" fill-opacity="0.25"/>',
    ),
    category: "shapes",
  },

  // ── Nature ──────────────────────────────────────────────
  {
    id: "peak-duo",
    name: "Peak Duo",
    url: svg(
      '<path d="M36,172 L100,72 L140,130 L172,82 L204,172 Z" fill="#1e293b" stroke="#f8fafc" stroke-width="8" stroke-linejoin="round"/><circle cx="170" cy="62" r="16" fill="#fbbf24"/>',
    ),
    category: "nature",
  },
  {
    id: "pine-badge",
    name: "Pine Badge",
    url: svg(
      '<path d="M120,50 L150,110 L138,110 L160,150 L80,150 L102,110 L90,110 Z" fill="#86efac"/><rect x="112" y="150" width="16" height="26" rx="3" fill="#f8fafc"/>',
    ),
    category: "nature",
  },
  {
    id: "sun-horizon",
    name: "Sun Horizon",
    url: svg(
      '<circle cx="120" cy="108" r="36" fill="#fb923c"/><path d="M42,148 Q120,110 198,148" fill="none" stroke="#f8fafc" stroke-width="10" stroke-linecap="round"/><line x1="42" y1="170" x2="198" y2="170" stroke="#f8fafc" stroke-width="6" stroke-linecap="round"/>',
    ),
    category: "nature",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    url: svg(
      '<g stroke="#e0f2fe" stroke-width="8" stroke-linecap="round"><line x1="120" y1="48" x2="120" y2="192"/><line x1="57" y1="84" x2="183" y2="156"/><line x1="57" y1="156" x2="183" y2="84"/><line x1="120" y1="48" x2="104" y2="72"/><line x1="120" y1="48" x2="136" y2="72"/><line x1="120" y1="192" x2="104" y2="168"/><line x1="120" y1="192" x2="136" y2="168"/></g>',
    ),
    category: "nature",
  },
  {
    id: "aurora-wave",
    name: "Aurora Wave",
    url: svg(
      '<path d="M30,160 C70,80 110,100 150,80 S210,60 210,100" fill="none" stroke="#5eead4" stroke-width="16" stroke-linecap="round" opacity="0.8"/><path d="M30,180 C80,110 130,130 180,100 S220,90 220,120" fill="none" stroke="#7dd3fc" stroke-width="12" stroke-linecap="round" opacity="0.6"/>',
    ),
    category: "nature",
  },
  {
    id: "north-star",
    name: "North Star",
    url: svg(
      '<path d="M120,44 L132,100 L188,88 L140,120 L188,152 L132,140 L120,196 L108,140 L52,152 L100,120 L52,88 L108,100 Z" fill="#fbbf24"/><circle cx="120" cy="120" r="14" fill="#0f172a"/>',
    ),
    category: "nature",
  },

  // ── Typo ────────────────────────────────────────────────
  {
    id: "send-it",
    name: "Send It",
    url: svg(
      '<text x="120" y="108" font-size="48" font-weight="bold" text-anchor="middle" fill="#f8fafc" font-family="Arial,sans-serif">SEND</text><text x="120" y="158" font-size="48" font-weight="bold" text-anchor="middle" fill="#fb923c" font-family="Arial,sans-serif">IT</text>',
    ),
    category: "typo",
  },
  {
    id: "full-send",
    name: "Full Send",
    url: svg(
      '<rect x="40" y="68" width="160" height="104" rx="18" fill="none" stroke="#f8fafc" stroke-width="8"/><text x="120" y="132" font-size="38" font-weight="bold" text-anchor="middle" fill="#7dd3fc" font-family="Arial,sans-serif">FULL SEND</text>',
    ),
    category: "typo",
  },
  {
    id: "pow-day",
    name: "Pow Day",
    url: svg(
      '<text x="120" y="104" font-size="44" font-weight="bold" text-anchor="middle" fill="#f8fafc" font-family="Arial,sans-serif">POW</text><text x="120" y="156" font-size="44" font-weight="bold" text-anchor="middle" fill="#fde68a" font-family="Arial,sans-serif">DAY</text>',
    ),
    category: "typo",
  },
  {
    id: "ride-or-die",
    name: "Ride or Die",
    url: svg(
      '<text x="120" y="96" font-size="36" font-weight="bold" text-anchor="middle" fill="#f8fafc" font-family="Arial,sans-serif">RIDE</text><text x="120" y="130" font-size="22" text-anchor="middle" fill="#7dd3fc" font-family="Arial,sans-serif">or</text><text x="120" y="166" font-size="36" font-weight="bold" text-anchor="middle" fill="#f8fafc" font-family="Arial,sans-serif">DIE</text>',
    ),
    category: "typo",
  },
  {
    id: "no-limits",
    name: "No Limits",
    url: svg(
      '<path d="M56,148 Q120,56 184,148" fill="none" stroke="#f8fafc" stroke-width="8" stroke-linecap="round"/><text x="120" y="140" font-size="32" font-weight="bold" text-anchor="middle" fill="#fb923c" font-family="Arial,sans-serif">NO LIMITS</text>',
    ),
    category: "typo",
  },

  // ── Icons ───────────────────────────────────────────────
  {
    id: "bolt",
    name: "Bolt",
    url: svg(
      '<path d="M136,40 L84,124 H120 L104,200 L164,108 H128 Z" fill="#fbbf24"/>',
    ),
    category: "icons",
  },
  {
    id: "skull",
    name: "Skull",
    url: svg(
      '<circle cx="120" cy="104" r="52" fill="#f8fafc"/><circle cx="100" cy="98" r="14" fill="#0f172a"/><circle cx="140" cy="98" r="14" fill="#0f172a"/><path d="M108,128 L112,140 L120,128 L128,140 L132,128" fill="#0f172a"/><rect x="106" y="156" width="8" height="24" rx="3" fill="#f8fafc"/><rect x="120" y="156" width="8" height="28" rx="3" fill="#f8fafc"/><rect x="134" y="156" width="8" height="22" rx="3" fill="#f8fafc"/>',
    ),
    category: "icons",
  },
  {
    id: "flame",
    name: "Flame",
    url: svg(
      '<path d="M120,46 C140,90 172,110 172,144 C172,174 148,196 120,196 C92,196 68,174 68,144 C68,110 100,90 120,46 Z" fill="#f97316"/><path d="M120,100 C132,126 148,138 148,156 C148,174 136,186 120,186 C104,186 92,174 92,156 C92,138 108,126 120,100 Z" fill="#fbbf24"/>',
    ),
    category: "icons",
  },
  {
    id: "crown",
    name: "Crown",
    url: svg(
      '<path d="M52,160 L68,80 L120,120 L172,80 L188,160 Z" fill="#fbbf24" stroke="#f8fafc" stroke-width="6" stroke-linejoin="round"/><circle cx="68" cy="76" r="8" fill="#f8fafc"/><circle cx="120" cy="66" r="8" fill="#f8fafc"/><circle cx="172" cy="76" r="8" fill="#f8fafc"/>',
    ),
    category: "icons",
  },
  {
    id: "peace",
    name: "Peace",
    url: svg(
      '<circle cx="120" cy="120" r="64" fill="none" stroke="#f8fafc" stroke-width="10"/><line x1="120" y1="56" x2="120" y2="184" stroke="#f8fafc" stroke-width="10"/><line x1="120" y1="120" x2="76" y2="82" stroke="#f8fafc" stroke-width="10" stroke-linecap="round"/><line x1="120" y1="120" x2="164" y2="82" stroke="#f8fafc" stroke-width="10" stroke-linecap="round"/>',
    ),
    category: "icons",
  },
];

export const STICKER_CATEGORIES: { value: StickerCategory; label: string }[] = [
  { value: "shapes", label: "Shapes" },
  { value: "nature", label: "Nature" },
  { value: "typo", label: "Typography" },
  { value: "icons", label: "Icons" },
];
