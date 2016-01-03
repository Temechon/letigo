/**
 * Read the babylon file and creates mansion and available positions for building
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CityManager = (function () {
    function CityManager() {
        _classCallCheck(this, CityManager);
    }

    _createClass(CityManager, null, [{
        key: 'NORMAL_POSITION_REGEXP',

        /**
         * Regexp to search for normal position
         */
        value: function NORMAL_POSITION_REGEXP() {
            return (/position(\d+)/i
            );
        }

        /**
         * Return the mesh called 'house'
         */
    }, {
        key: 'HOUSE_REGEXP',
        value: function HOUSE_REGEXP() {
            return (/house/i
            );
        }

        /**
         * Return the mesh called 'mansion'
         */
    }, {
        key: 'MANSION_REGEXP',
        value: function MANSION_REGEXP() {
            return (/mansion/i
            );
        }

        /**
         * Returns the list of position
         * {
         * normal:[],
         * medium:[],
         * high:[]
         * }
         */
    }, {
        key: 'GET_POSITIONS',
        value: function GET_POSITIONS(meshes) {
            var res = {};
            res.normal = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = meshes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var mesh = _step.value;

                    // normal positions
                    var result = CityManager.NORMAL_POSITION_REGEXP().exec(mesh.name);
                    if (result) {
                        res.normal.push(new Position(mesh.position));
                        mesh.dispose();
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return res;
        }
    }, {
        key: 'GET_HOUSE',
        value: function GET_HOUSE(meshes) {
            var res = null;

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = meshes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var mesh = _step2.value;

                    // normal positions
                    var result = CityManager.HOUSE_REGEXP().exec(mesh.name);
                    if (result) {
                        mesh.setEnabled(false);
                        res = mesh;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                        _iterator2['return']();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            if (!res) {
                console.warn('>> house not found!');
            }

            return res;
        }
    }, {
        key: 'GET_MANSION',
        value: function GET_MANSION(meshes) {
            var res = null;

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = meshes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var mesh = _step3.value;

                    // normal positions
                    var result = CityManager.MANSION_REGEXP().exec(mesh.name);
                    if (result) {
                        res = mesh;
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                        _iterator3['return']();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            if (!res) {
                console.warn('>> mansion not found!');
            }

            return res;
        }
    }]);

    return CityManager;
})();
//# sourceMappingURL=CityManager.js.map
