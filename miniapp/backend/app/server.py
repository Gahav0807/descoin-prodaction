import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers.clicker_router import router as clicker_router
from .routers.ref_router import router as ref_router
from .routers.task_router import router as task_router

class Server:
    """
    Монолитный сервер, обрабатывающий запросы от клиентской части
    """
    
    def __init__(self):
        self.app = FastAPI()

        # Нстройка корс
        # Массив доменов, которые разрешены для CORS
        self.origins = [
            "http://localhost:3000",
        ]

        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=self.origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        # Стандартный эндпоинт
        @self.app.get("/")
        async def start():
            return {"message": "Cat Coin Server is running!"}
        
        # Подключение роутеров
        self.app.include_router(clicker_router)
        self.app.include_router(ref_router)
        self.app.include_router(task_router)

    def run(self):
        uvicorn.run(self.app, host="127.0.0.1", port=9000)