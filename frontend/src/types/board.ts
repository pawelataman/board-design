export interface BoardElement {
  id: string;
  type: "text" | "image" | "sticker";
  name: string;
  url: string;
  scaleX: number;
  scaleY: number;
  positionX: number;
  positionY: number;
  rotation: number;
  opacity: number;
  side: "front" | "back";
  order: number;
  visible: boolean;
  locked: boolean;
  isCustomUpload: boolean;
  text: string | null;
  fontFamily: string | null;
  fontSize: number | null;
  color: string | null;
}

export interface BoardSurface {
  roughness: number;
  color: string;
  metalness: number;
}

export interface Board {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  elements: BoardElement[];
  surface: BoardSurface;
  previewUrl: string;
}

export interface CreateBoardPayload {
  name: string;
}

export interface UpdateBoardPayload {
  name?: string;
  elements?: BoardElement[];
  surface?: BoardSurface;
  previewUrl?: string;
}
