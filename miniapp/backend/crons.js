const cron = require('node-cron');
const Database = require('./src/config/database');
const logger = require('./src/config/logger');

cron.schedule('*/10 * * * * *', () => {
    updateLimitClicks();
});

async function updateLimitClicks() {
    try {
        await Database.setData("UPDATE main SET limit_clicks = 1000");
        logger.info('Доступные клики у пользователей обновлены');
    } catch (e) {
        logger.error(`Ошибка при обновлении лимита доступных кликов: ${e}`);
    }
}
