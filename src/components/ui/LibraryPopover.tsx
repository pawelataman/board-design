import { useState, useCallback } from "react";
import { useDesignStore } from "../../store/useDesignStore";
import {
  STICKER_LIBRARY,
  STICKER_CATEGORIES,
  type StickerCategory,
} from "../../assets/stickers/index";

// ── Sticker browser tab ─────────────────────────────────────────

function StickersTab() {
  const [category, setCategory] = useState<StickerCategory | "all">("all");
  const addElement = useDesignStore((s) => s.addElement);
  const activeSide = useDesignStore((s) => s.activeSide);
  const closeLibrary = useDesignStore((s) => s.closeLibrary);

  const filtered =
    category === "all"
      ? STICKER_LIBRARY
      : STICKER_LIBRARY.filter((s) => s.category === category);

  const handleAdd = (sticker: (typeof STICKER_LIBRARY)[0]) => {
    addElement({
      kind: "sticker",
      side: activeSide,
      name: sticker.name,
      transform: { x: 0, y: 0, rotation: 0, scale: 0.45 },
      visible: true,
      locked: false,
      url: sticker.url,
      opacity: 1,
    });
    closeLibrary();
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Category filter */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setCategory("all")}
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
            category === "all"
              ? "bg-[var(--accent-dim)] text-[var(--accent)]"
              : "text-[var(--text-secondary)] hover:bg-white/8"
          }`}
        >
          All
        </button>
        {STICKER_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
              category === cat.value
                ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:bg-white/8"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2">
        {filtered.map((sticker) => (
          <button
            key={sticker.id}
            onClick={() => handleAdd(sticker)}
            className="group flex flex-col items-center gap-1 rounded-lg p-1.5 transition-colors hover:bg-white/8"
            title={sticker.name}
          >
            <img
              src={sticker.url}
              alt={sticker.name}
              className="h-12 w-12 rounded-md"
              draggable={false}
            />
            <span className="truncate text-[10px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
              {sticker.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Image upload tab ────────────────────────────────────────────

function ImagesTab() {
  const addElement = useDesignStore((s) => s.addElement);
  const activeSide = useDesignStore((s) => s.activeSide);
  const closeLibrary = useDesignStore((s) => s.closeLibrary);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        addElement({
          kind: "image",
          side: activeSide,
          name: file.name.replace(/\.[^.]+$/, ""),
          transform: { x: 0, y: 0, rotation: 0, scale: 1 },
          visible: true,
          locked: false,
          url: dataUrl,
          isCustomUpload: true,
          opacity: 1,
        });
        closeLibrary();
      };
      reader.readAsDataURL(file);
    },
    [activeSide, addElement, closeLibrary],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[var(--border)] p-8 text-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <p className="text-sm text-[var(--text-secondary)]">
        Drag & drop an image here
      </p>
      <span className="text-xs text-[var(--text-secondary)]">or</span>
      <label className="cursor-pointer rounded-lg bg-[var(--accent-dim)] px-4 py-1.5 text-xs font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/25">
        Browse files
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </label>
    </div>
  );
}

// ── Main popover ────────────────────────────────────────────────

export default function LibraryPopover() {
  const libraryOpen = useDesignStore((s) => s.libraryOpen);
  const libraryTab = useDesignStore((s) => s.libraryTab);
  const openLibrary = useDesignStore((s) => s.openLibrary);
  const closeLibrary = useDesignStore((s) => s.closeLibrary);

  if (!libraryOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={closeLibrary} />

      {/* Panel */}
      <div className="panel absolute left-1/2 top-16 z-50 w-[calc(100vw-2rem)] max-w-[360px] -translate-x-1/2 p-4">
        {/* Tabs */}
        <div className="mb-3 flex items-center gap-2 border-b border-[var(--border)] pb-2">
          <button
            onClick={() => openLibrary("stickers")}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              libraryTab === "stickers"
                ? "bg-white/10 text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Stickers
          </button>
          <button
            onClick={() => openLibrary("images")}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              libraryTab === "images"
                ? "bg-white/10 text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Upload Image
          </button>

          <button
            onClick={closeLibrary}
            className="ml-auto rounded-lg px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-white/8 hover:text-[var(--text-primary)]"
          >
            x
          </button>
        </div>

        {libraryTab === "stickers" ? <StickersTab /> : <ImagesTab />}
      </div>
    </>
  );
}
