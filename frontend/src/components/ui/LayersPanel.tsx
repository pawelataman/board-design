import {
  Eye,
  EyeSlash,
  Lock,
  LockOpen,
  CaretUp,
  CaretDown,
  Trash,
  Sticker,
  TextT,
  Image,
} from "@phosphor-icons/react";
import { useDesignStore, type DesignElement } from "../../store/useDesignStore";

// ── Kind badge icon mapping ─────────────────────────────────────

const kindBadgeIcon: Record<string, React.ReactNode> = {
  sticker: <Sticker size={12} weight="bold" />,
  text: <TextT size={12} weight="bold" />,
  image: <Image size={12} weight="bold" />,
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
          {element.visible ? <Eye size={14} /> : <EyeSlash size={14} />}
        </ActionButton>

        <ActionButton
          onClick={() =>
            updateElement(element.id, { locked: !element.locked })
          }
          title={element.locked ? "Unlock" : "Lock"}
          variant={element.locked ? "active" : "default"}
        >
          {element.locked ? <Lock size={14} /> : <LockOpen size={14} />}
        </ActionButton>

        <ActionButton
          onClick={() => moveLayer(element.id, "up")}
          title="Move up"
        >
          <CaretUp size={14} />
        </ActionButton>

        <ActionButton
          onClick={() => moveLayer(element.id, "down")}
          title="Move down"
        >
          <CaretDown size={14} />
        </ActionButton>

        <ActionButton
          onClick={() => removeElement(element.id)}
          title="Delete"
          variant="danger"
        >
          <Trash size={14} />
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
    <div className="panel w-full md:w-72 p-3 overflow-y-auto max-h-[50vh] md:max-h-[calc(100vh-7rem)]">
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
