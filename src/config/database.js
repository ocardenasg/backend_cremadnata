require('dotenv').config();

let pool;

async function getPool() {
  if (!pool) {
    const mariadb = await import('mariadb');
    pool = mariadb.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 5,
      acquireTimeout: 10000
    });
  }
  return pool;
}

async function getConnection() {
  const p = await getPool();
  let conn;
  try {
    conn = await p.getConnection();
    return conn;
  } catch (err) {
    console.error('Error getting connection:', err);
    throw err;
  }
}

async function initDatabase() {
  const conn = await getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(10) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        cost DECIMAL(10,2),
        category VARCHAR(50),
        size VARCHAR(50),
        image VARCHAR(500),
        stock DECIMAL(10,2) DEFAULT 0,
        provider VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(20),
        is_active TINYINT(1) DEFAULT 1,
        role VARCHAR(20) DEFAULT 'client',
        password VARCHAR(255) NOT NULL,
        activation_token VARCHAR(64),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('MariaDB tables initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { getPool, getConnection, initDatabase };