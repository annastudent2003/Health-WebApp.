// models/db.cjs or models/db.js (if using commonjs)
const mysql = require("mysql2/promise");

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 10000,
    });
    console.log("✅ MySQL pool created (models/db.cjs)");
  }
  return pool;
}

module.exports = { getPool };
