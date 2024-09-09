import asyncio
from config import dp, bot, logger
from data.main_database import MainDatabase

from handlers.admin_handlers import admin_router
from handlers.start_handler import start_router

dp.include_router(start_router)
dp.include_router(admin_router)

async def start_bot() -> None:
    try:
        logger.debug("Starting the bot...")
        await dp.start_polling(bot)
    except (KeyboardInterrupt, asyncio.CancelledError):
        logger.warning("Bot stopped")
    except Exception as e:
        logger.error("Error starting the bot: %s", e)
    finally:
        await MainDatabase().close_connection()

if __name__ == '__main__':
    asyncio.run(start_bot())



