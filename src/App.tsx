import { useEffect } from "react";
import Scene from "./components/canvas/Scene";
import Toolbar from "./components/ui/Toolbar";
import LayersPanel from "./components/ui/LayersPanel";
import PropertiesPanel from "./components/ui/PropertiesPanel";
import LibraryPopover from "./components/ui/LibraryPopover";
import { decodeSharedDesign, useDesignStore } from "./store/useDesignStore";

export default function App() {
  // Load persisted design on mount (shared URL takes priority)
  useEffect(() => {
    const designParam = new URLSearchParams(window.location.search).get(
      "design",
    );

    if (designParam) {
      try {
        const decoded = decodeSharedDesign(designParam);
        useDesignStore.getState().importJSON(decoded);
        return;
      } catch {
        window.console.warn("Could not decode shared design URL.");
      }
    }

    useDesignStore.getState().loadFromLocal();
  }, []);

  // Auto-save to localStorage (debounced 1s)
  useEffect(() => {
    let timeoutId = 0;

    const unsubscribe = useDesignStore.subscribe(() => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        useDesignStore.getState().saveToLocal();
      }, 1000);
    });

    return () => {
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_top,#123047_0%,#081321_42%,#04070d_100%)] text-white">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(125,211,252,0.12),transparent_28%),radial-gradient(circle_at_78%_12%,rgba(251,191,36,0.12),transparent_22%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_30%)]" />

      {/* Full-bleed 3D canvas */}
      <Scene />

      {/* Floating UI panels */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* Top toolbar — centered */}
        <div className="pointer-events-auto absolute left-1/2 top-4 -translate-x-1/2">
          <Toolbar />
        </div>

        {/* Left — layers panel */}
        <div className="pointer-events-auto absolute left-4 top-20 bottom-4">
          <LayersPanel />
        </div>

        {/* Right — properties panel */}
        <div className="pointer-events-auto absolute right-4 top-20 bottom-4">
          <PropertiesPanel />
        </div>

        {/* Library popover (stickers / image upload) */}
        <div className="pointer-events-auto">
          <LibraryPopover />
        </div>
      </div>
    </div>
  );
}
