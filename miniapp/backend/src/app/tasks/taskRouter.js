const express = require('express');
const { tryDoTask } = require('./taskHandlers');

const router = express.Router();

// Endpoint для попытки выполнить задачу
/**
 * @route GET /tryDoTask/:userId/:taskInDb/:taskPrice
 * @param {string} userId - ID пользователя, пытающегося выполнить задачу
 * @param {string} taskInDb - ID задачи в базе данных
 * @param {string} taskPrice - Награда за задачу
 * @returns {object} - Объект с флагом 'success', указывающим на успешность выполнения задачи
 * @throws {Error} - Если возникла ошибка при попытке выполнить задачу
 */
router.get('/tryDoTask/:userId/:taskInDb/:taskPrice', async (req, res) => {
  try {
    const result = await tryDoTask(
      req.params.userId,
      req.params.taskInDb,
      req.params.taskPrice
    );
    res.json({ success: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

