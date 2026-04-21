import { app, BrowserWindow } from 'electron';
import started from 'electron-squirrel-startup';
import { initDatabase } from './database/init';
import { registerIpcHandlers } from './services/ipc.handlers';
import { createMainWindow } from './window';

if (started) {
  app.quit();
}

app.whenReady().then(async () => {
  // IPC avant init DB : les invocations n’arrivent qu’après createMainWindow ;
  // évite tout cas où le renderer serait prêt sans handlers (rebuild / hot reload).
  registerIpcHandlers();
  await initDatabase();
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
