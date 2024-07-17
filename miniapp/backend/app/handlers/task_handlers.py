from ..core.database import Database
from ... import logger

data=Database()

class TaskHandler():
    async def try_do_task(self,user_id, task_in_db, task_price):
        try:
            logger.info("Попытка сделать таск. Проверка на вхождение пользователя в бд")
    
            # Проверка на существование пользователя в базе
            is_exist = await data.get_data(
                f"SELECT * FROM tasks WHERE user_id = {user_id}"
                )
    
            # Пользователь есть
            if is_exist:
                logger.info("Пользователь есть. Проверка: сделан ли таск")
    
                # Проверяем, сделано ли задание
                is_task_completed = await data.get_fetchval(
                    f"SELECT {task_in_db} FROM tasks WHERE user_id = {user_id}"
                )
    
                # Задание сделано
                if is_task_completed:
                    logger.info("Таск сделан. Ничего не делаем")
    
                    # Сообщение о неудаче
                    return False
                
                # Задание не сделано
                else:
                    logger.info("Таск не сделан.Изменяем значение таска, присваиваем награду")
    
                    # Заменяем у task значение на true, присваиваем награду
                    await data.set_data(
                        f"UPDATE tasks SET {task_in_db} = true WHERE user_id = {user_id}"
                        )
                    await data.set_data(
                        f"UPDATE main SET wallet = wallet + {task_price} WHERE user_id = {user_id}"
                        )
                    # Сообщение об успешном выполнении
                    return True
        
            # Пользователя нет
            else:
                logger.info("Пользователя нет. Добавляем в бд, меняем значение таска и отдаем награду")
    
                # Добавляем пользователя в базу
                await data.set_data(
                    f"INSERT INTO tasks (user_id) VALUES ({user_id})"
                    )
                # Заменяем у task значение на true, присваиваем награду
                await data.set_data(
                    f"UPDATE tasks SET {task_in_db} = true WHERE user_id = {user_id}"
                    )
                await data.set_data(
                    f"UPDATE main SET wallet = wallet + {task_price} WHERE user_id = {user_id}"
                    )
                
                # Сообщение об успешном выполнении
                return True
                    
        except Exception as e:
            logger.error(f"Ошибка при выполнении таска: {e}")
            return False
    