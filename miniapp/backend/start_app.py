from .app.server import Server
from . import logger
from  .app.core.database import Database

server = Server()
data = Database()

def start_app():
    try:
        logger.info("Старт сервера...")
        server.run()
    except KeyboardInterrupt:
        logger.warning("Сервер остановлен")
    except Exception as e:
        logger.error("Ошибка при старте сервера: %s", e)
    finally:
        data.close_connection()