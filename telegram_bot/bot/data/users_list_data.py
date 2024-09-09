import sqlite3
from config import logger

class UsersDatabase:
    """
    Класс для работы с БД пользователей.
    Используется для функционала рассылки.
    """
    def __init__(self,db_file):
        self.connection=sqlite3.connect(db_file)
        self.cursor=self.connection.cursor()

    def user_exists(self,user_id):
        try:
            with self.connection:
                result = self.cursor.execute("SELECT * FROM users WHERE id=?",(user_id,)).fetchmany(1)
                return bool(len(result))
        except sqlite3.Error as error:
            logger.error(f"Ошибка при проверке на вхождение пользователя: {error}")

    def add_user(self,user_id):
        try:
            with self.connection:
                return self.cursor.execute("INSERT INTO users (id) VALUES(?)", (user_id,)) ; self.connection.commit()
               
        except sqlite3.Error as error:
            logger.error(f"Ошибка при добавлении пользователя: {error}")

    def get_users(self):
        try:
            with self.connection:
                return self.cursor.execute("SELECT id FROM users").fetchall()
        except sqlite3.Error as error:
            logger.error(f"Ошибка при получении списка пользователей: {error}")

    def get_count_of_users(self):
        try:
            with self.connection:
                result = self.cursor.execute("SELECT COUNT(*) FROM users").fetchone()
                return result[0]
        except sqlite3.Error as error:
            logger.error(f"Ошибка при получении списка пользователей: {error}")
