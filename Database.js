// Database.js
const { postgresPool, mongoClient, dbConfig } = require('./config');

class Database {
  constructor(dbType = 'postgres') {
    this.dbType = dbType;
    this.client = null;
  }

  async connect() {
    try {
      if (this.dbType === 'postgres') {
        this.client = await postgresPool.connect();
        console.log('PostgreSQL veritabanına başarıyla bağlandı.');
      } else if (this.dbType === 'mongo') {
        await mongoClient.connect();
        this.client = mongoClient.db(dbConfig.mongo.dbName);
        console.log('MongoDB veritabanına başarıyla bağlandı.');
      }
    } catch (error) {
      console.error('Bağlantı hatası:', error);
    }
  }

  async disconnect() {
    if (this.dbType === 'postgres' && this.client) {
      this.client.release();
    } else if (this.dbType === 'mongo') {
      await mongoClient.close();
    }
  }

  async create(table, data) {
    if (this.dbType === 'postgres') {
      const columns = Object.keys(data).join(', ');
      const values = Object.values(data);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
      const result = await this.client.query(query, values);
      return result.rows[0];
    } else if (this.dbType === 'mongo') {
      const result = await this.client.collection(table).insertOne(data);
      return result.ops[0];
    }
  }

  async read(table, criteria = {}) {
    if (this.dbType === 'postgres') {
      const whereClause = Object.keys(criteria).map((col, i) => `${col}=$${i + 1}`).join(' AND ');
      const values = Object.values(criteria);
      const query = `SELECT * FROM ${table} WHERE ${whereClause}`;
      const result = await this.client.query(query, values);
      return result.rows;
    } else if (this.dbType === 'mongo') {
      const result = await this.client.collection(table).find(criteria).toArray();
      return result;
    }
  }

  async update(table, criteria, data) {
    if (this.dbType === 'postgres') {
      const setClause = Object.keys(data).map((col, i) => `${col}=$${i + 1}`).join(', ');
      const whereClause = Object.keys(criteria).map((col, i) => `${col}=$${i + 1 + Object.keys(data).length}`).join(' AND ');
      const values = [...Object.values(data), ...Object.values(criteria)];
      const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
      const result = await this.client.query(query, values);
      return result.rows[0];
    } else if (this.dbType === 'mongo') {
      const result = await this.client.collection(table).updateOne(criteria, { $set: data });
      return result.result;
    }
  }

  async delete(table, criteria) {
    if (this.dbType === 'postgres') {
      const whereClause = Object.keys(criteria).map((col, i) => `${col}=$${i + 1}`).join(' AND ');
      const values = Object.values(criteria);
      const query = `DELETE FROM ${table} WHERE ${whereClause} RETURNING *`;
      const result = await this.client.query(query, values);
      return result.rows[0];
    } else if (this.dbType === 'mongo') {
      const result = await this.client.collection(table).deleteOne(criteria);
      return result.result;
    }
  }
}

module.exports = Database;
