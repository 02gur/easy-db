// config.js
const { Pool } = require('pg');
const { MongoClient } = require('mongodb');

const dbConfig = {
  postgres: {
    user: 'dbUser', // PostgreSQL kullanıcı adı
    host: 'localhost', // Veritabanı sunucu adresi
    database: 'dbName', // Veritabanı adı
    password: 'password', // Veritabanı şifresi
    port: 5432, // PostgreSQL portu
  },
  mongo: {
    url: 'mongodb://localhost:27017', // MongoDB URL'si
    dbName: 'dbName' // MongoDB veritabanı adı
  }
};

// PostgreSQL bağlantısı
const postgresPool = new Pool(dbConfig.postgres);

// MongoDB bağlantısı
const mongoClient = new MongoClient(dbConfig.mongo.url);

module.exports = {
  postgresPool,
  mongoClient,
  dbConfig
};
