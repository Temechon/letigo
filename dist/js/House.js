'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var House = (function (_Building) {
    _inherits(House, _Building);

    function House(game, position) {
        var _this = this;

        _classCallCheck(this, House);

        _get(Object.getPrototypeOf(House.prototype), 'constructor', this).call(this, game, position);

        // placeholder shape
        this.addChildren(this.game.assets['house'].clone('house'));

        // The time that a house can be bought
        this.canBuyTime = Game.randomNumber(10000, 15000);

        // Timer to check the building end
        this.timer = new Timer(this.canBuyTime, this.getScene(), { autodestroy: true });
        this.timer.onFinish = function () {
            _this.dispose();
        };

        // Timer to update the building proce
        this.priceTimer = new Timer(100, this.getScene(), { autodestroy: true, repeat: -1 });
        this.priceTimer.callback = function () {
            _this.updatePrice();
        };

        // Has this building been bought ?
        this.bought = false;

        this.build();
    }

    /**
     * Overrides mesh.dispose().
     */

    _createClass(House, [{
        key: 'dispose',
        value: function dispose() {
            this.timer.stop();
            this.priceTimer.stop();

            // If the player doesn't want to buy this building, make it disapear
            this.demolish();
        }

        /**
         * Remove this building
         */
    }, {
        key: 'demolish',
        value: function demolish() {
            var _this2 = this;

            var duration = 1000;
            var fps = 20;
            var quarter = duration * fps * 0.001 / 4;

            // remove animations
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
                _get(Object.getPrototypeOf(House.prototype), 'dispose', _this2).call(_this2);
                _this2.game.cleanPosition(_this2);
            });
        }
    }, {
        key: 'build',
        value: function build(callback) {
            var _this3 = this;

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
                _this3.timer.start();
                _this3.priceTimer.start();
                _this3.displayPrice();
                if (callback) {
                    callback();
                }
            });
        }
    }, {
        key: 'buy',
        value: function buy() {
            this.bought = true;

            // Change material
            var red = this.getScene().getMaterialByName('red');
            if (!red) {
                red = new BABYLON.StandardMaterial('red', this.getScene());
                red.emissiveColor = BABYLON.Color3.Red();
                red.specularColor = BABYLON.Color3.Black();
                red.freeze();
            }
            this.material = red;

            // Stop timer that demolish this building
            this.timer.stop();
        }
    }, {
        key: 'stop',
        value: function stop() {
            // Stop timer that demolish this building
            this.timer.stop();
            this.priceTimer.stop();
        }
    }]);

    return House;
})(Building);
//# sourceMappingURL=House.js.map
