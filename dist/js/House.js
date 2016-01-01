"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var House = (function (_Building) {
    _inherits(House, _Building);

    function House(game, position) {
        var _this = this;

        _classCallCheck(this, House);

        _get(Object.getPrototypeOf(House.prototype), "constructor", this).call(this, game, position);

        // placeholder shape
        var cube = BABYLON.MeshBuilder.CreateBox('', { width: 0.5, height: 1, depth: 0.5 }, this.getScene());
        cube.position.y = 0.5;
        this.addChildren(cube);

        // The time that a house can be bought
        this.canBuyTime = Game.randomNumber(5000, 10000);
        this.timer = new Timer(this.canBuyTime, this.getScene(), { autostart: true, autodestroy: true });
        this.timer.onFinish = function () {
            _this.dispose();
        };
        this.timer.start();

        // Has this building been bought ?
        this.bought = false;

        this.build();
    }

    /**
     * Overrides mesh.dispose().
     */

    _createClass(House, [{
        key: "dispose",
        value: function dispose() {
            var _this2 = this;

            // If the player doesn't want to buy this building, make it disapear
            this.demolish(function () {
                _get(Object.getPrototypeOf(House.prototype), "dispose", _this2).call(_this2);
                _this2.game.cleanPosition(_this2);
            });
        }

        /**
         * Remove this building
         */
    }, {
        key: "demolish",
        value: function demolish(callback) {

            var duration = 1000;
            var fps = 20;
            var quarter = duration * fps * 0.001 / 4;

            this.animations = [];
            // Position animation
            var position = new BABYLON.Animation("", "position.y", fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            position.setKeys([{ frame: 0, value: this.position.y }, { frame: quarter, value: this.position.y + 1 }, { frame: quarter * 4, value: 0 }]);
            var e = new BABYLON.CubicEase();
            e.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            position.setEasingFunction(e);
            this.animations.push(position);

            // Scaling
            var scaling = new BABYLON.Animation("", "scaling", fps, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            scaling.setKeys([{ frame: 0, value: new BABYLON.Vector3(1, 1, 1) }, { frame: quarter * 2, value: new BABYLON.Vector3(1.2, 1.2, 1.2) }, { frame: quarter * 4, value: BABYLON.Vector3.Zero() }]);
            this.animations.push(scaling);

            // Rotation
            var rotation = new BABYLON.Animation("", "rotation.y", fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            rotation.setKeys([{ frame: 0, value: 0 }, { frame: quarter * 4, value: Math.PI * 2 }]);
            rotation.setEasingFunction(e);
            this.animations.push(rotation);

            this.getScene().beginAnimation(this, 0, duration, false, 1, function () {
                callback();
            });
        }
    }, {
        key: "build",
        value: function build(callback) {
            var duration = 1000;
            var fps = 20;
            var quarter = duration * fps * 0.001 / 4;

            this.animations = [];
            // Position animation
            var position = new BABYLON.Animation("", "position.y", fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            position.setKeys([{ frame: 0, value: 0 }, { frame: quarter, value: this.position.y + 1 }, { frame: quarter * 4, value: this.position.y }]);
            var e = new BABYLON.CubicEase();
            e.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            position.setEasingFunction(e);
            this.animations.push(position);

            // Scaling
            var scaling = new BABYLON.Animation("", "scaling", fps, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            scaling.setKeys([{ frame: 0, value: BABYLON.Vector3.Zero() }, { frame: quarter * 3, value: new BABYLON.Vector3(1.2, 1.2, 1.2) }, { frame: quarter * 4, value: new BABYLON.Vector3(1, 1, 1) }]);
            var f = new BABYLON.ElasticEase();
            f.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
            scaling.setEasingFunction(f);
            this.animations.push(scaling);

            // Rotation
            var rotation = new BABYLON.Animation("", "rotation.y", fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            rotation.setKeys([{ frame: 0, value: 0 }, { frame: quarter * 4, value: Math.PI * 2 }]);
            rotation.setEasingFunction(e);
            this.animations.push(rotation);

            this.getScene().beginAnimation(this, 0, duration, false, 1, function () {
                //this.displayPrice();
                if (callback) {
                    callback();
                }
            });
        }

        /**
         * Returns screen coordinates of the building
         */
    }, {
        key: "_project",
        value: function _project() {
            var tmpPos = this.position.clone();
            return BABYLON.Vector3.Project(tmpPos, BABYLON.Matrix.Identity(), this.getScene().getTransformMatrix(), this.getScene().activeCamera.viewport.toGlobal(this.getScene().getEngine()));
        }
    }]);

    return House;
})(Building);
