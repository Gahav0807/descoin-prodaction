import asyncio
from . import logger
from aiogram import Bot,Dispatcher
from .handlers.ref_handler import ref_router
from .core.database import BotDatabase
from . import bot,dp

data=BotDatabase()

dp.include_router(ref_router)

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
    finally:
        data.close_connection()




