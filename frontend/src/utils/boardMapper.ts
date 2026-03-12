/**
 * Bidirectional mapping between the Zustand DesignElement / BoardSettings
 * and the API BoardElement / BoardSurface types.
 *
 * Key differences:
 *  - Store uses `kind` ("sticker"|"text"|"image"), API uses `type`
 *  - Store uses nested `transform { x, y, rotation, scale }`, API uses flat
 *    `positionX`, `positionY`, `scaleX`, `scaleY`, `rotation`
 *  - Store `scale` is uniform → mapped to both `scaleX` and `scaleY`
 */

import type {
  Board,
  BoardElement,
  BoardSurface,
  UpdateBoardPayload,
} from "../types/board";
import type {
  BoardSettings,
  DesignElement,
  Side,
} from "../store/useDesignStore";

// ── Store → API ──────────────────────────────────────────────────

export function designElementToApi(el: DesignElement): BoardElement {
  return {
    id: el.id,
    type: el.kind,
    name: el.name,
    url: el.url ?? "",
    scaleX: el.transform.scale,
    scaleY: el.transform.scale,
    positionX: el.transform.x,
    positionY: el.transform.y,
    rotation: el.transform.rotation,
    opacity: el.opacity ?? 1,
    side: el.side,
    order: el.order,
    visible: el.visible,
    locked: el.locked,
    isCustomUpload: el.isCustomUpload ?? false,
    text: el.text ?? null,
    fontFamily: el.fontFamily ?? null,
    fontSize: el.fontSize ?? null,
    color: el.color ?? null,
  };
}

export function boardSettingsToApi(settings: BoardSettings): BoardSurface {
  return {
    roughness: settings.roughness,
    color: settings.color,
    metalness: settings.metalness,
  };
}

/**
 * Build an UpdateBoardPayload from the current store state.
 */
export function storeToUpdatePayload(
  elements: DesignElement[],
  board: BoardSettings,
): UpdateBoardPayload {
  return {
    elements: elements.map(designElementToApi),
    surface: boardSettingsToApi(board),
  };
}

// ── API → Store ──────────────────────────────────────────────────

export function apiElementToDesign(el: BoardElement): DesignElement {
  return {
    id: el.id,
    kind: el.type,
    side: el.side,
    name: el.name,
    transform: {
      x: el.positionX,
      y: el.positionY,
      rotation: el.rotation,
      // Use scaleX as the uniform scale (they should be the same)
      scale: el.scaleX,
    },
    visible: el.visible,
    locked: el.locked,
    order: el.order,
    url: el.url || undefined,
    isCustomUpload: el.isCustomUpload,
    opacity: el.opacity,
    text: el.text ?? undefined,
    fontFamily: el.fontFamily ?? undefined,
    fontSize: el.fontSize ?? undefined,
    color: el.color ?? undefined,
  };
}

export function apiSurfaceToBoardSettings(surface: BoardSurface): BoardSettings {
  return {
    roughness: surface.roughness,
    color: surface.color,
    metalness: surface.metalness,
  };
}

/**
 * Hydrate the design store state from an API Board response.
 * Returns the shape expected by importJSON-like consumers.
 */
export function apiBoardToStoreState(board: Board): {
  board: BoardSettings;
  activeSide: Side;
  elements: DesignElement[];
} {
  return {
    board: apiSurfaceToBoardSettings(board.surface),
    activeSide: "front",
    elements: board.elements.map(apiElementToDesign),
  };
}
