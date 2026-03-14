import { useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { UserButton } from "@clerk/react";
import Scene from "../components/canvas/Scene";
import Toolbar from "../components/ui/Toolbar";
import LayersPanel from "../components/ui/LayersPanel";
import PropertiesPanel from "../components/ui/PropertiesPanel";
import LibraryPopover from "../components/ui/LibraryPopover";
import MobileTabBar from "../components/ui/MobileTabBar";
import { decodeSharedDesign, useDesignStore } from "../store/useDesignStore";
import { useBoard } from "../api/boards";

export default function Designer() {
  const [searchParams] = useSearchParams();
  const boardId = searchParams.get("boardId");

  const mobilePanelTab = useDesignStore((s) => s.mobilePanelTab);
  const storeBoardId = useDesignStore((s) => s.boardId);

  const { data: apiBoard, isLoading, isError } = useBoard(boardId ?? "");

  // Track whether we've already hydrated from the API to avoid re-hydrating
  const hydratedRef = useRef<string | null>(null);

  // Lock scrolling & touch on body while designer is active
  useEffect(() => {
    document.body.classList.add("designer-active");
    return () => document.body.classList.remove("designer-active");
  }, []);

  // ── Hydrate store from API board (when boardId is in URL) ──
  useEffect(() => {
    if (!boardId) return;
    if (!apiBoard) return;
    // Only hydrate once per boardId (avoid overwriting user edits on refetch)
    if (hydratedRef.current === boardId) return;

    hydratedRef.current = boardId;
    useDesignStore.getState().loadFromApiBoard(apiBoard);
  }, [boardId, apiBoard]);

  // ── Fallback: load from shared URL or localStorage (no boardId) ──
  useEffect(() => {
    if (boardId) return; // skip if we're loading from API

    const designParam = searchParams.get("design");

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
  }, [boardId, searchParams]);

  // ── Auto-save: currently disabled (see commented block below) ──

  // // ── Auto-save: debounced subscription to store changes ──
  // useEffect(() => {
  //   let timeoutId = 0;

  //   const unsubscribe = useDesignStore.subscribe(() => {
  //     window.clearTimeout(timeoutId);
  //     timeoutId = window.setTimeout(() => {
  //       const state = useDesignStore.getState();
  //       if (state.boardId) {
  //         // Board is API-persisted → save to API
  //         saveToApi();
  //       } else {
  //         // Scratch design → save to localStorage
  //         state.saveToLocal();
  //       }
  //     }, 1_000);
  //   });

  //   return () => {
  //     window.clearTimeout(timeoutId);
  //     unsubscribe();
  //   };
  // }, [saveToApi]);

  // ── Reset store when leaving the designer ──
  useEffect(() => {
    return () => {
      useDesignStore.getState().resetDesign();
    };
  }, []);

  // ── Loading / error states for API boards ──
  if (boardId && isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#04070d] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-sky-400" />
          <p className="text-sm text-white/60">Loading board...</p>
        </div>
      </div>
    );
  }

  if (boardId && isError) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#04070d] text-white">
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg font-semibold text-red-400">
            Failed to load board
          </p>
          <p className="text-sm text-white/60">
            The board may have been deleted or the server is unavailable.
          </p>
          <a
            href="/boards"
            className="mt-2 rounded-lg bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
          >
            Back to boards
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_top,#123047_0%,#081321_42%,#04070d_100%)] text-white">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(125,211,252,0.12),transparent_28%),radial-gradient(circle_at_78%_12%,rgba(251,191,36,0.12),transparent_22%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_30%)]" />

      {/* Full-bleed 3D canvas */}
      <Scene />

      {/* Floating UI panels */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* Top-left: back to boards + board name */}
        <div className="pointer-events-auto absolute left-4 top-4 flex items-center gap-3">
          <Link
            to="/boards"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur transition-colors hover:bg-white/20 hover:text-white"
            title="Back to boards"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          {storeBoardId && (
            <span className="text-sm text-white/50">
              {useDesignStore.getState().boardName ?? "Untitled"}
            </span>
          )}
        </div>

        {/* Top-right: user button */}
        <div className="pointer-events-auto absolute right-4 top-4">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
        </div>

        {/* Top toolbar — centered */}
        <div className="pointer-events-auto absolute left-1/2 top-4 -translate-x-1/2">
          <Toolbar />
        </div>

        {/* Desktop: side-by-side panels (hidden on mobile) */}
        <div className="pointer-events-auto absolute left-4 top-20 bottom-4 hidden md:block">
          <LayersPanel />
        </div>
        <div className="pointer-events-auto absolute right-4 top-20 bottom-4 hidden md:block">
          <PropertiesPanel />
        </div>

        {/* Mobile: bottom sheet panel (visible only on small screens when a tab is active) */}
        {mobilePanelTab && (
          <div className="pointer-events-auto absolute inset-x-0 bottom-14 max-h-[50vh] overflow-y-auto px-3 md:hidden">
            {mobilePanelTab === "layers" && <LayersPanel />}
            {mobilePanelTab === "properties" && <PropertiesPanel />}
          </div>
        )}

        {/* Mobile: bottom tab bar (visible only on small screens) */}
        <div className="pointer-events-auto absolute inset-x-0 bottom-0 md:hidden">
          <MobileTabBar />
        </div>

        {/* Library popover (stickers / image upload) */}
        <div className="pointer-events-auto">
          <LibraryPopover />
        </div>
      </div>
    </div>
  );
}
