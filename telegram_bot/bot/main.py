import asyncio
from config import dp, bot, logger
from data.main_database import BotDatabase
from handlers.broadcast_handler import broadcast_router
from handlers.ref_handler import ref_router

dp.include_router(ref_router)
dp.include_router(broadcast_router)

async def start_bot() -> None:
    try:
        logger.info("Starting the bot...")
        await dp.start_polling(bot)
    except (KeyboardInterrupt, asyncio.CancelledError):
        logger.warning("Bot stopped")
    except Exception as e:
        logger.error("Error starting the bot: %s", e)
    finally:
        await BotDatabase().close_connection()

if __name__ == '__main__':
    asyncio.run(start_bot())



