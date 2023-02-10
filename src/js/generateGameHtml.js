function generate(gamecode, gameTitle, gameTime) {
  const _ = `<div class="game" id="${gamecode}" onclick='updateRPC("${gamecode}")'>
        <img src="./images/icons/games/${gamecode}.jpg" class="gameIcon" draggable="false">
        <span class ="game-title">
        <p>${gameTitle}</p>
        <p style="font-size: 1rem" id="${gamecode}-time">${gameTime}</p>
        </span>
    </div>`;

  return _;
}

module.exports = generate;
