"""

starting bot

"""
import asyncio
from .bot import start_bot

if __name__ == "__main__":
   asyncio.create_task(asyncio.run(start_bot()))
   