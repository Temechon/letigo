// The function onload is loaded when the DOM has been loaded
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.addEventListener("DOMContentLoaded", function () {

    setTimeout(function () {
        // check that the window.screen.show method is available
        if (window.screen.show) {
            window.screen.show();
        }

        new Game('game-canvas');
    }, 3500);
});

var Game = (function () {
    function Game(canvasId) {
        var _this = this;

        _classCallCheck(this, Game);

        var canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(canvas, true, null, false);

        // Contains all loaded assets needed for this state
        this.assets = [];

        // The state scene
        this.scene = null;

        // Positions on cells that can be built on
        this.availablePositions = [];

        // Positions with a building on it
        this.takenPositions = [];

        // The mansion of the city
        this.mansion = null;

        // The player money
        this.money = 50;

        this.guiManager = new GUIManager(this);

        // At each tick, a month is spent.
        this.monthTimer = null;

        // The total time spent
        this.monthTime = -1;

        // Resize window event
        window.addEventListener("resize", function () {
            _this.engine.resize();
        });

        this.run();
    }

    _createClass(Game, [{
        key: "_initScene",
        value: function _initScene() {

            var scene = new BABYLON.Scene(this.engine);
            // Camera attached to the canvas
            var camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(-14, 17, -20), scene);
            camera.rotation.x = camera.rotation.y = 0.65;
            camera.attachControl(this.engine.getRenderingCanvas());

            // Hemispheric light to light the scene
            var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
            h.intensity = 0.9;
            return scene;
        }
    }, {
        key: "run",
        value: function run() {
            var _this2 = this;

            this.scene = this._initScene();

            // The loader
            var loader = new BABYLON.AssetsManager(this.scene);

            var meshTask = loader.addMeshTask("city", "", "./assets/", "city.babylon");
            meshTask.onSuccess = function (t) {

                _this2.availablePositions = CityManager.GET_POSITIONS(t.loadedMeshes).normal;
            };

            loader.onFinish = function () {

                // Init the game
                _this2._initGame();

                // The state is ready to be played
                _this2.isReady = true;

                _this2.engine.runRenderLoop(function () {
                    _this2.scene.render();
                });
            };

            loader.load();
        }
    }, {
        key: "_initGame",
        value: function _initGame() {
            var _this3 = this;

            window.addEventListener("keydown", function (evt) {
                if (evt.keyCode == 32) {
                    if (_this3.scene.debugLayer._enabled) {
                        _this3.scene.debugLayer.hide();
                    } else {
                        _this3.scene.debugLayer.show();
                    }
                }
            });

            this.monthTimer = new Timer(1000, this.scene, { repeat: -1 });
            this.monthTimer.callback = function () {
                _this3._addMonth();
            };

            setInterval(function () {
                var rp = _this3.getRandomPosition();
                if (rp) {
                    _this3.build(rp);
                }
            }, 1500);
        }

        /**
         * Returns an integer in [min, max[
         */
    }, {
        key: "getRandomPosition",

        /**
         * Returns a random available position, removes it from availablePositions
         * and push it to takenPositions
         * @returns {T}
         */
        value: function getRandomPosition() {
            var ind = Game.randomNumber(0, this.availablePositions.length);
            var res = this.availablePositions.splice(ind, 1)[0];
            if (res) {
                this.takenPositions.push(res);
                return res;
            }
            return null;
        }
    }, {
        key: "build",
        value: function build(position) {
            new House(this, position);
        }
    }, {
        key: "cleanPosition",
        value: function cleanPosition(building) {
            var _this4 = this;

            this.takenPositions.forEach(function (pos, index) {
                if (pos.equals(building.position)) {
                    _this4.takenPositions.splice(index, 1);
                    _this4.availablePositions.push(pos);
                }
            });
        }

        /**
         * Start the game by removing all building built during the menu time
         */
    }, {
        key: "start",
        value: function start() {
            for (var ind = 0; ind < this.scene.meshes.length; ind++) {
                var m = this.scene.meshes[ind];
                if (m instanceof House) {
                    m.dispose();
                    ind--;
                }
            }
            // Start the month timer
            this.monthTimer.reset();
            this.monthTimer.start();
        }

        /**
         * Increment the month/year timer, and updates the game GUI
         */
    }, {
        key: "_addMonth",
        value: function _addMonth() {
            this.monthTime++;
            this.guiManager.updateGui();
        }
    }], [{
        key: "randomNumber",
        value: function randomNumber(min, max) {
            if (min === max) {
                return min;
            }
            var random = Math.random();
            return Math.floor(random * (max - min) + min);
        }
    }]);

    return Game;
})();
