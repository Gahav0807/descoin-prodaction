from loguru import logger
from aiogram import Bot, Dispatcher

logger.add(".././utils/logs/bot/bot.log", rotation="100 MB", compression="zip")

ADMINS_ID=[445107195]
TOKEN = "7326805025:AAGtMCxcdIdyUUODgqj7NafG0lI45WefsWo"

bot = Bot(token=TOKEN)
dp = Dispatcher(
    bot=bot
)