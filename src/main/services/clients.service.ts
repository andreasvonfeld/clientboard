import type { Client, ClientInput } from '../../shared/types';
import { getDatabase, persist } from '../database/init';

function rowToClient(row: {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}): Client {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

function asRow(o: Record<string, unknown>): {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
} {
  return {
    id: Number(o.id),
    name: String(o.name),
    email: String(o.email),
    phone: o.phone == null ? null : String(o.phone),
    created_at: String(o.created_at),
  };
}

export function list(): Client[] {
  const database = getDatabase();
  const stmt = database.prepare(
    `SELECT id, name, email, phone, created_at FROM clients ORDER BY created_at DESC`,
  );
  const rows: Client[] = [];
  while (stmt.step()) {
    rows.push(rowToClient(asRow(stmt.getAsObject() as Record<string, unknown>)));
  }
  stmt.free();
  return rows;
}

export function getById(id: number): Client | null {
  const database = getDatabase();
  const stmt = database.prepare(
    `SELECT id, name, email, phone, created_at FROM clients WHERE id = ?`,
  );
  stmt.bind([id]);
  if (!stmt.step()) {
    stmt.free();
    return null;
  }
  const row = asRow(stmt.getAsObject() as Record<string, unknown>);
  stmt.free();
  return rowToClient(row);
}

export function create(input: ClientInput): Client {
  const database = getDatabase();
  const ins = database.prepare(
    `INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)`,
  );
  ins.bind([input.name, input.email, input.phone ?? null]);
  ins.step();
  ins.free();
  const idRes = database.exec('SELECT last_insert_rowid() AS id');
  const id = Number(idRes[0].values[0][0]);
  persist();
  const created = getById(id);
  if (!created) {
    throw new Error('Client introuvable après insertion');
  }
  return created;
}

export function update(id: number, input: ClientInput): Client | null {
  const ifExists = getById(id);
  if (!ifExists) return null;
  const database = getDatabase();
  const stmt = database.prepare(
    `UPDATE clients SET name = ?, email = ?, phone = ? WHERE id = ?`,
  );
  stmt.bind([input.name, input.email, input.phone ?? null, id]);
  stmt.step();
  stmt.free();
  persist();
  return getById(id);
}

export function remove(id: number): boolean {
  const ifExists = getById(id);
  if (!ifExists) return false;
  const database = getDatabase();
  const stmt = database.prepare(`DELETE FROM clients WHERE id = ?`);
  stmt.bind([id]);
  stmt.step();
  stmt.free();
  persist();
  return true;
}
