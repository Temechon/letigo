'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mansion = (function (_Building) {
    _inherits(Mansion, _Building);

    function Mansion(game, position) {
        _classCallCheck(this, Mansion);

        _get(Object.getPrototypeOf(Mansion.prototype), 'constructor', this).call(this, game, position);

        // placeholder shape
        var cube = BABYLON.MeshBuilder.CreateBox('', { width: 0.5, height: 1, depth: 0.5 }, this.getScene());
        cube.position.y = 0.5;
        this.addChildren(cube);
    }

    return Mansion;
})(Building);
//# sourceMappingURL=Mansion.js.map