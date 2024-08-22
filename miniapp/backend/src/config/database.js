const logger = require('./logger');
const { Pool } = require('pg');

class Database {
  static _instance = null;

  constructor() {
    this.pool = null;
  }

  static getInstance() {
    if (!Database._instance) {
      Database._instance = new Database();
    }
    return Database._instance;
  }

  async createPool() {
    if (!this.pool) {
      this.pool = new Pool({
        user: 'gen_user',
        host: '147.45.168.196',
        database: 'default_db',
        password: '290lCx8|3_2:nu',
        port: 5432
      });
      logger.info('Connection to DB is created');
    }
    return this.pool;
  }

  async closeConnection() {
    if (this.pool) {
      this.pool.end();
      this.pool = null;
      logger.info('Connection to DB is closed');
    } else {
      logger.warn('Trying to close a non-open connection');
    }
  }

  async getData(query) {
    try {
      if (!this.pool) {
        await this.createPool();
      }
      const result = await this.pool.query(query);
      logger.debug(`Executed query: ${query}`);
      return result.rows;
    } catch (err) {
      logger.error(`Error while fetching list: ${err}`);
      throw err;
    }
  }

  async setData(query) {
    try {
      if (!this.pool) {
        await this.createPool();
      }
      const result = await this.pool.query(query);
      logger.debug(`Executed query: ${query}`);
      return result;
    } catch (err) {
      logger.error(`Error while fetching list: ${err}`);
      throw err;
    }
  }

  async getList(query) {
    const result = await this.getData(query);
    return result;
  }

  async getFetchval(query) {
    try {
      if (!this.pool) {
        await this.createPool();
      }
      const result = await this.pool.query(query);
      logger.debug(`Executed query: ${query}`);
      return result.rows[0][Object.keys(result.rows[0])[0]];
    } catch (err) {
      logger.error(`Error while fetchval list: ${err}`);
      throw err;
    }
  }
}

module.exports = Database.getInstance();
