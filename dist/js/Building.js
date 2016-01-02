/**
 * A building is a structure that can be bought by the player.
 * House and Mansion are two directs subclasses
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

        this.name = 'building';

        // Building position
        this.position = position.position;

        // Position Object
        this._position = position;

        // Knowing if the price is rising of decreasing)
        this._oldPrice = 0;
        this._oldArrow = null;

        // The current price of this building
        this.basePrice = 1000;
        this.price = this.basePrice;
        var dr = this.basePrice / 4;

        // Time to compute the building price
        this._time = 0;

        this.parameters = [0, //Math.random() < 0.5 ? -1 : 1, //inflation
        Game.randomNumber(this.basePrice - dr, this.basePrice + dr), // range
        Math.random(), // frequency 1
        Math.random(), // frequency 2
        Math.random() // frequency 3
        ];

        // Arrows
        this.arrowTag = document.createElement('i');

        // Price label
        this.priceText = document.createElement('span');
        this.priceText.innerHTML = this.basePrice;

        this.priceTag = document.createElement('div');
        this.priceTag.className = 'priceTag';
        this.priceTag.appendChild(this.priceText);
        this.priceTag.appendChild(this.arrowTag);
    }

    _createClass(Building, [{
        key: 'getPositionId',
        value: function getPositionId() {
            return this._position.id;
        }
    }, {
        key: 'displayPrice',
        value: function displayPrice() {
            document.getElementsByTagName('body')[0].appendChild(this.priceTag);
            var p = this._project();

            // center horizontally
            p.x -= this.priceTag.clientWidth / 2;

            this.priceTag.style.top = Math.floor(p.y) + "px";
            this.priceTag.style.left = Math.floor(p.x) + "px";
        }
    }, {
        key: 'updatePrice',
        value: function updatePrice() {
            this._oldPrice = this.price;
            this._time += 0.01;
            this.price = Math.floor(this.basePrice + 1 //this.parameters[0] // inflation
             * this.parameters[1] // range
             * Math.sin(this.parameters[2] * this._time) // frequency 1
            //* Math.cos(this.parameters[3]*this._time)
            //* Math.sin(this.parameters[4]*this._time)
            );

            var arrow = this._oldArrow;
            if (this._oldPrice > this.price) {
                arrow = 'fa fa-arrow-down';
                this._oldArrow = arrow;
            } else if (this._oldPrice < this.price) {
                arrow = 'fa fa-arrow-up';
                this._oldArrow = arrow;
            }
            // display
            this.arrowTag.className = arrow;
            this.priceText.innerHTML = this.price;
        }
    }, {
        key: 'dispose',
        value: function dispose() {

            // remove price tags
            if (this.priceTag.parentNode) {
                this.priceTag.parentNode.removeChild(this.priceTag);
            }
            _get(Object.getPrototypeOf(Building.prototype), 'dispose', this).call(this);
        }

        /**
         * Returns screen coordinates of the building
         */
    }, {
        key: '_project',
        value: function _project() {
            var tmpPos = this.position.clone();
            return BABYLON.Vector3.Project(tmpPos, BABYLON.Matrix.Identity(), this.getScene().getTransformMatrix(), this.getScene().activeCamera.viewport.toGlobal(this.getScene().getEngine()));
        }
    }]);

    return Building;
})(GameObject);
//# sourceMappingURL=Building.js.map
