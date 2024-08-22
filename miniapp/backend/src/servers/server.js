const express = require('express');
const cors = require('cors');
const Database = require('../config/database')
const clickerRouter = require('../app/clicker/clickerRouter');
const refRouter = require('../app/referals/refRouter');
const taskRouter = require('../app/tasks/taskRouter');

class Server {
  constructor() {
    this.app = express();

    // Настройка CORS
    this.origins = ['http://localhost:3000', 'http://188.225.10.94'];

    this.app.use(
      cors({
        origin: '*',
        credentials: true,
        methods: '*',
        headers: '*'
      })
    );

    // Стандартный эндпоинт
    this.app.get('/', (req, res) => {
      res.json({ message: 'Descoin Server is running!' });
    });

    // Подключение роутеров
    this.app.use('/', clickerRouter);
    this.app.use('/', refRouter);
    this.app.use('/', taskRouter);
  }

  run() {
    this.server = this.app.listen(9000, '127.0.0.1', () => {
      console.log('Server is running on http://127.0.0.1:9000');
    });

    process.on('SIGINT', () => {
      console.log('Received SIGINT (Ctrl+C)');
      this.stop();
    });
  }

  stop() {
    Database.closeConnection();
    this.server.close(() => {
      console.log('Server stopped');
      process.exit(0);
    });
  }
}

module.exports = Server;
