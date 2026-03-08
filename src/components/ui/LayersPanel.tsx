import { useDesignStore, type DesignElement } from "../../store/useDesignStore";

function LayerRow({ element }: { element: DesignElement }) {
  const selectedId = useDesignStore((s) => s.selectedId);
  const select = useDesignStore((s) => s.select);
  const updateElement = useDesignStore((s) => s.updateElement);
  const removeElement = useDesignStore((s) => s.removeElement);
  const moveLayer = useDesignStore((s) => s.moveLayer);

  const isSelected = selectedId === element.id;

  const kindBadge: Record<string, string> = {
    sticker: "S",
    text: "T",
    image: "I",
  };

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
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/8 text-[10px] font-bold uppercase">
        {kindBadge[element.kind]}
      </span>

      {/* Name */}
      <span className="flex-1 truncate text-xs">{element.name}</span>

      {/* Actions (visible on hover) */}
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            updateElement(element.id, { visible: !element.visible });
          }}
          className={`rounded p-0.5 text-[10px] ${
            element.visible
              ? "text-[var(--text-secondary)]"
              : "text-[var(--accent)]"
          } hover:bg-white/8`}
          title={element.visible ? "Hide" : "Show"}
        >
          {element.visible ? "V" : "H"}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            updateElement(element.id, { locked: !element.locked });
          }}
          className={`rounded p-0.5 text-[10px] ${
            element.locked
              ? "text-[var(--accent)]"
              : "text-[var(--text-secondary)]"
          } hover:bg-white/8`}
          title={element.locked ? "Unlock" : "Lock"}
        >
          {element.locked ? "L" : "U"}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            moveLayer(element.id, "up");
          }}
          className="rounded p-0.5 text-[10px] text-[var(--text-secondary)] hover:bg-white/8"
          title="Move up"
        >
          ^
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            moveLayer(element.id, "down");
          }}
          className="rounded p-0.5 text-[10px] text-[var(--text-secondary)] hover:bg-white/8"
          title="Move down"
        >
          v
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeElement(element.id);
          }}
          className="rounded p-0.5 text-[10px] text-[var(--danger)] hover:bg-[var(--danger)]/10"
          title="Delete"
        >
          x
        </button>
      </div>
    </div>
  );
}

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
