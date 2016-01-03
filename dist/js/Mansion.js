'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mansion = (function (_Building) {
    _inherits(Mansion, _Building);

    function Mansion(game, position) {
        var _this = this;

        _classCallCheck(this, Mansion);

        _get(Object.getPrototypeOf(Mansion.prototype), 'constructor', this).call(this, game, position);

        // mansion shape
        var mansion = this.game.assets['mansion'];
        this.position = mansion.position;
        mansion.position = BABYLON.Vector3.Zero();
        this.addChildren(mansion);

        // Timer to update the building proce
        this.priceTimer = new Timer(100, this.getScene(), { autodestroy: true, repeat: -1 });
        this.priceTimer.callback = function () {
            _this.updatePrice();
        };

        this.basePrice = 10000;

        // Has this building been bought ?
        this.bought = false;

        this.setReady();

        this.priceTimer.start();
        this.displayPrice();
    }

    /**
     *
     */

    _createClass(Mansion, [{
        key: 'buy',
        value: function buy() {
            this.game.win();
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.priceTimer.stop();
        }
    }]);

    return Mansion;
})(Building);
//# sourceMappingURL=Mansion.js.map
