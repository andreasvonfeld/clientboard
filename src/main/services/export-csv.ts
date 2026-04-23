import { dialog, app } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as clients from './clients.service';
import { rowToLine, toCsv } from './utils/csv';

export async function exportClientsCsv(): Promise<
  | { ok: true; path: string }
  | { ok: false; canceled?: boolean; error?: string }
> {
  try {
    const rows = clients.list();
    const header = 'id,name,email,phone,status,createdAt';
    const lines = rows.map(rowToLine);
    const csv = toCsv([header, ...lines]);
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
