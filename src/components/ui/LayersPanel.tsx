import { useDesignStore, type DesignElement } from "../../store/useDesignStore";

// ── Inline SVG icons (14×14, Lucide-style) ──────────────────────

const iconProps = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

const EyeIcon = () => (
  <svg {...iconProps}>
    <title>Visible</title>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg {...iconProps}>
    <title>Hidden</title>
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const LockIcon = () => (
  <svg {...iconProps}>
    <title>Locked</title>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const UnlockIcon = () => (
  <svg {...iconProps}>
    <title>Unlocked</title>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 019.9-1" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg {...iconProps}>
    <title>Move up</title>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg {...iconProps}>
    <title>Move down</title>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const TrashIcon = () => (
  <svg {...iconProps}>
    <title>Delete</title>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);

// Kind badge icons (12×12)
const badgeIconProps = {
  width: 12,
  height: 12,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

const StickerBadge = () => (
  <svg {...badgeIconProps}>
    <title>Sticker</title>
    <path d="M15.5 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8.5L15.5 3z" />
  </svg>
);

const TextBadge = () => (
  <svg {...badgeIconProps}>
    <title>Text</title>
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

const ImageBadge = () => (
  <svg {...badgeIconProps}>
    <title>Image</title>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const kindBadgeIcon: Record<string, React.ReactNode> = {
  sticker: <StickerBadge />,
  text: <TextBadge />,
  image: <ImageBadge />,
};

// ── Action button wrapper ────────────────────────────────────────

function ActionButton({
  onClick,
  title,
  variant = "default",
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  title: string;
  variant?: "default" | "active" | "danger";
  children: React.ReactNode;
}) {
  const colorClass =
    variant === "danger"
      ? "text-[var(--danger)] hover:bg-[var(--danger)]/10"
      : variant === "active"
        ? "text-[var(--accent)] hover:bg-white/8"
        : "text-[var(--text-secondary)] hover:bg-white/8";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className={`flex items-center justify-center rounded p-1 transition-colors ${colorClass}`}
      title={title}
    >
      {children}
    </button>
  );
}

// ── Layer row ────────────────────────────────────────────────────

function LayerRow({ element }: { element: DesignElement }) {
  const selectedId = useDesignStore((s) => s.selectedId);
  const select = useDesignStore((s) => s.select);
  const updateElement = useDesignStore((s) => s.updateElement);
  const removeElement = useDesignStore((s) => s.removeElement);
  const moveLayer = useDesignStore((s) => s.moveLayer);

  const isSelected = selectedId === element.id;

  return (
    <div
      role="button"
      tabIndex={0}
      className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors cursor-pointer ${
        isSelected
          ? "bg-[var(--accent-dim)] text-[var(--accent)]"
          : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
      }`}
      onClick={() => select(element.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") select(element.id);
      }}
    >
      {/* Kind badge */}
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/8">
        {kindBadgeIcon[element.kind]}
      </span>

      {/* Name */}
      <span className="flex-1 truncate text-xs">{element.name}</span>

      {/* Actions (visible on hover / always visible when selected) */}
      <div
        className={`flex shrink-0 items-center gap-0.5 transition-opacity ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <ActionButton
          onClick={() =>
            updateElement(element.id, { visible: !element.visible })
          }
          title={element.visible ? "Hide" : "Show"}
          variant={element.visible ? "default" : "active"}
        >
          {element.visible ? <EyeIcon /> : <EyeOffIcon />}
        </ActionButton>

        <ActionButton
          onClick={() =>
            updateElement(element.id, { locked: !element.locked })
          }
          title={element.locked ? "Unlock" : "Lock"}
          variant={element.locked ? "active" : "default"}
        >
          {element.locked ? <LockIcon /> : <UnlockIcon />}
        </ActionButton>

        <ActionButton
          onClick={() => moveLayer(element.id, "up")}
          title="Move up"
        >
          <ChevronUpIcon />
        </ActionButton>

        <ActionButton
          onClick={() => moveLayer(element.id, "down")}
          title="Move down"
        >
          <ChevronDownIcon />
        </ActionButton>

        <ActionButton
          onClick={() => removeElement(element.id)}
          title="Delete"
          variant="danger"
        >
          <TrashIcon />
        </ActionButton>
      </div>
    </div>
  );
}

// ── Panel ────────────────────────────────────────────────────────

export default function LayersPanel() {
  const layersPanelOpen = useDesignStore((s) => s.layersPanelOpen);
  const elements = useDesignStore((s) => s.elements);
  const activeSide = useDesignStore((s) => s.activeSide);

  if (!layersPanelOpen) return null;

  // Show elements for active side, sorted by order (highest first = top of list)
  const sideElements = elements
    .filter((e) => e.side === activeSide)
    .sort((a, b) => b.order - a.order);

  return (
    <div className="panel w-56 p-3 overflow-y-auto max-h-[calc(100vh-7rem)]">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        Layers — {activeSide}
      </h3>

      {sideElements.length === 0 ? (
        <p className="py-4 text-center text-xs text-[var(--text-secondary)]">
          No elements on this side
        </p>
      ) : (
        <div className="flex flex-col gap-0.5">
          {sideElements.map((el) => (
            <LayerRow key={el.id} element={el} />
          ))}
        </div>
      )}
    </div>
  );
}
