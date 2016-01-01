class GUIManager {

    constructor (game) {
        this.game = game;

        this.playButton = document.getElementById("play");
        this.gameMenu = document.getElementById("game-menu");

        this.year = document.getElementById("year");
        this.month = document.getElementById("month");

        this.init();
    }

    /**
     * Attach action on play button
     */
    init() {
        var eventPrefix = BABYLON.Tools.GetPointerPrefix();
        this.playButton.addEventListener(eventPrefix + "down", () => {this._pressButton() }, false);
        this.playButton.addEventListener(eventPrefix + "up", () => {this._releaseButton() }, false);
    }

    /**
     * Change its color
     */
    _pressButton() {
        this.playButton.parentNode.className="play press";
    }

    /**
     * Reset the button color, removes the game menu and start the game
     */
    _releaseButton() {
        this.playButton.parentNode.className = "play";
        this.gameMenu.classList.add("hide");
        this.gameMenu.addEventListener('transitionend', () => {this.startGame() }, false);
        this.gameMenu.addEventListener('webkitTransitionEnd',  () => {this.startGame() }, false);
    }

    /**
     * Removes the game menu and starts the game
     */
    startGame() {
        this.gameMenu.style.display = 'none';
        this.game.start();
    }

    updateGui() {
        let y = Math.floor(this.game.monthTime / 12);
        let m = this.game.monthTime % 12 +1;
        this.year.innerHTML = `${y} years`;
        this.month.innerHTML = `${m} months`;
    }
}