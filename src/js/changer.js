/**
 * changer.js
 * 
 * Events for changing the current
 * game displayed in the rpc are handled here.
 */

const ipc = require('electron').ipcRenderer;

var updateRPC = (gameId) => {
    /*     console.log(gameId); */
    ipc.send('update_game', gameId);
}

ipc.on('error', (_empty) => {
    userNotification('Error!', 'Make sure your Discord app is running before opening this app. If this keeps showing up please create an issue at github.com/zedruc/WiiU-Discord-Rpc', 5);
});

ipc.on('rpc_ready', (_empty) => {
    userNotification('Ready', 'You can now use the app properly!', 5);
});

ipc.on('not_ready_yet', (_empty) => {
    userNotification('Not ready yet!', 'You somehow managed to click so fast that the app couldn\'t even connect...', 5);
});