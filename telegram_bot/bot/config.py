import os
from loguru import logger
from aiogram import Bot, Dispatcher

# Определение базового каталога для логов
current_file_path = os.path.abspath(__file__)
base_dir = os.path.abspath(os.path.join(current_file_path, "../../../"))
log_file_path = os.path.join(base_dir, "utils", "logs", "bot", "bot.log")

logger.add(log_file_path, rotation="100 MB", compression="zip")

ADMINS_ID=[445107195]
TOKEN = "7326805025:AAGtMCxcdIdyUUODgqj7NafG0lI45WefsWo"

bot = Bot(token=TOKEN)
dp = Dispatcher(
    bot=bot
)