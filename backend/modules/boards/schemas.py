import uuid
from datetime import datetime
from typing import Literal

from pydantic import Field

from core.schemas import BaseSchema


class BoardElement(BaseSchema):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    type: Literal["text", "image", "sticker"] = Field(
        ..., description="Type of the board element"
    )
    name: str = Field(..., description="Name of the board element")
    url: str = Field("", description="URL of the board element")
    scale_x: float = Field(1.0, description="Scale factor in the x direction")
    scale_y: float = Field(1.0, description="Scale factor in the y direction")
    position_x: float = Field(0.0, description="Position in the x direction")
    position_y: float = Field(0.0, description="Position in the y direction")
    rotation: float = Field(0.0, description="Rotation in radians around Z axis")
    opacity: float = Field(1.0, description="Opacity of the board element")
    side: Literal["front", "back"] = Field(
        "front", description="Side of the board element"
    )
    order: int = Field(..., ge=1, description="Order of the board element")
    visible: bool = Field(True, description="Visibility of the board element")
    locked: bool = Field(False, description="Lock status of the board element")
    is_custom_upload: bool = Field(
        False, description="Whether the element is a custom user upload"
    )
    text: str | None = Field(None, description="Text content (for text elements)")
    font_family: str | None = Field(None, description="Font family (for text elements)")
    font_size: float | None = Field(None, description="Font size (for text elements)")
    color: str | None = Field(None, description="Text color (for text elements)")


class BoardSurface(BaseSchema):
    roughness: float = Field(
        0.5, ge=0, le=1, description="Roughness of the board surface"
    )
    color: str = Field("#FFFFFF", description="Color of the board surface")
    metalness: float = Field(
        0.5, ge=0, le=1, description="Metalness of the board surface"
    )


class Board(BaseSchema):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, description="Unique identifier of the board"
    )
    name: str = Field(..., description="Name of the board")
    created_at: datetime = Field(
        default_factory=datetime.today, description="Creation date of the board"
    )
    updated_at: datetime = Field(
        default_factory=datetime.today, description="Last update date of the board"
    )
    elements: list[BoardElement] = Field(
        default_factory=list, description="List of board elements"
    )
    surface: BoardSurface = Field(
        default_factory=BoardSurface, description="Surface properties of the board"
    )
    preview_url: str = Field("", description="URL of the board preview image")


class CreateBoard(BaseSchema):
    name: str = Field(..., min_length=1, description="Name of the board")


class UpdateBoard(BaseSchema):
    name: str | None = Field(None, min_length=1, description="Name of the board")
    elements: list[BoardElement] | None = Field(
        None, description="List of board elements"
    )
    surface: BoardSurface | None = Field(
        None, description="Surface properties of the board"
    )
    preview_url: str | None = Field(None, description="URL of the board preview image")
