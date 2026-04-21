import { dialog, app } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Client } from '../../shared/types';
import * as clients from './clients.service';

function csvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function rowToLine(c: Client): string {
  return [
    String(c.id),
    c.name,
    c.email,
    c.phone ?? '',
    c.status,
    c.createdAt,
  ]
    .map(csvCell)
    .join(',');
}

export async function exportClientsCsv(): Promise<
  | { ok: true; path: string }
  | { ok: false; canceled?: boolean; error?: string }
> {
  try {
    const rows = clients.list();
    const header = 'id,name,email,phone,status,createdAt';
    const lines = rows.map(rowToLine);
    const csv = [header, ...lines].join('\r\n');
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Exporter les clients',
      defaultPath: path.join(app.getPath('documents'), 'clients.csv'),
      filters: [{ name: 'CSV', extensions: ['csv'] }],
    });
    if (canceled || !filePath) {
      return { ok: false, canceled: true };
    }
    await fs.writeFile(filePath, `\ufeff${csv}`, 'utf8');
    return { ok: true, path: filePath };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
