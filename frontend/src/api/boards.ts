import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import { apiFetch } from "./client";
import type {
  Board,
  CreateBoardPayload,
  UpdateBoardPayload,
} from "../types/board";

// ── Query keys ───────────────────────────────────────────────────

export const boardKeys = {
  all: ["boards"] as const,
  detail: (id: string) => ["boards", id] as const,
};

// ── Raw API functions (accept token) ─────────────────────────────

export function fetchBoards(token: string | null): Promise<Board[]> {
  return apiFetch<Board[]>("/boards/", { token });
}

export function fetchBoard(id: string, token: string | null): Promise<Board> {
  return apiFetch<Board>(`/boards/${id}`, { token });
}

export function createBoard(
  payload: CreateBoardPayload,
  token: string | null,
): Promise<Board> {
  return apiFetch<Board>("/boards/", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
}

export function updateBoard(
  id: string,
  payload: UpdateBoardPayload,
  token: string | null,
): Promise<Board> {
  return apiFetch<Board>(`/boards/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    token,
  });
}

export function deleteBoard(
  id: string,
  token: string | null,
): Promise<void> {
  return apiFetch<void>(`/boards/${id}`, { method: "DELETE", token });
}

// ── Hooks (authenticated via Clerk) ──────────────────────────────

export function useBoards() {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: boardKeys.all,
    queryFn: async () => {
      const token = await getToken();
      return fetchBoards(token);
    },
  });
}

export function useBoard(id: string) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: boardKeys.detail(id),
    queryFn: async () => {
      const token = await getToken();
      return fetchBoard(id, token);
    },
    enabled: !!id,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (payload: CreateBoardPayload) => {
      const token = await getToken();
      return createBoard(payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
    },
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateBoardPayload;
    }) => {
      const token = await getToken();
      return updateBoard(id, payload, token);
    },
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
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      return deleteBoard(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
    },
  });
}
