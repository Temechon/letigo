"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GUIManager = (function () {
    function GUIManager(game) {
        _classCallCheck(this, GUIManager);

        this.game = game;

        this.playButton = document.getElementById("play");
        this.gameMenu = document.getElementById("game-menu");

        this.year = document.getElementById("year");
        this.month = document.getElementById("month");

        this.money = document.getElementById("cash");

        this.init();
    }

    /**
     * Attach action on play button
     */

    _createClass(GUIManager, [{
        key: "init",
        value: function init() {
            var _this = this;

            var eventPrefix = BABYLON.Tools.GetPointerPrefix();
            this.playButton.addEventListener(eventPrefix + "down", function () {
                _this._pressButton();
            }, false);
            this.playButton.addEventListener(eventPrefix + "up", function () {
                _this._releaseButton();
            }, false);
        }

        /**
         * Change its color
         */
    }, {
        key: "_pressButton",
        value: function _pressButton() {
            this.playButton.parentNode.className = "play press";
        }

        /**
         * Reset the button color, removes the game menu and start the game
         */
    }, {
        key: "_releaseButton",
        value: function _releaseButton() {
            var _this2 = this;

            this.playButton.parentNode.className = "play";
            this.gameMenu.classList.add("hide");
            this.gameMenu.addEventListener('transitionend', function () {
                _this2.startGame();
            }, false);
            this.gameMenu.addEventListener('webkitTransitionEnd', function () {
                _this2.startGame();
            }, false);
        }

        /**
         * Removes the game menu and starts the game
         */
    }, {
        key: "startGame",
        value: function startGame() {
            this.gameMenu.style.display = 'none';
            this.game.start();
        }

        /**
         * Update the game GUI accordingly to the game stats
         */
    }, {
        key: "updateGui",
        value: function updateGui() {

            // date
            var y = Math.floor(this.game.monthTime / 12);
            var m = this.game.monthTime % 12 + 1;
            this.year.innerHTML = y + " years";
            this.month.innerHTML = m + " months";

            // cash
            var c = this.game.money;
            this.money.innerHTML = c + " $";
        }
    }]);

    return GUIManager;
})();
//# sourceMappingURL=GUIManager.js.map
