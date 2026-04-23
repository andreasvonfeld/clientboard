import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { app } from 'electron';

let db: DatabaseSync | null = null;
let dbFilePath = '';

function tableHasColumn(database: DatabaseSync, column: string): boolean {
  const rows = database
    .prepare(`PRAGMA table_info(clients)`)
    .all() as Array<{ name: string }>;
  return rows.some((r) => r.name === column);
}

function migrate(database: DatabaseSync): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      status TEXT NOT NULL DEFAULT 'prospect',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  if (!tableHasColumn(database, 'status')) {
    database.exec(
      `ALTER TABLE clients ADD COLUMN status TEXT NOT NULL DEFAULT 'prospect'`,
    );
  }
}

export async function initDatabase(): Promise<void> {
  dbFilePath = path.join(app.getPath('userData'), 'clientboard.db');
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, Buffer.alloc(0));
  }
  db = new DatabaseSync(dbFilePath);
  migrate(db);
}

export function getDatabase(): DatabaseSync {
  if (!db) {
    throw new Error('Base non initialisée — appeler initDatabase() au démarrage');
  }
  return db;
}

export function persist(): void {
  // DatabaseSync écrit directement sur disque; méthode gardée pour compatibilité d'appel.
}

export function closeDatabase(): void {
  if (db) {
    persist();
    db.close();
    db = null;
  }
}
