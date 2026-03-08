import { useDesignStore, type DesignElement } from "../../store/useDesignStore";

// ── Board properties (shown when nothing is selected) ────────────

function BoardProperties() {
  const boardColor = useDesignStore((s) => s.board.color);
  const boardRoughness = useDesignStore((s) => s.board.roughness);
  const boardMetalness = useDesignStore((s) => s.board.metalness);
  const setBoard = useDesignStore((s) => s.setBoard);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        Board
      </h3>

      <label className="flex items-center justify-between">
        <span className="text-sm">Color</span>
        <input
          type="color"
          value={boardColor}
          onChange={(e) => setBoard({ color: e.target.value })}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <div className="flex justify-between text-sm">
          <span>Roughness</span>
          <span className="text-[var(--text-secondary)]">
            {boardRoughness.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={boardRoughness}
          onChange={(e) => setBoard({ roughness: parseFloat(e.target.value) })}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <div className="flex justify-between text-sm">
          <span>Metalness</span>
          <span className="text-[var(--text-secondary)]">
            {boardMetalness.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={boardMetalness}
          onChange={(e) => setBoard({ metalness: parseFloat(e.target.value) })}
        />
      </label>
    </div>
  );
}

// ── Element properties (shown when an element is selected) ───────

function ElementProperties({ element }: { element: DesignElement }) {
  const updateElement = useDesignStore((s) => s.updateElement);
  const removeElement = useDesignStore((s) => s.removeElement);
  const duplicateElement = useDesignStore((s) => s.duplicateElement);
  const t = element.transform;

  const update = (partial: Partial<DesignElement>) =>
    updateElement(element.id, partial);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {element.kind}
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => duplicateElement(element.id)}
            className="rounded-lg px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-white/8 hover:text-[var(--text-primary)]"
            title="Duplicate"
          >
            Dup
          </button>
          <button
            type="button"
            onClick={() => removeElement(element.id)}
            className="rounded-lg px-2 py-1 text-xs text-[var(--danger)] hover:bg-[var(--danger)]/10"
            title="Delete"
          >
            Del
          </button>
        </div>
      </div>

      {/* Name */}
      <label className="flex flex-col gap-1.5">
        <span className="text-xs text-[var(--text-secondary)]">Name</span>
        <input
          type="text"
          value={element.name}
          onChange={(e) => update({ name: e.target.value })}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-sm outline-none focus:border-[var(--border-active)]"
        />
      </label>

      {/* Transform */}
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[var(--text-secondary)]">X</span>
          <input
            type="number"
            step={0.01}
            value={t.x}
            onChange={(e) =>
              update({ transform: { ...t, x: parseFloat(e.target.value) || 0 } })
            }
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 text-sm outline-none focus:border-[var(--border-active)]"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[var(--text-secondary)]">Y</span>
          <input
            type="number"
            step={0.01}
            value={t.y}
            onChange={(e) =>
              update({ transform: { ...t, y: parseFloat(e.target.value) || 0 } })
            }
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 text-sm outline-none focus:border-[var(--border-active)]"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[var(--text-secondary)]">Rotation</span>
          <input
            type="number"
            step={0.05}
            value={t.rotation}
            onChange={(e) =>
              update({
                transform: { ...t, rotation: parseFloat(e.target.value) || 0 },
              })
            }
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 text-sm outline-none focus:border-[var(--border-active)]"
          />
        </label>
      </div>

      {/* Scale slider */}
      <label className="flex flex-col gap-1.5">
        <div className="flex justify-between text-sm">
          <span>Scale</span>
          <span className="text-[var(--text-secondary)]">
            {t.scale.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min={0.02}
          max={3}
          step={0.01}
          value={t.scale}
          onChange={(e) =>
            update({
              transform: { ...t, scale: parseFloat(e.target.value) },
            })
          }
        />
      </label>

      {/* Opacity (stickers and images) */}
      {(element.kind === "sticker" || element.kind === "image") && (
        <label className="flex flex-col gap-1.5">
          <div className="flex justify-between text-sm">
            <span>Opacity</span>
            <span className="text-[var(--text-secondary)]">
              {(element.opacity ?? 1).toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={element.opacity ?? 1}
            onChange={(e) =>
              update({ opacity: parseFloat(e.target.value) })
            }
          />
        </label>
      )}

      {/* Text-specific props */}
      {element.kind === "text" && (
        <>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-[var(--text-secondary)]">Text</span>
            <input
              type="text"
              maxLength={24}
              value={element.text ?? ""}
              onChange={(e) => update({ text: e.target.value })}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-sm outline-none focus:border-[var(--border-active)]"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm">Color</span>
            <input
              type="color"
              value={element.color ?? "#ffffff"}
              onChange={(e) => update({ color: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-[var(--text-secondary)]">Font</span>
            <select
              value={element.fontFamily ?? "Syne"}
              onChange={(e) => update({ fontFamily: e.target.value })}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-sm outline-none focus:border-[var(--border-active)]"
            >
              <option value="Syne">Syne</option>
              <option value="Space Grotesk">Space Grotesk</option>
              <option value="Inter">Inter</option>
            </select>
          </label>
        </>
      )}

      {/* Visibility / Lock */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => update({ visible: !element.visible })}
          className={`flex-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium transition-colors ${
            element.visible
              ? "bg-[var(--surface-2)]"
              : "bg-[var(--accent-dim)] text-[var(--accent)]"
          }`}
        >
          {element.visible ? "Visible" : "Hidden"}
        </button>
        <button
          type="button"
          onClick={() => update({ locked: !element.locked })}
          className={`flex-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium transition-colors ${
            element.locked
              ? "bg-[var(--accent-dim)] text-[var(--accent)]"
              : "bg-[var(--surface-2)]"
          }`}
        >
          {element.locked ? "Locked" : "Unlocked"}
        </button>
      </div>
    </div>
  );
}

// ── Main panel ───────────────────────────────────────────────────

export default function PropertiesPanel() {
  const propertiesPanelOpen = useDesignStore((s) => s.propertiesPanelOpen);
  const selectedId = useDesignStore((s) => s.selectedId);
  const elements = useDesignStore((s) => s.elements);

  if (!propertiesPanelOpen) return null;

  const selected = selectedId
    ? elements.find((e) => e.id === selectedId)
    : undefined;

  return (
    <div className="panel w-full md:w-72 p-4 overflow-y-auto max-h-[50vh] md:max-h-[calc(100vh-7rem)]">
      {selected ? (
        <ElementProperties element={selected} />
      ) : (
        <BoardProperties />
      )}
    </div>
  );
}
