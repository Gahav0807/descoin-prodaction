import os
import asyncio
import asyncpg
from asyncpg import PostgresError
from ... import logger

from dotenv import load_dotenv

load_dotenv()


class Database:
    """
    Singleton async DB connection. Don't forget to shutdown!
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
                user=os.getenv("PGUSER"),
                password=os.getenv("PGPASSWORD"),
                database=os.getenv("PGDATABASE"),
                host=os.getenv("PGHOST")
            )
            logger.info("Connection to DB is created")
        return self.pool

    def close_connection(self):
        if self.pool:
            asyncio.run(self.pool.close())
            self.pool = None
            logger.info("Connection to DB is closed")
        else:
            logger.warning("Trying to close a non-open connection")

    async def get_data(self, query):
        try:
            if not self.pool:
                await self.create_pool()
            async with self.pool.acquire() as connection:
                async with connection.transaction():
                    result = await connection.fetch(query)
                    logger.debug("Executed query: %s", query)
                    return result
        except PostgresError as e:
            logger.error("Error while fetching list: %s", e)
        except Exception as e:
            logger.error("Unexpected error: %s", e)
            raise e from e
        
    async def set_data(self, query):
        try:
            if not self.pool:
                await self.create_pool()
            async with self.pool.acquire() as connection:
                async with connection.transaction():
                    result = await connection.execute(query)
                    logger.debug("Executed query: %s", query)
                    return result
        except PostgresError as e:
            logger.error("Error while fetching list: %s", e)
        except Exception as e:
            logger.error("Unexpected error: %s", e)
            raise e from e

    async def get_list(self, query):
        result = await self.get_data(query)
        return [dict(record) for record in result]
    
    async def get_fetchval(self, query):
        try:
            if not self.pool:
                await self.create_pool()
            async with self.pool.acquire() as connection:
                async with connection.transaction():
                    result = await connection.fetchval(query)
                    logger.debug("Executed query: %s", query)
                    return result
        except PostgresError as e:
            logger.error("Error while fetchval list: %s", e)
        except Exception as e:
            logger.error("Unexpected error: %s", e)
            raise e from e