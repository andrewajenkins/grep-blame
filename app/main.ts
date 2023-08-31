import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
import { Commands } from './commands/grep';
import { RipGrep } from './commands/ripgrep';
import { PlatformPath } from 'path';

const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);

let win: BrowserWindow | null = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve');

function createWindow(): BrowserWindow {
  console.log('creating window!');
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false,
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  ipcMain.on('grep-command', (event, arg) => {
    console.log('branch:', git.branch());
    const commands = new Commands();
    commands.grep({ path: '.', fileType: ['ts'], pattern: 'export Class' }, (err: any, res: any) => {
      if (err) event.reply('git-command-result', `error: ${err}`);
      else event.reply('git-command-result', res);
    });
  });
  ipcMain.on('grep-blame', async (event, arg) => {
    const fileTypes = ['ts', 'py'];
    const pattern = 'export class';
    const directory = './';

    const grepSearch = new RipGrep({ fileTypes, pattern, directory });

    try {
      const result = await grepSearch.search();
      console.log(result);
      event.reply('git-command-result', result);
    } catch (error) {
      event.reply('git-command-result', `error: ${error}`);
      console.error(error);
    }
  });
  ipcMain.on('get-page', async (event, arg) => {
    fs.readFile(arg, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      try {
        event.reply('page-results', data);
      } catch (error) {
        event.reply('page-results', `error: ${error}`);
      }
    });
  });
} catch (e) {
  console.error(e);
  // Catch Error
  // throw e;
}
