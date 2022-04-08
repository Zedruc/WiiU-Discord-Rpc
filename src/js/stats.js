var fs = require('fs');
var { ipcRenderer } = require('electron');

const statsButton = document.getElementById('stats');

var backButton = document.getElementById('back');

const statsPage = document.querySelector("#statsPage");
var mainPage = document.querySelector("#mainPage");

var settings = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'resources', 'app', 'src', 'user', 'settings.json')));
var stats = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'resources', 'app', 'src', 'user', 'times_played.json')));
if (settings["record-game-statistics"] == true) {
    for (const stat in stats) {
        document.getElementById(`${stat}_s`).innerHTML = stats[stat];
    }
}

ipcRenderer.on('rgs_updated', () => {
    if (settings["record-game-statistics"] == true) {
        for (const stat in stats) {
            console.log(stat + "_s");
        }
    }
});

statsButton.onmouseup = () => {
    mainPage.style.position = "absolute";
    mainPage.style.display = "none";
    statsPage.style.position = null;
    statsPage.style.display = null;
};

backButton.onmouseup = () => {
    mainPage.style.position = null;
    mainPage.style.display = null;
    statsPage.style.position = "absolute";
    statsPage.style.display = "none";
}