/**
 * A building is a structure that can be bought by the player
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Building = (function (_GameObject) {
    _inherits(Building, _GameObject);

    function Building(game, position) {
        _classCallCheck(this, Building);

        _get(Object.getPrototypeOf(Building.prototype), 'constructor', this).call(this, game);

        this.position = position;

        // The old price of this building (to know if the price is rising of decreasing)
        this._oldPrice = 0;

        // The price of this building
        this.price = 0;

        // debug
        this.addChildren(BABYLON.MeshBuilder.CreateBox('', { width: 0.5, height: 1, depth: 0.5 }, this.getScene()));

        this.setReady();

        // Arrows
        this.arrowUpTag = document.createElement('i');
        this.arrowUpTag.className = 'fa fa-arrow-up';

        this.arrowDownTag = document.createElement('i');
        this.arrowDownTag.className = 'fa fa-arrow-down';

        // Price label
        this.priceTag = document.createElement('div');
        this.priceTag.className = 'priceTag';
        this.priceTag.innerHTML = "99999";
        this.priceTag.appendChild(this.arrowUpTag);
    }

    _createClass(Building, [{
        key: 'spawn',
        value: function spawn(callback) {
            var _this = this;

            var duration = 1000;
            var fps = 20;
            var quarter = duration * fps * 0.001 / 4;

            if (this.animations.length == 0) {

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
            }

            this.getScene().beginAnimation(this, 0, duration, false, 1, function () {
                _this.displayPrice();
                if (callback) {
                    callback();
                }
            });
        }

        /**
         * Returns screen coordinates of the building
         */
    }, {
        key: '_project',
        value: function _project() {
            //this.scene.updateTransformMatrix();
            var tmpPos = this.position.clone();
            return BABYLON.Vector3.Project(tmpPos, BABYLON.Matrix.Identity(), this.getScene().getTransformMatrix(), this.getScene().activeCamera.viewport.toGlobal(this.getScene().getEngine()));
        }
    }, {
        key: 'displayPrice',
        value: function displayPrice() {
            document.getElementsByTagName('body')[0].appendChild(this.priceTag);
            var p = this._project();

            p.y += this.priceTag.clientHeight / 2;
            p.x -= this.priceTag.clientWidth / 2;

            this.priceTag.style.top = p.y + "px";
            this.priceTag.style.left = p.x + "px";
        }
    }, {
        key: 'updatePrice',
        value: function updatePrice() {
            this.priceTag.innerHTML = this.price;
        }
    }]);

    return Building;
})(GameObject);
//# sourceMappingURL=Building.js.map
