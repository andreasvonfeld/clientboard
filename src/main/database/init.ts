import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import type { Database } from 'sql.js';
import initSqlJs from 'sql.js';
import { app } from 'electron';

const require = createRequire(import.meta.url);
// sql.js n'exporte pas `package.json` — utiliser un sous-chemin `./dist/*` (voir exports du paquet).
const sqlJsDist = path.dirname(
  require.resolve('sql.js/dist/sql-wasm.wasm'),
);

let db: Database | null = null;
let dbFilePath = '';

function migrate(database: Database): void {
  database.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export async function initDatabase(): Promise<void> {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(sqlJsDist, file),
  });
  dbFilePath = path.join(app.getPath('userData'), 'clientboard.db');
  if (fs.existsSync(dbFilePath)) {
    const buf = fs.readFileSync(dbFilePath);
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }
  migrate(db);
  persist();
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error('Base non initialisée — appeler initDatabase() au démarrage');
  }
  return db;
}

export function persist(): void {
  if (!db || !dbFilePath) return;
  const data = db.export();
  fs.writeFileSync(dbFilePath, Buffer.from(data));
}

export function closeDatabase(): void {
  if (db) {
    persist();
    db.close();
    db = null;
  }
}
