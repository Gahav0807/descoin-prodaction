const express = require('express');
const { getReferalsById } = require('./refHandlers');

const router = express.Router();

// Endpoint для получения списка рефералов пользователя
/**
 * @route GET /getReferals/:userId
 * @param {string} userId - ID пользователя, для которого нужно получить список рефералов
 * @returns {array} - Массив объектов, содержащих информацию о рефералах пользователя
 * EXAMPLE:
 * [
  {
    "referent_id": "1111111111",
    "referal_id": "2222222222",
    "referal_name": "vlad"
  },
  {
    "referent_id": "1111111111",
    "referal_id": "3333333333",
    "referal_name": "anton"
  }
]
 * @throws {Error} - Если возникла ошибка при получении списка рефералов
 */
router.get('/getReferals/:userId', async (req, res) => {
  try {
    const result = await getReferalsById(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

