const path = require('path');
const fs = require('fs');
const axios = require('axios').default;
const timer = require('./util/timer');
const GameTimer = new timer();
const makeHTML = require('./js/generateGameHtml');

const customTitleBar = require('custom-electron-titlebar');

window.addEventListener('DOMContentLoaded', () => {
  new customTitleBar.Titlebar({
    backgroundColor: customTitleBar.Color.fromHex('#121111'),
    icon: './images/icons/icon.png',
    menu: false,
    closeable: true,
    minimizable: true,
    maximizable: true,
  });

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}--version`, process.version[type]);
  }

  var checkbox1 = document.getElementById('reset-timer-when-playing-a-new-game');
  var checkbox2 = document.getElementById('track-times');
  var settings = JSON.parse(fs.readFileSync(path.join(__dirname, 'user', 'settings.json')));

  checkbox1.checked = settings['reset-timer-when-playing-a-new-game'];
  checkbox2.checked = settings['track-times'];

  // load game list
  function loadGames(games) {
    const gameSection = document.getElementById('container-games');
    for (const game in games) {
      if (Object.hasOwnProperty.call(games, game)) {
        const _game = games[game];
        gameSection.innerHTML += makeHTML(game, _game.title, GameTimer.formatTime(game));
      }
    }
  }
  axios
    .get('https://api.zedruc.net/games')
    .then(response => {
      return response.data;
    })
    .then(loadGames);
});
