"""
make module logger
"""

import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path


class ColorLevelsFormatter(logging.Formatter):
    """
    Custom formatter to colorize log levels using ANSI escape codes.
    """

    # ANSI escape codes for colors and formatting
    _COLOR_CODES = {
        "DEBUG": "\033[94m",     # Blue
        "INFO": "\033[92m",      # Green
        "WARNING": "\033[93m",   # Yellow
        "ERROR": "\033[91m",     # Red
        "CRITICAL": "\033[95m",  # Magenta
        "RESET": "\033[0m",      # Reset
        "BOLD": "\033[1m"        # Bold
    }

    def format(self, record):
        levelname = record.levelname
        if levelname in self._COLOR_CODES:
            color_code = self._COLOR_CODES[levelname]
            reset_code = self._COLOR_CODES["RESET"]
            bold_code = self._COLOR_CODES["BOLD"]
            record.levelname = (f"{bold_code}{color_code}"
                                f"{levelname}{reset_code}")

        return super().format(record)


def setup_logger(name: str,
                 log_file: Path,
                 logging_level: "logging.level" = logging.INFO):
    """
    set up logger
    """
    logger = logging.getLogger(name)
    logger.setLevel(logging_level)
    format_style = ("%(asctime)s - %(name)s - %(levelname)s -"
                    " %(filename)s:%(lineno)d %(message)s")

    stream_formatter = ColorLevelsFormatter(fmt=format_style,
                                            datefmt="%m/%d %H:%M:%S")

    file_formatter = logging.Formatter(fmt=format_style)

    stream_handler = logging.StreamHandler()
    file_handler = RotatingFileHandler(log_file)
    stream_handler.setLevel(logging_level)
    file_handler.setLevel(logging.INFO)

    stream_handler.setFormatter(stream_formatter)
    file_handler.setFormatter(file_formatter)

    logger.addHandler(stream_handler)
    logger.addHandler(file_handler)

    return logger

print("Starting logger...")