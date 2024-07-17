from loguru import logger

# logger.add("utils/logs/miniapp-backend/app.log", rotation="100 MB", compression="zip")
logger.add("../utils/logs/miniapp-backend/app.log", rotation="100 MB", compression="zip")