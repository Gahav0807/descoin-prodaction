import os
import asyncpg
from asyncpg import PostgresError
from config import logger
from dotenv import load_dotenv

load_dotenv()

class BotDatabase:
    """
    Класс для работы с главной БД (общая с mini-app).
    Используется для работы с реферальной системой.
    """

    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        self.pool = None

    async def create_pool(self):
        if self.pool is None:
            self.pool = await asyncpg.create_pool(
                user='gen_user',
                password='290lCx8|3_2:nu',
                database='default_db',
                host='147.45.168.196'
            )
            logger.info("Connection to DB is created")
        return self.pool

    async def close_connection(self):
        if self.pool:
            await self.pool.close()
            self.pool = None
            logger.info("Connection to DB is closed")
        else:
            logger.warning("Trying to close a non-open connection")

    async def add_ref_node(self, referent_id, referal_id, referal_name):
        try:
            if not self.pool:
                await self.create_pool()
            async with self.pool.acquire() as connection:
                async with connection.transaction():
                    await connection.execute("INSERT INTO ref(referent_id,referal_id,referal_name) VALUES($1,$2,$3)", referent_id,referal_id,referal_name)
                    await connection.execute("UPDATE main SET wallet = wallet + 50000 WHERE user_id =$1",referent_id)

                    logger.debug("Добавлен реферальный-узел!")
        except PostgresError as e:
            logger.error("Error while fetching list: %s", e)
        except Exception as e:
            logger.error("Unexpected error: %s", e)
            raise e from e
        
    async def is_user_referal(self, user_id):
        try:
            if not self.pool:
                await self.create_pool()
            async with self.pool.acquire() as connection:
                async with connection.transaction():
                    logger.debug("Проверка,является ли юзер рефералом")
                    is_referal = await connection.fetchval("SELECT COUNT(*) FROM ref WHERE referal_id = $1", user_id)

                    if is_referal == 0:
                        logger.info("Юзер не является рефералом")
                        return False
                    else:
                        logger.info("Юзер является рефералом")
                        return True
        except PostgresError as e:
            logger.error("Error while fetching list: %s", e)
        except Exception as e:
            logger.error("Unexpected error: %s", e)
            raise e from e
    
