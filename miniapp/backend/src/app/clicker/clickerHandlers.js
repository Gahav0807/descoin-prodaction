const Database = require('../../config/database');
const logger = require('../../config/logger');
/**
 * Получает информацию о пользователе по его userId.
 * Если пользователь не найден, создает нового пользователя с базовыми значениями.
 * @param {number} userId - ID пользователя.
 * @param {string} username - Имя пользователя.
 * @returns {Promise<{ user_id: number, wallet: number, limit_clicks: number }>} - Информация о пользователе.
 */
async function getInfoByUserId(userId) {
  try {
    logger.info('Получаем инфу про пользователя из бд(clicker)');
    const result = await Database.getData(`SELECT * FROM main WHERE user_id = ${userId}`);
    if (result.length > 0) {
      logger.info('"Пользователь уже есть, отправляем данные');
      return result[0];
    } else {
      logger.info('Пользователя нет, заносим в бд, отправляем базовые значения');
      await Database.setData(`INSERT INTO main (user_id, wallet, limit_clicks) VALUES (${userId},  0, 1000)`);
      return { user_id: userId, wallet: 0, limit_clicks: 1000 };
    }
  } catch (e) {
    logger.error(`Ошибка при получении информации о пользователе: ${e}`);
    throw e;
  }
}

/**
 * Обновляет информацию о пользователе в базе данных.
 * Также обновляет данные о кликах пользователя в таблицах clicks_of_day и clicks_of_month.
 * @param {number} userId - ID пользователя.
 * @param {number} wallet - Текущий баланс кошелька пользователя.
 * @param {number} limitClicks - Лимит кликов пользователя.
 * @returns {Promise<boolean>} - Результат успешности операции.
 */
async function updateInfoByUserId(userId, wallet, limitClicks) {
  try {
    logger.info('Обновляем инфу пользователя в бд(main)');
    await Database.setData(`UPDATE main SET wallet = ${wallet}, limit_clicks = ${limitClicks} WHERE user_id = ${userId}`);
    return true;
  } catch (e) {
    logger.error(`Ошибка при обновлении информации о пользователе: ${e}`);
    return false;
  }
}

module.exports = {
  getInfoByUserId,
  updateInfoByUserId,
};
