import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { initDatabase } from './database/init';
import { registerIpcHandlers } from './services/ipc.handlers';
import { createMainWindow } from './window';

function handleSquirrelEvent(): boolean {
  if (process.platform !== 'win32') return false;
  const cmd = process.argv[1];
  if (!cmd?.startsWith('--squirrel-')) return false;

  const updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
  const exeName = path.basename(process.execPath);
  const spawnUpdate = (args: string[]) =>
    spawn(updateExe, args, { detached: true, stdio: 'ignore' }).unref();

  switch (cmd) {
    case '--squirrel-install':
    case '--squirrel-updated':
      spawnUpdate(['--createShortcut', exeName]);
      setTimeout(() => app.quit(), 1000);
      return true;
    case '--squirrel-uninstall':
      spawnUpdate(['--removeShortcut', exeName]);
      setTimeout(() => app.quit(), 1000);
      return true;
    case '--squirrel-obsolete':
      app.quit();
      return true;
    default:
      return false;
  }
}

if (!handleSquirrelEvent()) {
  const gotLock = app.requestSingleInstanceLock();
  if (!gotLock) {
    app.quit();
  }

  app.on('second-instance', () => {
    const existing = BrowserWindow.getAllWindows()[0];
    if (!existing) return;
    if (existing.isMinimized()) existing.restore();
    existing.show();
    existing.focus();
  });

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
    const existing = BrowserWindow.getAllWindows()[0];
    if (existing) {
      existing.show();
      existing.focus();
    } else {
      createMainWindow();
    }
  });
}
