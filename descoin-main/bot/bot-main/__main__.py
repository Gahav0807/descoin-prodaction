"""

starting telegram-bot

"""
import asyncio
from .bot import start_bot
from . import logger
from . import bot,dp

if __name__ == "__main__":
   asyncio.run(start_bot())
   

   