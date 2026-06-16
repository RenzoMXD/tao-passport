import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_POOL_MAX ?? 20),
  min: Number(process.env.DB_POOL_MIN ?? 2),
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT ?? 30000),
  connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT ?? 5000),
  allowExitOnIdle: false,
});

pool.on('error', (err, client) => {
  console.error('Unexpected database error on idle client', err);
});

export async function closePool(): Promise<void> {
  await pool.end();
}