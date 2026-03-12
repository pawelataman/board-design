import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBoards, useCreateBoard, useDeleteBoard } from "../api/boards";
import type { Board } from "../types/board";
import BoardsHeader from "../components/boards/BoardsHeader";
import BoardCard from "../components/boards/BoardCard";
import BoardSkeleton from "../components/boards/BoardSkeleton";
import EmptyState from "../components/boards/EmptyState";
import ErrorState from "../components/boards/ErrorState";
import CreateBoardModal from "../components/boards/CreateBoardModal";
import DeleteConfirmModal from "../components/boards/DeleteConfirmModal";

export default function BoardsPage() {
  const navigate = useNavigate();
  const { data: boards, isLoading, isError, error, refetch } = useBoards();
  const createBoard = useCreateBoard();
  const deleteBoard = useDeleteBoard();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);

  const handleCreate = (name: string) => {
    createBoard.mutate(
      { name },
      {
        onSuccess: (newBoard) => {
          setShowCreateModal(false);
          navigate(`/app?boardId=${newBoard.id}`);
        },
      },
    );
  };

  const handleDelete = () => {
    if (!boardToDelete) return;
    deleteBoard.mutate(boardToDelete.id, {
      onSuccess: () => setBoardToDelete(null),
    });
  };

  return (
    <div className="min-h-screen bg-[#04070d]">
      <BoardsHeader onCreateClick={() => setShowCreateModal(true)} />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <h1
            className="text-2xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "Syne" }}
          >
            My Boards
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {boards && boards.length > 0
              ? `${boards.length} ${boards.length === 1 ? "board" : "boards"}`
              : "Design and manage your snowboard creations"}
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <BoardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState
            message={
              error instanceof Error
                ? error.message
                : "Something went wrong. Is the backend running on localhost:8000?"
            }
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && boards && boards.length === 0 && (
          <EmptyState onCreate={() => setShowCreateModal(true)} />
        )}

        {!isLoading && !isError && boards && boards.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onDelete={setBoardToDelete}
              />
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateBoardModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
          isLoading={createBoard.isLoading}
        />
      )}

      {boardToDelete && (
        <DeleteConfirmModal
          board={boardToDelete}
          onClose={() => setBoardToDelete(null)}
          onConfirm={handleDelete}
          isLoading={deleteBoard.isLoading}
        />
      )}
    </div>
  );
}
