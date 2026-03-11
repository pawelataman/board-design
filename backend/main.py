from fastapi import FastAPI
from modules.board.router import router as board_router

app = FastAPI()
app.include_router(board_router)
