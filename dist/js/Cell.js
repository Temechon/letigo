/**
 * A cell is a block divided in 4 part where buildings can spawn.
 * The Game instance will keep the link between cell, positions and buildings.
 */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cell = (function (_GameObject) {
    _inherits(Cell, _GameObject);

    function Cell(game) {
        _classCallCheck(this, Cell);

        _get(Object.getPrototypeOf(Cell.prototype), "constructor", this).call(this, game);

        this.position = BABYLON.Vector3.Zero();
        this.size = 4;

        // The list of building available on this cell
        this.buildings = [];

        // Positions available on this cell
        this.positions = null;
        this.updatePosition();

        this.isVisible = true;

        // A cell is a squared plane
        var vd = BABYLON.VertexData.CreateGround({
            width: this.size, height: this.size, subdivisions: 1
        });
        vd.applyToMesh(this, false);

        this.material = new BABYLON.StandardMaterial("", this.getScene());
    }

    _createClass(Cell, [{
        key: "updatePosition",
        value: function updatePosition() {
            var newpos = arguments.length <= 0 || arguments[0] === undefined ? BABYLON.Vector3.Zero() : arguments[0];

            this.position = newpos;
            var hf = this.size / 4;
            this.positions = [new BABYLON.Vector3(this.position.x - hf, this.position.y, this.position.z - hf), new BABYLON.Vector3(this.position.x - hf, this.position.y, this.position.z + hf), new BABYLON.Vector3(this.position.x + hf, this.position.y, this.position.z - hf), new BABYLON.Vector3(this.position.x + hf, this.position.y, this.position.z + hf)];
        }
    }]);

    return Cell;
})(GameObject);
