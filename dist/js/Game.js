// The function onload is loaded when the DOM has been loaded
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

window.addEventListener("DOMContentLoaded", function () {

    if (window.screen.show) {
        setTimeout(function () {
            // check that the window.screen.show method is available
            window.screen.show();
            new Game('game-canvas');
        }, 2500);
    } else {
        new Game('game-canvas');
    }
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

        // Positions on cells that can be built on ([Position])
        this.availablePositions = [];

        // Positions with a building on it ([Position])
        this.takenPositions = [];

        // The mansion of the city
        this.mansion = null;

        // The player money
        this.money = 2000;

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
        key: '_initScene',
        value: function _initScene() {

            var scene = new BABYLON.Scene(this.engine);
            // Camera attached to the canvas
            var camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(-11, 34, -51), scene);
            camera.rotation.x = camera.rotation.y = 0.7;
            camera.attachControl(this.engine.getRenderingCanvas());

            // Hemispheric light to light the scene
            var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, -1, 0), scene);
            h.intensity = 1.5;

            var dir = new BABYLON.DirectionalLight('dir', new BABYLON.Vector3(0, -1, -0.5), scene);
            //dir.intensity = 2;
            return scene;
        }
    }, {
        key: 'run',
        value: function run() {
            var _this2 = this;

            this.scene = this._initScene();

            // The loader
            var loader = new BABYLON.AssetsManager(this.scene);

            var meshTask = loader.addMeshTask("city", "", "./assets/", "city.babylon");
            meshTask.onSuccess = function (t) {

                _this2.assets['house'] = CityManager.GET_HOUSE(t.loadedMeshes);
                _this2.assets['mansion'] = CityManager.GET_MANSION(t.loadedMeshes);
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
        key: '_initGame',
        value: function _initGame() {
            var _this3 = this;

            // Debug panel
            window.addEventListener("keydown", function (evt) {
                if (evt.keyCode == 32) {
                    if (_this3.scene.debugLayer._enabled) {
                        _this3.scene.debugLayer.hide();
                    } else {
                        _this3.scene.debugLayer.show();
                    }
                }
            });

            // Track the time spent
            this.monthTimer = new Timer(1000, this.scene, { repeat: -1 });
            this.monthTimer.callback = function () {
                _this3._addMonth();
            };

            // Build houses!
            this.buyTimer = new Timer(5000, this.scene, { autostart: true, repeat: -1, immediate: true });
            this.buyTimer.callback = function () {
                var rp = _this3.getRandomPosition();
                if (rp) {
                    _this3.build(rp);
                }
            };

            // Activate mansion
            new Mansion(this, new Position(BABYLON.Vector3.Zero()));

            // When the player touch a building
            this.scene.onPointerDown = function (evt, pickResult) {
                if (pickResult.pickedMesh && pickResult.pickedMesh.parent) {
                    var house = pickResult.pickedMesh.parent;

                    if (house.bought) {
                        // sell house
                        _this3.money += house.price;
                        house.dispose();
                    } else {
                        if (house.price <= _this3.money) {
                            _this3.money -= house.price;
                            house.buy();
                        }
                    }
                    _this3.guiManager.updateGui();
                }
            };
        }

        /**
         * Returns an integer in [min, max[
         */
    }, {
        key: 'getRandomPosition',

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
        key: 'build',
        value: function build(position) {
            new House(this, position);
        }
    }, {
        key: 'cleanPosition',
        value: function cleanPosition(building) {
            var _this4 = this;

            this.takenPositions.forEach(function (pos, index) {
                if (pos.id === building.getPositionId()) {
                    _this4.takenPositions.splice(index, 1);
                    _this4.availablePositions.push(pos);
                    return;
                }
            });
        }

        /**
         * Start the game by removing all building built during the menu time
         */
    }, {
        key: 'start',
        value: function start() {
            for (var ind = 0; ind < this.scene.meshes.length; ind++) {
                var m = this.scene.meshes[ind];
                if (m instanceof House) {
                    m.dispose();
                }
            }
            // Start the month timer
            this.monthTimer.reset();
            this.monthTimer.start();
            this.buyTimer.reset();
            this.buyTimer.immediate = true;
            this.buyTimer.start();
        }

        /**
         * Increment the month/year timer, and updates the game GUI
         */
    }, {
        key: '_addMonth',
        value: function _addMonth() {
            this.monthTime++;
            this.guiManager.updateGui();
        }

        /**
         * Win the game !
         */
    }, {
        key: 'win',
        value: function win() {
            this.monthTimer.stop();
            this.buyTimer.stop();

            for (var ind = 0; ind < this.scene.meshes.length; ind++) {
                var m = this.scene.meshes[ind];
                if (m instanceof Building) {
                    m.stop();
                }
            }

            // Display score and win screen
            this.guiManager.showWinScreen();
        }
    }], [{
        key: 'randomNumber',
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
//# sourceMappingURL=Game.js.map
