import {
  Cursor,
  Sticker,
  TextT,
  Image,
  ArrowsCounterClockwise,
  ShareNetwork,
  DownloadSimple,
} from "@phosphor-icons/react";
import { useDesignStore } from "../../store/useDesignStore";

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
  const requestScreenshot = useDesignStore((s) => s.requestScreenshot);
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
      icon: <Cursor size={18} />,
      label: "Select",
      action: () => setTool("select"),
      active: activeTool === "select",
    },
    {
      id: "sticker",
      icon: <Sticker size={18} />,
      label: "Stickers",
      action: () => openLibrary("stickers"),
    },
    {
      id: "text",
      icon: <TextT size={18} />,
      label: "Text",
      action: handleAddText,
    },
    {
      id: "image",
      icon: <Image size={18} />,
      label: "Image",
      action: () => openLibrary("images"),
    },
  ];

  return (
    <div className="toolbar-pill flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1.5">
      {tools.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={t.action}
          title={t.label}
          className={`flex items-center gap-1.5 rounded-full px-2 sm:px-3 py-1.5 text-xs font-medium transition-colors ${
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
        className="flex items-center gap-1.5 rounded-full px-2 sm:px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/8 hover:text-[var(--text-primary)]"
      >
        <ArrowsCounterClockwise size={18} />
        <span className="hidden sm:inline">
          {activeSide === "front" ? "Back" : "Front"}
        </span>
      </button>

      <div className="mx-1 h-5 w-px bg-white/10" />

      <button
        type="button"
        onClick={handleShare}
        title="Copy share URL"
        className="flex items-center gap-1.5 rounded-full px-2 sm:px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/8 hover:text-[var(--text-primary)]"
      >
        <ShareNetwork size={18} />
        <span className="hidden sm:inline">Share</span>
      </button>

      <button
        type="button"
        onClick={requestScreenshot}
        title="Export as PNG"
        className="flex items-center gap-1.5 rounded-full px-2 sm:px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/8 hover:text-[var(--text-primary)]"
      >
        <DownloadSimple size={18} />
        <span className="hidden sm:inline">Export</span>
      </button>
    </div>
  );
}
