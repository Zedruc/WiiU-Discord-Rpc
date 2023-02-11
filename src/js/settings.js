const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const settingsFile = path.join(__dirname, 'user', 'settings.json');

var settings = JSON.parse(fs.readFileSync(settingsFile));

function MissingParameters() {
  this.message = 'Please provide both parameters key and value';
}

function SettingsHandler() {
  /**
   * Loads the current settings and returns a settings object.
   * Warning: resource intensive
   * @returns Object
   */
  this.load = () => {
    settings = JSON.parse(fs.readFileSync(settingsFile));

    return settings;
  };

  this.set = (key = undefined, value = undefined) => {
    if (key == undefined || value == undefined) throw new MissingParameters();
    try {
      settings[key] = value;
      fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
      settings = JSON.parse(fs.readFileSync(settingsFile));
    } catch (error) {
      throw error;
    }
  };
}

var settingsHandler = new SettingsHandler();

function toggleOption(optionKey) {
  try {
    var temp = settingsHandler.load();
    temp[optionKey] = !temp[optionKey];
    settingsHandler.set(optionKey, temp[optionKey]);

    ipcRenderer.send('update_settings', optionKey);
    return;
  } catch (error) {
    throw error;
  }
}

const settingsButton = document.getElementById('settings');
const backButton = document.getElementById('back');

const settingsPage = document.querySelector('#settingsPage');
const mainPage = document.querySelector('#mainPage');

settingsButton.onmouseup = () => {
  mainPage.style.position = 'absolute';
  mainPage.style.display = 'none';
  settingsPage.style.position = null;
  settingsPage.style.display = null;
};

backButton.onmouseup = () => {
  mainPage.style.position = null;
  mainPage.style.display = null;
  settingsPage.style.position = 'absolute';
  settingsPage.style.display = 'none';
};
