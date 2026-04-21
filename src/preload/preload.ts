import { contextBridge, ipcRenderer } from 'electron';
import type { ClientInput } from '../shared/types';

contextBridge.exposeInMainWorld('api', {
  clients: {
    getAll: () => ipcRenderer.invoke('clients:getAll'),
    get: (id: number) => ipcRenderer.invoke('clients:get', id),
    create: (input: ClientInput) => ipcRenderer.invoke('clients:create', input),
    update: (id: number, input: ClientInput) =>
      ipcRenderer.invoke('clients:update', id, input),
    remove: (id: number) => ipcRenderer.invoke('clients:delete', id),
    exportCsv: () => ipcRenderer.invoke('clients:exportCsv'),
  },
});
