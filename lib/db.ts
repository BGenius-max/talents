import mysql from 'mysql2/promise';
import 'dotenv/config';  // loads .env automatically

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'talentsngo',

  waitForConnections: true,
  connectionLimit: 20,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,

  enableKeepAlive: true,
});

export async function query<T = any>(
  sql: string,
  params: any[] = []
): Promise<T> {
  const [rows] = await pool.execute(sql, params)
  return rows as T
}
