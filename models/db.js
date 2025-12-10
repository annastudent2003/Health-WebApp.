// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let pool = null;

export function getPool() {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    connectTimeout: 10000, // 10s
  });

  console.log("✅ MySQL pool created (mysql2/promise)");
  return pool;
}
