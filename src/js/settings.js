const fs = require('fs');
const path = require('path');
const settingsFile = path.resolve('./src/user/settings.json');

var settings;

settings = JSON.stringify(fs.readFileSync(settingsFile));

function MissingParameters() {
    this.message = "Please provide both parameters key and value";
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
    }

    this.set = (key = undefined, value = undefined) => {
        if (key == undefined || value == undefined) throw new MissingParameters;
        try {
            settings[key] = value;
            fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
            settings = JSON.parse(fs.readFileSync(settingsFile));
        } catch (error) {
            throw error;
        }
    }
}

var settingsHandler = new SettingsHandler();

function toggleOption(optionKey) {
    try {
        var temp = settingsHandler.load();
        temp[optionKey] = !temp[optionKey];
        settingsHandler.set(optionKey, temp[optionKey]);
        return;
    } catch (error) {
        throw error;
    }
}

const settingsButton = document.getElementById('settings');
const backButton = document.getElementById('back');

const mainPage = document.getElementById('mainPage');
const settingsPage = document.getElementById('settingsPage');

settingsButton.onmouseup = () => {
    userNotification("Sorry!", "Settings arent available until the styling issue is fixed.", 3)
    return;
    mainPage.style.display = "none";
    mainPage.style.position = "absolute";
    settingsPage.style.display = "inline";
    settingsPage.style.position = "static";
}

backButton.onmouseup = () => {
    mainPage.style.display = "inline";
    mainPage.style.position = "static";
    settingsPage.style.display = "none";
    settingsPage.style.position = "absolute";
}