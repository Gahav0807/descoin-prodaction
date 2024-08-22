from pathlib import Path
from aiogram.fsm.context import FSMContext
from aiogram import types, Router, F
from aiogram.filters import Command
from keyboards.inline import confirm_post_keyboard
from utils.broadcast.states_fsm import BroadcastStates
from data.users_list_data import UsersDatabase 
from config import bot, ADMINS_ID

# Передаем классу, отвечающему за действия с БД пользователей, путь к ней
current_dir = Path(__file__).parent
db_file_path = current_dir.parent / "utils" / "broadcast" / "database_tg_bot.db"
users_db = UsersDatabase(db_file_path)

broadcast_router = Router()

@broadcast_router.message(Command("sendall"))
async def start_broadcast(message: types.Message, state: FSMContext):
    """
    Начало процесса рассылки, доступно только администратору.
    Переход в состояние ожидания ввода текста поста.
    """
    if message.chat.type == 'private' and message.from_user.id in ADMINS_ID:
        await state.clear()
        await message.reply("Введите текст поста")
        await state.set_state(BroadcastStates.get_text)

@broadcast_router.message(BroadcastStates.get_text)
async def get_post_text(message: types.Message, state: FSMContext):
    """
    Получение текста поста, сохранение его в состоянии.
    Переход в состояние ожидания отправки фото поста.
    """
    if message.text:
        await state.update_data(get_text=message.text)
        await message.reply("Отправьте фото поста")
        await state.set_state(BroadcastStates.get_photo)
    else:
        await message.reply("Пожалуйста, введите текст поста")

@broadcast_router.message(BroadcastStates.get_photo)
async def get_post_photo(message: types.ChatPhoto, state: FSMContext):
    """
    Получение фото поста, сохранение его в состоянии.
    Переход в состояние ожидания ввода текста кнопки поста.
    """
    if message.photo:
        await state.update_data(get_photo=message.photo[-1].file_id)
        await message.reply("Отправьте текст кнопки поста")
        await state.set_state(BroadcastStates.get_keyboard_text)
    else:
        await message.reply("Пожалуйста, отправьте фото")

@broadcast_router.message(BroadcastStates.get_keyboard_text)
async def get_post_keyboard_text(message: types.Message, state: FSMContext):
    """
    Получение текста кнопки поста, сохранение его в состоянии.
    Переход в состояние ожидания ввода URL кнопки поста.
    """
    if message.text:
        await state.update_data(get_keyboard_text=message.text)
        await message.reply("Отправьте URL кнопки поста")
        await state.set_state(BroadcastStates.get_keyboard_url)
    else:
        await message.reply("Пожалуйста, отправьте текст")

@broadcast_router.message(BroadcastStates.get_keyboard_url)
async def get_post_keyboard_url(message: types.Message, state: FSMContext):
    """
    Получение URL кнопки поста, сохранение его в состоянии.
    Сбор всех данных для формирования поста.
    Отправка сформированного поста администратору для подтверждения.
    """
    global post_text
    global post_image
    global post_keyboard
    if message.text:
        if message.text.startswith("http"):
            await state.update_data(get_keyboard_url=message.text)
            data = await state.get_data()
            post_text = data.get('get_text')
            post_image = data.get('get_photo')
            post_keyboard_text = data.get('get_keyboard_text')
            post_keyboard_url = data.get('get_keyboard_url')
            post_button = [[types.InlineKeyboardButton(text=post_keyboard_text, url=post_keyboard_url)]]
            post_keyboard = types.InlineKeyboardMarkup(inline_keyboard=post_button)
            await message.answer(text="Вот твой пост:")
            await message.answer_photo(caption=post_text, photo=post_image, reply_markup=post_keyboard)
            await message.answer(text="Выложить?", reply_markup=confirm_post_keyboard)
            # await state.clear()
        else:
            await message.reply("Пожалуйста, отправьте URL для кнопки поста.")
    else:
        await message.reply("Пожалуйста, отправьте сыллку")

@broadcast_router.callback_query(F.data.startswith('confirm_send_post'))
async def send_post(call: types.CallbackQuery, state: FSMContext):
    """
    Обработчик подтверждения рассылки поста.
    Производит рассылку поста всем пользователям из базы данных.
    """
    if call.from_user.id in ADMINS_ID:
        # Проверяем, не была ли рассылка отменена
        current_state = await state.get_state()
        if current_state == BroadcastStates.get_keyboard_url.state:
            users = users_db.get_users()
            await bot.send_message(chat_id=call.from_user.id, text='Рассылка началась.')
            for row in users:
                try:
                    await bot.send_photo(chat_id=row[0], caption=post_text, photo=post_image, reply_markup=post_keyboard)
                except Exception as e:
                    print(f"Ошибка отправки сообщения пользователю {row[0]}: {e}")
            await bot.send_message(call.from_user.id,"Рассылка завершена.")
            await state.clear()
        else:
            await call.message.answer("Похоже, что рассылка была отменена, или она уже была отправлена. Хотите написать рассылку - /sendall")
    else:
        pass

@broadcast_router.callback_query(F.data.startswith('cancel_send_post'))
async def send_post(call: types.CallbackQuery, state: FSMContext):
    """
    Обработчик отмены рассылки поста.
    Отменяет рассылку поста.
    """
    if call.from_user.id in ADMINS_ID:
        await state.clear()
        await call.message.answer("Рассылка отменена.")
    else:
        pass