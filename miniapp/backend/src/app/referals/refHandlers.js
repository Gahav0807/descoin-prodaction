const Database = require('../../config/database');
const logger = require('../../config/logger');
/**
 * Получает список друзей пользователя по его ID.
 * @param {number} userId - ID пользователя.
 * @returns {Promise<Array<{ referent_id: number, friend_id: number, friend_username: string, friend_avatar: string }>>} - Список друзей пользователя.
 */
async function getReferalsById(userId) {
  try {
    logger.info('Получаем список друзей');
    const query = `SELECT * FROM ref WHERE referent_id = ${userId}`;
    const result = await Database.getList(query);
    return result;
  } catch (e) {
    logger.error(`Ошибка при получении списка друзей: ${e}`);
    throw e;
  }
}

module.exports = {
  getReferalsById,
};
