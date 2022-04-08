const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const RPC = require('discord-rpc');
const fs = require('fs');
const rpc = new RPC.Client({
    transport: "ipc"
});

// Setup file logging
const log = require('electron-log');
log.transports.file.level = 'silly';
log.transports.file.file = path.join(process.cwd(), 'resources', 'app', 'logs', 'log.log');

// Log a message
// log.info('Info log');
// log.error('Error log');

var status_details = {
    RPCClientIsReady: false,
    startedPlayingTimestamp: null
}

rpc.on('ready', () => {
    status_details.RPCClientIsReady = true;
    mainWindow.webContents.send('rpc_ready');
});

const CLIENT_ID = "853639117019283476";

// resources\app\src\user
console.log('\t*-----*');
var settings = JSON.parse(fs.readFileSync(path.join(__dirname, 'user', 'settings.json')));

function loginRPC() {
    if (status_details.RPCClientIsReady) return;

    rpc.login({
        clientId: CLIENT_ID.toString()
    }).catch(err => {
        log.error(err);
        mainWindow.webContents.send('notify', { title: 'Could not connect to your Discord app!', msg: 'Make sure your Discor app is running and restart WiiU RPC', timeout: 5 });
    });
}
loginRPC();

var games = JSON.parse(fs.readFileSync(path.join(__dirname, 'games.json')));
/* console.log(games); */
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}
var mainWindow;
const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        minWidth: 770,
        minHeight: 570,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.resolve(__dirname, 'preload.js')
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Prevent user from opening dev tools
    mainWindow.webContents.on('devtools-opened', () => {
        mainWindow.webContents.closeDevTools();
    });

    globalShortcut.register('CommandOrControl+Shift+I', () => { return });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        log.info('Quitting App');
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('update_game', (sender, gameId) => {
    if (!status_details.RPCClientIsReady) {
        mainWindow.webContents.send('not_ready_yet');
    }
    if (status_details.startedPlayingTimestamp == null) status_details.startedPlayingTimestamp = Date.now();
    try {
        log.info('Changing activity');
        if (settings["reset-timer-when-playing-a-new-game"] == true) status_details.startedPlayingTimestamp = Date.now();
        rpc.setActivity({
            state: "Playing",
            details: games[gameId].title,
            startTimestamp: status_details.startedPlayingTimestamp,
            largeImageKey: gameId,
            largeImageText: games[gameId].title,
            smallImageKey: "wiiu",
            smallImageText: "Wii U",
            buttons: [
                { label: "Discord WiiU RPC on Github", url: "https://github.com/Zedruc/WiiU-Discord-Rpc" },
            ]
        });
    } catch (error) {
        log.error(error);
        mainWindow.webContents.send('error');
        return;
    }

});

ipcMain.on('update_settings', (sender, optionKey) => {
    /**
     * At this point the settings file itself is already up to date
     * Now we just update the variable for the settings checks.
     */

    settings = JSON.parse(fs.readFileSync(path.join(__dirname, 'user', 'settings.json')));
    log.info('Settings Updated');
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
