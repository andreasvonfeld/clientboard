import { contextBridge, ipcRenderer } from 'electron';
import type { ClientInput } from '../shared/types';

contextBridge.exposeInMainWorld('api', {
  clients: {
    list: () => ipcRenderer.invoke('clients:list'),
    get: (id: number) => ipcRenderer.invoke('clients:get', id),
    create: (input: ClientInput) => ipcRenderer.invoke('clients:create', input),
    update: (id: number, input: ClientInput) =>
      ipcRenderer.invoke('clients:update', id, input),
    remove: (id: number) => ipcRenderer.invoke('clients:remove', id),
  },
});
