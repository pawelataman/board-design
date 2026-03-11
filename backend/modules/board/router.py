from fastapi import APIRouter

router = APIRouter(prefix="/boards", tags=["board"])


@router.get("/")
async def get_board():
    return {"message": "This is the board endpoint"}
