const fs = require('fs');
const path = require('path');
const log = require('electron-log');

const filePath = path.join(__dirname, '..', 'user', 'times_played.json');
log.info('Times file path: ' + filePath);
const gameTimes = JSON.parse(fs.readFileSync(filePath));
console.log(gameTimes);

module.exports = class Timer {
  constructor(timestamp) {
    this.timestamp = timestamp || Date.now();
  }

  /**
   *
   * @param {number} timestamp Unix timestamp
   *
   */
  setStart(timestamp) {
    this.timestamp = timestamp;
  }

  saveTime(gameCode) {
    if (Object.hasOwnProperty.call(gameTimes, gameCode)) {
      // current time - start time = time passed
      gameTimes[gameCode] += Date.now() - this.timestamp;
      /**
       * we assume that the game is being switched now,
       * so we reset the timestamp
       */
      this.resetTimer();
    }
  }

  formatTime(gameCode) {
    const time = new Date(gameTimes[gameCode]);
    var minutes = Math.floor((time / (1000 * 60)) % 60),
      hours = Math.floor((time / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}h ${minutes}m`;
  }

  /**
   * Saves the times to a file
   */
  saveAll() {
    fs.writeFileSync(filePath, JSON.stringify(gameTimes, null, 2));
  }

  resetTimer() {
    this.timestamp = Date.now();
  }

  resetAllTimes() {
    for (const game in gameTimes) {
      gameTimes[game] = 0;
    }
    this.saveAll();
  }

  debugLog() {
    log.info(gameTimes);
  }
};
