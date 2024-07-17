from ..core.database import Database
from ..... import logger

data=Database()

class ClickerHandler():
    async def get_info_by_user_id(self, user_id):
            try:
                logger.info("Получаем инфу про пользователя из бд(clicker)")
        
                result = await data.get_data(
                    f"SELECT * FROM main WHERE user_id = {user_id}"
                    )
                
                if result:
                    logger.info("Пользователь уже есть, отправляем данные")
        
                    return result[0]
                else:
                    logger.info("Пользователя нет, заносим в бд, отправляем базовые значения")
        
                    # Пользователь не найден, добавляем его в базу данных с балансом 0 и лимитом кликов 10000
                    await data.set_data(
                        f"INSERT INTO main (user_id, wallet, limit_clicks) VALUES ({user_id}, 0, 10000)"
                    )
                    # Возвращаем информацию о пользователе
                    return {"user_id": user_id, "wallet": 0, "limit_clicks": 10000}
                
            except Exception as e:
                 logger.error(f"Ошибка при получении информации о пользователе: {e}")
    
            
    async def update_info_by_user_id(self,user_id,wallet, limit_clicks):
        try:
            logger.info("Обновляем инфу пользователя в бд.main")
        
            #Обновление баланса юзера
            await data.set_data(
            f"UPDATE main SET wallet = {wallet}, limit_clicks = {limit_clicks} WHERE user_id = {user_id}"
        )
        
            logger.info("Проверяем, есть ли пользователь в бд.clicks_od_day && clicks_of_month")
                        
        except Exception as e:
            logger.error(f"Ошибка при обновлении информации о пользователе: {e}")