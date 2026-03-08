import { create } from "zustand";

// ── Types ──────────────────────────────────────────────────────────

export type Side = "front" | "back";

export type ElementKind = "sticker" | "text" | "image";

export interface Transform {
  x: number;
  y: number;
  rotation: number; // radians around Z
  scale: number; // uniform scale factor
}

export interface DesignElement {
  id: string;
  kind: ElementKind;
  side: Side;
  name: string;
  transform: Transform;
  visible: boolean;
  locked: boolean;
  order: number;
  // Sticker / Image
  url?: string;
  isCustomUpload?: boolean;
  opacity?: number;
  // Text
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
}

export interface BoardSettings {
  color: string;
  roughness: number;
  metalness: number;
}

export type Tool = "select" | "hand";

export type MobilePanelTab = "layers" | "properties" | null;

export interface DesignState {
  // Board
  board: BoardSettings;
  activeSide: Side;

  // Elements
  elements: DesignElement[];
  selectedId: string | null;

  // UI
  activeTool: Tool;
  layersPanelOpen: boolean;
  propertiesPanelOpen: boolean;
  libraryOpen: boolean;
  libraryTab: "stickers" | "images";
  mobilePanelTab: MobilePanelTab;

  // Board actions
  setBoard: (partial: Partial<BoardSettings>) => void;
  setActiveSide: (side: Side) => void;
  flipSide: () => void;

  // Element CRUD
  addElement: (element: Omit<DesignElement, "id" | "order">) => void;
  updateElement: (id: string, partial: Partial<DesignElement>) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;

  // Selection
  select: (id: string | null) => void;
  clearSelection: () => void;
  selectedElement: () => DesignElement | undefined;

  // Layer ordering
  moveLayer: (id: string, direction: "up" | "down") => void;
  moveToTop: (id: string) => void;
  moveToBottom: (id: string) => void;

  // Tools & panels
  setTool: (tool: Tool) => void;
  toggleLayersPanel: () => void;
  togglePropertiesPanel: () => void;
  openLibrary: (tab?: "stickers" | "images") => void;
  closeLibrary: () => void;
  setMobilePanelTab: (tab: MobilePanelTab) => void;

  // Persistence
  exportJSON: () => string;
  importJSON: (json: string) => boolean;
  saveToLocal: () => void;
  loadFromLocal: () => boolean;
  generateShareURL: () => string;
}

// ── Helpers ─────────────────────────────────────────────────────────

const STORAGE_KEY = "board_design_v2";

