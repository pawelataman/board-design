import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { Board, CreateBoardPayload, UpdateBoardPayload } from "../types/board";

// ── Query keys ───────────────────────────────────────────────────

export const boardKeys = {
  all: ["boards"] as const,
  detail: (id: string) => ["boards", id] as const,
};

// ── API functions ────────────────────────────────────────────────

export function fetchBoards(): Promise<Board[]> {
  return apiFetch<Board[]>("/boards/");
}

export function fetchBoard(id: string): Promise<Board> {
  return apiFetch<Board>(`/boards/${id}`);
}

export function createBoard(payload: CreateBoardPayload): Promise<Board> {
  return apiFetch<Board>("/boards/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateBoard(
  id: string,
  payload: UpdateBoardPayload,
): Promise<Board> {
  return apiFetch<Board>(`/boards/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteBoard(id: string): Promise<void> {
  return apiFetch<void>(`/boards/${id}`, { method: "DELETE" });
}

// ── Hooks ────────────────────────────────────────────────────────

export function useBoards() {
  return useQuery({
    queryKey: boardKeys.all,
    queryFn: fetchBoards,
  });
}

export function useBoard(id: string) {
  return useQuery({
    queryKey: boardKeys.detail(id),
    queryFn: () => fetchBoard(id),
    enabled: !!id,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
    },
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBoardPayload }) =>
      updateBoard(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
      queryClient.invalidateQueries({
        queryKey: boardKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
    },
  });
}
