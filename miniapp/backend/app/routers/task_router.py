from fastapi import APIRouter
from ..handlers.task_handlers import TaskHandler

router = APIRouter()
task_handler = TaskHandler()

@router.get("/tryDoTask/{user_id}/{task_in_db}/{task_price}")
async def do_task(
    user_id: int ,
    task_in_db: str,
    task_price: int, 
):
    result = await task_handler.try_do_task(user_id, task_in_db, task_price)
    return result
