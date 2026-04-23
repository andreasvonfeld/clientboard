import type { Client, ClientInput, ClientStatus } from '../../shared/types';
import { getDatabase, persist } from '../database/init';

const STATUSES: ClientStatus[] = ['prospect', 'active', 'inactive'];

function assertStatus(s: string): ClientStatus {
  if (STATUSES.includes(s as ClientStatus)) return s as ClientStatus;
  return 'prospect';
}

function rowToClient(row: {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  created_at: string;
}): Client {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: assertStatus(row.status),
    createdAt: row.created_at,
  };
}

function asRow(o: Record<string, unknown>): {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  created_at: string;
} {
  return {
    id: Number(o.id),
    name: String(o.name),
    email: String(o.email),
    phone: o.phone == null ? null : String(o.phone),
    status: o.status == null ? 'prospect' : String(o.status),
    created_at: String(o.created_at),
  };
}

export function list(): Client[] {
  const database = getDatabase();
  const rows = database
    .prepare(
    `SELECT id, name, email, phone, status, created_at FROM clients ORDER BY created_at DESC`,
  )
    .all() as Array<Record<string, unknown>>;
  return rows.map((r) => rowToClient(asRow(r)));
}

export function getById(id: number): Client | null {
  const database = getDatabase();
  const row = database
    .prepare(
      `SELECT id, name, email, phone, status, created_at FROM clients WHERE id = ?`,
    )
    .get(id) as Record<string, unknown> | undefined;
  if (!row) return null;
  const mapped = asRow(row);
  return rowToClient(mapped);
}

export function create(input: ClientInput): Client {
  const status = assertStatus(input.status);
  const database = getDatabase();
  const ins = database.prepare(
    `INSERT INTO clients (name, email, phone, status) VALUES (?, ?, ?, ?)`,
  );
  const result = ins.run(input.name, input.email, input.phone ?? null, status) as {
    lastInsertRowid: number | bigint;
  };
  const id = Number(result.lastInsertRowid);
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
  const status = assertStatus(input.status);
  const database = getDatabase();
  const stmt = database.prepare(
    `UPDATE clients SET name = ?, email = ?, phone = ?, status = ? WHERE id = ?`,
  );
  stmt.run(input.name, input.email, input.phone ?? null, status, id);
  persist();
  return getById(id);
}

export function remove(id: number): boolean {
  const ifExists = getById(id);
  if (!ifExists) return false;
  const database = getDatabase();
  const stmt = database.prepare(`DELETE FROM clients WHERE id = ?`);
  stmt.run(id);
  persist();
  return true;
}
