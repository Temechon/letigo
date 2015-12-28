// The function onload is loaded when the DOM has been loaded
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.addEventListener("DOMContentLoaded", function () {
        new Game('game-canvas');
});

var Game = (function () {
        function Game(canvasId) {
                var _this = this;

                _classCallCheck(this, Game);

                var canvas = document.getElementById(canvasId);
                this.engine = new BABYLON.Engine(canvas, true);

                // Contains all loaded assets needed for this state
                this.assets = [];

                // The state scene
                this.scene = null;

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
                        var camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 5, -10), scene);
                        camera.setTarget(BABYLON.Vector3.Zero());
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

                        var box = BABYLON.Mesh.CreateBox('', 1, this.scene);
                }
        }]);

        return Game;
})();
//# sourceMappingURL=Game.js.map
