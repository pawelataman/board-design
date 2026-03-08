import { useDesignStore } from "../../store/useDesignStore";

// ── SVG icon helpers (inline, no dependency) ────────────────────

const Icon = ({ d, label, size = 18 }: { d: string; label: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <title>{label}</title>
    <path d={d} />
  </svg>
);

const SelectIcon = () => <Icon d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" label="Select" />;
const StickerIcon = () => <Icon d="M15.5 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8.5L15.5 3z" label="Stickers" />;
const TextIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <title>Text</title>
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);
const ImageIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <title>Image</title>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const FlipIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <title>Flip</title>
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 014-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 01-4 4H3" />
  </svg>
);
const ShareIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <title>Share</title>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

type ToolBtn = {
  id: string;
  icon: React.ReactNode;
  label: string;
  action: () => void;
  active?: boolean;
};

export default function Toolbar() {
  const activeTool = useDesignStore((s) => s.activeTool);
  const setTool = useDesignStore((s) => s.setTool);
  const flipSide = useDesignStore((s) => s.flipSide);
  const activeSide = useDesignStore((s) => s.activeSide);
  const openLibrary = useDesignStore((s) => s.openLibrary);
  const generateShareURL = useDesignStore((s) => s.generateShareURL);
  const addElement = useDesignStore((s) => s.addElement);

  const handleShare = () => {
    const url = generateShareURL();
    navigator.clipboard.writeText(url).then(
      () => window.alert("Share URL copied to clipboard!"),
      () => window.alert("Could not copy URL"),
    );
  };

  const handleAddText = () => {
    addElement({
      kind: "text",
      side: useDesignStore.getState().activeSide,
      name: "Text",
      transform: { x: 0, y: 0, rotation: 0, scale: 0.22 },
      visible: true,
      locked: false,
      text: "Hello",
      fontFamily: "Syne",
      color: "#ffffff",
    });
  };

  const tools: ToolBtn[] = [
    {
      id: "select",
      icon: <SelectIcon />,
      label: "Select",
      action: () => setTool("select"),
      active: activeTool === "select",
    },
    {
      id: "sticker",
      icon: <StickerIcon />,
      label: "Stickers",
      action: () => openLibrary("stickers"),
    },
    {
      id: "text",
      icon: <TextIcon />,
      label: "Text",
      action: handleAddText,
    },
    {
      id: "image",
      icon: <ImageIcon />,
      label: "Image",
      action: () => openLibrary("images"),
    },
  ];

  return (
    <div className="toolbar-pill flex items-center gap-1 px-2 py-1.5">
      {tools.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={t.action}
          title={t.label}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            t.active
              ? "bg-white/12 text-[var(--accent)]"
              : "text-[var(--text-secondary)] hover:bg-white/8 hover:text-[var(--text-primary)]"
          }`}
        >
          {t.icon}
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}

      <div className="mx-1 h-5 w-px bg-white/10" />

      <button
        type="button"
        onClick={flipSide}
        title={`Flip to ${activeSide === "front" ? "back" : "front"}`}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/8 hover:text-[var(--text-primary)]"
      >
        <FlipIcon />
        <span className="hidden sm:inline">
          {activeSide === "front" ? "Back" : "Front"}
        </span>
      </button>

      <div className="mx-1 h-5 w-px bg-white/10" />

      <button
        type="button"
        onClick={handleShare}
        title="Copy share URL"
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/8 hover:text-[var(--text-primary)]"
      >
        <ShareIcon />
        <span className="hidden sm:inline">Share</span>
      </button>
    </div>
  );
}
