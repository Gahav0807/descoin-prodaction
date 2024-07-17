import asyncio
from  .app.core.database import Database
from .app.server import Server
from . import logger

data = Database()
server = Server()

def start_app():
    """
    Запускает сервер.
    """
    try:
        logger.info("Старт сервера...")
        server.run()
    except KeyboardInterrupt:
        logger.warning("Сервера остановлены")
    except Exception as e:
        logger.error("Ошибка при старте серверов: %s", e)
    finally:
        data.close_connection()


