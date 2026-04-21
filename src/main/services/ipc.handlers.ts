import { ipcMain } from 'electron';
import type { ClientInput } from '../../shared/types';
import * as clients from './clients.service';

const channels = {
  list: 'clients:list',
  get: 'clients:get',
  create: 'clients:create',
  update: 'clients:update',
  remove: 'clients:remove',
} as const;

export function registerIpcHandlers(): void {
  ipcMain.handle(channels.list, () => clients.list());
  ipcMain.handle(channels.get, (_event, id: number) => clients.getById(id));
  ipcMain.handle(channels.create, (_event, input: ClientInput) =>
    clients.create(input),
  );
  ipcMain.handle(channels.update, (_event, id: number, input: ClientInput) =>
    clients.update(id, input),
  );
  ipcMain.handle(channels.remove, (_event, id: number) => clients.remove(id));
}
