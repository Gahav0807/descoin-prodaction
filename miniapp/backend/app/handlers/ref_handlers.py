from ..core.database import Database
from ... import logger

data=Database()

class RefHandler():
    """
    Обработчик для страницы рефералов.
    Отвечает за получение списка рефералов
    """
    async def get_referals_by_id(self, user_id):
        logger.info("Получаем список друзей")
 
        query=f"SELECT * FROM ref WHERE referent_id = {user_id}"
        result=await data.get_list(query)
 
        return result
 
            
            
        
    