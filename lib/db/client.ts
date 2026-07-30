import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import * as schema from "./schema";

declare global {
  var __stupeniPgPool: Pool | undefined;
}

function buildPool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL не задан — см. .env.example");
  }
  const opts: PoolConfig = {
    connectionString: url,
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idleTimeoutMillis: 30_000,
    // Без таймаута висящий коннект блокирует рендер страницы целиком.
    connectionTimeoutMillis: 5_000,
  };
  if (process.env.DATABASE_SSL === "true") {
    opts.ssl = { rejectUnauthorized: false };
  }
  const pool = new Pool(opts);
  // Иначе ошибка простаивающего клиента (рестарт postgres) валит процесс.
  pool.on("error", (e) => console.error("[db] idle client error:", e.message));
  return pool;
}

function pool(): Pool {
  // dev-hot-reload переимпортирует модуль — переиспользуем тот же пул.
  if (!global.__stupeniPgPool) global.__stupeniPgPool = buildPool();
  return global.__stupeniPgPool;
}

let _db: NodePgDatabase<typeof schema> | undefined;

export function db(): NodePgDatabase<typeof schema> {
  if (!_db) _db = drizzle(pool(), { schema });
  return _db;
}

/** Настроена ли БД вообще (без неё сайт живёт на сиде). */
export function hasDb(): boolean {
  return !!process.env.DATABASE_URL;
}

export { schema };
