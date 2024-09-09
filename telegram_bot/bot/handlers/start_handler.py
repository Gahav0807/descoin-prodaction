from pathlib import Path
from aiogram import types, Router
from aiogram.filters import Command
from keyboards.inline import start_keyboard
from data.main_database import MainDatabase 
from data.users_list_data import UsersDatabase 
from config import bot

# Передаем классу, отвечающему за действия с БД пользователей, путь к ней
current_dir = Path(__file__).parent
db_file_path = current_dir.parent / "utils" / "broadcast" / "database_tg_bot.db"
users_db = UsersDatabase(db_file_path)

data = MainDatabase()
start_router = Router()

@start_router.message(Command('start'))
async def start(message: types.Message):
    """
    Обработчик команды /start.
    Если пользователь зашел в личные сообщения бота:
        - Проверяем, существует ли пользователь в базе данных. Если нет, добавляем его.
        - Извлекаем ID референта из ссылки.
        - Если ID референта является числом и отличается от ID пользователя:
            - Проверяем, является ли пользователь чьим-то рефералом. Если да, отправляем сообщение.
            - Если пользователь не является чьим-то рефералом:
                - Добавляем пользователя как реферала, начисляем награду.
                - Отправляем пользователю сообщение об успешной регистрации.
                - Оповещаем референта о новом реферале.
        - Если пользователь зашел по своей ссылке, отправляем сообщение.
        - Если пользователь зашел не по реферальной ссылке, отправляем стандартное сообщение.
    """
    if message.chat.type == 'private':
        if not users_db.user_exists(message.from_user.id):
            users_db.add_user(message.from_user.id)

        start_command = message.text
        referent_id = start_command[7:] # Извлекаем ID референта из ссылки

        if referent_id.isdigit(): # Проверяем, что ID референта является числом
            if referent_id != str(message.from_user.id): # Пользователь зашел не по своей ссылке
                if await data.is_user_referal(message.from_user.id): # Пользователь уже является чьим-то рефералом
                    await message.answer("You are already a referral! Don't try to log in through someone's referral link.")
                else: # Пользователь не является чьим-то рефералом
                    # Добавим реферала, начислим награду
                    await data.add_ref_node(int(referent_id), message.from_user.id, message.from_user.username)
                    await message.answer("You have successfully registered as a referral!")
                    # Стандартный текст
                    await message.answer("Airdrop Descoin🎁For each friend you will receive 50,000 descoin tokens!", reply_markup=await start_keyboard())
                    # Оповещаем референта о новом реферале
                    try:
                        await bot.send_message(chat_id=referent_id, text=f"A new user has registered using your referral link!\n@{message.from_user.username}")
                    except:
                        pass # Если референт заблокировал бота, отлавливаем ошибку
            else: # Пользователь зашел по своей ссылке
                await message.answer("You can't use your referral link!")
        else: # Пользователь зашел не по реф ссылке
            await message.answer("Airdrop Descoin🎁For each friend you will receive 50,000 descoin tokens!", reply_markup=await start_keyboard())
