// The function onload is loaded when the DOM has been loaded
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.addEventListener("DOMContentLoaded", function () {
    new Game('game-canvas');
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
            var camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(9.4, 15, -14), scene);
            camera.rotation.x = 0.5;
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

            //    var meshTask = this.loader.addMeshTask("skull task", "", "./assets/", "block02.babylon");
            //    meshTask.onSuccess = this._initMesh;

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

            for (var x = 0; x < 5; x++) {
                for (var z = 0; z < 5; z++) {
                    var _availablePositions;

                    var cell = new Cell(this);
                    cell.updatePosition(new BABYLON.Vector3(x * 5, 0, z * 5));
                    (_availablePositions = this.availablePositions).push.apply(_availablePositions, _toConsumableArray(cell.positions));
                }
            }
            setInterval(function () {
                _this3.build(_this3.getRandomPosition());
            }, 200);
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
            var ind = Game._randomNumber(0, this.availablePositions.length);
            var res = this.availablePositions.splice(ind, 1)[0];
            this.takenPositions.push(res);
            return res;
        }
    }, {
        key: "build",
        value: function build(position) {
            if (position) {
                var b = new Building(this, position);
                b.spawn();
            }
        }
    }], [{
        key: "_randomNumber",
        value: function _randomNumber(min, max) {
            if (min === max) {
                return min;
            }
            var random = Math.random();
            return Math.floor(random * (max - min) + min);
        }
    }]);

    return Game;
})();
