from aiogram.types import WebAppInfo
from aiogram import types

async def start_keyboard():
    buttons = [
        [
            types.InlineKeyboardButton(text="Play⚔️",web_app=WebAppInfo(url="https://descoin-web.online/")),
        ],
        [
            types.InlineKeyboardButton(text="Subscribe to our channel🔥", url="https://t.me/descoin_official")
        ]
    ]
    keyboard = types.InlineKeyboardMarkup(inline_keyboard=buttons)
    return keyboard

confirm_post_buttons = [
        [
            types.InlineKeyboardButton(text="Да🔥", callback_data="confirm_send_post"),
        ],
        [
            types.InlineKeyboardButton(text="Нет💔", callback_data="cancel_send_post"),
        ]
    ]
         
confirm_post_keyboard = types.InlineKeyboardMarkup(inline_keyboard=confirm_post_buttons)