// Import MySQL library

const mysql = require('mysql2/promise');

// MySQL configuration

const getConnection = async () => {
  if (!process.env.MYSQL_PASSWORD) {
    throw new Error(
      'Missing environment configuration at the server'
    );
  }

  const datosConexion = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_SCHEMA || 'example',
  };

  const conn = await mysql.createConnection(datosConexion);
  await conn.connect();

  return conn;
};

module.exports = { getConnection };