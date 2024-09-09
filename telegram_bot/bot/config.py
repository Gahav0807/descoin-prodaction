import os
from loguru import logger
from aiogram import Bot, Dispatcher

# Определение базового каталога для логов
current_file_path = os.path.abspath(__file__)
base_dir = os.path.abspath(os.path.join(current_file_path, "../../../"))
log_file_path = os.path.join(base_dir, "utils", "logs", "bot", "bot.log")

logger.add(log_file_path, rotation="100 MB", compression="zip")

ADMINS_ID=[6990335536,1032148889,1110220128,1573326142]
TOKEN = "7530290987:AAGZG8G3S9Os_ctntiJmWxxW73lLG26wpg4"

bot = Bot(token=TOKEN)
dp = Dispatcher(
    bot=bot
)