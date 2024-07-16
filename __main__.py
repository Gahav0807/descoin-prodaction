"""

starting programm

"""
import asyncio
from .miniapp.backend.start_app import start_app

if __name__ == "__main__":
   asyncio.create_task(start_app())