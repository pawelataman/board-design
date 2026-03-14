import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, status

from core.auth import basic_auth

from .boards_service import BoardsService, get_boards_service
from .schemas import Board, CreateBoard, UpdateBoard

router = APIRouter(prefix="/boards", tags=["board"])

BoardsServiceDep = Annotated[BoardsService, Depends(get_boards_service)]
BasicAuthDep = Annotated[None, Depends(basic_auth)]


@router.get("/")
async def get_boards(
    service: BoardsServiceDep, basic_auth: BasicAuthDep
) -> list[Board]:
    boards = service.get_boards()
    return boards


@router.get("/{board_id}")
async def get_board_by_id(
    board_id: Annotated[uuid.UUID, Path(description="The uuid ID of the board")],
    service: BoardsServiceDep,
) -> Board:
    board = service.get_board_by_id(board_id)
    if board is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Board with id {board_id} not found",
        )
    return board


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_board(
    board_data: CreateBoard,
    service: BoardsServiceDep,
) -> Board:
    new_board = service.create_board(board_data)
    return new_board


@router.put("/{board_id}")
async def update_board(
    board_id: Annotated[uuid.UUID, Path(description="The uuid ID of the board")],
    update_data: UpdateBoard,
    service: BoardsServiceDep,
) -> Board:
    updated_board = service.update_board(board_id, update_data)
    if updated_board is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Board with id {board_id} not found",
        )
    return updated_board


@router.delete("/{board_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_board(
    board_id: Annotated[uuid.UUID, Path(description="The uuid ID of the board")],
    service: BoardsServiceDep,
):
    deleted = service.delete_board(board_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Board with id {board_id} not found",
        )
