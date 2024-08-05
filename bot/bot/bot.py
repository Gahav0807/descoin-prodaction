from . import logger
from .handlers.ref_handler import ref_router
from .handlers.broadcast_handler import broadcast_router
from . import bot,dp

dp.include_router(ref_router)
dp.include_router(broadcast_router)

async def start_bot():
    """
    Запускает бота.
    """
    try:
        logger.info("Старт бота...")
        await dp.start_polling(bot)
    except KeyboardInterrupt:
        logger.warning("Бот остановлен")
    except Exception as e:
        logger.error("Ошибка при старте бота: %s", e)





