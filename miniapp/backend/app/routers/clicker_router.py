from fastapi import APIRouter
from ..handlers.clicker_handlers import ClickerHandler

router = APIRouter()
clicker_handler = ClickerHandler()

@router.get("/getInfo/{user_id}")
async def get_info(user_id: int):
    result = await clicker_handler.get_info_by_user_id(user_id)
    result_json = {
            "user_id": result["user_id"],
            "wallet": result["wallet"],
            "limit_clicks": result["limit_clicks"]
        }
    return result_json

@router.get("/updateInfo/{user_id}/{balance}/{limit_clicks}")
async def update_info(user_id: int,balance: int,limit_clicks: int,):
    await clicker_handler.update_info_by_user_id(user_id,balance, limit_clicks)
