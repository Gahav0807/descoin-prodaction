"""

starting backend

"""
import asyncio
from .start_app import start_app

if __name__ == "__main__":
   asyncio.create_task(start_app())