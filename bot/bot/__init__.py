from aiogram import Bot,Dispatcher
from loguru import logger

logger.add("../utils/logs/bot/bot.log", rotation="100 MB", compression="zip")

TOKEN = "6822613632:AAE_2v7B_ZCwcQc5LIRzOs3qqYddSqXbuG4"
ADMIN_ID=1573326142

bot = Bot(token=TOKEN)
dp = Dispatcher(bot=bot)

