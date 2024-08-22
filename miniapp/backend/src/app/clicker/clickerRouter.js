const express = require('express');
const { getInfoByUserId, updateInfoByUserId } = require('./clickerHandlers');

const router = express.Router();

// Endpoint для получения информации о пользователе
/**
 * @route GET /getInfo/:userId
 * @param {string} userId - ID пользователя, информацию о котором нужно получить
 * @returns {object} - Объект с информацией о пользователе, включая user_id, wallet и limit_clicks
 * EXAMPLE:
 * {
  "user_id": "1111111111",
  "wallet": 777,
  "limit_clicks": 10000
  }
 * @throws {Error} - Если возникла ошибка при получении информации о пользователе
 */
router.get('/getInfo/:userId', async (req, res) => {
  try {
    const result = await getInfoByUserId(req.params.userId);
    res.json({
      user_id: result.user_id,
      wallet: Number(BigInt(result.wallet)),
      limit_clicks: result.limit_clicks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint для обновления информации о пользователе
/**
 * @route GET /updateInfo/:userId/:balance/:limitClicks
 * @param {string} userId - ID пользователя, информацию которого нужно обновить
 * @param {string} balance - Новый баланс для кошелька пользователя
 * @param {string} limitClicks - Новый лимит кликов для пользователя
 * @returns {object} - Объект с флагом 'success', указывающим, была ли обновление успешным
 * @throws {Error} - Если возникла ошибка при обновлении информации о пользователе
 */
router.get('/updateInfo/:userId/:balance/:limitClicks', async (req, res) => {
  try {
    const result = await updateInfoByUserId(
      req.params.userId,
      req.params.balance,
      req.params.limitClicks
    );
    res.json({ success: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
