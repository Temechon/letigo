/**
* Builds a new timer. A timer can delay an action, and repeat this action X times
* @param time The time in milliseconds
* @param scene The scene
* @param callback The callback function called when the timer is finished
* @param options.autostart If set to true, the timer will autostart. False by default.
 *@param options.autodestroy If set to true, the timer will autodestroy at the end of all callback functions. False by default
 *@param options.repeat If set, the callback action will be repeated the specified number of times. 1 by default. Set to -1 if repeat infinitely
*/
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Timer = (function () {
    function Timer(time, scene) {
        var _this = this;

        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        _classCallCheck(this, Timer);

        this._scene = scene;

        this.maxTime = this.currentTime = time;

        // True if the timer is finished, false otherwise
        this.isOver = false;

        // True if the timer is paused, false otherwise
        this.paused = false;

        // True if the timer has been started, false otherwise
        this.started = false;

        // Function to be repeated when the timer is finished
        this.callback = null;

        // Function to be called when the timer is finished (no more repeat counts)
        this.onFinish = null;

        //If set, the callback action will be repeated the specified number of times
        this.repeat = options.repeat || 1;

        this.autostart = options.autostart || false;

        this.autodestroy = options.autodestroy || false;

        this._registeredFunction = function () {
            if (_this.started && !_this.isOver && !_this.paused) {
                _this._update();
            }
        };
        scene.registerBeforeRender(this._registeredFunction);

        // Start the timer is set to autostart
        if (this.autostart) {
            this.start();
        }
    }

    /**
     * Reset the timer
     */

    _createClass(Timer, [{
        key: "reset",
        value: function reset() {
            this.currentTime = this.maxTime;
            this.isOver = false;
            this.started = false;
            this.paused = false;
        }

        /**
         * Start the timer
         */
    }, {
        key: "start",
        value: function start() {
            this.started = true;
        }

        /**
         * Pause the timer
         */
    }, {
        key: "pause",
        value: function pause() {
            this.paused = true;
        }

        /**
         * Stop the timer, and reset it.
         * @param destroy If set to true, the timer is deleted.
         */
    }, {
        key: "stop",
        value: function stop() {
            this.started = false;
            this.reset();
            if (this.autodestroy) {
                this._destroy();
            }
        }

        /**
         * Destory the timer
         * @private
         */
    }, {
        key: "_destroy",
        value: function _destroy() {
            // Unregister update function
            this._scene.unregisterBeforeRender(this._registeredFunction);
        }

        /**
         * Unpause the timer
         */
    }, {
        key: "resume",
        value: function resume() {
            this.paused = false;
        }

        /**
         * The update function
         * @private
         */
    }, {
        key: "_update",
        value: function _update() {

            this.currentTime -= this._scene.getEngine().getDeltaTime();

            if (this.currentTime <= 0) {
                // The delay is finished, run the callback
                this.isOver = true;
                if (this.repeat != -1) {
                    this.repeat--;
                }
                if (this.callback) {
                    this.callback();
                }

                if (this.repeat > 0 || this.repeat == -1) {
                    this.reset();
                    this.start();
                } else {
                    // Call the onFinish action
                    if (this.onFinish) {
                        this.onFinish();
                    }
                    // Autodestroy
                    if (this.autodestroy) {
                        this._destroy();
                    }
                }
            }
        }
    }]);

    return Timer;
})();
//# sourceMappingURL=Timer.js.map
