function generate(gamecode, gameTitle) {
    const _ = `<div class="game" id="${gamecode}" onclick='updateRPC("${gamecode}")'>
        <img src="./images/icons/games/${gamecode}.jpg" class="gameIcon" draggable="false">
        <span class ="game-title">
        <p>${gameTitle}</p>
        </span>
    </div>`;

    return _;
}

module.exports = generate;