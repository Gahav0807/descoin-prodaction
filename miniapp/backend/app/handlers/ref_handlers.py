from ..core.database import Database
from ..... import logger

data=Database()

class RefHandler():
    async def get_referals_by_id(self, user_id):
        logger.info("Получаем список друзей")
 
        query=f"SELECT * FROM ref WHERE referent_id = {user_id}"
        result=await data.get_list(query)
 
        return result
 
            
            
        
    