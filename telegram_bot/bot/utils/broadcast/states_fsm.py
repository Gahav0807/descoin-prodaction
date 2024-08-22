from aiogram.fsm.state import State, StatesGroup

class BroadcastStates(StatesGroup):
    get_text: str = State()
    get_photo = State()
    get_keyboard_text: str = State()
    get_keyboard_url: str = State()
    is_send: bool = State()
    is_cancel: bool= State()