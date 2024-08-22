const Database = require('../../config/database');
const logger = require('../../config/logger');

/**
 * Пытается выполнить задание для пользователя.
 * Проверяет, существует ли пользователь в базе данных. Если нет, добавляет его.
 * Проверяет, выполнено ли задание. Если нет, обновляет значение задания и начисляет награду.
 * @param {number} userId - ID пользователя.
 * @param {string} taskInDb - Название поля в таблице "tasks", соответствующее заданию.
 * @param {number} taskPrice - Награда за выполнение задания.
 * @returns {Promise<boolean>} - Результат выполнения операции (true - успешно, false - ошибка).
 */
async function tryDoTask(userId, taskInDb, taskPrice) {
  try {
    logger.info('Попытка сделать таск. Проверка на вхождение пользователя в бд');
    // Проверка на существование пользователя в базе
    const isExist = await Database.getData(`SELECT * FROM tasks WHERE user_id = ${userId}`);
    // Пользователь есть
    if (isExist.length > 0) {
      logger.info('Пользователь есть. Проверка: сделан ли таск');
      // Проверяем, сделано ли задание
      const isTaskCompleted = await Database.getFetchval(`SELECT ${taskInDb} FROM tasks WHERE user_id = ${userId}`);
      // Задание сделано
      if (isTaskCompleted) {
        logger.info('Таск сделан. Ничего не делаем');
        return false;
      }
      // Задание не сделано
      else {
        logger.info('Таск не сделан. Изменяем значение таска, присваиваем награду');
        // Заменяем у task значение на true, присваиваем награду
        await Database.setData(`UPDATE tasks SET ${taskInDb} = true WHERE user_id = ${userId}`);
        await Database.setData(`UPDATE main SET wallet = wallet + ${taskPrice} WHERE user_id = ${userId}`);
        return true;
      }
    }
    // Пользователя нет
    else {
      logger.info('Пользователя нет. Добавляем в бд, меняем значение таска и отдаем награду');
      // Добавляем пользователя в базу
      await Database.setData(`INSERT INTO tasks (user_id) VALUES (${userId})`);
      // Заменяем у task значение на true, присваиваем награду
      await Database.setData(`UPDATE tasks SET ${taskInDb} = true WHERE user_id = ${userId}`);
      await Database.setData(`UPDATE main SET wallet = wallet + ${taskPrice} WHERE user_id = ${userId}`);
      return true;
    }
  } catch (e) {
    logger.error(`Ошибка при выполнении таска: ${e}`);
    return false;
  }
}

module.exports = {
  tryDoTask,
};
