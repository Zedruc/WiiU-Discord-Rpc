const path = require('path');
const fs = require('fs');
const url = require('url');

const customTitleBar = require('custom-electron-titlebar');

window.addEventListener('DOMContentLoaded', () => {
    new customTitleBar.Titlebar({
        backgroundColor: customTitleBar.Color.fromHex('#121111'),
        icon: './images/icons/icon.png',
        menu: false
    });

    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}--version`, process.version[type]);
    }

    var checkbox1 = document.getElementById('reset-timer-when-playing-a-new-game');
    var settings = JSON.parse(fs.readFileSync(path.resolve('./src/user/settings.json')));

    checkbox1.checked = settings["reset-timer-when-playing-a-new-game"];
});