const uid = () =>
  `el-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;

const nextOrder = (elements: DesignElement[], side: Side) => {
  const sideElements = elements.filter((e) => e.side === side);
  if (sideElements.length === 0) return 1;
  return Math.max(...sideElements.map((e) => e.order)) + 1;
};

const encodeBase64 = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (const b of bytes) {
    bin += String.fromCharCode(b);
  }
  return btoa(bin);
};

const decodeBase64 = (s: string) => {
  const bin = atob(s);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

type Serializable = Pick<DesignState, "board" | "activeSide" | "elements">;

const serialize = (state: DesignState, includeCustom: boolean): Serializable => ({
  board: state.board,
  activeSide: state.activeSide,
  elements: includeCustom
    ? state.elements
    : state.elements.filter((e) => !e.isCustomUpload),
});

const sanitize = (raw: unknown): Serializable | null => {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;

  const board: BoardSettings = {
    color:
      typeof data.board === "object" && data.board !== null
        ? String((data.board as Record<string, unknown>).color ?? "#1e293b")
        : "#1e293b",
    roughness:
      typeof data.board === "object" && data.board !== null
        ? Number((data.board as Record<string, unknown>).roughness ?? 0.4)
        : 0.4,
    metalness:
      typeof data.board === "object" && data.board !== null
        ? Number((data.board as Record<string, unknown>).metalness ?? 0.1)
        : 0.1,
  };

  const activeSide: Side =
    (data.activeSide as string) === "back" ? "back" : "front";

  const rawElements = Array.isArray(data.elements) ? data.elements : [];
  const elements: DesignElement[] = rawElements
    .filter((e: unknown) => e && typeof e === "object")
    .map((e: unknown, i: number) => {
      const el = e as Record<string, unknown>;
      const t = (el.transform as Record<string, unknown>) ?? {};
      return {
        id: String(el.id ?? uid()),
        kind: (["sticker", "text", "image"].includes(el.kind as string)
          ? el.kind
          : "sticker") as ElementKind,
        side: el.side === "back" ? "back" : "front",
        name: String(el.name ?? "Element"),
        transform: {
          x: Number(t.x ?? 0),
          y: Number(t.y ?? 0),
          rotation: Number(t.rotation ?? 0),
          scale: Number(t.scale ?? 1),
        } as Transform,
        visible: el.visible !== false,
        locked: el.locked === true,
        order: Number(el.order ?? i + 1),
        url: typeof el.url === "string" ? el.url : undefined,
        isCustomUpload: el.isCustomUpload === true,
        opacity: typeof el.opacity === "number" ? el.opacity : 1,
        text: typeof el.text === "string" ? el.text : undefined,
        fontFamily:
          typeof el.fontFamily === "string" ? el.fontFamily : undefined,
        fontSize: typeof el.fontSize === "number" ? el.fontSize : undefined,
        color: typeof el.color === "string" ? el.color : undefined,
      } satisfies DesignElement;
    });

  return { board, activeSide, elements };
};

// ── Default state ────────────────────────────────────────────────────

const defaultBoard: BoardSettings = {
  color: "#1e293b",
  roughness: 0.4,
  metalness: 0.1,
};

// ── Store ────────────────────────────────────────────────────────────

export const useDesignStore = create<DesignState>((set, get) => ({
  board: { ...defaultBoard },
  activeSide: "front",
  elements: [],
  selectedId: null,
  activeTool: "select",
  layersPanelOpen: true,
  propertiesPanelOpen: true,
  libraryOpen: false,
  libraryTab: "stickers",
  mobilePanelTab: null,

  // ── Board ──
  setBoard: (partial) =>
    set((s) => ({ board: { ...s.board, ...partial } })),

  setActiveSide: (side) =>
    set({ activeSide: side, selectedId: null }),

  flipSide: () =>
    set((s) => ({
      activeSide: s.activeSide === "front" ? "back" : "front",
      selectedId: null,
    })),

  // ── Elements ──
  addElement: (element) =>
    set((s) => {
      const id = uid();
      const order = nextOrder(s.elements, element.side);
      return {
        elements: [...s.elements, { ...element, id, order }],
        selectedId: id,
      };
    }),

  updateElement: (id, partial) =>
    set((s) => ({
      elements: s.elements.map((e) =>
        e.id === id ? { ...e, ...partial, id: e.id } : e,
      ),
    })),

  removeElement: (id) =>
    set((s) => ({
      elements: s.elements.filter((e) => e.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),

  duplicateElement: (id) =>
    set((s) => {
      const source = s.elements.find((e) => e.id === id);
      if (!source) return s;
      const newId = uid();
      const order = nextOrder(s.elements, source.side);
      return {
        elements: [
          ...s.elements,
          {
            ...source,
            id: newId,
            order,
            name: `${source.name} copy`,
            transform: {
              ...source.transform,
              x: source.transform.x + 0.05,
              y: source.transform.y - 0.05,
            },
          },
        ],
        selectedId: newId,
      };
    }),

  // ── Selection ──
  select: (id) =>
    set((s) => {
      if (id === null) return { selectedId: null };
      const el = s.elements.find((e) => e.id === id);
      if (!el) return { selectedId: id };
      // Auto-switch to the element's side so gizmos and panels stay in sync
      return { selectedId: id, activeSide: el.side };
    }),
  clearSelection: () => set({ selectedId: null }),
  selectedElement: () => {
    const s = get();
    return s.elements.find((e) => e.id === s.selectedId);
  },

  // ── Layers ──
  moveLayer: (id, direction) =>
    set((s) => {
      const sorted = [...s.elements].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((e) => e.id === id);
      if (idx < 0) return s;
      const swapIdx = direction === "up" ? idx + 1 : idx - 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return s;
      const current = sorted[idx];
      const target = sorted[swapIdx];
      return {
        elements: s.elements.map((e) => {
          if (e.id === current.id) return { ...e, order: target.order };
          if (e.id === target.id) return { ...e, order: current.order };
          return e;
        }),
      };
    }),

  moveToTop: (id) =>
    set((s) => {
      const maxOrder = Math.max(0, ...s.elements.map((e) => e.order));
      return {
        elements: s.elements.map((e) =>
          e.id === id ? { ...e, order: maxOrder + 1 } : e,
        ),
      };
    }),

  moveToBottom: (id) =>
    set((s) => {
      const minOrder = Math.min(
        Infinity,
        ...s.elements.map((e) => e.order),
      );
      return {
        elements: s.elements.map((e) =>
          e.id === id ? { ...e, order: minOrder - 1 } : e,
        ),
      };
    }),

  // ── Tools & panels ──
  setTool: (tool) => set({ activeTool: tool }),
  toggleLayersPanel: () => set((s) => ({ layersPanelOpen: !s.layersPanelOpen })),
  togglePropertiesPanel: () =>
    set((s) => ({ propertiesPanelOpen: !s.propertiesPanelOpen })),
  openLibrary: (tab) =>
    set({ libraryOpen: true, libraryTab: tab ?? "stickers" }),
  closeLibrary: () => set({ libraryOpen: false }),
  setMobilePanelTab: (tab) => set({ mobilePanelTab: tab }),

  // ── Persistence ──
  exportJSON: () => JSON.stringify(serialize(get(), true), null, 2),

  importJSON: (json) => {
    try {
      const parsed = sanitize(JSON.parse(json));
      if (!parsed) return false;
      set({
        board: parsed.board,
        activeSide: parsed.activeSide,
        elements: parsed.elements,
        selectedId: null,
      });
      return true;
    } catch {
      return false;
    }
  },

  saveToLocal: () => {
    if (typeof window === "undefined") return;
    const data = JSON.stringify(serialize(get(), true));
    window.localStorage.setItem(STORAGE_KEY, data);
  },

  loadFromLocal: () => {
    if (typeof window === "undefined") return false;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    return get().importJSON(raw);
  },

  generateShareURL: () => {
    if (typeof window === "undefined") return "";
    const data = JSON.stringify(serialize(get(), false));
    const encoded = encodeBase64(data);
    const url = new URL(window.location.href);
    url.searchParams.set("design", encoded);
    return url.toString();
  },
}));

export const decodeSharedDesign = (encoded: string) => decodeBase64(encoded);
