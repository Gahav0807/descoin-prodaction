import sqlite3

class UsersDatabase:
    """
    Класс для работы с БД пользователей.
    Используется для функционала рассылки.
    """
    def __init__(self,db_file):
        self.connection=sqlite3.connect(db_file)
        self.cursor=self.connection.cursor()

    def user_exists(self,user_id):
        with self.connection:
            result = self.cursor.execute("SELECT * FROM users WHERE id=?",(user_id,)).fetchmany(1)
            return bool(len(result))

    def add_user(self,user_id):
        with self.connection:
            return self.cursor.execute("INSERT INTO users (id) VALUES(?)", (user_id,))

    def get_users(self):
        with self.connection:
            return self.cursor.execute("SELECT id FROM users").fetchall()
