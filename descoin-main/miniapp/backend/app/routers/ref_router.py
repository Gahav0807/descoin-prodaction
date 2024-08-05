from fastapi import APIRouter
from ..handlers.ref_handlers import RefHandler

router = APIRouter()
ref_handler = RefHandler()

@router.get("/getReferals/{user_id}")
async def get_referals(user_id: int):
    result = await ref_handler.get_referals_by_id(user_id)
    return result
