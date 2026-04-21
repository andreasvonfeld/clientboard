import { ipcMain } from 'electron';
import type { ClientInput } from '../../shared/types';
import * as clients from './clients.service';
import { exportClientsCsv } from './export-csv';

/** Canaux IPC — alignement PDF : `clients:getAll`, `clients:create`, `clients:delete`. */
const channels = {
  getAll: 'clients:getAll',
  /** Ancien nom (alias) — évite erreur si bundle main obsolète côté dev. */
  listLegacy: 'clients:list',
  get: 'clients:get',
  create: 'clients:create',
  update: 'clients:update',
  delete: 'clients:delete',
  exportCsv: 'clients:exportCsv',
} as const;

function safeHandle(
  channel: string,
  listener: (...args: unknown[]) => unknown,
): void {
  ipcMain.removeHandler(channel);
  ipcMain.handle(channel, listener as never);
}

export function registerIpcHandlers(): void {
  const listHandler = () => clients.list();
  safeHandle(channels.getAll, listHandler);
  safeHandle(channels.listLegacy, listHandler);
  safeHandle(channels.get, (_event, id: number) => clients.getById(id));
  safeHandle(channels.create, (_event, input: ClientInput) =>
    clients.create(input),
  );
  safeHandle(channels.update, (_event, id: number, input: ClientInput) =>
    clients.update(id, input),
  );
  safeHandle(channels.delete, (_event, id: number) => clients.remove(id));
  safeHandle(channels.exportCsv, () => exportClientsCsv());
}
