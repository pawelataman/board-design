import uuid
from datetime import datetime

from loguru import logger

from .schemas import Board, BoardElement, BoardSurface, CreateBoard, UpdateBoard


class BoardsService:
    def __init__(self):
        self._boards: dict[uuid.UUID, Board] = {}
        self._seed_data()
        logger.info("BoardsService initialized")

    def _seed_data(self):
        seed_board = Board(
            name="Test Board",
            elements=[
                BoardElement(
                    type="text",
                    name="Text Element",
                    order=1,
                    side="front",
                )
            ],
            surface=BoardSurface(color="#FFFFFF", roughness=0.5, metalness=0.5),
        )
        self._boards[seed_board.id] = seed_board
        logger.info(f"Seeded board: {seed_board.id}")

    def get_boards(self) -> list[Board]:
        logger.info("Fetching all boards")
        return list(self._boards.values())

    def get_board_by_id(self, board_id: uuid.UUID) -> Board | None:
        logger.info(f"Fetching board with ID: {board_id}")
        return self._boards.get(board_id)

    def create_board(self, board_data: CreateBoard) -> Board:
        new_board = Board(name=board_data.name)
        self._boards[new_board.id] = new_board
        logger.info(f"Created board: {new_board.id}")
        return new_board

    def update_board(
        self, board_id: uuid.UUID, update_data: UpdateBoard
    ) -> Board | None:
        board = self._boards.get(board_id)
        if board is None:
            return None

        update_fields = update_data.model_dump(exclude_unset=True)
        board_dict = board.model_dump()
        board_dict.update(update_fields)
        board_dict["updated_at"] = datetime.today()

        updated_board = Board.model_validate(board_dict)
        self._boards[board_id] = updated_board
        logger.info(f"Updated board: {board_id}")
        return updated_board

    def delete_board(self, board_id: uuid.UUID) -> bool:
        if board_id not in self._boards:
            return False
        del self._boards[board_id]
        logger.info(f"Deleted board: {board_id}")
        return True


__boards_service = None


def get_boards_service() -> BoardsService:
    global __boards_service
    if __boards_service is None:
        __boards_service = BoardsService()
    return __boards_service
