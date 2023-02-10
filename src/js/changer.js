/**
 * changer.js
 *
 * Events for changing the current
 * game displayed in the rpc are handled here.
 */

const ipc = require('electron').ipcRenderer;

var updateRPC = gameId => {
  /*     console.log(gameId); */
  ipc.send('update_game', gameId);
};

ipc.on('error', _empty => {
  userNotification(
    'Not able to display status!',
    "Make sure your Discord app is running before opening this app. If this keeps showing up please create an issue at <a onclick=\"require('electron').shell.openExternal('https://github.com/Zedruc/WiiU-Discord-Rpc')\">github.com/zedruc/WiiU-Discord-Rpc</a>",
    10
  );
});

ipc.on('rpc_ready', _empty => {
  userNotification(
    'Ready!',
    'You can now use the app properly! Note: If you restart Discord, you will also have to restart the app.',
    5
  );
});

ipc.on('not_ready_yet', _empty => {
  userNotification(
    'Not able to display status!',
    "If this keeps showing up please create an issue at <a onclick=\"require('electron').shell.openExternal('https://github.com/Zedruc/WiiU-Discord-Rpc')\">github.com/zedruc/WiiU-Discord-Rpc</a>",
    10
  );
});

ipc.on('notify', (_, notification) => {
  console.log(notification);
  userNotification(notification.title, notification.msg, notification.timeout);
});

ipc.on('playtime_change', (event, gameId, playtime) => {
  document.getElementById(`${gameId}-time`).innerHTML = playtime;
});
