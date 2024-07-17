from aiogram.fsm.context import FSMContext
from aiogram import types
from aiogram import F
from aiogram.fsm.context import FSMContext
from aiogram import types
from aiogram import Router
from aiogram.filters import Command
from ..utils.buttons import *
from ..core.database import BotDatabase 
from .. import bot

data = BotDatabase()

ref_router=Router()

@ref_router.message(Command('start'))
async def start(message: types.Message):
    if message.chat.type =='private':
        start_command=message.text
        referent_id=str(start_command[7:]) # ДОСТАЕМ ID РЕФЕРЕНТА ИЗ СЫЛЛКИ

        if str(referent_id) != "":  # ПОЛЬЗОВАТЕЛЬ ЗАШЕЛ ПО РЕФ ССЫЛЛКЕ
            if str(referent_id) != str(message.from_user.id):#ПОЛЬЗОВАТЕЛЬ ЗАШЕЛ НЕ ПО СВОЕЙ СЫЛЛКЕ
                if await data.is_user_referal(message.from_user.id) == True: #ПОЛЬЗОВАТЕЛЬ УЖЕ ЯВЛЯЕТСЯ ЧЬИМ ТО РЕФЕРАЛОМ 
                    await message.answer("Ты уже являешься рефералом!Не пытайся зайти через чью то реферальную сыллку!")
                
                else: #ПОЛЬЗОВАТЕЛЬ НЕ ЯВЛЯЕТСЯ ЧЬИМ ТО РЕФЕРАЛОМ
                    #ДОБАВИМ РЕФЕРАЛА РЕФЕРЕНТУ,НАЧИСЛИМ НАГРАДУ
                    await data.add_ref_node(int(referent_id),message.from_user.id,message.from_user.username)
                    #ОПОВЕСТИМ ЮЗЕРА
                    await message.answer("Ты успешно зарегистрировался как реферал!")
                    # ДОБАВИМ РЕФЕРЕНТУ ДЕНЯК
                    
                    # СТАНДАРТНЫЙ ТЕКСТ
                    await message.answer("Airdrop Descoin🎁For each friend you will receive 50,000 descoin tokens!",reply_markup=await start_keyboard())
                    # ОПОВЕЩАЕМ РЕФЕРЕНТА О НОВОМ РЕФЕРАЛЕ
                    try:
                        await bot.send_message(chat_id=referent_id,text="По вашей реферальной ссылке зарегистрировался новый пользователь!")
                    except:
                        pass  #ЕСЛИ РЕФЕРЕНТ ЗАБЛОКИРОВАЛ БОТА => ОТЛАВЛИВАЕМ ОШИБКУ

            else: #ЗАШЕЛ ПО СВОЕЙ ССЫЛКЕ
                 await message.answer("Нельзя заходить по своей реферальной ссылке!")

        else: # ПОЛЬЗОВАТЕЛЬ ЗАШЕЛ НЕ ПО РЕФ ССЫЛЛКЕ
            await message.answer("Airdrop Descoin🎁For each friend you will receive 50,000 descoin tokens!",reply_markup=await start_keyboard())
