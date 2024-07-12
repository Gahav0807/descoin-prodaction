# __init__.py
"""
Main module initialization
"""

import os
import sys
import logging

from pathlib import Path
from .utils.logger import setup_logger

# TOKEN = os.getenv("tg_tester_2_bot")
BASE_PATH = Path(os.path.abspath(os.path.dirname(__file__)))
LOG_FILE = BASE_PATH / "utils" / "logs" / "app.log"

_is_debug = sys.argv[-1] == "debug"

LOGGING_LEVEL = logging.DEBUG if _is_debug else logging.INFO

logger = setup_logger(name="cat_coin",
                      log_file=LOG_FILE,
                      logging_level=LOGGING_LEVEL)

if _is_debug:
    logger.debug("IN DEBUG LEVEL")