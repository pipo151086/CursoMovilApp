// ProgressBar.js 1.0.0
// https://kimmobrunfeldt.github.io/progressbar.js
// License: MIT

!function (e) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else { var f; "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), f.ProgressBar = e() } }(function () {
    var define, module, exports; return (function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++)s(r[o]); return s })({
        1: [function (require, module, exports) {
            /* shifty - v1.5.2 - 2016-02-10 - http://jeremyckahn.github.io/shifty */
            ; (function () {
                var root = this || Function('return this')();

                /**
                 * Shifty Core
                 * By Jeremy Kahn - jeremyckahn@gmail.com
                 */

                var Tweenable = (function () {

                    'use strict';

                    // Aliases that get defined later in this function
                    var formula;

                    // CONSTANTS
                    var DEFAULT_SCHEDULE_FUNCTION;
                    var DEFAULT_EASING = 'linear';
                    var DEFAULT_DURATION = 500;
                    var UPDATE_TIME = 1000 / 60;

                    var _now = Date.now
                        ? Date.now
                        : function () { return +new Date(); };

                    var now = typeof SHIFTY_DEBUG_NOW !== 'undefined' ? SHIFTY_DEBUG_NOW : _now;

                    if (typeof window !== 'undefined') {
                        // requestAnimationFrame() shim by Paul Irish (modified for Shifty)
                        // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
                        DEFAULT_SCHEDULE_FUNCTION = window.requestAnimationFrame
                            || window.webkitRequestAnimationFrame
                            || window.oRequestAnimationFrame
                            || window.msRequestAnimationFrame
                            || (window.mozCancelRequestAnimationFrame
                                && window.mozRequestAnimationFrame)
                            || setTimeout;
                    } else {
                        DEFAULT_SCHEDULE_FUNCTION = setTimeout;
                    }

                    function noop() {
                        // NOOP!
                    }

                    /**
                     * Handy shortcut for doing a for-in loop. This is not a "normal" each
                     * function, it is optimized for Shifty.  The iterator function only receives
                     * the property name, not the value.
                     * @param {Object} obj
                     * @param {Function(string)} fn
                     * @private
                     */
                    function each(obj, fn) {
                        var key;
                        for (key in obj) {
                            if (Object.hasOwnProperty.call(obj, key)) {
                                fn(key);
                            }
                        }
                    }

                    /**
                     * Perform a shallow copy of Object properties.
                     * @param {Object} targetObject The object to copy into
                     * @param {Object} srcObject The object to copy from
                     * @return {Object} A reference to the augmented `targetObj` Object
                     * @private
                     */
                    function shallowCopy(targetObj, srcObj) {
                        each(srcObj, function (prop) {
                            targetObj[prop] = srcObj[prop];
                        });

                        return targetObj;
                    }

                    /**
                     * Copies each property from src onto target, but only if the property to
                     * copy to target is undefined.
                     * @param {Object} target Missing properties in this Object are filled in
                     * @param {Object} src
                     * @private
                     */
                    function defaults(target, src) {
                        each(src, function (prop) {
                            if (typeof target[prop] === 'undefined') {
                                target[prop] = src[prop];
                            }
                        });
                    }

                    /**
                     * Calculates the interpolated tween values of an Object for a given
                     * timestamp.
                     * @param {Number} forPosition The position to compute the state for.
                     * @param {Object} currentState Current state properties.
                     * @param {Object} originalState: The original state properties the Object is
                     * tweening from.
                     * @param {Object} targetState: The destination state properties the Object
                     * is tweening to.
                     * @param {number} duration: The length of the tween in milliseconds.
                     * @param {number} timestamp: The UNIX epoch time at which the tween began.
                     * @param {Object} easing: This Object's keys must correspond to the keys in
                     * targetState.
                     * @private
                     */
                    function tweenProps(forPosition, currentState, originalState, targetState,
                        duration, timestamp, easing) {
                        var normalizedPosition =
                            forPosition < timestamp ? 0 : (forPosition - timestamp) / duration;


                        var prop;
                        var easingObjectProp;
                        var easingFn;
                        for (prop in currentState) {
                            if (currentState.hasOwnProperty(prop)) {
                                easingObjectProp = easing[prop];
                                easingFn = typeof easingObjectProp === 'function'
                                    ? easingObjectProp
                                    : formula[easingObjectProp];

                                currentState[prop] = tweenProp(
                                    originalState[prop],
                                    targetState[prop],
                                    easingFn,
                                    normalizedPosition
                                );
                            }
                        }

                        return currentState;
                    }

                    /**
                     * Tweens a single property.
                     * @param {number} start The value that the tween started from.
                     * @param {number} end The value that the tween should end at.
                     * @param {Function} easingFunc The easing curve to apply to the tween.
                     * @param {number} position The normalized position (between 0.0 and 1.0) to
                     * calculate the midpoint of 'start' and 'end' against.
                     * @return {number} The tweened value.
                     * @private
                     */
                    function tweenProp(start, end, easingFunc, position) {
                        return start + (end - start) * easingFunc(position);
                    }

                    /**
                     * Applies a filter to Tweenable instance.
                     * @param {Tweenable} tweenable The `Tweenable` instance to call the filter
                     * upon.
                     * @param {String} filterName The name of the filter to apply.
                     * @private
                     */
                    function applyFilter(tweenable, filterName) {
                        var filters = Tweenable.prototype.filter;
                        var args = tweenable._filterArgs;

                        each(filters, function (name) {
                            if (typeof filters[name][filterName] !== 'undefined') {
                                filters[name][filterName].apply(tweenable, args);
                            }
                        });
                    }

                    var timeoutHandler_endTime;
                    var timeoutHandler_currentTime;
                    var timeoutHandler_isEnded;
                    var timeoutHandler_offset;
                    /**
                     * Handles the update logic for one step of a tween.
                     * @param {Tweenable} tweenable
                     * @param {number} timestamp
                     * @param {number} delay
                     * @param {number} duration
                     * @param {Object} currentState
                     * @param {Object} originalState
                     * @param {Object} targetState
                     * @param {Object} easing
                     * @param {Function(Object, *, number)} step
                     * @param {Function(Function,number)}} schedule
                     * @param {number=} opt_currentTimeOverride Needed for accurate timestamp in
                     * Tweenable#seek.
                     * @private
                     */
                    function timeoutHandler(tweenable, timestamp, delay, duration, currentState,
                        originalState, targetState, easing, step, schedule,
                        opt_currentTimeOverride) {

                        timeoutHandler_endTime = timestamp + delay + duration;

                        timeoutHandler_currentTime =
                            Math.min(opt_currentTimeOverride || now(), timeoutHandler_endTime);

                        timeoutHandler_isEnded =
                            timeoutHandler_currentTime >= timeoutHandler_endTime;

                        timeoutHandler_offset = duration - (
                            timeoutHandler_endTime - timeoutHandler_currentTime);

                        if (tweenable.isPlaying()) {
                            if (timeoutHandler_isEnded) {
                                step(targetState, tweenable._attachment, timeoutHandler_offset);
                                tweenable.stop(true);
                            } else {
                                tweenable._scheduleId =
                                    schedule(tweenable._timeoutHandler, UPDATE_TIME);

                                applyFilter(tweenable, 'beforeTween');

                                // If the animation has not yet reached the start point (e.g., there was
                                // delay that has not yet completed), just interpolate the starting
                                // position of the tween.
                                if (timeoutHandler_currentTime < (timestamp + delay)) {
                                    tweenProps(1, currentState, originalState, targetState, 1, 1, easing);
                                } else {
                                    tweenProps(timeoutHandler_currentTime, currentState, originalState,
                                        targetState, duration, timestamp + delay, easing);
                                }

                                applyFilter(tweenable, 'afterTween');

                                step(currentState, tweenable._attachment, timeoutHandler_offset);
                            }
                        }
                    }


                    /**
                     * Creates a usable easing Object from a string, a function or another easing
                     * Object.  If `easing` is an Object, then this function clones it and fills
                     * in the missing properties with `"linear"`.
                     * @param {Object.<string|Function>} fromTweenParams
                     * @param {Object|string|Function} easing
                     * @return {Object.<string|Function>}
                     * @private
                     */
                    function composeEasingObject(fromTweenParams, easing) {
                        var composedEasing = {};
                        var typeofEasing = typeof easing;

                        if (typeofEasing === 'string' || typeofEasing === 'function') {
                            each(fromTweenParams, function (prop) {
                                composedEasing[prop] = easing;
                            });
                        } else {
                            each(fromTweenParams, function (prop) {
                                if (!composedEasing[prop]) {
                                    composedEasing[prop] = easing[prop] || DEFAULT_EASING;
                                }
                            });
                        }

                        return composedEasing;
                    }

                    /**
                     * Tweenable constructor.
                     * @class Tweenable
                     * @param {Object=} opt_initialState The values that the initial tween should
                     * start at if a `from` object is not provided to `{{#crossLink
                     * "Tweenable/tween:method"}}{{/crossLink}}` or `{{#crossLink
                     * "Tweenable/setConfig:method"}}{{/crossLink}}`.
                     * @param {Object=} opt_config Configuration object to be passed to
                     * `{{#crossLink "Tweenable/setConfig:method"}}{{/crossLink}}`.
                     * @module Tweenable
                     * @constructor
                     */
                    function Tweenable(opt_initialState, opt_config) {
                        this._currentState = opt_initialState || {};
                        this._configured = false;
                        this._scheduleFunction = DEFAULT_SCHEDULE_FUNCTION;

                        // To prevent unnecessary calls to setConfig do not set default
                        // configuration here.  Only set default configuration immediately before
                        // tweening if none has been set.
                        if (typeof opt_config !== 'undefined') {
                            this.setConfig(opt_config);
                        }
                    }

                    /**
                     * Configure and start a tween.
                     * @method tween
                     * @param {Object=} opt_config Configuration object to be passed to
                     * `{{#crossLink "Tweenable/setConfig:method"}}{{/crossLink}}`.
                     * @chainable
                     */
                    Tweenable.prototype.tween = function (opt_config) {
                        if (this._isTweening) {
                            return this;
                        }

                        // Only set default config if no configuration has been set previously and
                        // none is provided now.
                        if (opt_config !== undefined || !this._configured) {
                            this.setConfig(opt_config);
                        }

                        this._timestamp = now();
                        this._start(this.get(), this._attachment);
                        return this.resume();
                    };

                    /**
                     * Configure a tween that will start at some point in the future.
                     *
                     * @method setConfig
                     * @param {Object} config The following values are valid:
                     * - __from__ (_Object=_): Starting position.  If omitted, `{{#crossLink
                     *   "Tweenable/get:method"}}get(){{/crossLink}}` is used.
                     * - __to__ (_Object=_): Ending position.
                     * - __duration__ (_number=_): How many milliseconds to animate for.
                     * - __delay__ (_delay=_): How many milliseconds to wait before starting the
                     *   tween.
                     * - __start__ (_Function(Object, *)_): Function to execute when the tween
                     *   begins.  Receives the state of the tween as the first parameter and
                     *   `attachment` as the second parameter.
                     * - __step__ (_Function(Object, *, number)_): Function to execute on every
                     *   tick.  Receives `{{#crossLink
                     *   "Tweenable/get:method"}}get(){{/crossLink}}` as the first parameter,
                     *   `attachment` as the second parameter, and the time elapsed since the
                     *   start of the tween as the third. This function is not called on the
                     *   final step of the animation, but `finish` is.
                     * - __finish__ (_Function(Object, *)_): Function to execute upon tween
                     *   completion.  Receives the state of the tween as the first parameter and
                     *   `attachment` as the second parameter.
                     * - __easing__ (_Object.<string|Function>|string|Function=_): Easing curve
                     *   name(s) or function(s) to use for the tween.
                     * - __attachment__ (_*_): Cached value that is passed to the
                     *   `step`/`start`/`finish` methods.
                     * @chainable
                     */
                    Tweenable.prototype.setConfig = function (config) {
                        config = config || {};
                        this._configured = true;

                        // Attach something to this Tweenable instance (e.g.: a DOM element, an
                        // object, a string, etc.);
                        this._attachment = config.attachment;

                        // Init the internal state
                        this._pausedAtTime = null;
                        this._scheduleId = null;
                        this._delay = config.delay || 0;
                        this._start = config.start || noop;
                        this._step = config.step || noop;
                        this._finish = config.finish || noop;
                        this._duration = config.duration || DEFAULT_DURATION;
                        this._currentState = shallowCopy({}, config.from) || this.get();
                        this._originalState = this.get();
                        this._targetState = shallowCopy({}, config.to) || this.get();

                        var self = this;
                        this._timeoutHandler = function () {
                            timeoutHandler(self,
                                self._timestamp,
                                self._delay,
                                self._duration,
                                self._currentState,
                                self._originalState,
                                self._targetState,
                                self._easing,
                                self._step,
                                self._scheduleFunction
                            );
                        };

                        // Aliases used below
                        var currentState = this._currentState;
                        var targetState = this._targetState;

                        // Ensure that there is always something to tween to.
                        defaults(targetState, currentState);

                        this._easing = composeEasingObject(
                            currentState, config.easing || DEFAULT_EASING);

                        this._filterArgs =
                            [currentState, this._originalState, targetState, this._easing];

                        applyFilter(this, 'tweenCreated');
                        return this;
                    };

                    /**
                     * @method get
                     * @return {Object} The current state.
                     */
                    Tweenable.prototype.get = function () {
                        return shallowCopy({}, this._currentState);
                    };

                    /**
                     * @method set
                     * @param {Object} state The current state.
                     */
                    Tweenable.prototype.set = function (state) {
                        this._currentState = state;
                    };

                    /**
                     * Pause a tween.  Paused tweens can be resumed from the point at which they
                     * were paused.  This is different from `{{#crossLink
                     * "Tweenable/stop:method"}}{{/crossLink}}`, as that method
                     * causes a tween to start over when it is resumed.
                     * @method pause
                     * @chainable
                     */
                    Tweenable.prototype.pause = function () {
                        this._pausedAtTime = now();
                        this._isPaused = true;
                        return this;
                    };

                    /**
                     * Resume a paused tween.
                     * @method resume
                     * @chainable
                     */
                    Tweenable.prototype.resume = function () {
                        if (this._isPaused) {
                            this._timestamp += now() - this._pausedAtTime;
                        }

                        this._isPaused = false;
                        this._isTweening = true;

                        this._timeoutHandler();

                        return this;
                    };

                    /**
                     * Move the state of the animation to a specific point in the tween's
                     * timeline.  If the animation is not running, this will cause the `step`
                     * handlers to be called.
                     * @method seek
                     * @param {millisecond} millisecond The millisecond of the animation to seek
                     * to.  This must not be less than `0`.
                     * @chainable
                     */
                    Tweenable.prototype.seek = function (millisecond) {
                        millisecond = Math.max(millisecond, 0);
                        var currentTime = now();

                        if ((this._timestamp + millisecond) === 0) {
                            return this;
                        }

                        this._timestamp = currentTime - millisecond;

                        if (!this.isPlaying()) {
                            this._isTweening = true;
                            this._isPaused = false;

                            // If the animation is not running, call timeoutHandler to make sure that
                            // any step handlers are run.
                            timeoutHandler(this,
                                this._timestamp,
                                this._delay,
                                this._duration,
                                this._currentState,
                                this._originalState,
                                this._targetState,
                                this._easing,
                                this._step,
                                this._scheduleFunction,
                                currentTime
                            );

                            this.pause();
                        }

                        return this;
                    };

                    /**
                     * Stops and cancels a tween.
                     * @param {boolean=} gotoEnd If `false` or omitted, the tween just stops at
                     * its current state, and the `finish` handler is not invoked.  If `true`,
                     * the tweened object's values are instantly set to the target values, and
                     * `finish` is invoked.
                     * @method stop
                     * @chainable
                     */
                    Tweenable.prototype.stop = function (gotoEnd) {
                        this._isTweening = false;
                        this._isPaused = false;
                        this._timeoutHandler = noop;

                        (root.cancelAnimationFrame ||
                            root.webkitCancelAnimationFrame ||
                            root.oCancelAnimationFrame ||
                            root.msCancelAnimationFrame ||
                            root.mozCancelRequestAnimationFrame ||
                            root.clearTimeout)(this._scheduleId);

                        if (gotoEnd) {
                            applyFilter(this, 'beforeTween');
                            tweenProps(
                                1,
                                this._currentState,
                                this._originalState,
                                this._targetState,
                                1,
                                0,
                                this._easing
                            );
                            applyFilter(this, 'afterTween');
                            applyFilter(this, 'afterTweenEnd');
                            this._finish.call(this, this._currentState, this._attachment);
                        }

                        return this;
                    };

                    /**
                     * @method isPlaying
                     * @return {boolean} Whether or not a tween is running.
                     */
                    Tweenable.prototype.isPlaying = function () {
                        return this._isTweening && !this._isPaused;
                    };

                    /**
                     * Set a custom schedule function.
                     *
                     * If a custom function is not set,
                     * [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame)
                     * is used if available, otherwise
                     * [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/Window.setTimeout)
                     * is used.
                     * @method setScheduleFunction
                     * @param {Function(Function,number)} scheduleFunction The function to be
                     * used to schedule the next frame to be rendered.
                     */
                    Tweenable.prototype.setScheduleFunction = function (scheduleFunction) {
                        this._scheduleFunction = scheduleFunction;
                    };

                    /**
                     * `delete` all "own" properties.  Call this when the `Tweenable` instance
                     * is no longer needed to free memory.
                     * @method dispose
                     */
                    Tweenable.prototype.dispose = function () {
                        var prop;
                        for (prop in this) {
                            if (this.hasOwnProperty(prop)) {
                                delete this[prop];
                            }
                        }
                    };

                    /**
                     * Filters are used for transforming the properties of a tween at various
                     * points in a Tweenable's life cycle.  See the README for more info on this.
                     * @private
                     */
                    Tweenable.prototype.filter = {};

                    /**
                     * This object contains all of the tweens available to Shifty.  It is
                     * extensible - simply attach properties to the `Tweenable.prototype.formula`
                     * Object following the same format as `linear`.
                     *
                     * `pos` should be a normalized `number` (between 0 and 1).
                     * @property formula
                     * @type {Object(function)}
                     */
                    Tweenable.prototype.formula = {
                        linear: function (pos) {
                            return pos;
                        }
                    };

                    formula = Tweenable.prototype.formula;

                    shallowCopy(Tweenable, {
                        'now': now
                        , 'each': each
                        , 'tweenProps': tweenProps
                        , 'tweenProp': tweenProp
                        , 'applyFilter': applyFilter
                        , 'shallowCopy': shallowCopy
                        , 'defaults': defaults
                        , 'composeEasingObject': composeEasingObject
                    });

                    // `root` is provided in the intro/outro files.

                    // A hook used for unit testing.
                    if (typeof SHIFTY_DEBUG_NOW === 'function') {
                        root.timeoutHandler = timeoutHandler;
                    }

                    // Bootstrap Tweenable appropriately for the environment.
                    if (typeof exports === 'object') {
                        // CommonJS
                        module.exports = Tweenable;
                    } else if (typeof define === 'function' && define.amd) {
                        // AMD
                        define(function () { return Tweenable; });
                    } else if (typeof root.Tweenable === 'undefined') {
                        // Browser: Make `Tweenable` globally accessible.
                        root.Tweenable = Tweenable;
                    }

                    return Tweenable;

                }());

                /*!
                 * All equations are adapted from Thomas Fuchs'
                 * [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/penner.js).
                 *
                 * Based on Easing Equations (c) 2003 [Robert
                 * Penner](http://www.robertpenner.com/), all rights reserved. This work is
                 * [subject to terms](http://www.robertpenner.com/easing_terms_of_use.html).
                 */

                /*!
                 *  TERMS OF USE - EASING EQUATIONS
                 *  Open source under the BSD License.
                 *  Easing Equations (c) 2003 Robert Penner, all rights reserved.
                 */

                ; (function () {

                    Tweenable.shallowCopy(Tweenable.prototype.formula, {
                        easeInQuad: function (pos) {
                            return Math.pow(pos, 2);
                        },

                        easeOutQuad: function (pos) {
                            return -(Math.pow((pos - 1), 2) - 1);
                        },

                        easeInOutQuad: function (pos) {
                            if ((pos /= 0.5) < 1) { return 0.5 * Math.pow(pos, 2); }
                            return -0.5 * ((pos -= 2) * pos - 2);
                        },

                        easeInCubic: function (pos) {
                            return Math.pow(pos, 3);
                        },

                        easeOutCubic: function (pos) {
                            return (Math.pow((pos - 1), 3) + 1);
                        },

                        easeInOutCubic: function (pos) {
                            if ((pos /= 0.5) < 1) { return 0.5 * Math.pow(pos, 3); }
                            return 0.5 * (Math.pow((pos - 2), 3) + 2);
                        },

                        easeInQuart: function (pos) {
                            return Math.pow(pos, 4);
                        },

                        easeOutQuart: function (pos) {
                            return -(Math.pow((pos - 1), 4) - 1);
                        },

                        easeInOutQuart: function (pos) {
                            if ((pos /= 0.5) < 1) { return 0.5 * Math.pow(pos, 4); }
                            return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
                        },

                        easeInQuint: function (pos) {
                            return Math.pow(pos, 5);
                        },

                        easeOutQuint: function (pos) {
                            return (Math.pow((pos - 1), 5) + 1);
                        },

                        easeInOutQuint: function (pos) {
                            if ((pos /= 0.5) < 1) { return 0.5 * Math.pow(pos, 5); }
                            return 0.5 * (Math.pow((pos - 2), 5) + 2);
                        },

                        easeInSine: function (pos) {
                            return -Math.cos(pos * (Math.PI / 2)) + 1;
                        },

                        easeOutSine: function (pos) {
                            return Math.sin(pos * (Math.PI / 2));
                        },

                        easeInOutSine: function (pos) {
                            return (-0.5 * (Math.cos(Math.PI * pos) - 1));
                        },

                        easeInExpo: function (pos) {
                            return (pos === 0) ? 0 : Math.pow(2, 10 * (pos - 1));
                        },

                        easeOutExpo: function (pos) {
                            return (pos === 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
                        },

                        easeInOutExpo: function (pos) {
                            if (pos === 0) { return 0; }
                            if (pos === 1) { return 1; }
                            if ((pos /= 0.5) < 1) { return 0.5 * Math.pow(2, 10 * (pos - 1)); }
                            return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
                        },

                        easeInCirc: function (pos) {
                            return -(Math.sqrt(1 - (pos * pos)) - 1);
                        },

                        easeOutCirc: function (pos) {
                            return Math.sqrt(1 - Math.pow((pos - 1), 2));
                        },

                        easeInOutCirc: function (pos) {
                            if ((pos /= 0.5) < 1) { return -0.5 * (Math.sqrt(1 - pos * pos) - 1); }
                            return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
                        },

                        easeOutBounce: function (pos) {
                            if ((pos) < (1 / 2.75)) {
                                return (7.5625 * pos * pos);
                            } else if (pos < (2 / 2.75)) {
                                return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
                            } else if (pos < (2.5 / 2.75)) {
                                return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
                            } else {
                                return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
                            }
                        },

                        easeInBack: function (pos) {
                            var s = 1.70158;
                            return (pos) * pos * ((s + 1) * pos - s);
                        },

                        easeOutBack: function (pos) {
                            var s = 1.70158;
                            return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
                        },

                        easeInOutBack: function (pos) {
                            var s = 1.70158;
                            if ((pos /= 0.5) < 1) {
                                return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));
                            }
                            return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
                        },

                        elastic: function (pos) {
                            // jshint maxlen:90
                            return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
                        },

                        swingFromTo: function (pos) {
                            var s = 1.70158;
                            return ((pos /= 0.5) < 1) ?
                                0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) :
                                0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
                        },

                        swingFrom: function (pos) {
                            var s = 1.70158;
                            return pos * pos * ((s + 1) * pos - s);
                        },

                        swingTo: function (pos) {
                            var s = 1.70158;
                            return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
                        },

                        bounce: function (pos) {
                            if (pos < (1 / 2.75)) {
                                return (7.5625 * pos * pos);
                            } else if (pos < (2 / 2.75)) {
                                return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
                            } else if (pos < (2.5 / 2.75)) {
                                return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
                            } else {
                                return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
                            }
                        },

                        bouncePast: function (pos) {
                            if (pos < (1 / 2.75)) {
                                return (7.5625 * pos * pos);
                            } else if (pos < (2 / 2.75)) {
                                return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
                            } else if (pos < (2.5 / 2.75)) {
                                return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
                            } else {
                                return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
                            }
                        },

                        easeFromTo: function (pos) {
                            if ((pos /= 0.5) < 1) { return 0.5 * Math.pow(pos, 4); }
                            return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
                        },

                        easeFrom: function (pos) {
                            return Math.pow(pos, 4);
                        },

                        easeTo: function (pos) {
                            return Math.pow(pos, 0.25);
                        }
                    });

                }());


                ; (function () {
                    // port of webkit cubic bezier handling by http://www.netzgesta.de/dev/
                    function cubicBezierAtTime(t, p1x, p1y, p2x, p2y, duration) {
                        var ax = 0, bx = 0, cx = 0, ay = 0, by = 0, cy = 0;
                        function sampleCurveX(t) {
                            return ((ax * t + bx) * t + cx) * t;
                        }
                        function sampleCurveY(t) {
                            return ((ay * t + by) * t + cy) * t;
                        }
                        function sampleCurveDerivativeX(t) {
                            return (3.0 * ax * t + 2.0 * bx) * t + cx;
                        }
                        function solveEpsilon(duration) {
                            return 1.0 / (200.0 * duration);
                        }
                        function solve(x, epsilon) {
                            return sampleCurveY(solveCurveX(x, epsilon));
                        }
                        function fabs(n) {
                            if (n >= 0) {
                                return n;
                            } else {
                                return 0 - n;
                            }
                        }
                        function solveCurveX(x, epsilon) {
                            var t0, t1, t2, x2, d2, i;
                            for (t2 = x, i = 0; i < 8; i++) {
                                x2 = sampleCurveX(t2) - x;
                                if (fabs(x2) < epsilon) {
                                    return t2;
                                }
                                d2 = sampleCurveDerivativeX(t2);
                                if (fabs(d2) < 1e-6) {
                                    break;
                                }
                                t2 = t2 - x2 / d2;
                            }
                            t0 = 0.0;
                            t1 = 1.0;
                            t2 = x;
                            if (t2 < t0) {
                                return t0;
                            }
                            if (t2 > t1) {
                                return t1;
                            }
                            while (t0 < t1) {
                                x2 = sampleCurveX(t2);
                                if (fabs(x2 - x) < epsilon) {
                                    return t2;
                                }
                                if (x > x2) {
                                    t0 = t2;
                                } else {
                                    t1 = t2;
                                }
                                t2 = (t1 - t0) * 0.5 + t0;
                            }
                            return t2; // Failure.
                        }
                        cx = 3.0 * p1x;
                        bx = 3.0 * (p2x - p1x) - cx;
                        ax = 1.0 - cx - bx;
                        cy = 3.0 * p1y;
                        by = 3.0 * (p2y - p1y) - cy;
                        ay = 1.0 - cy - by;
                        return solve(t, solveEpsilon(duration));
                    }
                    /**
                     *  getCubicBezierTransition(x1, y1, x2, y2) -> Function
                     *
                     *  Generates a transition easing function that is compatible
                     *  with WebKit's CSS transitions `-webkit-transition-timing-function`
                     *  CSS property.
                     *
                     *  The W3C has more information about CSS3 transition timing functions:
                     *  http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
                     *
                     *  @param {number} x1
                     *  @param {number} y1
                     *  @param {number} x2
                     *  @param {number} y2
                     *  @return {function}
                     *  @private
                     */
                    function getCubicBezierTransition(x1, y1, x2, y2) {
                        return function (pos) {
                            return cubicBezierAtTime(pos, x1, y1, x2, y2, 1);
                        };
                    }
                    // End ported code

                    /**
                     * Create a Bezier easing function and attach it to `{{#crossLink
                     * "Tweenable/formula:property"}}Tweenable#formula{{/crossLink}}`.  This
                     * function gives you total control over the easing curve.  Matthew Lein's
                     * [Ceaser](http://matthewlein.com/ceaser/) is a useful tool for visualizing
                     * the curves you can make with this function.
                     * @method setBezierFunction
                     * @param {string} name The name of the easing curve.  Overwrites the old
                     * easing function on `{{#crossLink
                     * "Tweenable/formula:property"}}Tweenable#formula{{/crossLink}}` if it
                     * exists.
                     * @param {number} x1
                     * @param {number} y1
                     * @param {number} x2
                     * @param {number} y2
                     * @return {function} The easing function that was attached to
                     * Tweenable.prototype.formula.
                     */
                    Tweenable.setBezierFunction = function (name, x1, y1, x2, y2) {
                        var cubicBezierTransition = getCubicBezierTransition(x1, y1, x2, y2);
                        cubicBezierTransition.displayName = name;
                        cubicBezierTransition.x1 = x1;
                        cubicBezierTransition.y1 = y1;
                        cubicBezierTransition.x2 = x2;
                        cubicBezierTransition.y2 = y2;

                        return Tweenable.prototype.formula[name] = cubicBezierTransition;
                    };


                    /**
                     * `delete` an easing function from `{{#crossLink
                     * "Tweenable/formula:property"}}Tweenable#formula{{/crossLink}}`.  Be
                     * careful with this method, as it `delete`s whatever easing formula matches
                     * `name` (which means you can delete standard Shifty easing functions).
                     * @method unsetBezierFunction
                     * @param {string} name The name of the easing function to delete.
                     * @return {function}
                     */
                    Tweenable.unsetBezierFunction = function (name) {
                        delete Tweenable.prototype.formula[name];
                    };

                })();

                ; (function () {

                    function getInterpolatedValues(
                        from, current, targetState, position, easing, delay) {
                        return Tweenable.tweenProps(
                            position, current, from, targetState, 1, delay, easing);
                    }

                    // Fake a Tweenable and patch some internals.  This approach allows us to
                    // skip uneccessary processing and object recreation, cutting down on garbage
                    // collection pauses.
                    var mockTweenable = new Tweenable();
                    mockTweenable._filterArgs = [];

                    /**
                     * Compute the midpoint of two Objects.  This method effectively calculates a
                     * specific frame of animation that `{{#crossLink
                     * "Tweenable/tween:method"}}{{/crossLink}}` does many times over the course
                     * of a full tween.
                     *
                     *     var interpolatedValues = Tweenable.interpolate({
                     *       width: '100px',
                     *       opacity: 0,
                     *       color: '#fff'
                     *     }, {
                     *       width: '200px',
                     *       opacity: 1,
                     *       color: '#000'
                     *     }, 0.5);
                     *
                     *     console.log(interpolatedValues);
                     *     // {opacity: 0.5, width: "150px", color: "rgb(127,127,127)"}
                     *
                     * @static
                     * @method interpolate
                     * @param {Object} from The starting values to tween from.
                     * @param {Object} targetState The ending values to tween to.
                     * @param {number} position The normalized position value (between `0.0` and
                     * `1.0`) to interpolate the values between `from` and `to` for.  `from`
                     * represents `0` and `to` represents `1`.
                     * @param {Object.<string|Function>|string|Function} easing The easing
                     * curve(s) to calculate the midpoint against.  You can reference any easing
                     * function attached to `Tweenable.prototype.formula`, or provide the easing
                     * function(s) directly.  If omitted, this defaults to "linear".
                     * @param {number=} opt_delay Optional delay to pad the beginning of the
                     * interpolated tween with.  This increases the range of `position` from (`0`
                     * through `1`) to (`0` through `1 + opt_delay`).  So, a delay of `0.5` would
                     * increase all valid values of `position` to numbers between `0` and `1.5`.
                     * @return {Object}
                     */
                    Tweenable.interpolate = function (
                        from, targetState, position, easing, opt_delay) {

                        var current = Tweenable.shallowCopy({}, from);
                        var delay = opt_delay || 0;
                        var easingObject = Tweenable.composeEasingObject(
                            from, easing || 'linear');

                        mockTweenable.set({});

                        // Alias and reuse the _filterArgs array instead of recreating it.
                        var filterArgs = mockTweenable._filterArgs;
                        filterArgs.length = 0;
                        filterArgs[0] = current;
                        filterArgs[1] = from;
                        filterArgs[2] = targetState;
                        filterArgs[3] = easingObject;

                        // Any defined value transformation must be applied
                        Tweenable.applyFilter(mockTweenable, 'tweenCreated');
                        Tweenable.applyFilter(mockTweenable, 'beforeTween');

                        var interpolatedValues = getInterpolatedValues(
                            from, current, targetState, position, easingObject, delay);

                        // Transform values back into their original format
                        Tweenable.applyFilter(mockTweenable, 'afterTween');

                        return interpolatedValues;
                    };

                }());

                /**
                 * This module adds string interpolation support to Shifty.
                 *
                 * The Token extension allows Shifty to tween numbers inside of strings.  Among
                 * other things, this allows you to animate CSS properties.  For example, you
                 * can do this:
                 *
                 *     var tweenable = new Tweenable();
                 *     tweenable.tween({
                 *       from: { transform: 'translateX(45px)' },
                 *       to: { transform: 'translateX(90xp)' }
                 *     });
                 *
                 * `translateX(45)` will be tweened to `translateX(90)`.  To demonstrate:
                 *
                 *     var tweenable = new Tweenable();
                 *     tweenable.tween({
                 *       from: { transform: 'translateX(45px)' },
                 *       to: { transform: 'translateX(90px)' },
                 *       step: function (state) {
                 *         console.log(state.transform);
                 *       }
                 *     });
                 *
                 * The above snippet will log something like this in the console:
                 *
                 *     translateX(60.3px)
                 *     ...
                 *     translateX(76.05px)
                 *     ...
                 *     translateX(90px)
                 *
                 * Another use for this is animating colors:
                 *
                 *     var tweenable = new Tweenable();
                 *     tweenable.tween({
                 *       from: { color: 'rgb(0,255,0)' },
                 *       to: { color: 'rgb(255,0,255)' },
                 *       step: function (state) {
                 *         console.log(state.color);
                 *       }
                 *     });
                 *
                 * The above snippet will log something like this:
                 *
                 *     rgb(84,170,84)
                 *     ...
                 *     rgb(170,84,170)
                 *     ...
                 *     rgb(255,0,255)
                 *
                 * This extension also supports hexadecimal colors, in both long (`#ff00ff`)
                 * and short (`#f0f`) forms.  Be aware that hexadecimal input values will be
                 * converted into the equivalent RGB output values.  This is done to optimize
                 * for performance.
                 *
                 *     var tweenable = new Tweenable();
                 *     tweenable.tween({
                 *       from: { color: '#0f0' },
                 *       to: { color: '#f0f' },
                 *       step: function (state) {
                 *         console.log(state.color);
                 *       }
                 *     });
                 *
                 * This snippet will generate the same output as the one before it because
                 * equivalent values were supplied (just in hexadecimal form rather than RGB):
                 *
                 *     rgb(84,170,84)
                 *     ...
                 *     rgb(170,84,170)
                 *     ...
                 *     rgb(255,0,255)
                 *
                 * ## Easing support
                 *
                 * Easing works somewhat differently in the Token extension.  This is because
                 * some CSS properties have multiple values in them, and you might need to
                 * tween each value along its own easing curve.  A basic example:
                 *
                 *     var tweenable = new Tweenable();
                 *     tweenable.tween({
                 *       from: { transform: 'translateX(0px) translateY(0px)' },
                 *       to: { transform:   'translateX(100px) translateY(100px)' },
                 *       easing: { transform: 'easeInQuad' },
                 *       step: function (state) {
                 *         console.log(state.transform);
                 *       }
                 *     });
                 *
                 * The above snippet will create values like this:
                 *
                 *     translateX(11.56px) translateY(11.56px)
                 *     ...
                 *     translateX(46.24px) translateY(46.24px)
                 *     ...
                 *     translateX(100px) translateY(100px)
                 *
                 * In this case, the values for `translateX` and `translateY` are always the
                 * same for each step of the tween, because they have the same start and end
                 * points and both use the same easing curve.  We can also tween `translateX`
                 * and `translateY` along independent curves:
                 *
                 *     var tweenable = new Tweenable();
                 *     tweenable.tween({
                 *       from: { transform: 'translateX(0px) translateY(0px)' },
                 *       to: { transform:   'translateX(100px) translateY(100px)' },
                 *       easing: { transform: 'easeInQuad bounce' },
                 *       step: function (state) {
                 *         console.log(state.transform);
                 *       }
                 *     });
                 *
                 * The above snippet will create values like this:
                 *
                 *     translateX(10.89px) translateY(82.35px)
                 *     ...
                 *     translateX(44.89px) translateY(86.73px)
                 *     ...
                 *     translateX(100px) translateY(100px)
                 *
                 * `translateX` and `translateY` are not in sync anymore, because `easeInQuad`
                 * was specified for `translateX` and `bounce` for `translateY`.  Mixing and
                 * matching easing curves can make for some interesting motion in your
                 * animations.
                 *
                 * The order of the space-separated easing curves correspond the token values
                 * they apply to.  If there are more token values than easing curves listed,
                 * the last easing curve listed is used.
                 * @submodule Tweenable.token
                 */

                // token function is defined above only so that dox-foundation sees it as
                // documentation and renders it.  It is never used, and is optimized away at
                // build time.

                ; (function (Tweenable) {

                    /**
                     * @typedef {{
                     *   formatString: string
                     *   chunkNames: Array.<string>
                     * }}
                     * @private
                     */
                    var formatManifest;

                    // CONSTANTS

                    var R_NUMBER_COMPONENT = /(\d|\-|\.)/;
                    var R_FORMAT_CHUNKS = /([^\-0-9\.]+)/g;
                    var R_UNFORMATTED_VALUES = /[0-9.\-]+/g;
                    var R_RGB = new RegExp(
                        'rgb\\(' + R_UNFORMATTED_VALUES.source +
                        (/,\s*/.source) + R_UNFORMATTED_VALUES.source +
                        (/,\s*/.source) + R_UNFORMATTED_VALUES.source + '\\)', 'g');
                    var R_RGB_PREFIX = /^.*\(/;
                    var R_HEX = /#([0-9]|[a-f]){3,6}/gi;
                    var VALUE_PLACEHOLDER = 'VAL';

                    // HELPERS

                    /**
                     * @param {Array.number} rawValues
                     * @param {string} prefix
                     *
                     * @return {Array.<string>}
                     * @private
                     */
                    function getFormatChunksFrom(rawValues, prefix) {
                        var accumulator = [];

                        var rawValuesLength = rawValues.length;
                        var i;

                        for (i = 0; i < rawValuesLength; i++) {
                            accumulator.push('_' + prefix + '_' + i);
                        }

                        return accumulator;
                    }

                    /**
                     * @param {string} formattedString
                     *
                     * @return {string}
                     * @private
                     */
                    function getFormatStringFrom(formattedString) {
                        var chunks = formattedString.match(R_FORMAT_CHUNKS);

                        if (!chunks) {
                            // chunks will be null if there were no tokens to parse in
                            // formattedString (for example, if formattedString is '2').  Coerce
                            // chunks to be useful here.
                            chunks = ['', ''];

                            // If there is only one chunk, assume that the string is a number
                            // followed by a token...
                            // NOTE: This may be an unwise assumption.
                        } else if (chunks.length === 1 ||
                            // ...or if the string starts with a number component (".", "-", or a
                            // digit)...
                            formattedString[0].match(R_NUMBER_COMPONENT)) {
                            // ...prepend an empty string here to make sure that the formatted number
                            // is properly replaced by VALUE_PLACEHOLDER
                            chunks.unshift('');
                        }

                        return chunks.join(VALUE_PLACEHOLDER);
                    }

                    /**
                     * Convert all hex color values within a string to an rgb string.
                     *
                     * @param {Object} stateObject
                     *
                     * @return {Object} The modified obj
                     * @private
                     */
                    function sanitizeObjectForHexProps(stateObject) {
                        Tweenable.each(stateObject, function (prop) {
                            var currentProp = stateObject[prop];

                            if (typeof currentProp === 'string' && currentProp.match(R_HEX)) {
                                stateObject[prop] = sanitizeHexChunksToRGB(currentProp);
                            }
                        });
                    }

                    /**
                     * @param {string} str
                     *
                     * @return {string}
                     * @private
                     */
                    function sanitizeHexChunksToRGB(str) {
                        return filterStringChunks(R_HEX, str, convertHexToRGB);
                    }

                    /**
                     * @param {string} hexString
                     *
                     * @return {string}
                     * @private
                     */
                    function convertHexToRGB(hexString) {
                        var rgbArr = hexToRGBArray(hexString);
                        return 'rgb(' + rgbArr[0] + ',' + rgbArr[1] + ',' + rgbArr[2] + ')';
                    }

                    var hexToRGBArray_returnArray = [];
                    /**
                     * Convert a hexadecimal string to an array with three items, one each for
                     * the red, blue, and green decimal values.
                     *
                     * @param {string} hex A hexadecimal string.
                     *
                     * @returns {Array.<number>} The converted Array of RGB values if `hex` is a
                     * valid string, or an Array of three 0's.
                     * @private
                     */
                    function hexToRGBArray(hex) {

                        hex = hex.replace(/#/, '');

                        // If the string is a shorthand three digit hex notation, normalize it to
                        // the standard six digit notation
                        if (hex.length === 3) {
                            hex = hex.split('');
                            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
                        }

                        hexToRGBArray_returnArray[0] = hexToDec(hex.substr(0, 2));
                        hexToRGBArray_returnArray[1] = hexToDec(hex.substr(2, 2));
                        hexToRGBArray_returnArray[2] = hexToDec(hex.substr(4, 2));

                        return hexToRGBArray_returnArray;
                    }

                    /**
                     * Convert a base-16 number to base-10.
                     *
                     * @param {Number|String} hex The value to convert
                     *
                     * @returns {Number} The base-10 equivalent of `hex`.
                     * @private
                     */
                    function hexToDec(hex) {
                        return parseInt(hex, 16);
                    }

                    /**
                     * Runs a filter operation on all chunks of a string that match a RegExp
                     *
                     * @param {RegExp} pattern
                     * @param {string} unfilteredString
                     * @param {function(string)} filter
                     *
                     * @return {string}
                     * @private
                     */
                    function filterStringChunks(pattern, unfilteredString, filter) {
                        var pattenMatches = unfilteredString.match(pattern);
                        var filteredString = unfilteredString.replace(pattern, VALUE_PLACEHOLDER);

                        if (pattenMatches) {
                            var pattenMatchesLength = pattenMatches.length;
                            var currentChunk;

                            for (var i = 0; i < pattenMatchesLength; i++) {
                                currentChunk = pattenMatches.shift();
                                filteredString = filteredString.replace(
                                    VALUE_PLACEHOLDER, filter(currentChunk));
                            }
                        }

                        return filteredString;
                    }

                    /**
                     * Check for floating point values within rgb strings and rounds them.
                     *
                     * @param {string} formattedString
                     *
                     * @return {string}
                     * @private
                     */
                    function sanitizeRGBChunks(formattedString) {
                        return filterStringChunks(R_RGB, formattedString, sanitizeRGBChunk);
                    }

                    /**
                     * @param {string} rgbChunk
                     *
                     * @return {string}
                     * @private
                     */
                    function sanitizeRGBChunk(rgbChunk) {
                        var numbers = rgbChunk.match(R_UNFORMATTED_VALUES);
                        var numbersLength = numbers.length;
                        var sanitizedString = rgbChunk.match(R_RGB_PREFIX)[0];

                        for (var i = 0; i < numbersLength; i++) {
                            sanitizedString += parseInt(numbers[i], 10) + ',';
                        }

                        sanitizedString = sanitizedString.slice(0, -1) + ')';

                        return sanitizedString;
                    }

                    /**
                     * @param {Object} stateObject
                     *
                     * @return {Object} An Object of formatManifests that correspond to
                     * the string properties of stateObject
                     * @private
                     */
                    function getFormatManifests(stateObject) {
                        var manifestAccumulator = {};

                        Tweenable.each(stateObject, function (prop) {
                            var currentProp = stateObject[prop];

                            if (typeof currentProp === 'string') {
                                var rawValues = getValuesFrom(currentProp);

                                manifestAccumulator[prop] = {
                                    'formatString': getFormatStringFrom(currentProp)
                                    , 'chunkNames': getFormatChunksFrom(rawValues, prop)
                                };
                            }
                        });

                        return manifestAccumulator;
                    }

                    /**
                     * @param {Object} stateObject
                     * @param {Object} formatManifests
                     * @private
                     */
                    function expandFormattedProperties(stateObject, formatManifests) {
                        Tweenable.each(formatManifests, function (prop) {
                            var currentProp = stateObject[prop];
                            var rawValues = getValuesFrom(currentProp);
                            var rawValuesLength = rawValues.length;

                            for (var i = 0; i < rawValuesLength; i++) {
                                stateObject[formatManifests[prop].chunkNames[i]] = +rawValues[i];
                            }

                            delete stateObject[prop];
                        });
                    }

                    /**
                     * @param {Object} stateObject
                     * @param {Object} formatManifests
                     * @private
                     */
                    function collapseFormattedProperties(stateObject, formatManifests) {
                        Tweenable.each(formatManifests, function (prop) {
                            var currentProp = stateObject[prop];
                            var formatChunks = extractPropertyChunks(
                                stateObject, formatManifests[prop].chunkNames);
                            var valuesList = getValuesList(
                                formatChunks, formatManifests[prop].chunkNames);
                            currentProp = getFormattedValues(
                                formatManifests[prop].formatString, valuesList);
                            stateObject[prop] = sanitizeRGBChunks(currentProp);
                        });
                    }

                    /**
                     * @param {Object} stateObject
                     * @param {Array.<string>} chunkNames
                     *
                     * @return {Object} The extracted value chunks.
                     * @private
                     */
                    function extractPropertyChunks(stateObject, chunkNames) {
                        var extractedValues = {};
                        var currentChunkName, chunkNamesLength = chunkNames.length;

                        for (var i = 0; i < chunkNamesLength; i++) {
                            currentChunkName = chunkNames[i];
                            extractedValues[currentChunkName] = stateObject[currentChunkName];
                            delete stateObject[currentChunkName];
                        }

                        return extractedValues;
                    }

                    var getValuesList_accumulator = [];
                    /**
                     * @param {Object} stateObject
                     * @param {Array.<string>} chunkNames
                     *
                     * @return {Array.<number>}
                     * @private
                     */
                    function getValuesList(stateObject, chunkNames) {
                        getValuesList_accumulator.length = 0;
                        var chunkNamesLength = chunkNames.length;

                        for (var i = 0; i < chunkNamesLength; i++) {
                            getValuesList_accumulator.push(stateObject[chunkNames[i]]);
                        }

                        return getValuesList_accumulator;
                    }

                    /**
                     * @param {string} formatString
                     * @param {Array.<number>} rawValues
                     *
                     * @return {string}
                     * @private
                     */
                    function getFormattedValues(formatString, rawValues) {
                        var formattedValueString = formatString;
                        var rawValuesLength = rawValues.length;

                        for (var i = 0; i < rawValuesLength; i++) {
                            formattedValueString = formattedValueString.replace(
                                VALUE_PLACEHOLDER, +rawValues[i].toFixed(4));
                        }

                        return formattedValueString;
                    }

                    /**
                     * Note: It's the duty of the caller to convert the Array elements of the
                     * return value into numbers.  This is a performance optimization.
                     *
                     * @param {string} formattedString
                     *
                     * @return {Array.<string>|null}
                     * @private
                     */
                    function getValuesFrom(formattedString) {
                        return formattedString.match(R_UNFORMATTED_VALUES);
                    }

                    /**
                     * @param {Object} easingObject
                     * @param {Object} tokenData
                     * @private
                     */
                    function expandEasingObject(easingObject, tokenData) {
                        Tweenable.each(tokenData, function (prop) {
                            var currentProp = tokenData[prop];
                            var chunkNames = currentProp.chunkNames;
                            var chunkLength = chunkNames.length;

                            var easing = easingObject[prop];
                            var i;

                            if (typeof easing === 'string') {
                                var easingChunks = easing.split(' ');
                                var lastEasingChunk = easingChunks[easingChunks.length - 1];

                                for (i = 0; i < chunkLength; i++) {
                                    easingObject[chunkNames[i]] = easingChunks[i] || lastEasingChunk;
                                }

                            } else {
                                for (i = 0; i < chunkLength; i++) {
                                    easingObject[chunkNames[i]] = easing;
                                }
                            }

                            delete easingObject[prop];
                        });
                    }

                    /**
                     * @param {Object} easingObject
                     * @param {Object} tokenData
                     * @private
                     */
                    function collapseEasingObject(easingObject, tokenData) {
                        Tweenable.each(tokenData, function (prop) {
                            var currentProp = tokenData[prop];
                            var chunkNames = currentProp.chunkNames;
                            var chunkLength = chunkNames.length;

                            var firstEasing = easingObject[chunkNames[0]];
                            var typeofEasings = typeof firstEasing;

                            if (typeofEasings === 'string') {
                                var composedEasingString = '';

                                for (var i = 0; i < chunkLength; i++) {
                                    composedEasingString += ' ' + easingObject[chunkNames[i]];
                                    delete easingObject[chunkNames[i]];
                                }

                                easingObject[prop] = composedEasingString.substr(1);
                            } else {
                                easingObject[prop] = firstEasing;
                            }
                        });
                    }

                    Tweenable.prototype.filter.token = {
                        'tweenCreated': function (currentState, fromState, toState, easingObject) {
                            sanitizeObjectForHexProps(currentState);
                            sanitizeObjectForHexProps(fromState);
                            sanitizeObjectForHexProps(toState);
                            this._tokenData = getFormatManifests(currentState);
                        },

                        'beforeTween': function (currentState, fromState, toState, easingObject) {
                            expandEasingObject(easingObject, this._tokenData);
                            expandFormattedProperties(currentState, this._tokenData);
                            expandFormattedProperties(fromState, this._tokenData);
                            expandFormattedProperties(toState, this._tokenData);
                        },

                        'afterTween': function (currentState, fromState, toState, easingObject) {
                            collapseFormattedProperties(currentState, this._tokenData);
                            collapseFormattedProperties(fromState, this._tokenData);
                            collapseFormattedProperties(toState, this._tokenData);
                            collapseEasingObject(easingObject, this._tokenData);
                        }
                    };

                }(Tweenable));

            }).call(null);

        }, {}], 2: [function (require, module, exports) {
            // Circle shaped progress bar

            var Shape = require('./shape');
            var utils = require('./utils');

            var Circle = function Circle(container, options) {
                // Use two arcs to form a circle
                // See this answer http://stackoverflow.com/a/10477334/1446092
                this._pathTemplate =
                    'M 50,50 m 0,-{radius}' +
                    ' a {radius},{radius} 0 1 1 0,{2radius}' +
                    ' a {radius},{radius} 0 1 1 0,-{2radius}';

                this.containerAspectRatio = 1;

                Shape.apply(this, arguments);
            };

            Circle.prototype = new Shape();
            Circle.prototype.constructor = Circle;

            Circle.prototype._pathString = function _pathString(opts) {
                var widthOfWider = opts.strokeWidth;
                if (opts.trailWidth && opts.trailWidth > opts.strokeWidth) {
                    widthOfWider = opts.trailWidth;
                }

                var r = 50 - widthOfWider / 2;

                return utils.render(this._pathTemplate, {
                    radius: r,
                    '2radius': r * 2
                });
            };

            Circle.prototype._trailString = function _trailString(opts) {
                return this._pathString(opts);
            };

            module.exports = Circle;

        }, { "./shape": 7, "./utils": 8 }], 3: [function (require, module, exports) {
            // Line shaped progress bar

            var Shape = require('./shape');
            var utils = require('./utils');

            var Line = function Line(container, options) {
                this._pathTemplate = 'M 0,{center} L 100,{center}';
                Shape.apply(this, arguments);
            };

            Line.prototype = new Shape();
            Line.prototype.constructor = Line;

            Line.prototype._initializeSvg = function _initializeSvg(svg, opts) {
                svg.setAttribute('viewBox', '0 0 100 ' + opts.strokeWidth);
                svg.setAttribute('preserveAspectRatio', 'none');
            };

            Line.prototype._pathString = function _pathString(opts) {
                return utils.render(this._pathTemplate, {
                    center: opts.strokeWidth / 2
                });
            };

            Line.prototype._trailString = function _trailString(opts) {
                return this._pathString(opts);
            };

            module.exports = Line;

        }, { "./shape": 7, "./utils": 8 }], 4: [function (require, module, exports) {
            module.exports = {
                // Higher level API, different shaped progress bars
                Line: require('./line'),
                Circle: require('./circle'),
                SemiCircle: require('./semicircle'),

                // Lower level API to use any SVG path
                Path: require('./path'),

                // Base-class for creating new custom shapes
                // to be in line with the API of built-in shapes
                // Undocumented.
                Shape: require('./shape'),

                // Internal utils, undocumented.
                utils: require('./utils')
            };

        }, { "./circle": 2, "./line": 3, "./path": 5, "./semicircle": 6, "./shape": 7, "./utils": 8 }], 5: [function (require, module, exports) {
            // Lower level API to animate any kind of svg path

            var Tweenable = require('shifty');
            var utils = require('./utils');

            var EASING_ALIASES = {
                easeIn: 'easeInCubic',
                easeOut: 'easeOutCubic',
                easeInOut: 'easeInOutCubic'
            };

            var Path = function Path(path, opts) {
                // Default parameters for animation
                opts = utils.extend({
                    duration: 800,
                    easing: 'linear',
                    from: {},
                    to: {},
                    step: function () { }
                }, opts);

                var element;
                if (utils.isString(path)) {
                    element = document.querySelector(path);
                } else {
                    element = path;
                }

                // Reveal .path as public attribute
                this.path = element;
                this._opts = opts;
                this._tweenable = null;

                // Set up the starting positions
                var length = this.path.getTotalLength();
                this.path.style.strokeDasharray = length + ' ' + length;
                this.set(0);
            };

            Path.prototype.value = function value() {
                var offset = this._getComputedDashOffset();
                var length = this.path.getTotalLength();

                var progress = 1 - offset / length;
                // Round number to prevent returning very small number like 1e-30, which
                // is practically 0
                return parseFloat(progress.toFixed(6), 10);
            };

            Path.prototype.set = function set(progress) {
                this.stop();

                this.path.style.strokeDashoffset = this._progressToOffset(progress);

                var step = this._opts.step;
                if (utils.isFunction(step)) {
                    var easing = this._easing(this._opts.easing);
                    var values = this._calculateTo(progress, easing);
                    var reference = this._opts.shape || this;
                    step(values, reference, this._opts.attachment);
                }
            };

            Path.prototype.stop = function stop() {
                this._stopTween();
                this.path.style.strokeDashoffset = this._getComputedDashOffset();
            };

            // Method introduced here:
            // http://jakearchibald.com/2013/animated-line-drawing-svg/
            Path.prototype.animate = function animate(progress, opts, cb) {
                opts = opts || {};

                if (utils.isFunction(opts)) {
                    cb = opts;
                    opts = {};
                }

                var passedOpts = utils.extend({}, opts);

                // Copy default opts to new object so defaults are not modified
                var defaultOpts = utils.extend({}, this._opts);
                opts = utils.extend(defaultOpts, opts);

                var shiftyEasing = this._easing(opts.easing);
                var values = this._resolveFromAndTo(progress, shiftyEasing, passedOpts);

                this.stop();

                // Trigger a layout so styles are calculated & the browser
                // picks up the starting position before animating
                this.path.getBoundingClientRect();

                var offset = this._getComputedDashOffset();
                var newOffset = this._progressToOffset(progress);

                var self = this;
                this._tweenable = new Tweenable();
                this._tweenable.tween({
                    from: utils.extend({ offset: offset }, values.from),
                    to: utils.extend({ offset: newOffset }, values.to),
                    duration: opts.duration,
                    easing: shiftyEasing,
                    step: function (state) {
                        self.path.style.strokeDashoffset = state.offset;
                        var reference = opts.shape || self;
                        opts.step(state, reference, opts.attachment);
                    },
                    finish: function (state) {
                        if (utils.isFunction(cb)) {
                            cb();
                        }
                    }
                });
            };

            Path.prototype._getComputedDashOffset = function _getComputedDashOffset() {
                var computedStyle = window.getComputedStyle(this.path, null);
                return parseFloat(computedStyle.getPropertyValue('stroke-dashoffset'), 10);
            };

            Path.prototype._progressToOffset = function _progressToOffset(progress) {
                var length = this.path.getTotalLength();
                return length - progress * length;
            };

            // Resolves from and to values for animation.
            Path.prototype._resolveFromAndTo = function _resolveFromAndTo(progress, easing, opts) {
                if (opts.from && opts.to) {
                    return {
                        from: opts.from,
                        to: opts.to
                    };
                }

                return {
                    from: this._calculateFrom(easing),
                    to: this._calculateTo(progress, easing)
                };
            };

            // Calculate `from` values from options passed at initialization
            Path.prototype._calculateFrom = function _calculateFrom(easing) {
                return Tweenable.interpolate(this._opts.from, this._opts.to, this.value(), easing);
            };

            // Calculate `to` values from options passed at initialization
            Path.prototype._calculateTo = function _calculateTo(progress, easing) {
                return Tweenable.interpolate(this._opts.from, this._opts.to, progress, easing);
            };

            Path.prototype._stopTween = function _stopTween() {
                if (this._tweenable !== null) {
                    this._tweenable.stop();
                    this._tweenable = null;
                }
            };

            Path.prototype._easing = function _easing(easing) {
                if (EASING_ALIASES.hasOwnProperty(easing)) {
                    return EASING_ALIASES[easing];
                }

                return easing;
            };

            module.exports = Path;

        }, { "./utils": 8, "shifty": 1 }], 6: [function (require, module, exports) {
            // Semi-SemiCircle shaped progress bar

            var Shape = require('./shape');
            var Circle = require('./circle');
            var utils = require('./utils');

            var SemiCircle = function SemiCircle(container, options) {
                // Use one arc to form a SemiCircle
                // See this answer http://stackoverflow.com/a/10477334/1446092
                this._pathTemplate =
                    'M 50,50 m -{radius},0' +
                    ' a {radius},{radius} 0 1 1 {2radius},0';

                this.containerAspectRatio = 2;

                Shape.apply(this, arguments);
            };

            SemiCircle.prototype = new Shape();
            SemiCircle.prototype.constructor = SemiCircle;

            SemiCircle.prototype._initializeSvg = function _initializeSvg(svg, opts) {
                svg.setAttribute('viewBox', '0 0 100 50');
            };

            SemiCircle.prototype._initializeTextContainer = function _initializeTextContainer(
                opts,
                container,
                textContainer
            ) {
                if (opts.text.style) {
                    // Reset top style
                    textContainer.style.top = 'auto';
                    textContainer.style.bottom = '0';

                    if (opts.text.alignToBottom) {
                        utils.setStyle(textContainer, 'transform', 'translate(-50%, 0)');
                    } else {
                        utils.setStyle(textContainer, 'transform', 'translate(-50%, 50%)');
                    }
                }
            };

            // Share functionality with Circle, just have different path
            SemiCircle.prototype._pathString = Circle.prototype._pathString;
            SemiCircle.prototype._trailString = Circle.prototype._trailString;

            module.exports = SemiCircle;

        }, { "./circle": 2, "./shape": 7, "./utils": 8 }], 7: [function (require, module, exports) {
            // Base object for different progress bar shapes

            var Path = require('./path');
            var utils = require('./utils');

            var DESTROYED_ERROR = 'Object is destroyed';

            var Shape = function Shape(container, opts) {
                // Throw a better error if progress bars are not initialized with `new`
                // keyword
                if (!(this instanceof Shape)) {
                    throw new Error('Constructor was called without new keyword');
                }

                // Prevent calling constructor without parameters so inheritance
                // works correctly. To understand, this is how Shape is inherited:
                //
                //   Line.prototype = new Shape();
                //
                // We just want to set the prototype for Line.
                if (arguments.length === 0) {
                    return;
                }

                // Default parameters for progress bar creation
                this._opts = utils.extend({
                    color: '#555',
                    strokeWidth: 1.0,
                    trailColor: null,
                    trailWidth: null,
                    fill: null,
                    text: {
                        style: {
                            color: null,
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            padding: 0,
                            margin: 0,
                            transform: {
                                prefix: true,
                                value: 'translate(-50%, -50%)'
                            }
                        },
                        autoStyleContainer: true,
                        alignToBottom: true,
                        value: '',
                        className: 'progressbar-text'
                    },
                    svgStyle: {
                        display: 'block',
                        width: '100%'
                    }
                }, opts, true);  // Use recursive extend

                // If user specifies e.g. svgStyle or text style, the whole object
                // should replace the defaults to make working with styles easier
                if (utils.isObject(opts) && opts.svgStyle !== undefined) {
                    this._opts.svgStyle = opts.svgStyle;
                }
                if (utils.isObject(opts) && utils.isObject(opts.text) && opts.text.style !== undefined) {
                    this._opts.text.style = opts.text.style;
                }

                var svgView = this._createSvgView(this._opts);

                var element;
                if (utils.isString(container)) {
                    element = document.querySelector(container);
                } else {
                    element = container;
                }

                if (!element) {
                    throw new Error('Container does not exist: ' + container);
                }

                this._container = element;
                this._container.appendChild(svgView.svg);
                this._warnContainerAspectRatio(this._container);

                if (this._opts.svgStyle) {
                    utils.setStyles(svgView.svg, this._opts.svgStyle);
                }

                // Expose public attributes before Path initialization
                this.svg = svgView.svg;
                this.path = svgView.path;
                this.trail = svgView.trail;
                this.text = null;

                var newOpts = utils.extend({
                    attachment: undefined,
                    shape: this
                }, this._opts);
                this._progressPath = new Path(svgView.path, newOpts);

                if (utils.isObject(this._opts.text) && this._opts.text.value) {
                    this.setText(this._opts.text.value);
                }
            };

            Shape.prototype.animate = function animate(progress, opts, cb) {
                if (this._progressPath === null) {
                    throw new Error(DESTROYED_ERROR);
                }

                this._progressPath.animate(progress, opts, cb);
            };

            Shape.prototype.stop = function stop() {
                if (this._progressPath === null) {
                    throw new Error(DESTROYED_ERROR);
                }

                // Don't crash if stop is called inside step function
                if (this._progressPath === undefined) {
                    return;
                }

                this._progressPath.stop();
            };

            Shape.prototype.destroy = function destroy() {
                if (this._progressPath === null) {
                    throw new Error(DESTROYED_ERROR);
                }

                this.stop();
                this.svg.parentNode.removeChild(this.svg);
                this.svg = null;
                this.path = null;
                this.trail = null;
                this._progressPath = null;

                if (this.text !== null) {
                    this.text.parentNode.removeChild(this.text);
                    this.text = null;
                }
            };

            Shape.prototype.set = function set(progress) {
                if (this._progressPath === null) {
                    throw new Error(DESTROYED_ERROR);
                }

                this._progressPath.set(progress);
            };

            Shape.prototype.value = function value() {
                if (this._progressPath === null) {
                    throw new Error(DESTROYED_ERROR);
                }

                if (this._progressPath === undefined) {
                    return 0;
                }

                return this._progressPath.value();
            };

            Shape.prototype.setText = function setText(newText) {
                if (this._progressPath === null) {
                    throw new Error(DESTROYED_ERROR);
                }

                if (this.text === null) {
                    // Create new text node
                    this.text = this._createTextContainer(this._opts, this._container);
                    this._container.appendChild(this.text);
                }

                // Remove previous text and add new
                if (utils.isObject(newText)) {
                    utils.removeChildren(this.text);
                    this.text.appendChild(newText);
                } else {
                    this.text.innerHTML = newText;
                }
            };

            Shape.prototype._createSvgView = function _createSvgView(opts) {
                var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                this._initializeSvg(svg, opts);

                var trailPath = null;
                // Each option listed in the if condition are 'triggers' for creating
                // the trail path
                if (opts.trailColor || opts.trailWidth) {
                    trailPath = this._createTrail(opts);
                    svg.appendChild(trailPath);
                }

                var path = this._createPath(opts);
                svg.appendChild(path);

                return {
                    svg: svg,
                    path: path,
                    trail: trailPath
                };
            };

            Shape.prototype._initializeSvg = function _initializeSvg(svg, opts) {
                svg.setAttribute('viewBox', '0 0 100 100');
            };

            Shape.prototype._createPath = function _createPath(opts) {
                var pathString = this._pathString(opts);
                return this._createPathElement(pathString, opts);
            };

            Shape.prototype._createTrail = function _createTrail(opts) {
                // Create path string with original passed options
                var pathString = this._trailString(opts);

                // Prevent modifying original
                var newOpts = utils.extend({}, opts);

                // Defaults for parameters which modify trail path
                if (!newOpts.trailColor) {
                    newOpts.trailColor = '#eee';
                }
                if (!newOpts.trailWidth) {
                    newOpts.trailWidth = newOpts.strokeWidth;
                }

                newOpts.color = newOpts.trailColor;
                newOpts.strokeWidth = newOpts.trailWidth;

                // When trail path is set, fill must be set for it instead of the
                // actual path to prevent trail stroke from clipping
                newOpts.fill = null;

                return this._createPathElement(pathString, newOpts);
            };

            Shape.prototype._createPathElement = function _createPathElement(pathString, opts) {
                var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', pathString);
                path.setAttribute('stroke', opts.color);
                path.setAttribute('stroke-width', opts.strokeWidth);

                if (opts.fill) {
                    path.setAttribute('fill', opts.fill);
                } else {
                    path.setAttribute('fill-opacity', '0');
                }

                return path;
            };

            Shape.prototype._createTextContainer = function _createTextContainer(opts, container) {
                var textContainer = document.createElement('div');
                textContainer.className = opts.text.className;

                var textStyle = opts.text.style;
                if (textStyle) {
                    if (opts.text.autoStyleContainer) {
                        container.style.position = 'relative';
                    }

                    utils.setStyles(textContainer, textStyle);
                    // Default text color to progress bar's color
                    if (!textStyle.color) {
                        textContainer.style.color = opts.color;
                    }
                }

                this._initializeTextContainer(opts, container, textContainer);
                return textContainer;
            };

            // Give custom shapes possibility to modify text element
            Shape.prototype._initializeTextContainer = function (opts, container, element) {
                // By default, no-op
                // Custom shapes should respect API options, such as text.style
            };

            Shape.prototype._pathString = function _pathString(opts) {
                throw new Error('Override this function for each progress bar');
            };

            Shape.prototype._trailString = function _trailString(opts) {
                throw new Error('Override this function for each progress bar');
            };

            Shape.prototype._warnContainerAspectRatio = function _warnContainerAspectRatio(container) {
                if (!this.containerAspectRatio) {
                    return;
                }

                var computedStyle = window.getComputedStyle(container, null);
                var width = parseFloat(computedStyle.getPropertyValue('width'), 10);
                var height = parseFloat(computedStyle.getPropertyValue('height'), 10);
                if (!utils.floatEquals(this.containerAspectRatio, width / height)) {
                    console.warn(
                        'Incorrect aspect ratio of container',
                        this._container,
                        'detected:',
                        computedStyle.getPropertyValue('width') + '(width)',
                        '/',
                        computedStyle.getPropertyValue('height') + '(height)',
                        '=',
                        width / height
                    );

                    console.warn(
                        'Aspect ratio of should be',
                        this.containerAspectRatio
                    );
                }
            };

            module.exports = Shape;

        }, { "./path": 5, "./utils": 8 }], 8: [function (require, module, exports) {
            // Utility functions

            var PREFIXES = 'Webkit Moz O ms'.split(' ');
            var FLOAT_COMPARISON_EPSILON = 0.001;

            // Copy all attributes from source object to destination object.
            // destination object is mutated.
            function extend(destination, source, recursive) {
                destination = destination || {};
                source = source || {};
                recursive = recursive || false;

                for (var attrName in source) {
                    if (source.hasOwnProperty(attrName)) {
                        var destVal = destination[attrName];
                        var sourceVal = source[attrName];
                        if (recursive && isObject(destVal) && isObject(sourceVal)) {
                            destination[attrName] = extend(destVal, sourceVal, recursive);
                        } else {
                            destination[attrName] = sourceVal;
                        }
                    }
                }

                return destination;
            }

            // Renders templates with given variables. Variables must be surrounded with
            // braces without any spaces, e.g. {variable}
            // All instances of variable placeholders will be replaced with given content
            // Example:
            // render('Hello, {message}!', {message: 'world'})
            function render(template, vars) {
                var rendered = template;

                for (var key in vars) {
                    if (vars.hasOwnProperty(key)) {
                        var val = vars[key];
                        var regExpString = '\\{' + key + '\\}';
                        var regExp = new RegExp(regExpString, 'g');

                        rendered = rendered.replace(regExp, val);
                    }
                }

                return rendered;
            }

            function setStyle(element, style, value) {
                var elStyle = element.style;  // cache for performance

                for (var i = 0; i < PREFIXES.length; ++i) {
                    var prefix = PREFIXES[i];
                    elStyle[prefix + capitalize(style)] = value;
                }

                elStyle[style] = value;
            }

            function setStyles(element, styles) {
                forEachObject(styles, function (styleValue, styleName) {
                    // Allow disabling some individual styles by setting them
                    // to null or undefined
                    if (styleValue === null || styleValue === undefined) {
                        return;
                    }

                    // If style's value is {prefix: true, value: '50%'},
                    // Set also browser prefixed styles
                    if (isObject(styleValue) && styleValue.prefix === true) {
                        setStyle(element, styleName, styleValue.value);
                    } else {
                        element.style[styleName] = styleValue;
                    }
                });
            }

            function capitalize(text) {
                return text.charAt(0).toUpperCase() + text.slice(1);
            }

            function isString(obj) {
                return typeof obj === 'string' || obj instanceof String;
            }

            function isFunction(obj) {
                return typeof obj === 'function';
            }

            function isArray(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }

            // Returns true if `obj` is object as in {a: 1, b: 2}, not if it's function or
            // array
            function isObject(obj) {
                if (isArray(obj)) {
                    return false;
                }

                var type = typeof obj;
                return type === 'object' && !!obj;
            }

            function forEachObject(object, callback) {
                for (var key in object) {
                    if (object.hasOwnProperty(key)) {
                        var val = object[key];
                        callback(val, key);
                    }
                }
            }

            function floatEquals(a, b) {
                return Math.abs(a - b) < FLOAT_COMPARISON_EPSILON;
            }

            // https://coderwall.com/p/nygghw/don-t-use-innerhtml-to-empty-dom-elements
            function removeChildren(el) {
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
            }

            module.exports = {
                extend: extend,
                render: render,
                setStyle: setStyle,
                setStyles: setStyles,
                capitalize: capitalize,
                isString: isString,
                isFunction: isFunction,
                isObject: isObject,
                forEachObject: forEachObject,
                floatEquals: floatEquals,
                removeChildren: removeChildren
            };

        }, {}]
    }, {}, [4])(4)
});
/**
 * @version: 1.0 Alpha-1
 * @author: Coolite Inc. http://www.coolite.com/
 * @date: 2008-05-13
 * @copyright: Copyright (c) 2006-2008, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * @license: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * @website: http://www.datejs.com/
 */
Date.CultureInfo = { name: "es-EC", englishName: "Spanish (Ecuador)", nativeName: "Espa??ol (Ecuador)", dayNames: ["domingo", "lunes", "martes", "mi??rcoles", "jueves", "viernes", "s??bado"], abbreviatedDayNames: ["dom", "lun", "mar", "mi??", "jue", "vie", "s??b"], shortestDayNames: ["do", "lu", "ma", "mi", "ju", "vi", "s??"], firstLetterDayNames: ["d", "l", "m", "m", "j", "v", "s"], monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"], abbreviatedMonthNames: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], amDesignator: "", pmDesignator: "", firstDayOfWeek: 0, twoDigitYearMax: 2029, dateElementOrder: "dmy", formatPatterns: { shortDate: "dd/MM/yyyy", longDate: "dddd, dd' de 'MMMM' de 'yyyy", shortTime: "H:mm", longTime: "H:mm:ss", fullDateTime: "dddd, dd' de 'MMMM' de 'yyyy H:mm:ss", sortableDateTime: "yyyy-MM-ddTHH:mm:ss", universalSortableDateTime: "yyyy-MM-dd HH:mm:ssZ", rfc1123: "ddd, dd MMM yyyy HH:mm:ss GMT", monthDay: "dd MMMM", yearMonth: "MMMM' de 'yyyy" }, regexPatterns: { jan: /^ene(ro)?/i, feb: /^feb(rero)?/i, mar: /^mar(zo)?/i, apr: /^abr(il)?/i, may: /^may(o)?/i, jun: /^jun(io)?/i, jul: /^jul(io)?/i, aug: /^ago(sto)?/i, sep: /^sep(tiembre)?/i, oct: /^oct(ubre)?/i, nov: /^nov(iembre)?/i, dec: /^dic(iembre)?/i, sun: /^do(m(ingo)?)?/i, mon: /^lu(n(es)?)?/i, tue: /^ma(r(tes)?)?/i, wed: /^mi(??(rcoles)?)?/i, thu: /^ju(e(ves)?)?/i, fri: /^vi(e(rnes)?)?/i, sat: /^s??(b(ado)?)?/i, future: /^next/i, past: /^last|past|prev(ious)?/i, add: /^(\+|aft(er)?|from|hence)/i, subtract: /^(\-|bef(ore)?|ago)/i, yesterday: /^yes(terday)?/i, today: /^t(od(ay)?)?/i, tomorrow: /^tom(orrow)?/i, now: /^n(ow)?/i, millisecond: /^ms|milli(second)?s?/i, second: /^sec(ond)?s?/i, minute: /^mn|min(ute)?s?/i, hour: /^h(our)?s?/i, week: /^w(eek)?s?/i, month: /^m(onth)?s?/i, day: /^d(ay)?s?/i, year: /^y(ear)?s?/i, shortMeridian: /^(a|p)/i, longMeridian: /^(a\.?m?\.?|p\.?m?\.?)/i, timezone: /^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt|utc)/i, ordinalSuffix: /^\s*(st|nd|rd|th)/i, timeContext: /^\s*(\:|a(?!u|p)|p)/i }, timezones: [{ name: "UTC", offset: "-000" }, { name: "GMT", offset: "-000" }, { name: "EST", offset: "-0500" }, { name: "EDT", offset: "-0400" }, { name: "CST", offset: "-0600" }, { name: "CDT", offset: "-0500" }, { name: "MST", offset: "-0700" }, { name: "MDT", offset: "-0600" }, { name: "PST", offset: "-0800" }, { name: "PDT", offset: "-0700" }] };
(function () {
    var $D = Date, $P = $D.prototype, $C = $D.CultureInfo, p = function (s, l) {
        if (!l) { l = 2; }
        return ("000" + s).slice(l * -1);
    }; $P.clearTime = function () { this.setHours(0); this.setMinutes(0); this.setSeconds(0); this.setMilliseconds(0); return this; }; $P.setTimeToNow = function () { var n = new Date(); this.setHours(n.getHours()); this.setMinutes(n.getMinutes()); this.setSeconds(n.getSeconds()); this.setMilliseconds(n.getMilliseconds()); return this; }; $D.today = function () { return new Date().clearTime(); }; $D.compare = function (date1, date2) { if (isNaN(date1) || isNaN(date2)) { throw new Error(date1 + " - " + date2); } else if (date1 instanceof Date && date2 instanceof Date) { return (date1 < date2) ? -1 : (date1 > date2) ? 1 : 0; } else { throw new TypeError(date1 + " - " + date2); } }; $D.equals = function (date1, date2) { return (date1.compareTo(date2) === 0); }; $D.getDayNumberFromName = function (name) {
        var n = $C.dayNames, m = $C.abbreviatedDayNames, o = $C.shortestDayNames, s = name.toLowerCase(); for (var i = 0; i < n.length; i++) { if (n[i].toLowerCase() == s || m[i].toLowerCase() == s || o[i].toLowerCase() == s) { return i; } }
        return -1;
    }; $D.getMonthNumberFromName = function (name) {
        var n = $C.monthNames, m = $C.abbreviatedMonthNames, s = name.toLowerCase(); for (var i = 0; i < n.length; i++) { if (n[i].toLowerCase() == s || m[i].toLowerCase() == s) { return i; } }
        return -1;
    }; $D.isLeapYear = function (year) { return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0); }; $D.getDaysInMonth = function (year, month) { return [31, ($D.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]; }; $D.getTimezoneAbbreviation = function (offset) {
        var z = $C.timezones, p; for (var i = 0; i < z.length; i++) { if (z[i].offset === offset) { return z[i].name; } }
        return null;
    }; $D.getTimezoneOffset = function (name) {
        var z = $C.timezones, p; for (var i = 0; i < z.length; i++) { if (z[i].name === name.toUpperCase()) { return z[i].offset; } }
        return null;
    }; $P.clone = function () { return new Date(this.getTime()); }; $P.compareTo = function (date) { return Date.compare(this, date); }; $P.equals = function (date) { return Date.equals(this, date || new Date()); }; $P.between = function (start, end) { return this.getTime() >= start.getTime() && this.getTime() <= end.getTime(); }; $P.isAfter = function (date) { return this.compareTo(date || new Date()) === 1; }; $P.isBefore = function (date) { return (this.compareTo(date || new Date()) === -1); }; $P.isToday = function () { return this.isSameDay(new Date()); }; $P.isSameDay = function (date) { return this.clone().clearTime().equals(date.clone().clearTime()); }; $P.addMilliseconds = function (value) { this.setMilliseconds(this.getMilliseconds() + value); return this; }; $P.addSeconds = function (value) { return this.addMilliseconds(value * 1000); }; $P.addMinutes = function (value) { return this.addMilliseconds(value * 60000); }; $P.addHours = function (value) { return this.addMilliseconds(value * 3600000); }; $P.addDays = function (value) { this.setDate(this.getDate() + value); return this; }; $P.addWeeks = function (value) { return this.addDays(value * 7); }; $P.addMonths = function (value) { var n = this.getDate(); this.setDate(1); this.setMonth(this.getMonth() + value); this.setDate(Math.min(n, $D.getDaysInMonth(this.getFullYear(), this.getMonth()))); return this; }; $P.addYears = function (value) { return this.addMonths(value * 12); }; $P.add = function (config) {
        if (typeof config == "number") { this._orient = config; return this; }
        var x = config; if (x.milliseconds) { this.addMilliseconds(x.milliseconds); }
        if (x.seconds) { this.addSeconds(x.seconds); }
        if (x.minutes) { this.addMinutes(x.minutes); }
        if (x.hours) { this.addHours(x.hours); }
        if (x.weeks) { this.addWeeks(x.weeks); }
        if (x.months) { this.addMonths(x.months); }
        if (x.years) { this.addYears(x.years); }
        if (x.days) { this.addDays(x.days); }
        return this;
    }; var $y, $m, $d; $P.getWeek = function () {
        var a, b, c, d, e, f, g, n, s, w; $y = (!$y) ? this.getFullYear() : $y; $m = (!$m) ? this.getMonth() + 1 : $m; $d = (!$d) ? this.getDate() : $d; if ($m <= 2) { a = $y - 1; b = (a / 4 | 0) - (a / 100 | 0) + (a / 400 | 0); c = ((a - 1) / 4 | 0) - ((a - 1) / 100 | 0) + ((a - 1) / 400 | 0); s = b - c; e = 0; f = $d - 1 + (31 * ($m - 1)); } else { a = $y; b = (a / 4 | 0) - (a / 100 | 0) + (a / 400 | 0); c = ((a - 1) / 4 | 0) - ((a - 1) / 100 | 0) + ((a - 1) / 400 | 0); s = b - c; e = s + 1; f = $d + ((153 * ($m - 3) + 2) / 5) + 58 + s; }
        g = (a + b) % 7; d = (f + g - e) % 7; n = (f + 3 - d) | 0; if (n < 0) { w = 53 - ((g - s) / 5 | 0); } else if (n > 364 + s) { w = 1; } else { w = (n / 7 | 0) + 1; }
        $y = $m = $d = null; return w;
    }; $P.getISOWeek = function () { $y = this.getUTCFullYear(); $m = this.getUTCMonth() + 1; $d = this.getUTCDate(); return p(this.getWeek()); }; $P.setWeek = function (n) { return this.moveToDayOfWeek(1).addWeeks(n - this.getWeek()); }; $D._validate = function (n, min, max, name) {
        if (typeof n == "undefined") { return false; } else if (typeof n != "number") { throw new TypeError(n + " is not a Number."); } else if (n < min || n > max) { throw new RangeError(n + " is not a valid value for " + name + "."); }
        return true;
    }; $D.validateMillisecond = function (value) { return $D._validate(value, 0, 999, "millisecond"); }; $D.validateSecond = function (value) { return $D._validate(value, 0, 59, "second"); }; $D.validateMinute = function (value) { return $D._validate(value, 0, 59, "minute"); }; $D.validateHour = function (value) { return $D._validate(value, 0, 23, "hour"); }; $D.validateDay = function (value, year, month) { return $D._validate(value, 1, $D.getDaysInMonth(year, month), "day"); }; $D.validateMonth = function (value) { return $D._validate(value, 0, 11, "month"); }; $D.validateYear = function (value) { return $D._validate(value, 0, 9999, "year"); }; $P.set = function (config) {
        if ($D.validateMillisecond(config.millisecond)) { this.addMilliseconds(config.millisecond - this.getMilliseconds()); }
        if ($D.validateSecond(config.second)) { this.addSeconds(config.second - this.getSeconds()); }
        if ($D.validateMinute(config.minute)) { this.addMinutes(config.minute - this.getMinutes()); }
        if ($D.validateHour(config.hour)) { this.addHours(config.hour - this.getHours()); }
        if ($D.validateMonth(config.month)) { this.addMonths(config.month - this.getMonth()); }
        if ($D.validateYear(config.year)) { this.addYears(config.year - this.getFullYear()); }
        if ($D.validateDay(config.day, this.getFullYear(), this.getMonth())) { this.addDays(config.day - this.getDate()); }
        if (config.timezone) { this.setTimezone(config.timezone); }
        if (config.timezoneOffset) { this.setTimezoneOffset(config.timezoneOffset); }
        if (config.week && $D._validate(config.week, 0, 53, "week")) { this.setWeek(config.week); }
        return this;
    }; $P.moveToFirstDayOfMonth = function () { return this.set({ day: 1 }); }; $P.moveToLastDayOfMonth = function () { return this.set({ day: $D.getDaysInMonth(this.getFullYear(), this.getMonth()) }); }; $P.moveToNthOccurrence = function (dayOfWeek, occurrence) {
        var shift = 0; if (occurrence > 0) { shift = occurrence - 1; }
        else if (occurrence === -1) {
            this.moveToLastDayOfMonth(); if (this.getDay() !== dayOfWeek) { this.moveToDayOfWeek(dayOfWeek, -1); }
            return this;
        }
        return this.moveToFirstDayOfMonth().addDays(-1).moveToDayOfWeek(dayOfWeek, +1).addWeeks(shift);
    }; $P.moveToDayOfWeek = function (dayOfWeek, orient) { var diff = (dayOfWeek - this.getDay() + 7 * (orient || +1)) % 7; return this.addDays((diff === 0) ? diff += 7 * (orient || +1) : diff); }; $P.moveToMonth = function (month, orient) { var diff = (month - this.getMonth() + 12 * (orient || +1)) % 12; return this.addMonths((diff === 0) ? diff += 12 * (orient || +1) : diff); }; $P.getOrdinalNumber = function () { return Math.ceil((this.clone().clearTime() - new Date(this.getFullYear(), 0, 1)) / 86400000) + 1; }; $P.getTimezone = function () { return $D.getTimezoneAbbreviation(this.getUTCOffset()); }; $P.setTimezoneOffset = function (offset) { var here = this.getTimezoneOffset(), there = Number(offset) * -6 / 10; return this.addMinutes(there - here); }; $P.setTimezone = function (offset) { return this.setTimezoneOffset($D.getTimezoneOffset(offset)); }; $P.hasDaylightSavingTime = function () { return (Date.today().set({ month: 0, day: 1 }).getTimezoneOffset() !== Date.today().set({ month: 6, day: 1 }).getTimezoneOffset()); }; $P.isDaylightSavingTime = function () { return (this.hasDaylightSavingTime() && new Date().getTimezoneOffset() === Date.today().set({ month: 6, day: 1 }).getTimezoneOffset()); }; $P.getUTCOffset = function () { var n = this.getTimezoneOffset() * -10 / 6, r; if (n < 0) { r = (n - 10000).toString(); return r.charAt(0) + r.substr(2); } else { r = (n + 10000).toString(); return "+" + r.substr(1); } }; $P.getElapsed = function (date) { return (date || new Date()) - this; }; if (!$P.toISOString) {
        $P.toISOString = function () {
            function f(n) { return n < 10 ? '0' + n : n; }
            return '"' + this.getUTCFullYear() + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate()) + 'T' +
                f(this.getUTCHours()) + ':' +
                f(this.getUTCMinutes()) + ':' +
                f(this.getUTCSeconds()) + 'Z"';
        };
    }
    $P._toString = $P.toString; $P.toString = function (format) {
        var x = this; if (format && format.length == 1) { var c = $C.formatPatterns; x.t = x.toString; switch (format) { case "d": return x.t(c.shortDate); case "D": return x.t(c.longDate); case "F": return x.t(c.fullDateTime); case "m": return x.t(c.monthDay); case "r": return x.t(c.rfc1123); case "s": return x.t(c.sortableDateTime); case "t": return x.t(c.shortTime); case "T": return x.t(c.longTime); case "u": return x.t(c.universalSortableDateTime); case "y": return x.t(c.yearMonth); } }
        var ord = function (n) { switch (n * 1) { case 1: case 21: case 31: return "st"; case 2: case 22: return "nd"; case 3: case 23: return "rd"; default: return "th"; } }; return format ? format.replace(/(\\)?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|S)/g, function (m) {
            if (m.charAt(0) === "\\") { return m.replace("\\", ""); }
            x.h = x.getHours; switch (m) { case "hh": return p(x.h() < 13 ? (x.h() === 0 ? 12 : x.h()) : (x.h() - 12)); case "h": return x.h() < 13 ? (x.h() === 0 ? 12 : x.h()) : (x.h() - 12); case "HH": return p(x.h()); case "H": return x.h(); case "mm": return p(x.getMinutes()); case "m": return x.getMinutes(); case "ss": return p(x.getSeconds()); case "s": return x.getSeconds(); case "yyyy": return p(x.getFullYear(), 4); case "yy": return p(x.getFullYear()); case "dddd": return $C.dayNames[x.getDay()]; case "ddd": return $C.abbreviatedDayNames[x.getDay()]; case "dd": return p(x.getDate()); case "d": return x.getDate(); case "MMMM": return $C.monthNames[x.getMonth()]; case "MMM": return $C.abbreviatedMonthNames[x.getMonth()]; case "MM": return p((x.getMonth() + 1)); case "M": return x.getMonth() + 1; case "t": return x.h() < 12 ? $C.amDesignator.substring(0, 1) : $C.pmDesignator.substring(0, 1); case "tt": return x.h() < 12 ? $C.amDesignator : $C.pmDesignator; case "S": return ord(x.getDate()); default: return m; }
        }) : this._toString();
    };
}());
(function () {
    var $D = Date, $P = $D.prototype, $C = $D.CultureInfo, $N = Number.prototype; $P._orient = +1; $P._nth = null; $P._is = false; $P._same = false; $P._isSecond = false; $N._dateElement = "day"; $P.next = function () { this._orient = +1; return this; }; $D.next = function () { return $D.today().next(); }; $P.last = $P.prev = $P.previous = function () { this._orient = -1; return this; }; $D.last = $D.prev = $D.previous = function () { return $D.today().last(); }; $P.is = function () { this._is = true; return this; }; $P.same = function () { this._same = true; this._isSecond = false; return this; }; $P.today = function () { return this.same().day(); }; $P.weekday = function () {
        if (this._is) { this._is = false; return (!this.is().sat() && !this.is().sun()); }
        return false;
    }; $P.at = function (time) { return (typeof time === "string") ? $D.parse(this.toString("d") + " " + time) : this.set(time); }; $N.fromNow = $N.after = function (date) { var c = {}; c[this._dateElement] = this; return ((!date) ? new Date() : date.clone()).add(c); }; $N.ago = $N.before = function (date) { var c = {}; c[this._dateElement] = this * -1; return ((!date) ? new Date() : date.clone()).add(c); }; var dx = ("sunday monday tuesday wednesday thursday friday saturday").split(/\s/), mx = ("january february march april may june july august september october november december").split(/\s/), px = ("Millisecond Second Minute Hour Day Week Month Year").split(/\s/), pxf = ("Milliseconds Seconds Minutes Hours Date Week Month FullYear").split(/\s/), nth = ("final first second third fourth fifth").split(/\s/), de; $P.toObject = function () {
        var o = {}; for (var i = 0; i < px.length; i++) { o[px[i].toLowerCase()] = this["get" + pxf[i]](); }
        return o;
    }; $D.fromObject = function (config) { config.week = null; return Date.today().set(config); }; var df = function (n) {
        return function () {
            if (this._is) { this._is = false; return this.getDay() == n; }
            if (this._nth !== null) {
                if (this._isSecond) { this.addSeconds(this._orient * -1); }
                this._isSecond = false; var ntemp = this._nth; this._nth = null; var temp = this.clone().moveToLastDayOfMonth(); this.moveToNthOccurrence(n, ntemp); if (this > temp) { throw new RangeError($D.getDayName(n) + " does not occur " + ntemp + " times in the month of " + $D.getMonthName(temp.getMonth()) + " " + temp.getFullYear() + "."); }
                return this;
            }
            return this.moveToDayOfWeek(n, this._orient);
        };
    }; var sdf = function (n) {
        return function () {
            var t = $D.today(), shift = n - t.getDay(); if (n === 0 && $C.firstDayOfWeek === 1 && t.getDay() !== 0) { shift = shift + 7; }
            return t.addDays(shift);
        };
    }; for (var i = 0; i < dx.length; i++) { $D[dx[i].toUpperCase()] = $D[dx[i].toUpperCase().substring(0, 3)] = i; $D[dx[i]] = $D[dx[i].substring(0, 3)] = sdf(i); $P[dx[i]] = $P[dx[i].substring(0, 3)] = df(i); }
    var mf = function (n) {
        return function () {
            if (this._is) { this._is = false; return this.getMonth() === n; }
            return this.moveToMonth(n, this._orient);
        };
    }; var smf = function (n) { return function () { return $D.today().set({ month: n, day: 1 }); }; }; for (var j = 0; j < mx.length; j++) { $D[mx[j].toUpperCase()] = $D[mx[j].toUpperCase().substring(0, 3)] = j; $D[mx[j]] = $D[mx[j].substring(0, 3)] = smf(j); $P[mx[j]] = $P[mx[j].substring(0, 3)] = mf(j); }
    var ef = function (j) {
        return function () {
            if (this._isSecond) { this._isSecond = false; return this; }
            if (this._same) {
                this._same = this._is = false; var o1 = this.toObject(), o2 = (arguments[0] || new Date()).toObject(), v = "", k = j.toLowerCase(); for (var m = (px.length - 1); m > -1; m--) {
                    v = px[m].toLowerCase(); if (o1[v] != o2[v]) { return false; }
                    if (k == v) { break; }
                }
                return true;
            }
            if (j.substring(j.length - 1) != "s") { j += "s"; }
            return this["add" + j](this._orient);
        };
    }; var nf = function (n) { return function () { this._dateElement = n; return this; }; }; for (var k = 0; k < px.length; k++) { de = px[k].toLowerCase(); $P[de] = $P[de + "s"] = ef(px[k]); $N[de] = $N[de + "s"] = nf(de); }
    $P._ss = ef("Second"); var nthfn = function (n) {
        return function (dayOfWeek) {
            if (this._same) { return this._ss(arguments[0]); }
            if (dayOfWeek || dayOfWeek === 0) { return this.moveToNthOccurrence(dayOfWeek, n); }
            this._nth = n; if (n === 2 && (dayOfWeek === undefined || dayOfWeek === null)) { this._isSecond = true; return this.addSeconds(this._orient); }
            return this;
        };
    }; for (var l = 0; l < nth.length; l++) { $P[nth[l]] = (l === 0) ? nthfn(-1) : nthfn(l); }
}());
(function () {
    Date.Parsing = { Exception: function (s) { this.message = "Parse error at '" + s.substring(0, 10) + " ...'"; } }; var $P = Date.Parsing; var _ = $P.Operators = {
        rtoken: function (r) { return function (s) { var mx = s.match(r); if (mx) { return ([mx[0], s.substring(mx[0].length)]); } else { throw new $P.Exception(s); } }; }, token: function (s) { return function (s) { return _.rtoken(new RegExp("^\s*" + s + "\s*"))(s); }; }, stoken: function (s) { return _.rtoken(new RegExp("^" + s)); }, until: function (p) {
            return function (s) {
                var qx = [], rx = null; while (s.length) {
                    try { rx = p.call(this, s); } catch (e) { qx.push(rx[0]); s = rx[1]; continue; }
                    break;
                }
                return [qx, s];
            };
        }, many: function (p) {
            return function (s) {
                var rx = [], r = null; while (s.length) {
                    try { r = p.call(this, s); } catch (e) { return [rx, s]; }
                    rx.push(r[0]); s = r[1];
                }
                return [rx, s];
            };
        }, optional: function (p) {
            return function (s) {
                var r = null; try { r = p.call(this, s); } catch (e) { return [null, s]; }
                return [r[0], r[1]];
            };
        }, not: function (p) {
            return function (s) {
                try { p.call(this, s); } catch (e) { return [null, s]; }
                throw new $P.Exception(s);
            };
        }, ignore: function (p) { return p ? function (s) { var r = null; r = p.call(this, s); return [null, r[1]]; } : null; }, product: function () {
            var px = arguments[0], qx = Array.prototype.slice.call(arguments, 1), rx = []; for (var i = 0; i < px.length; i++) { rx.push(_.each(px[i], qx)); }
            return rx;
        }, cache: function (rule) {
            var cache = {}, r = null; return function (s) {
                try { r = cache[s] = (cache[s] || rule.call(this, s)); } catch (e) { r = cache[s] = e; }
                if (r instanceof $P.Exception) { throw r; } else { return r; }
            };
        }, any: function () {
            var px = arguments; return function (s) {
                var r = null; for (var i = 0; i < px.length; i++) {
                    if (px[i] == null) { continue; }
                    try { r = (px[i].call(this, s)); } catch (e) { r = null; }
                    if (r) { return r; }
                }
                throw new $P.Exception(s);
            };
        }, each: function () {
            var px = arguments; return function (s) {
                var rx = [], r = null; for (var i = 0; i < px.length; i++) {
                    if (px[i] == null) { continue; }
                    try { r = (px[i].call(this, s)); } catch (e) { throw new $P.Exception(s); }
                    rx.push(r[0]); s = r[1];
                }
                return [rx, s];
            };
        }, all: function () { var px = arguments, _ = _; return _.each(_.optional(px)); }, sequence: function (px, d, c) {
            d = d || _.rtoken(/^\s*/); c = c || null; if (px.length == 1) { return px[0]; }
            return function (s) {
                var r = null, q = null; var rx = []; for (var i = 0; i < px.length; i++) {
                    try { r = px[i].call(this, s); } catch (e) { break; }
                    rx.push(r[0]); try { q = d.call(this, r[1]); } catch (ex) { q = null; break; }
                    s = q[1];
                }
                if (!r) { throw new $P.Exception(s); }
                if (q) { throw new $P.Exception(q[1]); }
                if (c) { try { r = c.call(this, r[1]); } catch (ey) { throw new $P.Exception(r[1]); } }
                return [rx, (r ? r[1] : s)];
            };
        }, between: function (d1, p, d2) { d2 = d2 || d1; var _fn = _.each(_.ignore(d1), p, _.ignore(d2)); return function (s) { var rx = _fn.call(this, s); return [[rx[0][0], r[0][2]], rx[1]]; }; }, list: function (p, d, c) { d = d || _.rtoken(/^\s*/); c = c || null; return (p instanceof Array ? _.each(_.product(p.slice(0, -1), _.ignore(d)), p.slice(-1), _.ignore(c)) : _.each(_.many(_.each(p, _.ignore(d))), px, _.ignore(c))); }, set: function (px, d, c) {
            d = d || _.rtoken(/^\s*/); c = c || null; return function (s) {
                var r = null, p = null, q = null, rx = null, best = [[], s], last = false; for (var i = 0; i < px.length; i++) {
                    q = null; p = null; r = null; last = (px.length == 1); try { r = px[i].call(this, s); } catch (e) { continue; }
                    rx = [[r[0]], r[1]]; if (r[1].length > 0 && !last) { try { q = d.call(this, r[1]); } catch (ex) { last = true; } } else { last = true; }
                    if (!last && q[1].length === 0) { last = true; }
                    if (!last) {
                        var qx = []; for (var j = 0; j < px.length; j++) { if (i != j) { qx.push(px[j]); } }
                        p = _.set(qx, d).call(this, q[1]); if (p[0].length > 0) { rx[0] = rx[0].concat(p[0]); rx[1] = p[1]; }
                    }
                    if (rx[1].length < best[1].length) { best = rx; }
                    if (best[1].length === 0) { break; }
                }
                if (best[0].length === 0) { return best; }
                if (c) {
                    try { q = c.call(this, best[1]); } catch (ey) { throw new $P.Exception(best[1]); }
                    best[1] = q[1];
                }
                return best;
            };
        }, forward: function (gr, fname) { return function (s) { return gr[fname].call(this, s); }; }, replace: function (rule, repl) { return function (s) { var r = rule.call(this, s); return [repl, r[1]]; }; }, process: function (rule, fn) { return function (s) { var r = rule.call(this, s); return [fn.call(this, r[0]), r[1]]; }; }, min: function (min, rule) {
            return function (s) {
                var rx = rule.call(this, s); if (rx[0].length < min) { throw new $P.Exception(s); }
                return rx;
            };
        }
    }; var _generator = function (op) {
        return function () {
            var args = null, rx = []; if (arguments.length > 1) { args = Array.prototype.slice.call(arguments); } else if (arguments[0] instanceof Array) { args = arguments[0]; }
            if (args) { for (var i = 0, px = args.shift(); i < px.length; i++) { args.unshift(px[i]); rx.push(op.apply(null, args)); args.shift(); return rx; } } else { return op.apply(null, arguments); }
        };
    }; var gx = "optional not ignore cache".split(/\s/); for (var i = 0; i < gx.length; i++) { _[gx[i]] = _generator(_[gx[i]]); }
    var _vector = function (op) { return function () { if (arguments[0] instanceof Array) { return op.apply(null, arguments[0]); } else { return op.apply(null, arguments); } }; }; var vx = "each any all".split(/\s/); for (var j = 0; j < vx.length; j++) { _[vx[j]] = _vector(_[vx[j]]); }
}()); (function () {
    var $D = Date, $P = $D.prototype, $C = $D.CultureInfo; var flattenAndCompact = function (ax) {
        var rx = []; for (var i = 0; i < ax.length; i++) { if (ax[i] instanceof Array) { rx = rx.concat(flattenAndCompact(ax[i])); } else { if (ax[i]) { rx.push(ax[i]); } } }
        return rx;
    }; $D.Grammar = {}; $D.Translator = {
        hour: function (s) { return function () { this.hour = Number(s); }; }, minute: function (s) { return function () { this.minute = Number(s); }; }, second: function (s) { return function () { this.second = Number(s); }; }, meridian: function (s) { return function () { this.meridian = s.slice(0, 1).toLowerCase(); }; }, timezone: function (s) { return function () { var n = s.replace(/[^\d\+\-]/g, ""); if (n.length) { this.timezoneOffset = Number(n); } else { this.timezone = s.toLowerCase(); } }; }, day: function (x) { var s = x[0]; return function () { this.day = Number(s.match(/\d+/)[0]); }; }, month: function (s) { return function () { this.month = (s.length == 3) ? "jan feb mar apr may jun jul aug sep oct nov dec".indexOf(s) / 4 : Number(s) - 1; }; }, year: function (s) { return function () { var n = Number(s); this.year = ((s.length > 2) ? n : (n + (((n + 2000) < $C.twoDigitYearMax) ? 2000 : 1900))); }; }, rday: function (s) { return function () { switch (s) { case "yesterday": this.days = -1; break; case "tomorrow": this.days = 1; break; case "today": this.days = 0; break; case "now": this.days = 0; this.now = true; break; } }; }, finishExact: function (x) {
            x = (x instanceof Array) ? x : [x]; for (var i = 0; i < x.length; i++) { if (x[i]) { x[i].call(this); } }
            var now = new Date(); if ((this.hour || this.minute) && (!this.month && !this.year && !this.day)) { this.day = now.getDate(); }
            if (!this.year) { this.year = now.getFullYear(); }
            if (!this.month && this.month !== 0) { this.month = now.getMonth(); }
            if (!this.day) { this.day = 1; }
            if (!this.hour) { this.hour = 0; }
            if (!this.minute) { this.minute = 0; }
            if (!this.second) { this.second = 0; }
            if (this.meridian && this.hour) { if (this.meridian == "p" && this.hour < 12) { this.hour = this.hour + 12; } else if (this.meridian == "a" && this.hour == 12) { this.hour = 0; } }
            if (this.day > $D.getDaysInMonth(this.year, this.month)) { throw new RangeError(this.day + " is not a valid value for days."); }
            var r = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second); if (this.timezone) { r.set({ timezone: this.timezone }); } else if (this.timezoneOffset) { r.set({ timezoneOffset: this.timezoneOffset }); }
            return r;
        }, finish: function (x) {
            x = (x instanceof Array) ? flattenAndCompact(x) : [x]; if (x.length === 0) { return null; }
            for (var i = 0; i < x.length; i++) { if (typeof x[i] == "function") { x[i].call(this); } }
            var today = $D.today(); if (this.now && !this.unit && !this.operator) { return new Date(); } else if (this.now) { today = new Date(); }
            var expression = !!(this.days && this.days !== null || this.orient || this.operator); var gap, mod, orient; orient = ((this.orient == "past" || this.operator == "subtract") ? -1 : 1); if (!this.now && "hour minute second".indexOf(this.unit) != -1) { today.setTimeToNow(); }
            if (this.month || this.month === 0) { if ("year day hour minute second".indexOf(this.unit) != -1) { this.value = this.month + 1; this.month = null; expression = true; } }
            if (!expression && this.weekday && !this.day && !this.days) {
                var temp = Date[this.weekday](); this.day = temp.getDate(); if (!this.month) { this.month = temp.getMonth(); }
                this.year = temp.getFullYear();
            }
            if (expression && this.weekday && this.unit != "month") { this.unit = "day"; gap = ($D.getDayNumberFromName(this.weekday) - today.getDay()); mod = 7; this.days = gap ? ((gap + (orient * mod)) % mod) : (orient * mod); }
            if (this.month && this.unit == "day" && this.operator) { this.value = (this.month + 1); this.month = null; }
            if (this.value != null && this.month != null && this.year != null) { this.day = this.value * 1; }
            if (this.month && !this.day && this.value) { today.set({ day: this.value * 1 }); if (!expression) { this.day = this.value * 1; } }
            if (!this.month && this.value && this.unit == "month" && !this.now) { this.month = this.value; expression = true; }
            if (expression && (this.month || this.month === 0) && this.unit != "year") { this.unit = "month"; gap = (this.month - today.getMonth()); mod = 12; this.months = gap ? ((gap + (orient * mod)) % mod) : (orient * mod); this.month = null; }
            if (!this.unit) { this.unit = "day"; }
            if (!this.value && this.operator && this.operator !== null && this[this.unit + "s"] && this[this.unit + "s"] !== null) { this[this.unit + "s"] = this[this.unit + "s"] + ((this.operator == "add") ? 1 : -1) + (this.value || 0) * orient; } else if (this[this.unit + "s"] == null || this.operator != null) {
                if (!this.value) { this.value = 1; }
                this[this.unit + "s"] = this.value * orient;
            }
            if (this.meridian && this.hour) { if (this.meridian == "p" && this.hour < 12) { this.hour = this.hour + 12; } else if (this.meridian == "a" && this.hour == 12) { this.hour = 0; } }
            if (this.weekday && !this.day && !this.days) { var temp = Date[this.weekday](); this.day = temp.getDate(); if (temp.getMonth() !== today.getMonth()) { this.month = temp.getMonth(); } }
            if ((this.month || this.month === 0) && !this.day) { this.day = 1; }
            if (!this.orient && !this.operator && this.unit == "week" && this.value && !this.day && !this.month) { return Date.today().setWeek(this.value); }
            if (expression && this.timezone && this.day && this.days) { this.day = this.days; }
            return (expression) ? today.add(this) : today.set(this);
        }
    }; var _ = $D.Parsing.Operators, g = $D.Grammar, t = $D.Translator, _fn; g.datePartDelimiter = _.rtoken(/^([\s\-\.\,\/\x27]+)/); g.timePartDelimiter = _.stoken(":"); g.whiteSpace = _.rtoken(/^\s*/); g.generalDelimiter = _.rtoken(/^(([\s\,]|at|@|on)+)/); var _C = {}; g.ctoken = function (keys) {
        var fn = _C[keys]; if (!fn) {
            var c = $C.regexPatterns; var kx = keys.split(/\s+/), px = []; for (var i = 0; i < kx.length; i++) { px.push(_.replace(_.rtoken(c[kx[i]]), kx[i])); }
            fn = _C[keys] = _.any.apply(null, px);
        }
        return fn;
    }; g.ctoken2 = function (key) { return _.rtoken($C.regexPatterns[key]); }; g.h = _.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2]|[1-9])/), t.hour)); g.hh = _.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2])/), t.hour)); g.H = _.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/), t.hour)); g.HH = _.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3])/), t.hour)); g.m = _.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/), t.minute)); g.mm = _.cache(_.process(_.rtoken(/^[0-5][0-9]/), t.minute)); g.s = _.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/), t.second)); g.ss = _.cache(_.process(_.rtoken(/^[0-5][0-9]/), t.second)); g.hms = _.cache(_.sequence([g.H, g.m, g.s], g.timePartDelimiter)); g.t = _.cache(_.process(g.ctoken2("shortMeridian"), t.meridian)); g.tt = _.cache(_.process(g.ctoken2("longMeridian"), t.meridian)); g.z = _.cache(_.process(_.rtoken(/^((\+|\-)\s*\d\d\d\d)|((\+|\-)\d\d\:?\d\d)/), t.timezone)); g.zz = _.cache(_.process(_.rtoken(/^((\+|\-)\s*\d\d\d\d)|((\+|\-)\d\d\:?\d\d)/), t.timezone)); g.zzz = _.cache(_.process(g.ctoken2("timezone"), t.timezone)); g.timeSuffix = _.each(_.ignore(g.whiteSpace), _.set([g.tt, g.zzz])); g.time = _.each(_.optional(_.ignore(_.stoken("T"))), g.hms, g.timeSuffix); g.d = _.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1]|\d)/), _.optional(g.ctoken2("ordinalSuffix"))), t.day)); g.dd = _.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1])/), _.optional(g.ctoken2("ordinalSuffix"))), t.day)); g.ddd = g.dddd = _.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"), function (s) { return function () { this.weekday = s; }; })); g.M = _.cache(_.process(_.rtoken(/^(1[0-2]|0\d|\d)/), t.month)); g.MM = _.cache(_.process(_.rtoken(/^(1[0-2]|0\d)/), t.month)); g.MMM = g.MMMM = _.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"), t.month)); g.y = _.cache(_.process(_.rtoken(/^(\d\d?)/), t.year)); g.yy = _.cache(_.process(_.rtoken(/^(\d\d)/), t.year)); g.yyy = _.cache(_.process(_.rtoken(/^(\d\d?\d?\d?)/), t.year)); g.yyyy = _.cache(_.process(_.rtoken(/^(\d\d\d\d)/), t.year)); _fn = function () { return _.each(_.any.apply(null, arguments), _.not(g.ctoken2("timeContext"))); }; g.day = _fn(g.d, g.dd); g.month = _fn(g.M, g.MMM); g.year = _fn(g.yyyy, g.yy); g.orientation = _.process(g.ctoken("past future"), function (s) { return function () { this.orient = s; }; }); g.operator = _.process(g.ctoken("add subtract"), function (s) { return function () { this.operator = s; }; }); g.rday = _.process(g.ctoken("yesterday tomorrow today now"), t.rday); g.unit = _.process(g.ctoken("second minute hour day week month year"), function (s) { return function () { this.unit = s; }; }); g.value = _.process(_.rtoken(/^\d\d?(st|nd|rd|th)?/), function (s) { return function () { this.value = s.replace(/\D/g, ""); }; }); g.expression = _.set([g.rday, g.operator, g.value, g.unit, g.orientation, g.ddd, g.MMM]); _fn = function () { return _.set(arguments, g.datePartDelimiter); }; g.mdy = _fn(g.ddd, g.month, g.day, g.year); g.ymd = _fn(g.ddd, g.year, g.month, g.day); g.dmy = _fn(g.ddd, g.day, g.month, g.year); g.date = function (s) { return ((g[$C.dateElementOrder] || g.mdy).call(this, s)); }; g.format = _.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/), function (fmt) { if (g[fmt]) { return g[fmt]; } else { throw $D.Parsing.Exception(fmt); } }), _.process(_.rtoken(/^[^dMyhHmstz]+/), function (s) { return _.ignore(_.stoken(s)); }))), function (rules) { return _.process(_.each.apply(null, rules), t.finishExact); }); var _F = {}; var _get = function (f) { return _F[f] = (_F[f] || g.format(f)[0]); }; g.formats = function (fx) {
        if (fx instanceof Array) {
            var rx = []; for (var i = 0; i < fx.length; i++) { rx.push(_get(fx[i])); }
            return _.any.apply(null, rx);
        } else { return _get(fx); }
    }; g._formats = g.formats(["\"yyyy-MM-ddTHH:mm:ssZ\"", "yyyy-MM-ddTHH:mm:ssZ", "yyyy-MM-ddTHH:mm:ssz", "yyyy-MM-ddTHH:mm:ss", "yyyy-MM-ddTHH:mmZ", "yyyy-MM-ddTHH:mmz", "yyyy-MM-ddTHH:mm", "ddd, MMM dd, yyyy H:mm:ss tt", "ddd MMM d yyyy HH:mm:ss zzz", "MMddyyyy", "ddMMyyyy", "Mddyyyy", "ddMyyyy", "Mdyyyy", "dMyyyy", "yyyy", "Mdyy", "dMyy", "d"]); g._start = _.process(_.set([g.date, g.time, g.expression], g.generalDelimiter, g.whiteSpace), t.finish); g.start = function (s) {
        try { var r = g._formats.call({}, s); if (r[1].length === 0) { return r; } } catch (e) { }
        return g._start.call({}, s);
    }; $D._parse = $D.parse; $D.parse = function (s) {
        var r = null; if (!s) { return null; }
        if (s instanceof Date) { return s; }
        try { r = $D.Grammar.start.call({}, s.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1")); } catch (e) { return null; }
        return ((r[1].length === 0) ? r[0] : null);
    }; $D.getParseFunction = function (fx) {
        var fn = $D.Grammar.formats(fx); return function (s) {
            var r = null; try { r = fn.call({}, s); } catch (e) { return null; }
            return ((r[1].length === 0) ? r[0] : null);
        };
    }; $D.parseExact = function (s, fx) { return $D.getParseFunction(fx)(s); };
}());

Globalize.loadMessages({
    en: {
        validations: {
            required: "El campo (nameControl) es obligatorio",
            numeric: "El campo (nameControl) solo permite n??meros",
            stringLength: "El campo (nameControl) solo admite entre (minLength) y (maxLength) caracteres",
            range: "El campo (nameControl) no debe ser menor a (rangomenor) ni mayor a (rangomayor)",
            pattern: "El campo (nameControl) no coincide con el patr??n establecido",
            email: "El campo (nameControl) no es v??lido",
            compare: "El campo (nameControl) no coincide con el campo (campocomparar)",
            custom: "El campo (nameControl) no se v??lido",
            vced: "El campo Identificaci??n no es v??lido",
            vruc: "El campo RUC no es v??lido",
            vtelfcon: "El campo tel??fono debe seguir el siguiente formato: ",
            vcel: "El campo celular debe seguir el siguiente formato: {0}",
            vpass: "El campo pasporte no es v??lido",
            InputDateFrom: 'Ingrese la Fecha Desde',
            DateOutRange: 'El valor de la fecha est?? fuera del rango establecido.',
            ErrorRangeDate: "Rango de fechas incorrectas",
            DateFromGreatherThanDateAt: 'La Fecha Desde debe ser menor a la Fecha Hasta',
            InvalidDate: 'La fecha establecida es inv??lida.',
        },
        tags: {
            Summary_Avg: 'Promedio',
            Summary_Other_Avg: 'Promedio de',
            Summary_Count: 'Total',
            Summary_Max: 'M??ximo',
            Summary_Other_Max: 'M??ximo de',
            Summary_Min: 'M??nimo',
            Summary_Other_Min: 'M??nimo de',
            Summary_Sum: 'Sumatoria',
            Summary_Other_Sum: 'Sumatoria de',
            Button_Accept: 'Aceptar',
            CountSelect: 'Total Seleccionados=',
            Button_Cancel: 'Cancelar',
            Button_Find: 'Buscar',
            Button_Save: 'Guardar',
            Button_Back: 'Regresar',
            Button_Edit: 'Editar',
            Button_New: 'Nuevo',
            Button_Print: 'Imprimir',
            Button_Search: 'Buscar',
            Button_Send: 'Enviar',
            Button_Export: 'Exportar',
            Button_Refresh: 'Refrescar',
            IsActive: 'Es Activo',
            IsMasive: 'Es Masivo',
            Yes: 'SI',
            No: 'NO',
            GeographicLocation1: 'Departamento',
            GeographicLocation2: 'Provincia',
            GeographicLocation3: 'Distrito',
            GeographicLocation4: ''
        },
        messages: {
            ErrorData: 'Existen campos llenados incorrectamente.'
        }
    }
})

/*****************************************************************************************************************************************************************************************************************************************************************
--------------------------------------------------------------A C C E S O  E T I Q U E T A S / M E N S A J E S / V A L I D A C I O N E S--------------------------------------------------------------------------------------------------------------------------
*****************************************************************************************************************************************************************************************************************************************************************/

/*
    Acceso a Mensajes
        Accede al mensaje establecido en el archivo de recursos de acuerdo a su c??digo de mensaje
    Par??metros:
        messageCode: C??digo de Mensaje al cual se desea acceder.
*/
CORE_MESSAGE = function (messageCode) {
    try {
        return Globalize('en').formatMessage('messages/' + messageCode);
    } catch (e) {
        return messageCode;
    }
}

CORE_MESSAGE_ADD = function (messageCode, valuesReplace) {
    try {
        var message = Globalize('en').messageFormatter('messages/' + messageCode);
        return message(valuesReplace);
    } catch (e) {
        return messageCode;
    }

}

/*
    Acceso a Etiquetas
        Accede a la etiqueta establecida en el archivo de recursos de acuerdo a su c??digo.
    Par??metros:
        tagCode: C??digo de Etiqueta al cual se desea acceder.
*/
CORE_TAG = function (tagCode) {
    try {
        return Globalize('en').formatMessage("tags/" + tagCode);
    } catch (e) {
        return tagCode;
    }
}

/*
    Acceso a Validaciones
        Accede a la validaci??n establecida en el archivo de recursos de acuerdo al tipo de validaci??n.
    Par??metros:
        typeValidation: Validaci??n al cual se desea acceder.
*/
CORE_VALIDATION = function (typeValidation) {
    try {
        return Globalize('en').formatMessage("validations/" + typeValidation);
    } catch (e) {
        return typeValidation;
    }
}

CORE_VALIDATION_ADD = function (typeValidation, values) {
    try {
        var validation = Globalize('en').messageFormatter("validations/" + typeValidation);
        return validation(values);
    } catch (e) {
        return typeValidation;
    }
}
var iconosCore = {
    down: 'fa-caret-square-o-down',
    warning: 'fa-warning',
    adjust: 'fa-adjust',
    random: 'fa-random',
    thumb_tack: 'fa-thumb-tack',
    align_center: 'fa-align-center',
    align_right: 'fa-align-right',
    align_left: 'fa-align-left',
    align_justify: 'fa-align-justify',
    text_height: 'fa-text-height',
    ambulance: 'fa-ambulance',
    text_width: 'fa-text-width',
    anchor: 'fa-anchor',
    angle_down: 'fa-angle-down',
    angle_up: 'fa-angle-up',
    angle_right: 'fa-angle-right',
    angle_left: 'fa-angle-left',
    power_off: 'fa-power-off',
    adn: 'fa-adn',
    android: 'fa-android',
    apple: 'fa-apple',
    bitbucket: 'fa-bitbucket',
    bitbucket_borde: 'fa-bitbucket-square',
    bitcoin: 'fa-bitcoin',
    css3: 'fa-css3',
    dribbble: 'fa-dribbble',
    dropbox: 'fa-dropbox',
    facebook: 'fa-facebook',
    facebook_borde: 'fa-facebook-square',
    flickr: ' fa-flickr',
    foursquare: 'fa-foursquare',
    github: 'fa-github',
    github_alt: 'fa-github-alt',
    github_borde: 'fa-github-square',
    gittip: 'fa-gittip',
    googleplus: 'fa-google-plus',
    googleplus_borde: 'fa-google-plus-square',
    html5: 'fa-html5',
    instagram: 'fa-instagram',
    linkedin: 'fa-linkedin',
    linkedin_borde: 'fa-linkedin-square',
    linux: 'fa-linux',
    maxcdn: 'fa-maxcdn',
    pagelines: 'fa-pagelines',
    pinterest: 'fa-pinterest',
    pinterest_borde: 'fa-pinterest-square',
    renren: 'fa-renren',
    skype: 'fa-skype',
    trello: 'fa-trello',
    tumblr: 'fa-tumblr',
    tumbrl_borde: 'fa-tumblr-square',
    twitter: 'fa-twitter',
    twitter_borde: 'fa-twitter-square',
    vimeo_borde: 'fa-vimeo-square',
    vk: 'fa-vk',
    weibo: 'fa-weibo',
    windows: 'fa-windows',
    xing: 'fa-xing',
    xing_borde: 'fa-xing-square',
    youtube: 'fa-youtube',
    youtube_borde: 'fa-youtube-square',
    tree: 'fa-tree',
    archive: 'fa-archive',
    file: 'fa-file',
    file_o: 'fa-file-o',
    files_o: 'fa-files-o',
    file_audio_o: 'fa-file-audio-o',
    file_code_o: 'fa-file-code-o',
    file_archive_o: 'fa-file-archive-o',
    file_excel_o: 'fa-file-excel-o',
    file_image_o: 'fa-file-image-o',
    file_pdf_o: 'fa-file-pdf-o',
    file_powerpoint_o: 'fa-file-powerpoint-o',
    file_text: 'fa-file-text',
    file_video_o: 'fa-file-video-o',
    file_word_o: 'fa-file-word-o',
    file_zip_o: 'fa-file-zip-o',
    up: 'fa-caret-square-o-up',
    asterisk: 'fa-asterisk',
    headphones: 'fa-headphones',
    indent: 'fa-indent',
    plane: 'fa-plane',
    paper_plane: 'fa-paper-plane',
    paper_plane_o: 'fa-paper-plane-o',
    volume_down: 'fa-volume-down',
    inbox: 'fa-inbox',
    flag: 'fa-flag',
    flag_checkered: 'fa-flag-checkered',
    flag_o: 'fa-flag-o',
    bank: 'fa-bank',
    bars: 'fa-bars',
    database: 'fa-database',
    trash_o: 'fa-trash-o',
    code_fork: 'fa-code-fork',
    graduation_cap: 'fa-graduation-cap',
    lock: 'fa-lock',
    bold: 'fa-bold',
    bomb: 'fa-bomb',
    lightbulb_o: 'fa-lightbulb-o',
    eraser: 'fa-eraser',
    compass: 'fa-compass',
    search: 'fa-search',
    search_plus: 'fa-search-plus',
    search_minus: 'fa-search-minus',
    chain: 'fa-chain',
    chain_broken: 'fa-chain-broken',
    coffee: 'fa-coffee',
    calculator: 'fa-calculator',
    calendar: 'fa-calendar',
    calendar_o: 'fa-calendar-o',
    camera: 'fa-camera',
    camera_retro: 'fa-camera-retro',
    truck: 'fa-truck',
    bell: 'fa-bell',
    bell_o: 'fa-bell-o',
    meh_o: 'fa-meh-o',
    smile_o: 'fa-smile-o',
    frown_o: 'fa-frown-o',
    folder: 'fa-folder',
    folder_open: 'fa-folder-open',
    folder_open_o: 'fa-folder-open-o',
    folder_o: 'fa-folder-o',
    road: 'fa-road',
    shopping_cart: 'fa-shopping-cart',
    car: 'fa-car',
    mobile: 'fa-mobile',
    times: 'fa-times',
    times_circle: 'fa-times-circle',
    times_circle_o: 'fa-times-circle-o',
    certificate: 'fa-certificate',
    beers: 'fa-beers',
    check: 'fa-check',
    check_circle: 'fa-check-circle',
    check_circle_o: 'fa-check-circle-o',
    check_square: 'fa-check-square',
    check_square_o: 'fa-check-square-o',
    chevron_down: 'fa-chevron-down',
    chevron_up: 'fa-chevron-up',
    chevron_right: 'fa-chevron-right',
    chevron_left: 'fa-chevron-left',
    chevron_circle_down: 'fa-chevron-circle-down',
    chevron_circle_up: 'fa-chevron-circle-up',
    chevron_circle_right: 'fa-chevron-circle-right',
    chevron_circle_left: 'fa-chevron-circle-left',
    circle: 'fa-circle',
    circle_thin: 'fa-circle-thin',
    dot_circle_o: 'fa-dot-circle-o',
    circle_o: 'fa-circle-o',
    paperclip: 'fa-paperclip',
    code: 'fa-code',
    barcode: 'fa-barcode',
    qrcode: 'fa-qrcode',
    rocket: 'fa-rocket',
    columns: 'fa-columns',
    comment: 'fa-comment',
    comment_o: 'fa-comment-o',
    comments: 'fa-comments',
    comments_o: 'fa-comments-o',
    quote_right: 'fa-quote-right',
    quote_left: 'fa-quote-left',
    share: 'fa-share',
    share_alt: 'fa-share-alt',
    share_alt_square: 'fa-share-alt-square',
    share_square: 'fa-share-square',
    share_square_o: 'fa-share-square-o',
    copy: 'fa-copy',
    heart: 'fa-heart',
    heart_o: 'fa-heart-o',
    cut: 'fa-cut',
    crop: 'fa-crop',
    square: 'fa-square',
    square_o: 'fa-square-o',
    cutlery: 'fa-cutlery',
    cube: 'fa-cube',
    cubes: 'fa-cubes',
    spoon: 'fa-spoon',
    dashboard: 'fa-dashboard',
    right: 'fa-caret-square-o-right',
    unlock: 'fa-unlock',
    unlock_alt: 'fa-unlock-alt',
    download: 'fa-download',
    sign_out: 'fa-sign-out',
    ban: 'fa-ban',
    undo: 'fa-undo',
    sliders: 'fa-sliders',
    money: 'fa-money',
    hdd_o: 'fa-hdd-o',
    floppy: 'fa-floppy-o',
    angle_double_down: 'fa-angle-double-down',
    angle_double_up: 'fa-angle-double-up',
    angle_double_right: 'fa-angle-double-right',
    angle_double_left: 'fa-angle-double-left',
    dollar: 'fa-dollar',
    building: 'fa-building',
    building_o: 'fa-building-o',
    edit: 'fa-edit',
    send: 'fa-send',
    send_o: 'fa-send-o',
    desktop: 'fa-desktop',
    shield: 'fa-shield',
    stethoscope: 'fa-stethoscope',
    star: 'fa-star',
    star_half: 'fa-star-half',
    star_half_o: 'fa-star-half-o',
    star_o: 'fa-star-o',
    tag: 'fa-tag',
    tags: 'fa-tags',
    euro: 'fa-euro',
    fire_extinguisher: 'fa-fire-extinguisher',
    fax: 'fa-fax',
    arrow_down: 'fa-arrow-down',
    arrow_up: 'fa-arrow-up',
    arrow_right: 'fa-arrow-right',
    arrow_left: 'fa-arrow-left',
    arrows_h: 'fa-arrows-h',
    arrows_v: 'fa-arrows-v',
    arrow_circle_down: 'fa-arrow-circle-down',
    arrow_circle_down_o: 'fa-arrow-circle-o-down',
    arrow_circle_up: 'fa-arrow-circle-up',
    arrow_circle_up_o: 'fa-arrow-circle-o-up',
    arrow_circle_right: 'fa-arrow-circle-right',
    arrow_circle_right_o: 'fa-arrow-circle-o-right',
    arrow_circle_left: 'fa-arrow-circle-left',
    arrow_circle_left_o: 'fa-arrow-circle-o-left',
    location_arrow: 'fa-location-arrow',
    arrows: 'fa-arrows',
    arrows_alt: 'fa-arrows-alt',
    long_arrow_down: 'fa-long-arrow-down',
    long_arrow_up: 'fa-long-arrow-up',
    long_arrow_right: 'fa-long-arrow-right',
    long_arrow_left: 'fa-long-arrow-left',
    filter: 'fa-filter',
    flask: 'fa-flask',
    fire: 'fa-fire',
    font: 'fa-font',
    gamepad: 'fa-gamepad',
    rotate_right: 'fa-rotate-right',
    rotate_left: 'fa-rotate-left',
    globe: 'fa-globe',
    google: 'fa-google',
    bar_chart_o: 'fa-bar-chart-o',
    group: 'fa-group',
    save: 'fa-save',
    header: 'fa-header',
    external_link: 'fa-external-link',
    external_link_square: 'fa-external-link-square',
    history: 'fa-history',
    leaf: 'fa-leaf',
    male: 'fa-male',
    h_square: 'fa-h-square',
    hospital_o: 'fa-hospital-o',
    language: 'fa-language',
    magnet: 'fa-magnet',
    empire: 'fa-empire',
    print: 'fa-print',
    map_marker: 'fa-map-marker',
    map: 'fa-map-o',
    info: 'fa-info',
    info_circle: 'fa-info-circle',
    home: 'fa-home',
    bug: 'fa-bug',
    institution: 'fa-institution',
    exchange: 'fa-exchange',
    italic: 'fa-italic',
    left: 'fa-caret-square-o-left',
    fighter_jet: 'fa-fighter-jet',
    joomla: 'fa-joomla',
    medkit: 'fa-medkit',
    pencil: 'fa-pencil',
    pencil_square: 'fa-pencil-square',
    lapiz_borde_T: 'fa-pencil-square-o',
    laptop: 'fa-laptop',
    key: 'fa-key',
    wrench: 'fa-wrench',
    book: 'fa-book',
    lemon_o: 'fa-lemon-o',
    list: 'fa-list',
    list_alt: 'fa-list-alt',
    list_ul: 'fa-list-ul',
    list_ol: 'fa-list-ol',
    moon_o: 'fa-moon-o',
    suitcase: 'fa-suitcase',
    briefcase: 'fa-briefcase',
    hand_down_o: 'fa-hand-o-down',
    hand_up_o: 'fa-hand-o-up',
    hand_right_o: 'fa-hand-o-right',
    hand_left_o: 'fa-hand-o-left',
    sitemap: 'fa-sitemap',
    bookmark: 'fa-bookmark',
    bookmark_o: 'fa-bookmark-o',
    legal: 'fa-legal',
    bullhorn: 'fa-bullhorn',
    envelope: 'fa-envelope',
    envelope_square: 'fa-envelope-square',
    envelope_o: 'fa-envelope-o',
    microphone: 'fa-microphone',
    microphone_slash: 'fa-microphone-slash',
    circle_notch_o: 'fa-circle-o-notch',
    female: 'fa-female',
    step_backward: 'fa-step-backward',
    forward: 'fa-forward',
    fast_forward: 'fa-fast-forward',
    compress: 'fa-compress',
    stop: 'fa-stop',
    eject: 'fa-eject',
    expand: 'fa-expand',
    pause: 'fa-pause',
    play: 'fa-play',
    play_circle: 'fa-play-circle',
    play_circle_o: 'fa-play-circle-o',
    backward: 'fa-backward',
    fast_backward: 'fa-fast-backward',
    step_forward: 'fa-step-forward',
    youtube_play: 'fa-youtube-play',
    music: 'fa-music',
    level_down: 'fa-level-down',
    level_up: 'fa-level-up',
    child: 'fa-child',
    cloud: 'fa-cloud',
    cloud_upload: 'fa-cloud-upload',
    cloud_download: 'fa-cloud-download',
    slack: 'fa-slack',
    bullseye: 'fa-bullseye',
    sort: 'fa-sort',
    sort_asc: 'fa-sort-asc',
    sort_desc: 'fa-sort-desc',
    sort_alpha_asc: 'fa-sort-alpha-asc',
    sort_alpha_desc: 'fa-sort-alpha-desc',
    sort_amount_asc: 'fa-sort-amount-asc',
    sort_amount_desc: 'fa-sort-amount-desc',
    sort_numeric_asc: 'fa-sort-numeric-asc',
    sort_numeric_desc: 'fa-sort-numeric-desc',
    paragraph: 'fa-paragraph',
    paw: 'fa-paw',
    film: 'fa-film',
    paste: 'fa-paste',
    puzzle_piece: 'fa-puzzle-piece',
    clipboard: 'fa-clipboard',
    thumbs_down: 'fa-thumbs-down',
    thumbs_down_o: 'fa-thumbs-o-down',
    thumbs_up: 'fa-thumbs-up',
    thumbs_up_o: 'fa-thumbs-o-up',
    crosshairs: 'fa-crosshairs',
    ellipsis_h: 'fa-ellipsis-h',
    ellipsis_v: 'fa-ellipsis-v',
    bolt: 'fa-bolt',
    recycle: 'fa-recycle',
    dedent: 'fa-dedent',
    mail_forward: 'fa-mail-forward',
    refresh: 'fa-refresh',
    sign_in: 'fa-sign-in',
    clock_o: 'fa-clock-o',
    reorder: 'fa-reorder',
    repeat: 'fa-repeat',
    reply: 'fa-reply',
    mail_reply: 'fa-mail-reply',
    reply_all: 'fa-reply-all',
    mail_reply_all: 'fa-mail-reply-all',
    retweet: 'fa-retweet',
    cog: 'fa-cog',
    cogs: 'fa-cogs',
    rupee: 'fa-rupee',
    life_bouy: 'fa-life-bouy',
    signal: 'fa-signal',
    exclamation: 'fa-exclamation',
    exclamation_circle: 'fa-exclamation-circle',
    exclamation_triangle: 'fa-exclamation-triangle',
    plus: 'fa-plus',
    plus_circle: 'fa-plus-circle',
    plus_square: 'fa-plus-square',
    plus_square_o: 'fa-plus-square-o',
    minus: 'fa-minus',
    minus_circle: 'fa-minus-circle',
    minus_square: 'fa-minus-square',
    minus_square_o: 'fa-minus-square-o',
    question: 'fa-question',
    question_circle: 'fa-question-circle',
    wheelchair: 'fa-wheelchair',
    sun_o: 'fa-sun-o',
    umbrella: 'fa-umbrella',
    soundcloud: 'fa-soundcloud',
    support: 'fa-support',
    rss: 'fa-rss',
    rss_square: 'fa-rss-square',
    spinner: 'fa-spinner',
    spotify: 'fa-spotify',
    stack_exchange: 'fa-stack-exchange',
    stack_overlow: 'fa-stack-exchange',
    subscript: 'fa-subscript',
    volume_up: 'fa-volume-up',
    underline: 'fa-underline',
    superscript: 'fa-superscript',
    table: 'fa-table',
    tablet: 'fa-tablet',
    strikethrough: 'fa-strikethrough',
    tachometer: 'fa-tachometer',
    tasks: 'fa-tasks',
    credit_card: 'fa-credit-card',
    cab: 'fa-cab',
    keyboard_o: 'fa-keyboard-o',
    phone: 'fa-phone',
    phone_square: 'fa-phone-square',
    ticket: 'fa-ticket',
    tint: 'fa-tint',
    scissors: 'fa-scissors',
    space_shuttle: 'fa-space-shuttle',
    trophy: 'fa-trophy',
    university: 'fa-university',
    upload: 'fa-upload',
    user: 'fa-user',
    user_md: 'fa-user-md',
    users: 'fa-users',
    magic: 'fa-magic',
    glass: 'fa-glass',
    automobile: 'fa-automobile',
    video_camera: 'fa-video-camera',
    vine: 'fa-vine',
    eye: 'fa-eye',
    eye_slash: 'fa-eye-slash',
    volume_off: 'fa-volume-off',
    wordpress: 'fa-wordpress',
    wechat: 'fa-wechat',
    yahoo: 'fa-yahoo',
    yen: 'fa-yen'
}


/*****************************************************************************************************************************************************************************************************************************************************************
--------------------------------------------------------------------------------V A R I A B L E S---------------------------------------------------------------------------------------------------------------------------------------------
*****************************************************************************************************************************************************************************************************************************************************************/
var Sesion = {
    FechaSistema: new Date(),
    IpMaquina: ''
}
/*Tiempo que se mostrar?? la notificaci??n (Toast)*/
var notificationTime = 5000;
var deviceType;
/*****************************************************************************************************************************************************************************************************************************************************************
--------------------------------------------------------------------------------P A T R ?? N  D E  C A R A C T E R E S---------------------------------------------------------------------------------------------------------------------------------------------
*****************************************************************************************************************************************************************************************************************************************************************/
CORE_PATTERN_LETTERS = 'a-zA-Z????????????????????????';
CORE_PATTERN_INT = '0-9';
CORE_PATTERN_SPECIALS_ALLOWED = String.fromCharCode(47) + String.fromCharCode(45);
CORE_PAGINATION = 15;

/*****************************************************************************************************************************************************************************************************************************************************************
----------------------------------------------------------------------------------------E N U M E R A D O S-------------------------------------------------------------------------------------------------------------------------------------------------------
*****************************************************************************************************************************************************************************************************************************************************************/
/* Enumerado de los caracteres especiales */
CORE_SPECIAL_CHAR = {
    ASTERISK: "42",//*
    CLOSE_EXCLAMATION: "33",//!
    NUMERAL: "35",//#
    LEFT_PARENTHESES: "40",//(
    RIGHT_PARENTHESES: "41",//)
    DOLAR: "36",//$
    PERCENTAGE: "37",//%
    AMPERSAND: "38",//&
    EQUAL: "61",//=
    PLUS: "43",//+
    AT: "64",//"@"
    OPEN_QUESTION_MARK: "191",//??
    CLOSE_QUESTION_MARK: "63",//?
    COMMA: "44",//,
    TWO_POINT: "58",//:
    LESS_THAN: "60",//<
    GREATER_THAN: "62",//>
    DOWN_DASH: "95",//_
    DOT: "46",//.
    DOT_COMMA: "59",//;
    EQUIVALENCE: "126",//~
    VERTUCAL_BAR: "124",//|
    SPACE: "32"//ESPACIO
}


/* Enumerado de los tipos de controles que se manejan en la aplicaci??n */
var typeControl = {
    TextBox: 'textbox',
    NumberBox: 'numberbox',
    SelectBox: 'selectbox',
    DateBox: 'datebox',
    TextArea: 'textarea',
    Button: 'boton',
    Check: 'check',
    DataGrid: 'grid',
    TagBox: 'tagbox',
    Switch: 'switch',
    Popup: 'popup',
    ListBox: 'list',
    RadioGroup: 'radiogroup'
}

/* Enumerado de los tipos de botones que se pueden configurar */
var typeButtons = {
    Normal: 'normal',
    Default: 'default',
    Back: 'back',
    Danger: 'danger',
    Success: 'success',
}

var classButtons = {
    Accept: CORE_TAG('Button_Accept'),
    Cancel: CORE_TAG('Button_Cancel'),
    New: CORE_TAG('Button_New'),
    Print: CORE_TAG('Button_Print'),
    Send: CORE_TAG('Button_Send'),
    Save: CORE_TAG('Button_Save'),
    Search: CORE_TAG('Button_Search'),
    Refresh: CORE_TAG('Button_Refresh'),
    Delete: CORE_TAG('Delete'),
    Other: CORE_TAG('Button_Other'),
    Info: "",
}

/* Enumerado de las clases de mensajes a desplegar en la aplicaci??n */
var classMessage = {
    Info: 'MENINF',
    Warning: 'MENADV',
    Danger: 'MENERR',
    Question: 'MENPRE',
    Success: 'MENSUC'
}

/* Enumerado para los modos de selecci??n en un control tipo lista*/
var modeSelection = {
    None: 'none',
    Single: 'single',
    Multiple: 'multi',
    MultipleGrid: 'multiple'
}

/* Enumerado para indicar la posici??n en la que aparecer?? un control determinado */
var positionControls = {
    Top: 'top',
    Bottom: 'bottom',
    Right: 'rigth',
    Left: 'left'
}

/* Enumerado para indicar el tipo de caracteres permitidos*/
var typeCharAllowed = {
    OnlyText: 'textOnly',
    OnlyNumber: 'numberOnly',
    OnlyTextAndNumber: 'textAndNumberOnly',
    OnlyTextAndChar: 'textAndCharactersOnly',
    OnlyNumberAndChar: 'NumberAndCharactersOnly',
    OnlyTextNumberAndChar: 'textNumberAndCharactersOnly',
    AllChar: 'allChartes',
}

var typePatternColumn = {
    CED: 'ID',
    CellPhone: 'CELU',
    Email: 'EMAIL',
    Extention: 'EXTC',
    AccountNumber: 'NUMCTA',
    DecimalNumber: 'NDEC',
    IntNumber: 'NENT',
    RUC: 'RUC',
    OnlyLetters: 'TXTONLY',
    OnlyLetterChar: 'TXTCHARONLY',
    OnlyNumbers: 'NUMONLY',
    OnlyNumbersChar: 'NUMCHARONLY',
    OnlyLettersNumber: 'TXTNUMONLY',
    OnlyLettersNumberChar: 'TXTNUCHARMONLY',
    AllChars: 'ALLCHAR',
    Phone: 'TELF'
}

/* Enumerado para indicar c??mo se mostrar?? un control en su configuraci??n inicial*/
var stateControl = {
    disabled: 'disabled',
    hide: 'hide',
    readOnly: 'readOnly'
}

var typeSelectionGrid = {
    None: 'none',
    Single: 'single',
    Multiple: 'multiple',
    AllowSelect: 'allowSelectAll'
}

var typeValidation = {
    Required: 'required',
    Numeric: 'numeric',
    Range: 'range',
    RangoDate: 'rangeDate',
    Pattern: 'pattern',
    RangePattern: 'rangePattern',
    StringLength: 'stringLength',
    Compare: 'compare',
    Custom: 'custom',
    Email: 'email'
}

var textAlignment = {
    Right: 'right',
    Left: 'left',
    Center: 'center',
    Justify: 'justify'
}

var presentationText = {
    OnlyText: 'onlytext',
    OnlyIcon: 'onlyicon',
    IconText: 'icontext'
}

var typeSummaryGrid = {
    Count: 'count',
    Sum: 'sum',
    Min: 'min',
    Max: 'max',
    Average: 'avg'
}

var eventsControl = {
    change: 'change',
    copy: 'copy',
    cut: 'cut',
    disposing: 'disposing',
    enterKey: 'enterKey',
    focusIn: 'focusIn',
    focusOut: 'focusOut',
    initialized: 'initialized',
    input: 'input',
    keyDown: 'keyDown',
    keyPress: 'keyPress',
    keyUp: 'keyUp',
    optionChanged: 'optionChanged',
    paste: 'paste',
    valueChanged: 'valueChanged'
}

var typeLetter = {
    upper: 'uppercase',
    lower: 'lowercase',
    normal: 'none'
}

var toolBarButtons = {
    New: 'buttonToolBarNew',
    Edit: 'buttonToolBarEdit',
    Save: 'buttonToolBarSave',
    Print: 'buttonToolBarPrint',
    Search: 'buttonToolBarSearch',
    Send: 'buttonToolBarSend',
    Cancel: 'buttonToolBarCancel',
    Export: 'buttonToolBarExport',
    Accept: 'buttonToolBarAccept',
    Other: 'buttonToolBarOther'
}

var stateToolBar = {
    disabled: 'disabled',
    hidden: 'hidden',
    enabled: 'enabled',
    visible: 'visible'
}

var searchOperations = {
    Equal: '=',
    Different: '<>',
    GreaterThan: '>',
    GreaterEqualThan: '>=',
    LessThan: '<',
    LessEqualThan: '<',
    StartsWith: 'startswith',
    EndsWith: 'endswith',
    Contains: 'contains',
    NotContains: 'notcontains',
}

var dateParts = {
    Seconds: 'second',
    Minutes: 'minute',
    Hours: 'hour',
    Days: 'day',
    Months: 'month',
    Years: 'year'
}

var typesDate = {
    ShortDate: 'shortdate',
    LongDate: 'longdate'
}

var typesNotification = {
    Error: 'error',
    Success: 'success',
    Warning: 'warning',
    Info: 'info'
}

var typesLinearGauge = {
    Rectangle: 'rectangle',
    Rhombus: 'rhombus',
    Circle: 'circle',
    TextCloud: 'textCloud',
    TriangleMarker: 'triangleMarker'
}

var formatValues = {
    Money: '',
    Percent: '%'
}

var typePhones = {
    Phone: 'phone',
    Mobile: 'mobile'
}

var sizeFloatButtons = {
    small: 'small',
    normal: 'normal'
}

var typeFloatButtons = {
    "default": 'btn-default',
    white: 'btn-white',
    blue: 'btn-blue',
    success: 'btn-success',
    yellow: 'btn-yellow'
}

var typeOrders = {
    Ascendent: 'asc',
    Descendent: 'desc'
}

var stateScreen = {
    Active: 'Activa',
    Lock: 'Bloqueada'
}

/*****************************************************************************************************************************************************************************************************************************************************************
----------------------------------------------------------------------------C O N F I G U R A C I ?? N  C O N T R O L E S------------------------------------------------------------------------------------------------------------------------------------------
*****************************************************************************************************************************************************************************************************************************************************************/

/*
    Configuraci??n del control Popup.
        Permite configurar un elemento html (div) en una pantalla flotante.
    Par??metros: 
        visible: Valor booleano para indicar si el control se muestra visible inicialmente.
        width: Indica el ancho de la pantalla flotante. 'auto'==> Se autoajusta al contenido de la pantalla flotante. '100%'==> Se establecer?? el ancho en porcentaje. '100px'==> Se establecer?? un tama??o fijo
        height: Indica la altura de la pantalla flotante. 'auto'==> Se autoajusta al contenido de la pantalla flotante. '100%'==> Se establecer?? el ancho en porcentaje. '100px'==> Se establecer?? un tama??o fijo
        showTitle: Valor booleano para indicar si se muestra un t??tulo en la pantalla flotante.
        title: Texto que indica el t??tulo de la pantalla flotante. V??lido solo si mostrarTitulo es true.
        showCloseButton: Valor booleano que indica si muestro el ??cono de cerrar en la cabecera de la pantalla flotante.
        resizeEnabled: Valor booleano que indica si puedo cambiar el tama??o de la pantalla flotante en tiempo de ejecuci??n.
*/
function setupPopup(visible, width, height, showTitle, title, showCloseButton, resizeEnabled, toolbarItems) {
    var popup = {
        visible: visible,
        width: width,
        height: height,
        title: title,
        maxHeight: '98%',
        maxWidth: '98%',
        deferRendering: false,
        resizeEnabled: resizeEnabled,
        showTitle: showTitle,
        fullScreen: false,
        showCloseButton: showCloseButton,
        onShowing: null,
        onShown: null,
        onHiding: null,
        onHidden: null,
        toolbarItems: toolbarItems
    }
    return popup;
}

function setupPopover(target, position, width, shading, showTitle, title, showCloseButton) {
    var popover = {
        closeOnOutsideClick: true,
        deferRendering: false,
        height: 'auto',
        onContentReady: null,
        onDisposing: null,
        onHidden: null,
        onHiding: null,
        onInitialized: null,
        onOptionChanged: null,
        onShowing: null,
        onShown: null,


        onTitleRendered: null,
        position: position,
        rtlEnabled: undefined,
        shading: shading,
        shadingColor: 'rgba(0, 0, 0, 0.5)',
        showCloseButton: showCloseButton,
        showTitle: showTitle,
        target: target,
        title: title,
        titleTemplate: undefined,
        visible: false,
        width: width,
        toolbarItems: []
    }

    return popover;
}

/*
    Configuraci??n de control Switch.
        Permite configurar un elemento html (div) en un control tipo switch.
    Par??metros:
        onText: Texto a mostrar cuando el valor del switch sea ON.
        offText: Texto a mostrar cuando el valor del switch sea OFF.
        defaultValue: Valor inicial del control.
        typeStateField: Estado en el que se desea visualizar el control (Oculto, Deshabilitado, Solo de Lectura) [Opcional].
*/
function setupSwitchControl(onText, offText, defaultValue, typeStateField) {
    var switchBox = {
        onText: onText,
        offText: offText,
        value: defaultValue,
        disabled: false,
        visible: true,
        readonly: false
    }

    if (typeStateField)
        setStateField(switchBox, typeStateField);

    return switchBox;
}

/*
    Configura un ??rbol de jerarqu??as
    Par??metros:
        dataSource: origen de datos que alimenta nuestro ??rbol,
        keyExpr: Clave primaria de nuestro origen de datos,
        idParent: Campo que representa al padre de cada elemento para formar la jerarqu??a,
        displayExpr: Texto a mostrar en el ??rbol (Si se usa la propiedad itemTemplate este campo no funciona),
        valueSelected: Valor interno que se seleccionar?? del ??rbol,
        selectionMode: Modo de selecci??n de los ??tems del ??rbol,
        height: Altura que tendr?? nuestro ??rbol,
        width: Ancho que tendr?? nuestro ??rbol,
        itemTemplate: Plantilla HTML de cada elemento del ??rbol.
        typeStateField: Estado inicial del control (oculto, deshabilitado, solo-lectura)
*/
function setupTreeView(dataSource, keyExpr, idParent, displayExpr, valueSelected, selectionMode, height, width, itemTemplate, typeStateField) {
    var treeView = {
        accessKey: null,
        dataStructure: 'plain',
        disabled: false,
        dataSource: dataSource,
        expandAllEnabled: true,
        displayExpr: displayExpr,
        expandNodesRecursive: true,
        height: height,
        width: width,
        keyExpr: keyExpr,
        noDataText: 'No existen datos para formar la estructura',
        parentIdExpr: idParent,
        scrollDirection: 'both',
        selectAllText: 'Seleccionar Todos',
        selectByClick: true,
        selectionMode: selectionMode,
        selectNodesRecursive: true,
        showCheckBoxesMode: selectionMode == typeSelectionGrid.Multiple ? 'normal' : 'none',
        visible: true,
        readonly: false,
        itemTemplate: itemTemplate,
        onContentReady: undefined,
        onDisposing: undefined,
        onInitialized: undefined,
        onItemClick: undefined,
        onItemCollapsed: undefined,
        onItemContextMenu: undefined,
        onItemExpanded: undefined,
        onItemHold: undefined,
        onItemRendered: undefined,
        onItemSelected: undefined,
        onItemSelectionChanged: undefined,
        onOptionChanged: undefined,
        onSelectionChanged: undefined
    }

    if (typeStateField)
        setStateField(treeView, typeStateField);

    return treeView;
}

function setupContextMenu(dataSource, displayExpr, target, height, width, itemTemplate) {
    var contextMenu = {
        closeOnOutsideClick: true,
        dataSource: dataSource,
        displayExpr: displayExpr,
        height: height,
        target: target,
        selectByClick: true,
        selectionMode: 'none',
        width: width,
        itemTemplate: itemTemplate,
        onContentReady: undefined,
        onDisposing: undefined,
        onHidden: undefined,
        onHiding: undefined,
        onInitialized: undefined,
        onItemClick: undefined,
        onItemContextMenu: undefined,
        onItemRendered: undefined,
        onOptionChanged: undefined,
        onPositioning: undefined,
        onSelectionChanged: undefined,
        onShowing: undefined,
        onShown: undefined
    }

    return contextMenu;
}

function setupTagBox(defaultValue, dataSource, displayExpr, valueExpr, showSelectionControls, searchEnabled, applyValueMode, itemTemplate) {
    var tagBox = {
        value: defaultValue,
        dataSource: dataSource,
        displayExpr: displayExpr,
        valueExpr: valueExpr,
        applyValueMode: applyValueMode,
        showSelectionControls: showSelectionControls,
        noDataText: 'No hay informaci??n disponible',
        placeholder: 'Seleccione una o varias opciones',
        searchMode: 'contains',
        searchEnabled: searchEnabled,
        onChange: undefined,
        onClosed: undefined,
        onContentReady: undefined,
        onCustomItemCreating: undefined,
        onDisposing: undefined,
        onEnterKey: undefined,
        onFocusIn: undefined,
        onFocusOut: undefined,
        onInitialized: undefined,
        onInput: undefined,
        onItemClick: undefined,
        onKeyDown: undefined,
        onKeyPress: undefined,
        onKeyUp: undefined,
        onOpened: undefined,
        onOptionChanged: undefined,
        onSelectAllValueChanged: undefined,
        onSelectionChanged: undefined,
        onValueChanged: undefined,
        itemTemplate: itemTemplate ? itemTemplate : 'item'
    }

    return tagBox;
}

/*
    Configuraci??n de control Bot??n.
        Permite configurar un elemento html (div) en un control de bot??n.
    Parametros:
        text: Texto a mostrar en la etiqueta del bot??n.
        action: Acci??n a ejecutar en el evento click del bot??n.
        type: Tipo de bot??n a configurar; pueden ser de tres tipos: Exito, PorDefecto, Error, Normal; forma de invocar: tiposBoton.Exito
        validationGroup: Establece el grupo de validaci??n asociado a este bot??n, con el fin de validar solo los controles asociados a este grupo.
        typeStateField: Estado en el que se desea visualizar el control (Oculto, Deshabilitado, Solo de Lectura) [Opcional].
*/
function setupButtonControl(text, action, validationGroup, type, icon, typeStateField, rtlEnabled) {
    var button = {
        text: text,
        type: type,
        icon: icon ? 'fa ' + icon : undefined,
        validationGroup: validationGroup,
        disabled: false,
        visible: true,
        readonly: false,
        rtlEnabled: rtlEnabled ? rtlEnabled : false,
        onClick: function (params) {
            if (action)
                action(params);
        }
    }

    if (typeStateField)
        setStateField(button, typeStateField);

    return button;
}

/*
    Configura el bot??n aceptar de un popup o una vista.
    Par??metros:
        action: Acci??n a ejecutar en el evento click del bot??n.
        validationGroup: Establece el grupo de validaci??n asociado a este bot??n, con el fin de validar solo los controles asociados a este grupo.
        allowIcon: Valor Booleano para indicar si se presentar?? ??cono en el bot??n
        typeStateField: Estado en el que se desea visualizar el control (Oculto, Deshabilitado, Solo de Lectura) [Opcional].
*/
function setupButtonControlDefault(classButton, action, validationGroup, allowIcon, typeStateField) {
    var textButton = classButton;
    var icon = undefined;
    if (allowIcon == true) {
        switch (classButton) {
            case classButtons.Accept:
                icon = 'fa ' + iconosCore.check;
                break;
            case classButtons.Cancel:
                icon = 'fa ' + iconosCore.times;
                break;
            case classButtons.Refresh:
                icon = 'fa ' + iconosCore.refresh;
                break;
            case classButtons.Send:
                icon = 'fa ' + iconosCore.send_o;
                break;
            case classButtons.New:
                icon = 'fa ' + iconosCore.file_o;
                break;
            case classButtons.Print:
                icon = 'fa ' + iconosCore.print;
                break;
            case classButtons.Save:
                icon = 'fa ' + iconosCore.floppy;
                break;
            case classButtons.Info:
                icon = 'fa ' + iconosCore.info;
                break;
            default:
                break;
        }
    }
    return setupButtonControl(textButton, action, validationGroup, typeButtons.Default, icon, typeStateField);
}

/*
    Configuraci??n de control text box.
        Permite configurar un elemento html (div) en un control textbox.
    Parametros:
        maxLenght: Cantidad de caracteres permitidos en el control.
        placeholder: Texto de ayuda que se mostrar?? en el control.
        typeStateField: Estado en el que se desea visualizar el control (Oculto, Deshabilitado, Solo de Lectura) [Opcional].
*/
function setupTextBoxControl(defaultValue, maxLenght, placeholder, typeLetterControl, typeStateField, allowSpace, typeChar, specialsChar, preventPropagation) {

    var textbox = {
        value: defaultValue,
        maxLength: maxLenght,
        disabled: false,
        visible: true,
        readOnly: false,
        placeholder: placeholder,
        mode: 'text',
        onChange: function (evt) {
            if (typeLetterControl) {
                var nameField = '#' + evt.element[0].id;
                switch (typeLetterControl) {
                    case typeLetter.upper:
                        $(nameField).dxTextBox('option', 'value', $(nameField).dxTextBox('option', 'value') == null ? '' : $(nameField).dxTextBox('option', 'value').toUpperCase())
                        break;
                    case typeLetter.lower:
                        $(nameField).dxTextBox('option', 'value', $(nameField).dxTextBox('option', 'value') == null ? '' : $(nameField).dxTextBox('option', 'value').toLowerCase())
                        break;
                    default:
                        break;
                }
            }
        },
        onCopy: function (evt) {
            var variable = "";
        },
        onCut: null,
        onDisposing: null,
        onEnterKey: null,
        onFocusIn: function (evt) {
            if (typeLetterControl)
                setTypeLetter(evt, typeLetterControl);
            if (preventPropagation) {
                evt.preventDefault();
                evt.stopPropagation();
                window.scrollTo(0, 0);
                //debugger;
            }

        },
        onFocusOut: null,
        onInitialized: null,
        onInput: null,
        onKeyDown: null,
        onKeyPress: function (evt) {
            restrictionTextControl(evt.element[0].id, typeChar, allowSpace, specialsChar);
        },
        onKeyUp: null,
        onOptionChanged: null,
        onPaste: null,
        onValueChanged: null,
    }

    if (typeStateField)
        setStateField(textbox, typeStateField);

    return textbox;
}

function setTypeLetter(evt, typeLetter) {
    var control = document.getElementById(evt.element[0].id);
    control.firstChild.firstChild.style.textTransform = typeLetter;
}

/*
    Permite establecer un evento inicial a un control determinado.
    Par??metros:
        optionsControl: Opciones del control al que se va a establecer el evento.
        event: Evento a establecer.
        functionEvent: Acci??n a ejecutar en el evento.
*/
function setEventControls(optionsControl, event, functionEvent) {
    switch (event) {
        case this.eventsControl.change:
            optionsControl.onChange = function (e) {
                functionEvent(e);
            }
            break;
        case this.eventsControl.copy:
            optionsControl.onCopy = function (e) {
                functionEvent(e);
            }
            break;
        case this.eventsControl.cut:
            optionsControl.onCut = function (e) {
                functionEvent(e);
            }
            break;
        case this.eventsControl.disposing:
            optionsControl.onDisposing = function (e) {
                functionEvent(e);
            }
            break;
        case this.eventsControl.enterKey:
            optionsControl.onEnterKey = function (e) {
                functionEvent(e);
            }
            break;
        case this.eventsControl.focusIn:
            optionsControl.onFocusIn = function (e) {
                functionEvent(e);
            }
            break;
        case this.eventsControl.focusOut:
            optionsControl.onFocusOut = function (e) {
                functionEvent(e);
            }
            break;
        case this.eventsControl.initialized:
            optionsControl.onInitialized = function (e) {
                functionEvent(e);
            }
            break;
        case this.eventsControl.input:
            optionsControl.onInput = function (e) {
                functionEvent(e);
            }
            break;
        case this.eventsControl.keyDown:
            optionsControl.onKeyDown = function (e) {
                functionEvent(e);
            }
            break;
        case this.eventsControl.keyPress:
            optionsControl.onKeyPress = function (e) {
                functionEvent(e);
            }
            break;
        case this.eventsControl.keyUp:
            optionsControl.onKeyUp = function (e) {
                functionEvent(e);
            }
            break;
        case this.eventsControl.optionChanged:
            optionsControl.onOptionChanged = function (e) {
                functionEvent(e);
            }
            break;
        case this.eventsControl.paste:
            optionsControl.onPaste = function (e) {
                functionEvent(e);
            }
            break;
        case this.eventsControl.valueChanged:
            optionsControl.onValueChanged = function (e) {
                functionEvent(e);
            }
            break;
        default:
            showErrorMessage(CORE_TAG('ErrorMessage'), CORE_MESSAGE('NoEventControl'))
            break;
    }
}

/*
    Configuraci??n de un control textbox en modo Email.
    Par??metros:
        maxLenght: Cantidad de caracteres permitidos en el control.
        placeholder: Texto de ayuda que se mostrar?? en el control.
        typeStateField: Estado en el que se desea visualizar el control (Oculto, Deshabilitado, Solo de Lectura) [Opcional].
*/
function setupEmailControl(defaultValue, maxLength, typeStateField, placeHolder) {
    var textbox = setupTextBoxControl(defaultValue, maxLength, placeHolder ? placeHolder : ConstantsBehaivor.PLACEHOLDER_EMAIL_FIELD, typeLetter.lower, typeStateField, false, typeCharAllowed.OnlyTextNumberAndChar, '@-_.');

    textbox.mode = 'email';

    return textbox;
}

function setupTextPasswordControl(defaultValue, maxLength, placeholder, typeStateField) {
    if (!placeholder)
        placeholder = CORE_TAG('Password');
    var textbox = setupTextBoxControl(defaultValue, maxLength, placeholder, undefined, typeStateField);

    textbox.mode = 'password';

    return textbox;
}

/*
    Configuraci??n de un text box solo para ingresar DNI
    Par??metros:
        typeStateField: Estado en el que se desea visualizar el control (Oculto, Deshabilitado, Solo de Lectura) [Opcional].
*/
function setupTextBoxDNIControl(defaultValue, typeStateField) {
    var textbox = setupTextBoxControl(defaultValue, ConstantsBehaivor.LENGTH_DNI, ConstantsBehaivor.PLACEHOLDER_DNI, null, typeStateField, false);

    textbox.mode = 'number';

    textbox.onKeyUp = function (e) {
        var value = e.jQueryEvent.currentTarget.value;
        if (e.jQueryEvent.keyCode == '107' || e.jQueryEvent.keyCode == '106' || e.jQueryEvent.keyCode == '109' || e.jQueryEvent.keyCode == '111')
            e.jQueryEvent.currentTarget.value = value.substring(0, value.length - 1);
        if (value.length > textbox.maxLength) {
            e.jQueryEvent.currentTarget.value = value.substring(0, value.length - 1);
        }
    }

    return textbox;
}

function setupTextRUCControl(defaultValue, typeStateField) {
    var textbox = setupTextBoxControl(defaultValue, ConstantsBehaivor.LENGTH_RUC, ConstantsBehaivor.PLACEHOLDER_RUC, null, typeStateField, false);

    textbox.mode = 'number';

    textbox.onKeyUp = function (e) {
        var value = e.jQueryEvent.currentTarget.value;
        if (e.jQueryEvent.keyCode == '107' || e.jQueryEvent.keyCode == '106' || e.jQueryEvent.keyCode == '109' || e.jQueryEvent.keyCode == '111')
            e.jQueryEvent.currentTarget.value = value.substring(0, value.length - 1);
        if (value.length > textbox.maxLength) {
            e.jQueryEvent.currentTarget.value = value.substring(0, value.length - 1);
        }
    }

    return textbox;
}

function setupTextPASAPORTControl(defaultValue, typeStateField) {
    var textbox = setupTextBoxControl(defaultValue, ConstantsBehaivor.LENGTH_PASSPORT, ConstantsBehaivor.PLACEHOLDER_PASSPORT, null, typeStateField, false, typeCharAllowed.OnlyTextAndNumber);

    return textbox;
}

function setupTextPhoneControl(defaultValue, typePhone, typeStateField, placeHolder) {

    var textbox = setupTextBoxControl(defaultValue);

    textbox.mode = 'number';

    switch (typePhone) {
        case typePhones.Phone:
            textbox.maxLength = ConstantsBehaivor.LENGTH_PHONE;
            textbox.placeholder = placeHolder ? placeHolder : ConstantsBehaivor.PLACEHOLDER_PHONE;
            break;
        case typePhones.Mobile:
            textbox.maxLength = ConstantsBehaivor.LENGTH_CELLPHONE;
            textbox.placeholder = placeHolder ? placeHolder : ConstantsBehaivor.PLACEHOLDER_CELLPHONE;
            break;
        default:
            break;
    }

    textbox.onKeyUp = function (e) {
        var value = e.jQueryEvent.currentTarget.value;
        if (e.jQueryEvent.keyCode == '107' || e.jQueryEvent.keyCode == '106' || e.jQueryEvent.keyCode == '109' || e.jQueryEvent.keyCode == '111')
            e.jQueryEvent.currentTarget.value = value.substring(0, value.length - 1);
        if (value.length > textbox.maxLength) {
            e.jQueryEvent.currentTarget.value = value.substring(0, value.length - 1);
        }
    }

    return textbox;
}

function setupHibridPhoneControl(defaultValue, typeStateField, placeHolder) {

    var textbox = setupTextBoxControl(defaultValue);

    textbox.mode = 'number';
    textbox.maxLength = 8;

    textbox.placeholder = placeHolder ? placeHolder : ConstantsBehaivor.PLACEHOLDER_PHONE;

    textbox.onKeyUp = function (e) {
        var value = e.jQueryEvent.currentTarget.value;
        if (e.jQueryEvent.keyCode == '107' || e.jQueryEvent.keyCode == '106' || e.jQueryEvent.keyCode == '109' || e.jQueryEvent.keyCode == '111')
            e.jQueryEvent.currentTarget.value = value.substring(0, value.length - 1);
        if (value.length > textbox.maxLength) {
            e.jQueryEvent.currentTarget.value = value.substring(0, value.length - 1);
        }
    }

    if (typeStateField)
        setStateField(textbox, typeStateField);

    return textbox;
}

/*
    Configuraci??n de un control de tipo selecci??n.
    Par??metros:
        dataSource: Origen de Datos para alimentar el control.
        displayMember: Texto que se mostrar?? en cada ??tem del control.
        valueMember: Valor que se establecer?? al seleccionar un ??tem del control.
        searchEnabled: Indica si se habilitar?? la b??squeda en el control.
        typeStateField: Estado en el que se desea visualizar el control (Oculto, Deshabilitado, Solo de Lectura) [Opcional].
*/
function setupComboBoxControl(dataSource, displayMember, valueMember, defaultValue, searchEnabled, typeStateField, width, placeHolder) {

    var combobox = {
        value: defaultValue,
        dataSource: dataSource,
        displayExpr: displayMember,
        valueExpr: valueMember,

        placeholder: placeHolder,
        showClearButton: false,
        disabled: false,
        visible: true,
        readonly: false,
        width: width,
        searchEnabled: searchEnabled ? searchEnabled : false,
        onChange: null,
        onClosed: null,
        onContentReady: null,
        onCopy: null,
        onCut: null,
        onDisposing: null,
        onEnterKey: null,
        onFocusIn: null,
        onFocusOut: null,
        onInitialized: null,
        onInput: null,

        onItemClick: null,
        onKeyDown: null,
        onKeyPress: null,
        onKeyUp: null,
        onOpened: null,
        onOptionChanged: null,
        onPaste: null,
        onSelectionChanged: null,
        onValueChanged: null
    }

    if (typeStateField)
        setStateField(combobox, typeStateField);

    return combobox;
}


function setupLookupControl(defaultValue, dataSource, displayExpr, valueExpr, search, applyValueMode, typeStateField, itemTemplate, title) {
    var lookup = {
        items: dataSource,
        value: defaultValue,
        displayExpr: displayExpr,
        searchEnabled: search,
        valueExpr: valueExpr,
        applyValueMode: applyValueMode,
        readonly: false,
        disabled: false,
        visible: true,
        deferRendering: false,
        onClosed: undefined,
        onContentReady: undefined,
        onDisposing: undefined,
        onInitialized: undefined,
        onItemClick: undefined,
        onOpened: undefined,
        onOptionChanged: undefined,
        onPageLoading: undefined,
        onPullRefresh: undefined,
        onScroll: undefined,
        onSelectionChanged: undefined,
        onTitleRendered: undefined,
        onValueChanged: undefined,
        applyButtonText: 'Aceptar',
        clearButtonText: 'Limpiar',
        noDataText: 'Sin datos disponibles',
        nextButtonText: 'M??s',
        placeholder: 'Seleccione',
        cancelButtonText: 'Cancelar',
        searchPlaceholder: 'Buscar',
        position: {
            at: 'center'
        },
        itemTemplate: itemTemplate,
        title: title
    }

    if (typeStateField)
        setStateField(lookup, typeStateField);

    return lookup;
}

/*
    Configuraci??n de un control para el ingreso de fechas.
    Par??metros:
        minDate: Fecha M??nima que acepta el control.
        maxDate: Fecha M??xima que acepta el control.
        typeStateField: Estado en el que se desea visualizar el control (Oculto, Deshabilitado, Solo de Lectura) [Opcional].
*/
function setupDateControl(defaultValue, minDate, maxDate, width, typeStateField, readOnly) {
    var dateBox = {
        type: 'date',
        width: width,
        value: defaultValue,
        placeholder: ConstantsBehaivor.PATTERN_SHORTDATE,
        displayFormat: ConstantsBehaivor.PATTERN_SHORTDATE,
        pickerType: 'calendar',
        max: maxDate ? maxDate : undefined,
        min: minDate ? minDate : undefined,
        acceptCustomValue: false,
        disabled: false,
        visible: true,
        readonly: (readOnly != undefined) ? readOnly : false,
        dateOutOfRangeMessage: CORE_VALIDATION('DateOutRange'),
        invalidDateMessage: CORE_VALIDATION('InvalidDate'),
        onValueChanged: null,
        //onOpened: null,
        onClosed: null,
        onChange: null,
        adaptivityEnabled: true,
    }
    if (typeStateField)
        setStateField(dateBox, typeStateField);

    return dateBox;
}

/*
    Configuraci??n de una grilla de datos.
    Par??metros
        dataSource: Origen de datos que alimenta a la grilla.
        columns: Columnas a configurar a la grilla.
        modeSelection: Modo de selecci??n de la grilla (Ninguna, Simple, M??ltiple).
        pagination: Indica si se desea o no una paginaci??n
        typeStateField: Estado en el que se desea visualizar el control (Oculto, Deshabilitado, Solo de Lectura) [Opcional].
*/
function setupDataGrid(dataSource, columns, modeSelectionGrid, pagination, allowFilter, allowEditing, summary, isGroupedSummary, pageSize, typeStateField) {
    dataSource = dataSource ? dataSource : [];
    modeSelectionGrid = modeSelectionGrid ? modeSelectionGrid : modeSelection.None;
    pagination = pagination ? pagination : false;

    var dataGrid = {
        columnAutoWidth: true,
        columns: columns,
        dataSource: dataSource,
        disabled: false,
        filterRow: {
            applyFilter: 'auto',
            applyFilterText: CORE_TAG('applyFilterText'),
            betweenEndText: CORE_TAG('betweenEndText'),
            betweenStartText: CORE_TAG('betweenStartText'),
            operationDescriptions: {
                '=': CORE_TAG('Equal'),
                '<>': CORE_TAG('NotEqual'),
                '<': CORE_TAG('LessThan'),
                '<=': CORE_TAG('LessEqualThan'),
                '>': CORE_TAG('GreaterThan'),
                '>=': CORE_TAG('GreaterEqualThan'),
                'startswith': CORE_TAG('StartsWith'),
                'contains': CORE_TAG('Contains'),
                'notcontains': CORE_TAG('NotContains'),
                'endswith': CORE_TAG('EndsWith'),
                'between': CORE_TAG('Between'),
            },
            resetOperationText: CORE_TAG('Reset'),
            showAllText: CORE_TAG('All'),

            visible: allowFilter
        },
        hoverStateEnabled: true,
        selection: {
            mode: modeSelectionGrid,
            allowSelectAll: modeSelectionGrid == modeSelection.MultipleGrid ? true : undefined,
            showCheckBoxesMode: modeSelectionGrid == modeSelection.MultipleGrid ? 'always' : 'none'
        },
        editing: {
            allowAdding: allowEditing,
            allowDeleting: allowEditing,
            allowUpdating: allowEditing,
            mode: 'form',
            texts: {
                addRow: CORE_MESSAGE('AddRow'),
                cancelAllChanges: CORE_MESSAGE('CancelAllChanges'),
                cancelRowChanges: CORE_MESSAGE('CancelRowChanges'),
                confirmDeleteMessage: CORE_MESSAGE('ConfirmDeleteMessage'),
                confirmDeleteTitle: CORE_MESSAGE('ConfirmDeleteTitle'),
                deleteRow: CORE_MESSAGE('DeleteRow'),
                editRow: CORE_MESSAGE('EditRow'),
                saveAllChanges: CORE_MESSAGE('SaveAllChanges'),
                saveRowChanges: CORE_MESSAGE('SaveRowChanges'),
                validationCancelChanges: CORE_MESSAGE('ValidationCancelChanges'),
            }
        },
        paging: {
            enabled: pagination,
            pageSize: pageSize ? pageSize : CORE_PAGINATION
        },
        showBorders: true,
        rowAlternationEnabled: true,
        showRowLines: true,
        visible: true,
        readonly: false,
        onSelectionChanged: null,
        onInitNewRow: null,
        onRowInserting: null,
        onRowInserted: null,
        onRowUpdating: null,
        onRowUpdated: null,
        onRowRemoving: null,
        onRowRemoved: null,
        onRowCollapsed: null,
        onRowPrepared: null,
        onEditingStart: null,
        noDataText: CORE_MESSAGE('NoData'),
        summary: {
            groupItems: null,
            totalItems: null,
            texts: {
                avg: CORE_TAG('Summary_Avg') + ' = {0}',
                avgOtherColumn: CORE_TAG('Summary_Other_Avg') + ' {1} es {0}',
                count: CORE_TAG('Summary_Count') + ' = {0}',
                max: CORE_TAG('Summary_Max') + ' = {0}',
                maxOtherColumn: CORE_TAG('Summary_Other_Max') + ' {1} es {0}',
                min: CORE_TAG('Summary_Min') + ' = {0}',
                minOtherColumn: CORE_TAG('Summary_Other_Min') + ' {1} es {0}',
                sum: CORE_TAG('Summary_Sum') + ' = {0}',
                sumOtherColumn: CORE_TAG('Summary_Other_Sum') + ' {1} es {0}'
            }
        },
    }

    if (summary && summary.length) {
        if (isGroupedSummary == true)
            dataGrid.summary.groupItems = summary;
        else
            dataGrid.summary.totalItems = summary;
    }

    if (typeStateField)
        setStateField(dataGrid, typeStateField);

    return dataGrid;
}

/*
    Configuraci??n de un control para mostrar un resumen de los campos inv??lidos.
    Par??metros:
        groupValidation: Grupo de validaci??n a desplegar el resumen.
*/
function setupSummaryValidation(groupValidation) {
    var summary = {
        hoverStateEnabled: true,
        validationGroup: groupValidation
    }

    return summary;
}

function setupListBox(dataSource, selectionMode, showCheck, height, itemTemplate, grouped, groupTemplate, typeStateField) {
    var listBox = {
        dataSource: dataSource,
        grouped: grouped,
        groupTemplate: groupTemplate,
        itemTemplate: itemTemplate,
        collapsibleGroups: false,
        noDataText: '',//CORE_MESSAGE('NoData'),
        height: height,
        width: '100%',
        onContentReady: null,
        onDisposing: null,
        onGroupRendered: null,
        onInitialized: null,
        onItemClick: null,
        onItemContextMenu: null,
        onItemDeleted: null,
        onItemDeleting: null,
        onItemHold: null,
        onItemRendered: null,
        onItemReordered: null,
        onItemSwipe: null,
        onOptionChanged: null,
        onPageLoading: null,
        onPullRefresh: null,
        onScroll: null,
        onSelectionChanged: null,
        pageLoadingText: '',//CORE_MESSAGE('LoadingData'),
        pulledDownText: CORE_MESSAGE('ReleaseRefresh'),
        pullingDownText: CORE_MESSAGE('PullDownRefresh'),
        refreshingText: CORE_MESSAGE('Refreshing'),
        selectionMode: selectionMode,
        showSelectionControls: showCheck,
        visible: true,
        disabled: false,
        readOnly: false,
        allowItemDeleting: false,
        itemDeleteMode: 'static'
    }

    if (typeStateField)
        setStateField(listBox, typeStateField);

    return listBox;
}


function setupAccordion(dataSource, titleTemplate, itemTemplate, multiple, collapsible) {
    try {
        var accordion = {
            dataSource: dataSource,
            animationDuration: 300,
            collapsible: collapsible,
            multiple: multiple,
            deferRendering: false,
            itemTitleTemplate: titleTemplate,
            itemTemplate: itemTemplate,
            selectedItems: dataSource,
            onSelectionChanged: null
        };
        return accordion;

    } catch (e) {
        showErrorMessage('', 'No se pudo crear el control (' + e + '). Por favor comun??quese con el Administrador.');
    }
}

function setupNumberBox(defaultValue, minValue, maxValue, width, maxlength, mode, placeholder, typeStateField) {
    try {
        if (mode == undefined)
            mode = 'number';

        var numberBox = {
            value: defaultValue,
            min: minValue,
            max: maxValue,
            rtlEnabled: false,
            mode: mode,
            maxLength: maxlength,
            width: width,
            placeholder: placeholder,
            invalidValueMessage: 'Ingrese un n??mero v??lido',
            onChange: null,
            onCopy: null,
            onCut: null,
            onDisposing: null,
            onEnterKey: null,
            onFocusIn: null,
            onFocusOut: null,
            onInitialized: null,
            onInput: null,
            onKeyDown: null,
            onKeyUp: null,
            onOptionChanged: null,
            onPaste: null,
            onValueChanged: null,
            onKeyPress: function (event) {
                var nameField = '#' + event.element[0].id;
                var jqueryevent = event.jQueryEvent;

                var str = String.fromCharCode(jqueryevent.keyCode);
                if (str == ',') {
                    jqueryevent.preventDefault();
                    return;
                }

                var presicion = ConstantsBehaivor.PRECISION_DECIMAL == null ? 0 : ConstantsBehaivor.PRECISION_DECIMAL;
                var number = $(nameField).dxNumberBox('option', 'text') == null ? '' : $(nameField).dxNumberBox('option', 'text').split('.');
                if (number.length > 1) {
                    if (number[1].length > 2) {
                        jqueryevent.preventDefault();
                        return;
                    } else {
                        if (number[1].length > 1) {
                            var numero = number[1].substring(0, presicion);
                            var salary = 0.0;
                            salary = number[0] + '.' + numero;
                            var salary2 = parseFloat(salary);
                            $(nameField).dxNumberBox('option', 'value', $(nameField).dxNumberBox('option', 'attr').text = salary2);
                            jqueryevent.preventDefault();
                            return;
                        } else {

                            if (number[1].length == 3) {
                                var numero = number[1].substring(0, presicion);
                                var salary = 0.0;
                                salary = number[0] + '.' + numero;
                                var salary2 = parseFloat(salary);
                                $(nameField).dxNumberBox('option', 'value', $(nameField).dxNumberBox('option', 'attr').text = salary2);
                                jqueryevent.preventDefault();
                                return;
                            }
                        }
                    }
                }

            }
        }

        if (typeStateField)
            setStateField(numberBox, typeStateField);

        return numberBox;
    } catch (e) {
        showErrorMessage('', 'No se pudo crear el control (' + e + '). Por favor comun??quese con el Administrador.');
    }
}

function setupCheckBoxControl(defaultValue, text, typeStateField) {
    try {
        var checkBox = {
            value: defaultValue,
            text: text,
            disabled: false,
            visible: true,
            readonly: false,
            onValueChanged: null,
        }
        if (typeStateField)
            setStateField(checkBox, typeStateField);

        return checkBox;
    } catch (e) {
        showErrorMessage('', 'No se pudo crear el control (' + e + '). Por favor comun??quese con el Administrador.');
    }
}

function setupTextAreaControl(defaultValue, maxLength, width, height, placeHolder, typeStateField) {
    try {
        var textArea = {
            value: defaultValue,
            placeholder: placeHolder,
            maxLength: maxLength,
            width: width,
            height: height,
            disabled: false,
            visible: true,
            readonly: false,
            onValueChanged: null,
            onKeyDown: null,
            onKeyPress: null,
            onKeyUp: null,
            onEnterKey: null
        }

        if (typeStateField)
            setStateField(textArea, typeStateField);

        return textArea;
    } catch (e) {
        showErrorMessage('', 'No se pudo crear el control (' + e + '). Por favor comun??quese con el Administrador.');
    }
}

function setupMapControl(markersData, width, height, zoom, iconMarker) {
    try {
        var maps = {
            center: { lat: currentPosition.Latitud, lng: currentPosition.Longitud },
            zoom: zoom,
            height: function () {
                return window.innerHeight - 210;
            },
            width: width,
            markers: markersData,
            autoAdjust: true,
            controls: true,
            provider: 'google',
            key: { google: 'AIzaSyBamz0SmdOUDV6iLW7g-KMbPbM-DcPfDxY' },
            type: 'roadmap',
            markerIconSrc: './images/' + iconMarker + '.png'
        }

        return maps;
    } catch (e) {
        showErrorMessage('', 'No se pudo crear el control (' + e + '). Por favor comun??quese con el Administrador.');
    }
}

function setupRadioGroup(defaultValue, dataSource, displayExpr, valueExpr, itemTemplate) {
    try {
        if (!itemTemplate)
            itemTemplate = 'item';
        var radioGroup = {
            dataSource: dataSource,
            value: defaultValue,
            layout: 'vertical',
            displayExpr: displayExpr,
            valueExpr: valueExpr,
            onValueChanged: null,
            itemTemplate: itemTemplate
        }

        return radioGroup;
    } catch (e) {
        showErrorMessage('', 'No se pudo crear el control (' + e + '). Por favor comun??quese con el Administrador.');
    }

}

function setupToolBarView(title, click, type, textType) {

    var toolBarView = {
        items: [
            {
                location: 'before',
                options: { type: type, text: textType ? textType : undefined, onClick: !click ? backView : click },
                widget: 'dxButton',
            },
            { text: title }
        ]
    }

    return toolBarView;
}

/*
    Configura un control de galler??a de Im??genes.
    Par??metros:
        dataSource: Origen de Datos a cargar en el gallery.
        height: Alto del control.
        slideShow: Booleano que indica si las im??genes se desplazan autom??ticamente.
        delaySlide: Tiempo de desplazamiento de las im??genes.
        loop: Booleano que indica si se desplaza nuevamente la primera imagen despu??s de la ??ltima.
        showButtons: Booleano que indica si se muestran los botones de navegaci??n.
        showIndicator: Booleano que indica si se muestran los indicadores de im??genes.
*/
function setupGallery(dataSource, slideShow, delaySlide, loop, showButtons, showIndicator) {
    var gallery = {
        dataSource: dataSource,
        width: '100%',
        slideshowDelay: slideShow ? delaySlide : 0,
        loop: loop,
        showNavButtons: showButtons,
        showIndicator: showIndicator
    }

    return gallery;
}

function setupTabsControl(dataSource, selectedIndex, itemTemplate) {

    var tabs = {
        dataSource: dataSource,
        selectedIndex: selectedIndex,
        itemTemplate: itemTemplate,
        deferRendering: true,
        onItemClick: null,
        onSelectionChanged: null,
    }

    return tabs;
}

/*
    Configura un control de hoja de acciones (Se usa en m??biles)
    Par??metros:
        dataSource: Origen de datos que contiene las acciones a realizar,
        showTitle: Valor booleano para indicar si se muestra o no un t??tulo,
        title: T??tulo a mostrar en la hoja de acciones,
        itemTemplate: Dise??o que se desea mostrar en cada ??tem
*/
function setupActionSheet(dataSource, showTitle, title, itemTemplate) {
    var actionSheet = {
        dataSource: dataSource,
        showCancelButton: true,
        showTitle: showTitle,
        title: title,
        onItemClick: null,
        onCancelClick: null,
        visible: false,
        cancelText: 'Cancelar',
        itemTemplate: itemTemplate
    }

    return actionSheet;
}

function setupColorBoxControl(defaultValue, placeholder, typeStateField) {
    var colorBox = {
        applyButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        value: defaultValue,
        onChange: undefined,
        onClosed: undefined,
        onCopy: undefined,
        onCut: undefined,
        onDisposing: undefined,
        onEnterKey: undefined,
        onFocusIn: undefined,
        onFocusOut: undefined,
        onInitialized: undefined,
        onInput: undefined,
        onKeyDown: undefined,
        onKeyPress: undefined,
        onKeyUp: undefined,
        onOpened: undefined,
        onOptionChanged: undefined,
        onPaste: undefined,
        onValueChanged: undefined,
        deferRendering: true,
        placeholder: placeholder,
        disabled: undefined,
        readonly: undefined,
        visible: true
    }

    if (typeStateField)
        setStateField(colorBox, typeStateField);

    return colorBox;
}


/*
    Permite la configuraci??n de un bot??n flotante en la pantalla.
    Par??metros:
        typeButton: Tipo de Bot??n a crear
*/
function setupFloatButton(classButton, action, icon, sizeFloatButtons, typeFloatButtons, aditionalClass, groupValidation) {
    var areaFloat = document.getElementById('floatButtons');
    var floatButtons = document.createElement('div');

    $(floatButtons).dxButton({
        visible: true,


        validationGroup: groupValidation,
        onClick: function (params) {
            if (action)
                action(params);
        }
    });
    var classCurrentButton = 'btn-movil';

    if (!icon)
        icon = iconosCore.check;

    if (!typeFloatButtons)
        typeFloatButtons = this.typeFloatButtons.default;

    if (sizeFloatButtons == this.sizeFloatButtons.small)
        classCurrentButton = 'btn-movil-small';

    floatButtons.classList.add(classCurrentButton);
    floatButtons.classList.add(typeFloatButtons);
    if (aditionalClass)
        floatButtons.classList.add(aditionalClass);

    $(floatButtons).dxButton('option', 'visible', true);
    $(floatButtons).dxButton('option', 'onClick', function (params) {
        if (action)
            action(params);
    });

    switch (classButton) {
        case classButtons.Cancel:
            icon = iconosCore.times;
            floatButtons.id = 'floatButtonCancel';
            break;
        case classButtons.Save:
            icon = iconosCore.floppy;
            floatButtons.id = 'floatButtonSave';
            break;
        case classButtons.Delete:
            icon = iconosCore.minus;
            floatButtons.id = 'floatButtonDelete';
            break;
        case classButtons.New:
            icon = iconosCore.plus;
            floatButtons.id = 'floatButtonNew';
            break;
        case classButtons.Accept:
            icon = iconosCore.check;
            floatButtons.id = 'floatButtonAccept';
            break;
        case classButtons.Search:
            icon = iconosCore.search;
            floatButtons.id = 'floatButtonSearch';
            break;
        case classButtons.Other:
            floatButtons.id = 'floatButtonOther_' + icon.split('-')[1];
            break;
    }
    $(floatButtons).dxButton('option', 'icon', 'fa ' + icon);



    areaFloat.appendChild(floatButtons);
}

function hideFloatButtons() {
    var floatButtons = document.getElementById('floatButtons');
    floatButtons.innerHTML = '';
}

function setupLoadPanel() {
    var loadPanel = {
        message: 'Cargando',
        visible: false,
        deferRendering: false,
        height: 'auto'
    }

    return loadPanel;
}

function setupFileUploader(multiple, accept, uploadMode, labelText, showFileList, uploadUrl, typeStateField) {
    var fileUploader = {
        multiple: multiple ? multiple : false,
        accept: accept ? accept : '*',
        uploadMode: uploadMode ? uploadMode : 'instantly',
        uploadButtonText: 'Cargar',
        uploadedMessage: 'Cargado',
        uploadFailedMessage: 'Error al cargar el archivo',
        selectButtonText: 'Seleccionar',
        disabled: false,
        visible: true,
        readOnly: false,
        labelText: labelText ? labelText : '',
        onDisposing: null,
        onInitialized: null,
        onOptionChanged: null,
        onProgress: null,
        onUploadAborted: null,
        onUploaded: null,
        onUploadError: null,
        onUploadStarted: null,
        onValueChanged: null,
        readyToUploadMessage: 'Listo para cargar',
        showFileList: showFileList ? showFileList : true,
        uploadUrl: uploadUrl ? uploadUrl : 'https://js.devexpress.com/Content/Services/upload.aspx'
    }

    if (typeStateField)
        setStateField(fileUploader, typeStateField);

    return fileUploader;
}

/*****************************************************************************************************************************************************************************************************************************************************************
-------------------------------------------------C O N F I G U R A C I ?? N   C O N T R O L E S   E S T A D I S T I C O S------------------------------------------------------------------------------------------------------------------------------------------
*****************************************************************************************************************************************************************************************************************************************************************/

function setupPieChar(dataSource, series, height, width, title, subtitle, showLegend, extendPropierties) {
    if (!showLegend)
        showLegend = true;

    var pieChart = {
        dataSource: dataSource,
        series: series,
        size: {
            height: height,
            width: width
        },
        legend: {
            visible: showLegend,
            horizontalAlignment: "center",
            verticalAlignment: "bottom"
        },
        tooltip: {
            enabled: true,
            format: "currency",
            percentPrecision: 2,
            customizeTooltip: function (arg) {
                return {
                    text: arg.valueText + " - " + arg.percentText
                };
            }
        },
        title: {
            text: title,
            font: {
                size: 16,
                family: mainFontFamily,
                color: '#00c0d5'
            },
            subtitle: {
                text: subtitle,
                size: 12,
                family: mainFontFamily,
                color: 'grey'
            }
        },
        commonSeriesSettings: {
            type: "doughnut",
            innerRadius: 0.2,
            label: {
                visible: true,
                connector: {
                    visible: true,
                    width: 0.5
                },
                format: "currency",
                customizeText: function (arg) {
                    return arg.argumentText + " (" + arg.percentText + ")";
                }
            }
        }
    }

    if (extendPropierties)
        $.extend(pieChart, extendPropierties);

    return pieChart;
}

function setupLinearGauge(defaultValue, startValue, endValue, subValues, typeLinear, formatValue) {
    if (!formatValue)
        formatValue = formatValues.Money;
    if (!typeLinear)
        typeLinear = typesLinearGauge.Rectangle;
    var linearGauge = {
        animation: {
            enabled: true,
            duration: 5000
        },
        startValue: startValue,
        endValue: endValue,
        value: defaultValue,
        tickInterval: 50,
        label: {
            customizeText: function (arg) {
                if (formatValue == formatValues.Percent)
                    return arg.valueText + formatValue;
                else
                    return formatValue + arg.valueText;
            }
        },
        subvalues: subValues,
        subvalueIndicator: {
            type: typeLinear,
            color: mainColor
        },
        tooltip: {
            enabled: true,
            format: 'currency',
            precision: 2,
            font: {
                size: 12,
                weight: 700,
                family: mainFontFamily
            },
            color: mainColor,

        }
    }

    return linearGauge;
}

function setupCircularGauge(defaultValue, startValues, endValues, subvalues, typeLinear, title, interval) {

    if (!interval)
        interval = 100;

    if (!typeLinear)
        typeLinear = typesLinearGauge.Rectangle;

    var circularGauge = {
        scale: {
            startValue: startValues,
            endValue: endValues,
            tickInterval: interval,
            label: {
                useRangeColors: true
            }
        },
        rangeContainer: {
            palette: 'pastel',
            ranges: [
                { startValue: startValues, endValue: startValues + ((endValues * 30) / 100), color: '#f16f5c' },
                { startValue: startValues + ((endValues * 30) / 100), endValue: startValues + ((endValues * 60) / 100), color: 'orange' },
                { startValue: startValues + ((endValues * 60) / 100), endValue: endValues, color: mainColor }
            ]
        },
        valueIndicator: {
            type: typeLinear,
            color: mainColor
        },
        subvalues: subvalues,
        subvalueIndicator: {
            type: typeLinear,
            color: mainColor
        },
        size: {
            height: 200,
        },
        value: defaultValue,
        title: {
            text: title,
            font: {
                size: 16,
                color: mainColor,
                family: mainFontFamily
            }
        }
    }

    return circularGauge;

}

function setupChartLine(dataSource, fieldArgumentSerie, series, title, subtitle, heightLine) {
    var lineChart = {
        tooltip: {
            enabled: true,
            zIndex: 3,
            customizeTooltip: function (args) {
                return {
                    text: Number(args.value).formatMoney(2, '.', ',')
                };
            }
        },
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: fieldArgumentSerie,
            type: 'line', label: {
                customizeText: function (args) {
                    var FechaRegular = Date.parse(args.valueText + 'T00:00:00');
                    return new Date(FechaRegular).getDay() + '/' + new Date(FechaRegular).getMonth();
                },
                rotationAngle: 45
            }
        },
        "export": {
            enabled: false
        },
        margin: {
            bottom: 20
        },
        argumentAxis: {
            valueMarginsEnabled: false,
            discreteAxisDivisionMode: "crossLabels",
            grid: {
                visible: true
            },
            label: {
                customizeText: function (args) {
                    var FechaRegular = Date.parse(args.value + 'T00:00:00');
                    return mesesAnio[Date.parse(FechaRegular).getMonth()].TextoAbr + ', ' + (Date.parse(FechaRegular).getDate());
                },
                overlappingBehavior: {
                    mode: 'rotate',
                    rotationAngle: 315,
                    staggeringSpacing: 1,
                },
                indentFromAxis: 5
            },
            tickInterval: {
                days: 1
            }
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            itemTextPosition: "bottom",
        },
        size: {
            height: heightLine
        },
        series: series,
        title: {
            text: title,
            subtitle: {
                text: subtitle
            }
        },
        valueAxis: {
            label: {
                format: 'decimal',
                customizeText: function (args) {
                    return Number(args.valueText).formatMoney(2, '.', ',');
                },
            }
        },
    }

    return lineChart;
}


/*****************************************************************************************************************************************************************************************************************************************************************
--------------------------------------------------------------------------------------------C O N F I G U R A C I ?? N  C O L U M N A S----------------------------------------------------------------------------------------------------------------------------
*****************************************************************************************************************************************************************************************************************************************************************/

/*
    Establece el estado de una columna
    Par??metros
        column: Columna a establecer el estado.
        typeStateField: Estado a establecer en la columna.
*/
function setStateColumn(column, typeStateField) {

    switch (typeStateField) {
        case 'hide':
            column.visible = false;
            break;
        case 'disabled':
            column.disabled = true;
            break;
        case 'readOnly':
            column.readonly = true;
            break;
    }
    return column;
}

/*
    Permite la configuraci??n de una columna de texto de un grid.
    Par??metros:
        dataField: Nombre del campo asociado a la fuente de datos que se carga en el grid.
        caption: Nombre de la columna del grid.
        isRequerid: Valor Booleano que indica si la columna es un dato obligatorio.
        width: Ancho de la columna.
        typeCharAllowed: Tipo de caracteres permitidos en la columna.
        specialsChar: Caracteres especiales que permitir?? la columna. Solo aplica para los tipos de caracteres permitidos (OnlyLetterChar, OnlyNumbersChar, OnlyLettersNumberChar).
        typeStateField: Valor que indica c??mo se establecer?? la columna inicialmente
*/
function setupTextColumn(dataField, caption, width, allowFilter, alignment, isRequerid, typeCharAllowed, specialsChar, typeStateField) {
    var rulePattern = null;
    var messageText = CORE_VALIDATION("custom");
    var messageValidation = CORE_VALIDATION("required");
    messageValidation = messageValidation.replace("(nameControl)", caption);
    var column = null;
    var rulesValidation = [];
    if (isRequerid) {
        var messageValidation = CORE_VALIDATION("required");
        rulesValidation.push({ type: 'required', message: messageValidation });
    }
    switch (typeCharAllowed) {
        case 'textOnly':
            rulePattern = getColumnPattern(typePatternColumn.OnlyLetters);
            break;
        case 'numberOnly':
            rulePattern = getColumnPattern(typePatternColumn.OnlyNumbers);
            break;
        case 'textAndNumberOnly':
            rulePattern = getColumnPattern(typePatternColumn.OnlyLettersNumber);
            break;
        case 'textAndCharactersOnly':
            rulePattern = getColumnPattern(typePatternColumn.OnlyLetterChar, specialsChar);
            break;
        case 'NumberAndCharactersOnly':
            rulePattern = getColumnPattern(typePatternColumn.OnlyNumbersChar, specialsChar);
            break;
        case 'textNumberAndCharactersOnly':
            rulePattern = getColumnPattern(typePatternColumn.OnlyLettersNumberChar, specialsChar);
            break;
    }
    if (rulePattern != null)
        rulesValidation.push(rulePattern);
    column = {
        dataField: dataField,
        caption: caption,
        allowEditing: true,
        width: width,
        visible: true,
        readonly: false,
        disabled: false,
        alignment: alignment ? alignment : textAlignment.Center,
        allowFiltering: allowFilter != null ? allowFilter : true,
        validationRules: rulesValidation,
    };
    column = setStateColumn(column, typeStateField);
    return column;
}

/*
    Configuraci??n de una columna tipo check
    Par??metros:
        dataField: Nombre del campo asociado a la fuente de datos que se carga en el grid.
        caption: Nombre de la columna del grid.
        width: Ancho de la columna.
        typeStateField: Valor que indica c??mo se establecer?? la columna inicialmente.
*/
function setupCheckColumn(dataField, caption, width, typeStateField) {
    var column = null;
    column = {
        dataField: dataField,
        caption: caption,
        allowEditing: true,
        dataType: 'boolean',
        visible: true,
        readonly: false,
        disabled: false,
        width: width
    };
    column = setStateColumn(column, typeStateField);
    return column;
}

/*
    Configuraci??n de una columna para ingresar la c??dula
    Par??metros:
        dataField: Nombre del campo asociado a la fuente de datos que se carga en el grid.
        caption: Nombre de la columna del grid.
        isRequerid: Valor Booleano que indica si la columna es un dato obligatorio.
        width: Ancho de la columna.
        typeStateField: Valor que indica c??mo se establecer?? la columna inicialmente.
*/
function setupColumnCED(dataField, caption, width, isRequerid, typeStateField) {
    var rulePatternCED = getColumnPattern(typePatternColumn.CED);
    var messageValidationCED = CORE_VALIDATION("vced");
    messageValidationCED = messageValidationCED.replace("(nameControl)", caption);
    var column = null;
    var rulesValidation = [];

    if (isRequerid) {
        var messageValidation = CORE_VALIDATION("required");
        messageValidation = messageValidation.replace("(nameControl)", caption);
        rulesValidation.push({ type: 'required', message: messageValidation });
    }
    rulesValidation.push(rulePatternCED);
    rulesValidation.push({ type: 'custom', validationCallback: checkDNI, message: messageValidationCED });
    column = {
        dataField: dataField,
        caption: caption,
        width: ancho,
        allowEditing: true,
        visible: true,
        readonly: false,
        disabled: false,
        placeholder: ConstantsBehaivor.PLACEHOLDER_DNI,
        validationRules: rulesValidation
    };
    column = setStateColumn(column, typeStateField);
    return column;
}

/*
    Configuraci??n de una columna de tipo fecha
    Par??metros:
        dataField: Nombre del campo asociado a la fuente de datos que se carga en el grid.
        caption: Nombre de la columna del grid.
        isRequerid: Valor Booleano que indica si la columna es un dato obligatorio.
        width: Ancho de la columna.
        minDate: Fecha M??nima.
        maxDate: Fecha M??xima.
        typeStateField: Valor que indica c??mo se establecer?? la columna inicialmente.
*/
function setupDateColumn(dataField, caption, width, allowFilter, isRequerid, minDate, maxDate, typeStateField) {
    var column = null;
    var rulesValidation = [];
    if (isRequerid) {
        rulesValidation.push(getValidationRule(typeValidation.Required, caption));
    }

    if (minDate != null || maxDate != null) {
        if (minDate == null) {
            minDate = Date.parse('1900-01-01');
        }

        if (maxDate == null) {
            maxDate = Date.parse('2900-01-01');
        }
        messageValidation = CORE_VALIDATION('range');
        messageValidation = messageValidation.replace("(nameControl)", caption);
        messageValidation = messageValidation.replace("(rangomenor)", minDate.toDateString());
        messageValidation = messageValidation.replace("(rangomayor)", maxDate.toDateString());
        rulesValidation.push({ type: 'range', min: Date.parse(minDate.toDateString()), max: Date.parse(maxDate.toDateString()), message: messageValidation });
    }
    column = {
        dataField: dataField,
        caption: caption,
        dataType: 'date',
        width: width,
        allowEditing: true,
        value: maxDate == null ? null : Date.parse(maxDate.toDateString()),
        visible: true,
        readonly: false,
        disabled: false,
        alignment: textAlignment.Center,
        allowFiltering: allowFilter != null ? allowFilter : true,
        placeholder: ConstantsBehaivor.PATTERN_SHORTDATE,
        format: ConstantsBehaivor.PATTERN_SHORTDATE,
        validationRules: rulesValidation
    };
    column = setStateColumn(column, typeStateField);
    return column;
}

/*
    Configuraci??n de una columna con el formato de fecha y hora.
    Par??metros:
        dataField: Nombre del campo asociado a la fuente de datos que se carga en el grid.
        caption: Nombre de la columna del grid.
        width: Ancho de la columna.
        typeStateField: Valor que indica c??mo se establecer?? la columna inicialmente.
*/
function setupDateTimeColumn(dataField, caption, width, allowFilter, typeStateField) {
    var column = {
        dataField: dataField,
        caption: caption,
        dataType: 'date',
        width: width,
        allowEditing: true,
        alignment: textAlignment.Center,
        allowFiltering: allowFilter != null ? allowFilter : true,
        placeholder: ConstantsBehaivor.PATTERN_LONGDATE,
        format: ConstantsBehaivor.PATTERN_LONGDATE
    }
    column = setStateColumn(column, typeStateField);

    return column;
}

/*
    Configuraci??n de una columna de tipo moneda
    Par??metros:
        dataField: Nombre del campo asociado a la fuente de datos que se carga en el grid.
        caption: Nombre de la columna del grid.
        isRequerid: Valor Booleano que indica si la columna es un dato obligatorio.
        align: Alineaci??n del texto de la columna
        width: Ancho de la columna.
        typeStateField: Valor que indica c??mo se establecer?? la columna inicialmente.
*/
function setupMoneyColumn(dataField, caption, width, isRequerid, align, typeStateField) {
    var rulePatternNumber = getColumnPattern(typePatternColumn.DecimalNumber);
    var column = null;
    var rulesValidation = [];
    if (isRequerid) {
        var messageValidation = CORE_VALIDATION("required");
        messageValidation = messageValidation.replace("(nameControl)", caption);
        rulesValidation.push({ type: 'required', message: messageValidation });
    }
    rulesValidation.push(rulePatternNumber);
    column = {
        dataField: dataField,
        caption: caption,
        width: width,
        allowEditing: true,
        visible: true,
        readonly: false,
        disabled: false,
        alignment: textAlignment.Center,
        format: 'currency',
        precision: 2,
        alignment: align,
        dataType: 'number',
        validationRules: rulesValidation
    };

    column = setStateColumn(column, typeStateField);
    return column;
}

/*
    Configuraci??n de una columna de tipo selecci??n
    Par??metros:
        dataField: Nombre del campo asociado a la fuente de datos que se carga en el grid.
        caption: Nombre de la columna del grid.
        isRequerid: Valor Booleano que indica si la columna es un dato obligatorio.
        dataSource: Fuente de datos para alimentar el combo.
        displayText: Texto a desplegar en el combo.
        valueSelection: Valor de selecci??n.
        width: Ancho de la columna.
        typeStateField: Valor que indica c??mo se establecer?? la columna inicialmente.
*/
function setupSelectionColumn(dataField, caption, dataSource, displayText, valueSelection, width, allowFilter, isRequerid, typeStateField) {
    var column = null;
    var rulesValidation = [];
    if (isRequerid) {
        var messageValidation = CORE_VALIDATION("required");
        messageValidation = messageValidation.replace("(nameControl)", caption);
        rulesValidation.push({ type: 'required', message: messageValidation });
    }
    column = {
        dataField: dataField,
        caption: caption,
        allowEditing: true,
        visible: true,
        readonly: false,
        disabled: false,
        alignment: textAlignment.Center,
        width: width,
        allowFiltering: allowFilter != null ? allowFilter : true,
        validationRules: rulesValidation,
        lookup: {
            dataSource: dataSource, valueExpr: valueSelection, displayExpr: displayText
        }
    };
    column = setStateColumn(column, typeStateField);
    return column;
}

/*
    Configuraci??n de una columna de tipo booleano
    Par??metros:
        dataField: Nombre del campo asociado a la fuente de datos que se carga en el grid.
        caption: Nombre de la columna del grid.
        width: Ancho de la columna.
*/
function setupBoolColumn(dataField, caption, width, allowFilter) {
    var columna = {
        dataField: dataField,
        caption: caption,
        allowEditing: true,
        width: width,
        alignment: textAlignment.Center,
        allowFiltering: allowFilter != null ? allowFilter : true,
        cellTemplate: function (container, options) {
            var htmlColumna = "";
            if (options.value == true)
                htmlColumna = "<div style='color:green'> <i style='margin-right:3px; display:inline-block' class='fa " + iconosCore.check + "' /> <span style='display:inline-block; font-size:12px'>" + CORE_TAG('Yes') + "</span></div>";
            else
                htmlColumna = "<div style='color:red'> <i style='margin-right:3px; display:inline-block' class='fa " + iconosCore.times + "' /> <span style='display:inline-block; font-size:12px'>" + CORE_TAG('No') + "</span></div>";

            $(htmlColumna).appendTo(container);
        }
    }

    return columna;
}

/*
    Configuraci??n de una columna de tipo booleano
    Par??metros:
        dataField: Nombre del campo asociado a la fuente de datos que se carga en el grid.
        caption: Nombre de la columna del grid.
        width: Ancho de la columna.
*/
function setupBoolOtherColumn(dataField, caption, width, textAprove, textCancel) {
    var columna = {
        dataField: dataField,
        caption: caption,
        width: width,
        alignment: textAlignment.Center,
        cellTemplate: function (container, options) {
            var htmlColumna = "";
            if (options.value == true)
                htmlColumna = "<div style='color:green'> <i style='margin-right:3px; display:inline-block' class='fa " + iconosCore.check + "' /> <span style='display:inline-block; font-size:12px'>" + textAprove + "</span></div>";
            else
                htmlColumna = "<div style='color:red'> <i style='margin-right:3px; display:inline-block' class='fa " + iconosCore.times + "' /> <span style='display:inline-block; font-size:12px'>" + textCancel + "</span></div>";

            $(htmlColumna).appendTo(container);
        }
    }

    return columna;
}

/*
    Configuraci??n de una columna con un estilo predefinido.
    Par??metros:
        dataField: Nombre del campo asociado a la fuente de datos que se carga en el grid.
        caption: Nombre de la columna del grid.
        width: Ancho de la columna.
        cellTemplate: Funci??n que devuelve el estilo que se desea dar a la columna
*/
function setupStyleColumn(dataField, caption, width, allowFilter, cellTemplate) {
    var columna = {
        dataField: dataField,
        caption: caption,
        width: width,
        alignment: textAlignment.Center,
        allowFiltering: allowFilter != null ? allowFilter : true,
        cellTemplate: function (container, options) {
            $(cellTemplate(options)).appendTo(container);
        }
    }

    return columna;
}

/*
    Configuraci??n de una columna con acciones de Editar y Eliminar.
    Par??metros:
        actionEdit: Acci??n que se establece al editar un registro. Si la funci??n no est?? definida, no se dibuja esta acci??n.
        accionDelete: Acci??n que se establece al eliminar un registro. Si la funci??n no est?? definida, no se dibuja esta acci??n.
        presentationText: Modo de presentaci??n de la acci??n
*/
function setupActionColumns(actionEdit, actionDelete, presentationText) {
    var column = {
        dataField: '',
        caption: CORE_TAG('Actions'),
        alignment: textAlignment.Center,
        width: 'auto',
        cellTemplate: function (container, options) {
            if (actionEdit) {
                var htmlEdit = "<a class='column-action-grid'>";
                switch (presentationText) {
                    case 'onlytext':
                        htmlEdit = htmlEdit + "<span>" + CORE_TAG('Edit') + "</span>";
                        break;
                    case 'onlyicon':
                        htmlEdit = htmlEdit + "<i title='" + CORE_TAG('Edit') + "' class='fa " + iconosCore.edit + "' />";
                        break;
                    case 'icontext':
                        htmlEdit = htmlEdit + "<i style='display:inline-block;' class='fa " + iconosCore.edit + "' /> <span style='display:inline-block'>" + CORE_TAG('Edit') + "</span>";
                        break;
                    default:
                        break;
                }
                htmlEdit = htmlEdit + "</a>";
                $(htmlEdit).on('click', function (e) {
                    actionEdit(options.data);
                }).appendTo(container);
            }
            if (actionDelete) {
                var htmlDelete = "<a class='column-action-grid'>";
                switch (presentationText) {
                    case 'onlytext':
                        htmlDelete = htmlDelete + "<span>" + CORE_TAG('Delete') + "</span>";
                        break;
                    case 'onlyicon':
                        htmlDelete = htmlDelete + "<i title='" + CORE_TAG('Delete') + "' class='fa " + iconosCore.minus_circle + "' />";
                        break;
                    case 'icontext':
                        htmlDelete = htmlDelete + "<i style='display:inline-block; margin-right:1px' class='fa " + iconosCore.minus_circle + "' /> <span style='display:inline-block'>" + CORE_TAG('Delete') + "</span>";
                        break;
                    default:
                        break;
                }
                htmlDelete = htmlDelete + "</a>";
                $(htmlDelete).on('click', function (e) {
                    actionDelete(options.data);
                }).appendTo(container);
            }
        }
    }

    return column;
}

/*
    Configuraci??n de una columna de tipo bot??n.
    Par??metros:
        caption: Nombre de la columna del grid.
        text: Texto de la etiqueta del bot??n.
        presentationText: Modo de presentaci??n del bot??n.
        icon: ??cono a mostrar en el bot??n.
        type: Tipo de bot??n a configurar.
        action: Acci??n que se ejecutar?? en el bot??n.
*/
function setupButtonColumn(caption, text, presentationText, icon, type, action) {
    var column = {
        caption: caption,
        dataField: '',
        alignment: textAlignment.Center,
        width: 'auto',
        cellTemplate: function (container, options) {
            var classcss = "button-blue";
            switch (type) {
                case 'default':
                    classcss = 'button-orange';
                    break;
                case 'success':
                    classcss = 'button-green'
                    break;
                case 'danger':
                    classcss = 'button-red'
                    break;
                default:
                    break;
            }
            var htmlButton = "<a class='column-button-grid " + classcss + "'>";
            switch (presentationText) {
                case 'onlytext':
                    htmlButton = htmlButton + "<span>" + text + "</span>";
                    break;
                case 'onlyicon':
                    htmlButton = htmlButton + "<i title='" + text + "' class='fa " + icon + "' />";
                    break;
                case 'icontext':
                    htmlButton = htmlButton + "<i style='display:inline-block;' class='fa " + icon + "' /> <span style='display:inline-block'>" + text + "</span>";
                    break;
                default:
                    break;
            }
            htmlButton = htmlButton + "</a>";
            $(htmlButton).on('click', function (e) {
                action(options);
            }).appendTo(container);
        }
    }

    return column;
}

/*
    Configuraci??n de una columna de tipo imagen.
    Par??metros:
        dataField: Nombre del campo asociado a la fuente de datos que se carga en el grid.
        caption: Nombre de la columna del grid.
        width: Ancho de la columna.
        sizeImage: Tama??o de la imagen a mostrar
*/
function setupImageColumn(dataField, caption, width, sizeImage) {
    var column = {
        dataField: dataField,
        caption: caption,
        width: width,
        cellTemplate: function (container, options) {
            $("<img style='height:" + sizeImage + "px; width:" + sizeImage + "px' />")
                .attr("src", "images/" + options.value)
                .appendTo(container);
        }
    }

    return column;
}

/*
    Permite configurar un resumen en una columna especificada.
    Par??metros:
        dataField: Nombre del campo asociado a la fuente de datos que se carga en el grid.
        description: Descripci??n del resumen.
        format: Formato del valor del resumen.
        typeSummary: Tipo de resumen a configurar.
*/
function setupSummaryColumn(dataField, typeSummary, description, format) {
    var summary = {
        column: dataField, summaryType: typeSummary, customizeText: null, valueFormat: null
    };

    if (description) {
        summary.customizeText = function (e) {
            return description + ": " + e.value
        }
    }

    if (format) {
        summary.valueFormat = format;
    }

    return summary;
}
/*****************************************************************************************************************************************************************************************************************************************************************
--------------------------------------------------------------------------------------------V A L I D A C I O N E S-----------------------------------------------------------------------------------------------------------------------------------------------
*****************************************************************************************************************************************************************************************************************************************************************/

/*
    Obtiene el patr??n de validaci??n a una columna.
    Par??metros:
        typePatternColumn: Tipo de patr??n a configuraci??n de la columna.
        specialsChar: Caracteres especiales que la columna permite.
        presicion: Presicion de los n??meros decimales.
*/
function getColumnPattern(typePatternColumn, specialsChar, presicion) {
    var rule = null;
    var vpatron = '';
    switch (typePatternColumn) {
        case "ID":
            var messageValidationCED = CORE_VALIDATION("vced");
            messageValidationCED = messageValidationCED + " debe seguir formato: " + ConstantsBehaivor.PLACEHOLDER_DNI;
            rule = { type: 'pattern', message: messageValidationCED, pattern: ConstantsBehaivor.PATTERN_CED }
            break;
        case "RUC":
            var messageValidationRUC = CORE_VALIDATION("vruc");
            messageValidationRUC = messageValidationRUC + " debe seguir formato: " + ConstantsBehaivor.PLACEHOLDER_RUC;
            rule = { type: 'pattern', message: messageValidationRUC, pattern: ConstantsBehaivor.PATTERN_RUC }
            break;
        case "TELF":
            var messageValidationPHONE = CORE_VALIDATION("vtelfcon");
            messageValidationPHONE = messageValidationPHONE + ConstantsBehaivor.PLACEHOLDER_PHONE;
            rule = { type: 'pattern', message: messageValidationPHONE, pattern: ConstantsBehaivor.PATTERN_PHONE }
            break;
        case "CELU":
            var messagesValidacionCELPHONE = CORE_VALIDATION("vcel");
            messagesValidacionCELPHONE = messagesValidacionCELPHONE + ConstantsBehaivor.PLACEHOLDER_CELLPHONE;
            rule = { type: 'pattern', message: messagesValidacionCELPHONE, pattern: ConstantsBehaivor.PLACEHOLDER_CELLPHONE }
            break;
        case "NDEC":
            var messageValidationDEC = CORE_VALIDATION("custom");
            messageValidationDEC = messageValidationDEC + ', verificar n??mero decimal';

            if (presicion == null)
                presicion = ConstantsBehaivor.PRECISION_DECIMAL;
            var patronNumDec = '/^\d+(?:\.\d{0,' + presicion + '})$/;';

            rule = { type: 'pattern', message: messageValidationDEC, pattern: patronNumDec }
            break;
        case "NENT":
            var messageValidationINT = CORE_VALIDATION("custom");
            messageValidationINT = messageValidationINT + ', verificar n??mero entero';
            rule = { type: 'pattern', message: messageValidationINT, pattern: "^[" + CORE_PATTERN_INT + "]+$" }
            break;
        case "NUMCTA":
            var messageValidationACCOUNT = CORE_VALIDATION("custom");
            messageValidationACCOUNT = messageValidationACCOUNT + ' debe seguir formato: ' + ConstantsBehaivor.PLACEHOLDER_ACCOUNT_NUMBER;
            rule = { type: 'pattern', message: messageValidationACCOUNT, pattern: ConstantsBehaivor.PATTERN_ACCOUNT_NUMBER }
            break;
        case "EMAIL":
            var messageValidationEMAIL = CORE_VALIDATION("custom");
            messageValidationEMAIL = messageValidationEMAIL + ', verificar email';
            rule = { type: 'email', message: messageValidationEMAIL }
            break;
        case "EXTC":
            var messageValidationEXT = CORE_VALIDATION("custom");
            messageValidationEXT = messageValidationEXT + ', verificar extensi??n';
            rule = { type: 'pattern', message: messageValidationEXT, pattern: "^[" + CORE_PATTERN_INT + "]+$" }
            break;
        case "TXTONLY":
            var messageValidationText = CORE_VALIDATION("custom");
            messageValidationText = messageValidationText + ', solo se acepta letras';
            vpatron = "^[" + CORE_PATTERN_LETTERS + "\\s]+$";
            rule = { type: 'pattern', message: messageValidationText, pattern: vpatron }
            break;
        case "TXTCHARONLY":
            var messageValidationChar = CORE_VALIDATION("custom");
            vpatron = "^[" + CORE_PATTERN_LETTERS + (specialsChar == null ? '' : specialsChar) + CORE_PATTERN_SPECIALS_ALLOWED + "\\s]+$";
            rule = { type: 'pattern', message: messageValidationChar, pattern: vpatron }
            break;
        case "NUMONLY":
            var messageValidationOnlyNUM = CORE_VALIDATION("custom");
            messageValidationOnlyNUM = messageValidationOnlyNUM + ', solo se acepta n??meros';
            vpatron = "^[" + CORE_PATTERN_INT + "]+$";
            rule = { type: 'pattern', message: messageValidationOnlyNUM, pattern: vpatron }
            break;
        case "NUMCHARONLY":
            var messageValidationCHARNUM = CORE_VALIDATION("custom");
            vpatron = "^[" + CORE_PATTERN_INT + (specialsChar == null ? '' : specialsChar) + CORE_PATTERN_SPECIALS_ALLOWED + "]+$";
            rule = { type: 'pattern', message: messageValidationCHARNUM, pattern: vpatron }
            break;
        case "TXTNUMONLY":
            var messageValidationTEXTNUM = CORE_VALIDATION("custom");
            vpatron = "^[" + CORE_PATTERN_LETTERS + CORE_PATTERN_INT + "\\s]+$";
            rule = { type: 'pattern', message: messageValidationTEXTNUM, pattern: vpatron }
            break;
        case "TXTNUCHARMONLY":
            var messageValidationCHARTEXTNUM = CORE_VALIDATION("custom");
            vpatron = "^[" + CORE_PATTERN_LETTERS + CORE_PATTERN_INT + (specialsChar == null ? '' : specialsChar) + CORE_PATTERN_SPECIALS_ALLOWED + "\\s]+$";
            rule = { type: 'pattern', message: messageValidationCHARTEXTNUM, pattern: vpatron }
            break;
    }
    return rule;
}

/*
    Obtiene una regla de validaci??n
    Par??metros:
        typeValidation: Tipo de Validaci??n a asociar a la regla de validaci??n.
        dataValidation: Datos necesarios para los tipos de validacion Range, stringLength.
        aditionalFunction: Funci??n que se desea a ejecutar al validar
*/
function getValidationRule(typeValidation, fieldName, dataValidation, aditionalFunction) {
    var ruleValidation = null;
    var messageValidation = "";
    messageValidation = CORE_VALIDATION(typeValidation);
    messageValidation = messageValidation.replace('(nameControl)', fieldName);
    switch (typeValidation) {
        case "required":
            ruleValidation = { type: typeValidation, message: messageValidation };
            break;
        case "numeric":
            ruleValidation = { type: typeValidation, message: messageValidation };
            break;
        case "range":
            var rangos = dataValidation.split(',');
            var minimo = rangos[0];
            var maximo = rangos[1];
            messageValidation = messageValidation.replace("(rangomenor)", minimo);
            messageValidation = messageValidation.replace("(rangomayor)", maximo);
            ruleValidation = { type: typeValidation, min: minimo, max: maximo, message: messageValidation };
            break;
        case "rangeDate":
            var rangosD = dataValidation.split(',');
            var minimo = rangosD[0];
            var maximo = rangosD[1];
            messageValidation = messageValidation.replace("(rangomenor)", minimo);
            messageValidation = messageValidation.replace("(rangomayor)", maximo);
            ruleValidation = { type: typeValidation, min: new Date(minimo), max: new Date(maximo), message: messageValidation };
            break;
        case "compare":
            messageValidation = messageValidation.replace('(campocomparar)', dataValidation);
            ruleValidation = { type: typeValidation, comparisonTarget: aditionalFunction, message: messageValidation };
            break;
        case "custom":
            ruleValidation = { type: typeValidation, validationCallback: aditionalFunction, message: messageValidation };
            break;
        case "email":
            ruleValidation = { type: typeValidation, message: messageValidation };
            break;
        case "pattern":
            ruleValidation = { type: typeValidation, pattern: dataValidation, message: messageValidation };
            break;

        case "stringLength":
            var rango = dataValidation.split(',');
            var minimo = rango[0];
            var maximo = rango[1];
            messageValidation = messageValidation.replace("(longitudmenor)", minimo);
            messageValidation = messageValidation.replace("(longitudmayor)", maximo);
            ruleValidation = { type: typeValidation, min: minimo, max: maximo, message: messageValidation };
            break;
    }

    return ruleValidation;
}

/*
    Validaci??n de campos obligatorios
    Par??metros:
        groupValidation: Grupo de Validaci??n al que se asociar?? la validaci??n.
        fieldName: Nombre del campo que se va a validar.
*/
function validateRequired(groupValidation, fieldName) {
    if (!fieldName)
        fieldName = '';
    var rulesValidation = [];
    rulesValidation.push(getValidationRule(typeValidation.Required, fieldName));
    var generalValidation = {
        validationGroup: groupValidation,
        validationRules: rulesValidation
    };
    return generalValidation;
}

function validateCompare(groupValidation, actionCompare, fieldName, fieldCompare) {
    var rulesValidation = [];
    rulesValidation.push(getValidationRule(typeValidation.Compare, fieldName, fieldCompare, actionCompare));
    var generalValidation = {
        validationGroup: groupValidation,
        validationRules: rulesValidation
    };
    return generalValidation;
}
/*
    Validaci??n de un control de tipo text box.
    Par??metros:
        nameControl: Nombrel del control a asociar la validaci??n.
        isRequerid: Indica si el control es obligatorio.
        groupValidation: Grupo de Validaci??n que se va a asociar las validaciones.
        minLength: Cantidad m??nima de caracteres permitidos en el texto.
        maxLength: Cantidad m??xima de caracteres permitidos en el texto.
        typeCharAllowed: Tipos de car??cteres permitidos en el texto.
        specialsChar: Caracteres especiales que se permitir??n en el texto.
*/
function validateText(nameControl, isRequired, groupValidation, minLength, maxLength, typeCharAllowed, specialsChar) {
    var rulesValidation = [];
    if (isRequired == true)
        rulesValidation.push(validateRequired(groupValidation));

    var vpattern = '';
    switch (typeCharAllowed) {
        case this.typeCharAllowed.OnlyText:
            vpattern = "^[" + CORE_PATTERN_LETTERS + "\\s]+$";
            onlyTextAllowed(nameControl);
            break;
        case this.typeCharAllowed.OnlyNumber:
            vpattern = "^[" + CORE_PATTERN_INT + "\\s]+$";
            onlyNumberAllowed(nameControl);
            break;
        case this.typeCharAllowed.OnlyTextAndNumber:
            vpatron = "^[" + CORE_PATTERN_LETTERS + CORE_PATTERN_INT + "]+$";
            onlyNumberAndTextAllowed(nameControl);
            break;
        case this.typeCharAllowed.OnlyTextAndChar:
            vpatron = "^[" + CORE_PATTERN_LETTERS + (specialsChar == null ? '' : specialsChar) + CORE_PATTERN_SPECIALS_ALLOWED + "\\s]+$";
            onlyTextAndCharAllowed(nameControl, specialsChar);
            break;
        case this.typeCharAllowed.OnlyNumberAndChar:
            vpatron = "^[" + CORE_PATTERN_INT + (specialsChar == null ? '' : specialsChar) + CORE_PATTERN_SPECIALS_ALLOWED + "]+$";
            onlyNumberAndCharAllowed(nameControl, specialsChar);
            break;
        case this.typeCharAllowed.OnlyTextNumberAndChar:
            vpatron = "^[" + CORE_PATTERN_LETTERS + CORE_PATTERN_INT + (specialsChar == null ? '' : specialsChar) + CORE_PATTERN_SPECIALS_ALLOWED + "\\s]+$";
            onlyTextNumberAndCharAllowed(nameControl, specialsChar);
            break;
        default:
            break;
    }

    if (vpattern != '') {
        var message = CORE_VALIDATION(typeValidation.Custom);
        rulesValidation.push({ type: typeValidation.Pattern, pattern: vpattern, message: message })
    }

    if (!(minLength == null && maxLength == null)) {
        minLength = minLength == null ? 0 : minLength;
        maxLength = maxLength == null ? 9999 : maxLength;
        var patternMessage = '';
        patternMessage = CORE_VALIDATION(typeValidation.StringLength);
        patternMessage = patternMessage.replace('(minLength)', minLength);
        patternMessage = patternMessage.replace('(maxLength)', maxLength);
        var patternLength = "^." + "{" + minLength + "," + maxLength + "}$";
        rulesValidation.push({ type: typeValidation.Pattern, pattern: patternLength, message: patternMessage })
    }

    var generalValidation = {
        validationGroup: groupValidation,
        validationRules: rulesValidation
    }

    return generalValidation;
}

/*
    Valida la identificaci??n de una persona en un campo de texto.
    Par??metros:
        isRequired: Indica si el campo es obligatorio.
        groupValidation: Grupo de validaci??n a asociar las validaciones.
*/
function validateDNI(isRequired, groupValidation, fieldName) {
    if (!fieldName)
        fieldName = '';
    var rulesValidation = [];
    if (isRequired) {
        rulesValidation.push(getValidationRule(typeValidation.Required, fieldName));
    }
    var messageValidation = CORE_VALIDATION("vced");
    rulesValidation.push({
        type: typeValidation.Custom,
        validationCallback: checkDNI,
        message: messageValidation
    });
    rulesValidation.push({
        type: typeValidation.Pattern,
        pattern: ConstantsBehaivor.PATTERN_CED,
        message: messageValidation
    });

    var generalValidation = {
        validationGroup: groupValidation,
        validationRules: rulesValidation
    };

    return generalValidation;
}

function validateRUC(isRequired, groupValidation, fieldName) {
    if (!fieldName)
        fieldName = '';
    var rulesValidation = [];
    if (isRequired) {
        rulesValidation.push(getValidationRule(typeValidation.Required, fieldName));
    }
    var messageValidation = CORE_VALIDATION("vced");
    rulesValidation.push({
        type: typeValidation.Custom,
        validationCallback: checkRUC,
        message: messageValidation
    });
    rulesValidation.push({
        type: typeValidation.Pattern,
        pattern: ConstantsBehaivor.PATTERN_RUC,
        message: messageValidation
    });

    var generalValidation = {
        validationGroup: groupValidation,
        validationRules: rulesValidation
    };

    return generalValidation;
}

function validatePASS(isRequired, groupValidation, fieldName) {
    if (!fieldName)
        fieldName = '';
    var rulesValidation = [];
    if (isRequired) {
        rulesValidation.push(getValidationRule(typeValidation.Required, fieldName));
    }
    var messageValidation = CORE_VALIDATION("vpass");
    rulesValidation.push({
        type: typeValidation.Custom,
        validationCallback: checkPASS,
        message: messageValidation
    });

    var generalValidation = {
        validationGroup: groupValidation,
        validationRules: rulesValidation
    };

    return generalValidation;
}
function validateEmail(isRequired, groupValidation, fieldName) {
    var rulesValidation = [];
    if (isRequired)
        rulesValidation.push(getValidationRule(typeValidation.Required, fieldName))

    rulesValidation.push(getValidationRule(typeValidation.Email, fieldName));

    var generalValidation = {
        validationGroup: groupValidation,
        validationRules: rulesValidation
    };
    return generalValidation;
}

function validatePhone(isRequired, groupValidation, fieldName) {

    var rulesValidation = [];
    if (isRequired)
        rulesValidation.push(getValidationRule(typeValidation.Required, fieldName))

    rulesValidation.push({
        type: typeValidation.Custom,
        validationCallback: checkLengthPhone,
        message: "El campo " + fieldName + " debe tener m??nimo " + ConstantsBehaivor.MIN_LENGTH_PHONE + " d??gitos"
    });

    rulesValidation.push({
        type: typeValidation.Custom,
        validationCallback: checkConventionalPhone,
        message: "El campo " + fieldName + " no debe iniciar con " + ConstantsBehaivor.INIT_NUMBER_CELLPHONE
    });

    var generalValidation = {
        validationGroup: groupValidation,
        validationRules: rulesValidation
    };
    return generalValidation;
}

function validateCellPhone(isRequired, groupValidation, fieldName) {
    if (!fieldName)
        fieldName = '';
    var rulesValidation = [];

    if (isRequired)
        rulesValidation.push(getValidationRule(typeValidation.Required, fieldName))

    var messageValidation = CORE_VALIDATION_ADD("vcel", ConstantsBehaivor.INIT_NUMBER_CELLPHONE + "#######");
    rulesValidation.push(getValidationRule(typeValidation.Pattern, ConstantsBehaivor.PATTERN_CELLPHONE, "N??MERO INVALIDO"));

    var generalValidation = {
        validationGroup: groupValidation,
        validationRules: rulesValidation
    };
    return generalValidation;
}

function validateHibridPhone(isRequired, groupValidation, fieldName) {
    var rulesValidation = [];
    if (isRequired)
        rulesValidation.push(getValidationRule(typeValidation.Required, fieldName))

    rulesValidation.push({
        type: typeValidation.Custom,
        validationCallback: checkLengthHibridPhone,
        message: "El campo " + fieldName + " es inv??lido, verifique la cantidad de caracteres ingresados"
    });

    var generalValidation = {
        validationGroup: groupValidation,
        validationRules: rulesValidation
    };

    return generalValidation;
}

function checkLengthPhone(params) {
    var value = params.value;
    if (!value)
        return true;
    if (value.length >= ConstantsBehaivor.MIN_LENGTH_PHONE && value.length <= ConstantsBehaivor.LENGTH_PHONE)
        return true;
    else
        return false;
}

function checkConventionalPhone(params) {

    if (ValidatorBehavior.IsConventionalPhone(params))
        return true;
    else
        return false;
}

function checkCellPhone(params) {
    if (ValidatorBehavior.IsCellPhone(params))
        return true;
    else
        return false;
}

function checkLengthCellPhone(params) {
    var value = params.value;
    if (!value)
        return true;
    if (value.length == ConstantsBehaivor.LENGTH_CELLPHONE)
        return true;
    else
        return false;
}

function checkLengthHibridPhone(params) {
    var value = params.value;
    var typeValidation = "PHONE";

    if (!value)
        return true;

    var initNumber = value.substring(0, ConstantsBehaivor.INIT_NUMBER_CELLPHONE.length);

    if (initNumber == ConstantsBehaivor.INIT_NUMBER_CELLPHONE)
        typeValidation = "CELL";

    if (typeValidation == "PHONE") {
        if (value.length >= ConstantsBehaivor.MIN_LENGTH_PHONE && value.length <= ConstantsBehaivor.LENGTH_PHONE)
            return true;
        else
            return false;
    } else {
        if (value.length == ConstantsBehaivor.LENGTH_CELLPHONE)
            return true;
        else
            return false;
    }
}

/*
    Verifica si la identificaci??n de una persona es v??lida
*/
function checkDNI(params) {
    if (ValidatorBehavior.ValidateDNI(params.value))
        return true;
    else
        return false;
}

function checkRUC(params) {
    if (ValidatorBehavior.ValidateRUC(params.value))
        return true;
    else
        return false;
}


function checkPASS(params) {
    if (ValidatorBehavior.ValidatePassport(params.value))
        return true;
    else
        return false;
}

/*****************************************************************************************************************************************************************************************************************************************************************
--------------------------------------------------------------------------------------------M E N S A J E S   D E   I N T E R F A Z-------------------------------------------------------------------------------------------------------------------------------
*****************************************************************************************************************************************************************************************************************************************************************/

/*
    Muestra una notificaci??n a la interfaz de tipo Error.
    P??rametros: 
        message: Mensaje que se va a desplegar
*/
function showNotificationError(message, time, position) {
    notificationTime = time ? time : notificationTime;
    DevExpress.ui.notify({ message: decodeURI(message), type: 'error', displayTime: notificationTime, position: position });
}

/*
    Muestra una notificaci??n a la interfaz de tipo Advertencia.
    P??rametros: 
        message: Mensaje que se va a desplegar
*/
function showNotificationWarning(message, time, position) {
    notificationTime = time ? time : notificationTime;
    DevExpress.ui.notify({ message: decodeURI(message), type: 'warning', displayTime: notificationTime, position: position });
}

/*
    Muestra una notificaci??n a la interfaz de tipo Exito.
    P??rametros: 
        message: Mensaje que se va a desplegar
*/
function showNotificationSuccess(message, time, position) {
    notificationTime = time ? time : notificationTime;
    DevExpress.ui.notify({ message: decodeURI(message), type: 'success', displayTime: notificationTime, position: position });
}

/*
    Muestra una notificaci??n a la interfaz de tipo Informativo.
    P??rametros: 
        message: Mensaje que se va a desplegar
*/
function showNotificationInfo(message, time, position) {
    notificationTime = time ? time : notificationTime;
    DevExpress.ui.notify({ message: decodeURI(message), type: 'info', displayTime: notificationTime, position: position });
}

/*
    Despliega un mensaje de error.
    Par??metros:
        error: Error en html que se desplegar?? en la pantalla.
        title: T??tulo del mensaje, si no est?? definido presenta un t??tulo predefinido.
        action: Acci??n a ejecutar despu??s de desplegar el mensaje.
*/
function showServerErrorMessage(error, title, action) {
    try {
        //var posini = error.responseText.search("<title>") + 7;
        //var posfin = error.responseText.search("</title>");
        messageError = error.responseJSON;
        if (messageError.contains('ExceptionMessage') == true) {
            var posinimsg = messageError.search("<ExceptionMessage>") + 18;
            var posfinmsg = messageError.search("</ExceptionMessage>");
            messageError = messageError.slice(posinimsg, posfinmsg);
        }

        DevExpress.ui.dialog.alert({
            message: decodeURI(messageError),
            title: title ? title : CORE_TAG('ErrorMessage'),
            buttons: [{
                text: CORE_TAG('Button_Accept'), onClick: function () {
                    if (action) {
                        action(messageError);
                    }
                    $(".dx-popup-title").removeClass("title-message-error");
                }
            }]
        });

        $(".dx-popup-title").addClass("title-message-error");
        $(".dx-popup-title").removeClass("title-message-success");
        $(".dx-popup-title").removeClass("title-message-warning");
        $(".dx-popup-title").removeClass("title-message-question");
        $(".dx-popup-title").removeClass("title-message-info");

    } catch (e) {
        showErrorMessage(CORE_TAG('ErrorMessage'), CORE_MESSAGE('CannotReadError'));
    }

}

/*
    Despliega un mensaje de error.
    Par??metros:
        error: Error en html que se desplegar?? en la pantalla.
        title: T??tulo del mensaje, si no est?? definido presenta un t??tulo predefinido.
        action: Acci??n a ejecutar despu??s de desplegar el mensaje.
*/
function showErrorMessage(title, message, action) {

    DevExpress.ui.dialog.alert({
        message: decodeURI(message),
        title: title ? title : CORE_TAG('ErrorMessage'),
        buttons: [{
            text: CORE_TAG('Button_Accept'), onClick: function () {
                if (action) {
                    action();
                }
                $(".dx-popup-title").removeClass("title-message-error");
            }
        }]
    });

    $(".dx-popup-title").addClass("title-message-error");
    $(".dx-popup-title").removeClass("title-message-success");
    $(".dx-popup-title").removeClass("title-message-warning");
    $(".dx-popup-title").removeClass("title-message-question");
    $(".dx-popup-title").removeClass("title-message-info");
}

/*
    Despliega un mensaje informartivo.
    Par??metros:
        message: Mensaje que se desplegar?? en la pantalla.
        title: T??tulo del mensaje, si no est?? definido presenta un t??tulo predefinido.
        action: Acci??n a ejecutar despu??s de desplegar el mensaje.
*/
function showSimpleMessage(title, message, action, sound) {

    if (sound && sound == true) {
        var audio = document.getElementById('notificationMessage');
        audio.play();
    }

    DevExpress.ui.dialog.alert({
        message: decodeURI(message),
        title: title,
        buttons: [{
            text: CORE_TAG('Button_Accept'), onClick: function () {
                if (action)
                    action();

                $(".dx-popup-title").removeClass("title-message-info");
            }
        }]
    });

    $(".dx-popup-title").addClass("title-message-info");
    $(".dx-popup-title").removeClass("title-message-success");
    $(".dx-popup-title").removeClass("title-message-error");
    $(".dx-popup-title").removeClass("title-message-question");
    $(".dx-popup-title").removeClass("title-message-warning");
}

/*
    Despliega un mensaje de advertencia.
    Par??metros:
        message: Mensaje que se desplegar?? en la pantalla.
        title: T??tulo del mensaje, si no est?? definido presenta un t??tulo predefinido.
        action: Acci??n a ejecutar despu??s de desplegar el mensaje.
*/
function showWarningMessage(title, message, action, sound) {

    if (sound && sound == true) {
        var audio = document.getElementById('notificationMessage');
        audio.play();
    }
    DevExpress.ui.dialog.alert({
        message: decodeURI(message),
        title: title,
        buttons: [{
            text: CORE_TAG('Button_Accept'), onClick: function () {
                if (action)
                    action();

                $(".dx-popup-title").removeClass("title-message-warning");
            }
        }]
    });

    $(".dx-popup-title").addClass("title-message-warning");
    $(".dx-popup-title").removeClass("title-message-success");
    $(".dx-popup-title").removeClass("title-message-error");
    $(".dx-popup-title").removeClass("title-message-question");
    $(".dx-popup-title").removeClass("title-message-info");
}

/*
    Despliega un mensaje de ??xito.
    Par??metros:
        message: Mensaje que se desplegar?? en la pantalla.
        title: T??tulo del mensaje, si no est?? definido presenta un t??tulo predefinido.
        action: Acci??n a ejecutar despu??s de desplegar el mensaje.
*/
function showSuccessMessage(title, message, action, sound) {

    if (sound && sound == true) {
        var audio = document.getElementById('notificationMessage');
        audio.play();
    }

    DevExpress.ui.dialog.alert({
        message: decodeURI(message),
        title: title,
        buttons: [{
            text: CORE_TAG('Button_Accept'), onClick: function () {
                if (action)
                    action();

                $(".dx-popup-title").removeClass("title-message-success");
            }
        }]
    });

    $(".dx-popup-title").addClass("title-message-success");
    $(".dx-popup-title").removeClass("title-message-warning");
    $(".dx-popup-title").removeClass("title-message-error");
    $(".dx-popup-title").removeClass("title-message-question");
    $(".dx-popup-title").removeClass("title-message-info");
}

/*
    Despliega un mensaje de pregunta.
    Par??metros:
        message: Mensaje que se desplegar?? en la pantalla.
        title: T??tulo del mensaje, si no est?? definido presenta un t??tulo predefinido.
        action: Acci??n a ejecutar despu??s de desplegar el mensaje.
*/
function showQuestionMessage(title, message, actionYes, actionNo, sound) {

    if (sound && sound == true) {
        var audio = document.getElementById('notificationMessage');
        audio.play();
    }

    var customDialog = DevExpress.ui.dialog.custom({
        title: title,
        message: message == null ? '' : decodeURI(message),
        buttons: [
            { text: CORE_TAG('Yes'), onClick: function () { return CORE_TAG('Yes') } },
            { text: CORE_TAG('No'), onClick: function () { return CORE_TAG('No') } },
        ]
    });
    customDialog.show().done(function (dialogResult) {
        if (dialogResult == CORE_TAG('Yes')) {
            actionYes();
            $(".dx-popup-title").removeClass("title-message-question");
        }
        else {
            if (actionNo)
                actionNo();

            $(".dx-popup-title").removeClass("title-message-question");
            return;
        }
    });

    $(".dx-popup-title").addClass("title-message-question");
    $(".dx-popup-title").removeClass("title-message-success");
    $(".dx-popup-title").removeClass("title-message-error");
    $(".dx-popup-title").removeClass("title-message-warning");
    $(".dx-popup-title").removeClass("title-message-info");

    return customDialog;
}

/*
    Permite mostrar el mensaje en la validaci??n de campos
    Par??metros:
        title: 'T??tulo del mensaje a desplegar',
        ruleValidation: 'Regla que se ha validado en la pantalla (result.brokenRules[0])'
*/
function showMessageValidation(title, ruleValidation) {
    showWarningMessage(title, CORE_MESSAGE('ErrorData'), function () {
        //var control = ruleValidation.brokenRules[0].validator.element()[0].id;
        //if ($('#' + control).hasClass('dx-selectbox'))
        //    $('#' + control).dxSelectBox('instance').focus();
        //else if ($('#' + control).hasClass('dx-autocomplete'))
        //    $('#' + control).dxAutocomplete('instance').focus();
        //else if ($('#' + control).hasClass('dx-datebox'))
        //    $('#' + control).dxDateBox('instance').focus();
        //else if ($('#' + control).hasClass('dx-numberbox'))
        //    $('#' + control).dxNumberBox('instance').focus();
        //else if ($('#' + control).hasClass('dx-textarea'))
        //    $('#' + control).dxTextArea('instance').focus();
        //else if ($('#' + control).hasClass('dx-textbox'))
        //    $('#' + control).dxTextBox('instance').focus();
    });
}

function showException(message, stack, parameters, addFunction) {
    showErrorMessage(CORE_TAG('SystemError'), CORE_MESSAGE('SystemError'), function () {
        if (addFunction)
            addFunction();
    });
}

/*****************************************************************************************************************************************************************************************************************************************************************
--------------------------------------------------------------------------------------------F U N C I O N E S   D E   C O R E-------------------------------------------------------------------------------------------------------------------------------
*****************************************************************************************************************************************************************************************************************************************************************/

/*
    Obtiene el tama??o de un archivo
    Par??metros:
        controlName: Nombre del control.
        index: ??ndice
*/
function getSizeFile(controlName, index) {
    var control = $(controlName);
    var size = control.get(0).files[index].size;
    return size;
}

/*
    Obtiene la descripci??n de un cat??logo dado su c??digo.
    Par??metros:
        codeCatalog: C??digo de cat??logo.
        listCatalog: Lista de cat??logos donde se va a consultar.
*/
function getDescriptionCatalog(codeCatalog, listCatalog) {
    var descriptionCatalog = codeCatalog;

    if (!codeCatalog)
        return;

    for (var x = 0; x < listCatalog.length; x++) {
        if (listCatalog[x].CodigoDetalleCatalogo == codeCatalog) {
            descriptionCatalog = listCatalog[x].NombreCorto;
            x = listCatalog.length;
        }
    }

    return descriptionCatalog;
}

/*
    Convierte un c??digo de caracter en una cadena.
    Par??metros:
        charCodes: C??digo del caracter.
*/
function convertCharCodeToString(charCodes) {
    charCodes = charCodes.split(',');
    var cadena = "";

    for (var i = 0; i < charCodes.length; i++) {
        cadena = cadena + String.fromCharCode(charCodes[i]);
    }
    return cadena;
}

/*
    Cambia el valor de una propiedad de un control determinado.
    Par??metros:
        nameControl: Nombre del control que se desea cambiar a la propiedad.
        typeControl: Tipo de control.
        nameProperty: Nombre de la propiedad del control que se desea cambiar.
        valueProperty: Nuevo valor de la propiedad.
*/
function changePropertyControl(nameControl, typeControl, nameProperty, valueProperty) {
    switch (typeControl) {
        case this.typeControl.TextBox:
            $(nameControl).dxTextBox('option', nameProperty, valueProperty);
            break;
        case this.typeControl.NumberBox:
            $(nameControl).dxNumberBox('option', nameProperty, valueProperty);
            break;
        case this.typeControl.SelectBox:
            $(nameControl).dxSelectBox('option', nameProperty, valueProperty);
            break;
        case this.typeControl.DateBox:
            $(nameControl).dxDateBox('option', nameProperty, valueProperty);
            break;
        case this.typeControl.TextArea:
            $(nameControl).dxTextArea('option', nameProperty, valueProperty);
            break;
        case this.typeControl.Button:
            $(nameControl).dxButton('option', nameProperty, valueProperty);
            break;
        case this.typeControl.Check:
            $(nameControl).dxCheckBox('option', nameProperty, valueProperty);
            break;
        case this.typeControl.DataGrid:
            $(nameControl).dxDataGrid('option', nameProperty, valueProperty);
            break;
        case this.typeControl.TagBox:
            $(nameControl).dxTagBox('option', nameProperty, valueProperty);
            break;
        case this.typeControl.Switch:
            $(nameControl).dxSwitch('option', nameProperty, valueProperty);
            break;
        case this.typeControl.Popup:
            $(nameControl).dxPopup('option', nameProperty, valueProperty);
            break;
        case this.typeControl.ListBox:
            $(nameControl).dxList('option', nameProperty, valueProperty);
            break;
    }
}

/*
    Obtiene el detalle de un cat??logo establecido.
    Par??metros:
        codeCatalog: C??digo del cat??logo del que se desea el detalle.
        listCatalog: Lista de los cat??logos.
*/
function getCatalogDetail(codeCatalog, listCatalog) {
    if (listCatalog.length == 0) {
        return [];
    }
    for (var i = 0; i < listCatalog.length; i++) {
        if (listCatalog[i].CodigoCatalogo == codeCatalog) {
            return listCatalog[i].DetalleCatalogo;
        }
    }
}

/*
    Obtiene el valor de la etiqueta de un XML
    Par??metros:
        tag: Etiqueta del XML a obtener el valor.
        strXml: XML donde se va a obtener el valor.
*/
function getValueXml(tag, strXml) {
    var posini = strXml.search("<" + tag + ">");
    if (posini >= 0)
        posini = posini + (tag.length + 2);

    var posfin = strXml.search("</" + tag + ">");
    var result = strXml.slice(posini, posfin);

    return result;
}

/*
    Valida si existe alguna palabra o frase dentro de una cadena de caracteres.
    Par??metros:
        wordSearch: Frase o palabra que se desea buscar
*/
String.prototype.contains = function (wordSearch) {
    var valueString = this;
    var pos = valueString.search(wordSearch);
    if (pos > -1)
        return true;

    return false;
}

String.prototype.inputChar = function (charInput, eachPosChar) {
    var valueString = this;
    var newData = "";
    for (var ch = 0; ch < valueString.length; ch++) {
        if ((ch % eachPosChar) == 0)
            newData = newData + charInput + valueString[ch];
        else
            newData = newData + valueString[ch];
    }

    newData = newData.substring(1);

    return newData
}

/*
    Muestra el panel de Carga al ejecutar alguna acci??n.
    Par??metros:
        message: Mensaje a mostrar en el panel.
*/
function initProcess(message) {
    if ($('#loadPanel').dxLoadPanel('instance')) {
        if (!message)
            message = CORE_MESSAGE('LoadingData');
        $('#loadPanel').dxLoadPanel('option', 'message', message);
        $('#loadPanel').dxLoadPanel('instance').show();
    }
}

/*
    Oculta el panel de Carga.
*/
function stopProcess() {
    $('#loadPanel').dxLoadPanel('option', 'visible', false);
    var loadProcess = document.getElementById('loadProcess');
    if (loadProcess) {
        loadProcess.style.opacity = 0;
        loadProcess.style.zIndex = 0;
    }
}

/*
    Establece el estado en que se mostrar?? un control, ya sea oculto, desabilitado o de solo lectura.
    Par??metros: 
        optionsControl: opciones del control que se desea establecer el estado.
        typeStateField: estado a establecer al control.
*/
function setStateField(optionsControl, typeStateField) {
    try {
        switch (typeStateField) {
            case this.stateControl.hide:
                optionsControl.visible = false;
                break;
            case this.stateControl.disabled:
                optionsControl.disabled = true;
                break;
            case this.stateControl.readOnly:
                optionsControl.readOnly = true;
                break;
        }
    } catch (e) {
        showErrorMessage(CORE_TAG('ErrorMessage'), e);
    }

}

function restrictionTextControl(nameControl, typeCharWritten, allowSpace, specialsChar) {
    var character = typeCharWritten;
    $('#' + nameControl).unbind("keypress");
    $('#' + nameControl).keypress(function (evt) {
        if (allowSpace == false) {
            key = evt.keyCode || evt.which;
            if (key == 32)
                return false;
        }
        switch (character) {
            case typeCharAllowed.OnlyText:
                key = evt.keyCode || evt.which;
                tecla = String.fromCharCode(key).toLowerCase();
                var ban = false;
                if (key == 8)
                    ban = true;
                var patron = new RegExp("^[" + CORE_PATTERN_LETTERS + "\\s]$")
                if (patron.test(tecla) || ban == true) {
                    return true;
                } else {
                    return false;
                }
                break;
            case typeCharAllowed.OnlyNumber:
                var charCode = (evt.which) ? evt.which : event.keyCode;

                var cadena = String.fromCharCode(charCode);
                var ban = false;
                var banTeclaEspecial = false;
                if (charCode == 8 || charCode == 13) {
                    banTeclaEspecial = true;
                }
                if ((charCode > 47 && charCode < 58) || banTeclaEspecial)
                    ban = true;
                return ban;
                break;
            case typeCharAllowed.OnlyTextAndNumber:
                var key = evt.keyCode || evt.which;
                var banSoloLetras = true;
                tecla = String.fromCharCode(key).toLowerCase();
                var patron = new RegExp("^[" + CORE_PATTERN_LETTERS + "\\s]$")
                if (!patron.test(tecla))
                    banSoloLetras = false;
                var banSoloNumeros = false;
                var charCode = (evt.which) ? evt.which : event.keyCode
                if (charCode > 47 && charCode < 58)
                    banSoloNumeros = true;
                if (banSoloLetras || banSoloNumeros)
                    return true;
                else
                    return false;
                break;
            case typeCharAllowed.OnlyTextAndChar:
                var banSoloLetrasYCarateresEspeciales = true;
                var key = evt.keyCode || evt.which;

                var tecla = String.fromCharCode(key).toLowerCase();
                var caracterEspecial = (specialsChar == null ? '' : specialsChar) + CORE_PATTERN_SPECIALS_ALLOWED;
                var ban = true;
                if (caracterEspecial.indexOf(tecla) == -1)
                    ban = false;
                var patron = new RegExp("^[" + CORE_PATTERN_LETTERS + caracterEspecial + "\\s]$")
                if (patron.test(tecla)) {
                    return true;
                } else {
                    return false;
                }
                break;
            case typeCharAllowed.OnlyNumberAndChar:
                key = evt.keyCode || evt.which;
                var tecla = String.fromCharCode(key).toLowerCase();
                var ban = true;
                var caracterEspecial = (specialsChar == null ? '' : specialsChar) + CORE_PATTERN_SPECIALS_ALLOWED;
                var patron = new RegExp("^[" + caracterEspecial + "]$");
                if (!patron.test(tecla))
                    ban = false;
                var banSoloNumeros = false;
                var charCode = (evt.which) ? evt.which : event.keyCode
                if (charCode > 47 && charCode < 58)
                    banSoloNumeros = true;
                if (ban || banSoloNumeros)
                    return true;
                else
                    return false;
                break;
            case typeCharAllowed.OnlyTextNumberAndChar:
                var key = evt.keyCode || evt.which;
                var tecla = String.fromCharCode(key).toLowerCase();
                var caracterEspecial = (specialsChar == null ? '' : specialsChar) + CORE_PATTERN_SPECIALS_ALLOWED;
                var banSoloLetrasYCarateresEspeciales = true;
                var patron = new RegExp("^[" + CORE_PATTERN_LETTERS + caracterEspecial + "\\s]$")

                if (!patron.test(tecla))
                    banSoloLetrasYCarateresEspeciales = false;
                var banSoloNumeros = false;
                var charCode = (evt.which) ? evt.which : event.keyCode
                if (charCode > 47 && charCode < 58)
                    banSoloNumeros = true;
                if (banSoloLetrasYCarateresEspeciales || banSoloNumeros)
                    return true;
                else
                    return false;
                break;
            default:
                break;
        }
    });
}

/*
    Restringe el uso de espacios en el control establecido.
    Par??metros:
        nameControl: Nombre del control donde se establece la restricci??n.
*/
function withoutSpace(nameControl) {
    $('#' + nameControl).on('keypress', function (evt) {
        key = evt.keyCode || evt.which;
        if (key == 32)
            return false;
    });
}
/*
    Permite s??lo letras en el control determinado.
    Par??metros:
        nameControl: Nombre del control donde se establece la restricci??n
*/
function onlyTextAllowed(nameControl) {
    $('#' + nameControl).keyPress(function (evt) {
        key = evt.keyCode || evt.which;
        tecla = String.fromCharCode(key).toLowerCase();
        var ban = false;
        if (key == 8)
            ban = true;
        var patron = new RegExp("^[" + CORE_PATTERN_LETTERS + "\\s]$")
        if (patron.test(tecla) || ban == true) {
            return true;
        } else {
            return false;
        }

    });
}

/*
    Permite s??lo n??meros en el control determinado.
    Par??metros:
        nameControl: Nombre del control donde se establece la restricci??n
*/
function onlyNumberAllowed(nameControl, evt) {
    $('#' + nameControl).keypress(function (evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode;

        var cadena = String.fromCharCode(charCode);
        var ban = false;
        var banTeclaEspecial = false;
        if (charCode == 8 || charCode == 13) {
            banTeclaEspecial = true;
        }
        if ((charCode > 47 && charCode < 58) || banTeclaEspecial)
            ban = true;
        return ban;
    });

}

/*
    Permite letras y n??meros en el control determinado.
    Par??metros:
        nameControl: Nombre del control donde se establece la restricci??n
*/
function onlyNumberAndTextAllowed(nameControl) {
    $('#' + nameControl).on('keypress', function (evt) {
        var key = evt.keyCode || evt.which;
        var banSoloLetras = true;
        tecla = String.fromCharCode(key).toLowerCase();
        var patron = new RegExp("^[" + CORE_PATTERN_LETTERS + "\\s]$")
        if (!patron.test(tecla))
            banSoloLetras = false;
        var banSoloNumeros = false;
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 47 && charCode < 58)
            banSoloNumeros = true;
        if (banSoloLetras || banSoloNumeros)
            return true;
        else
            return false;
    });
    $('#' + nameControl).on('keydown', function (evt) {
        var charCode = 0;
        if (window.event) {
            return true;
        } else {
            var key = evt.which;
            var banSoloLetras = true;
            tecla = String.fromCharCode(key).toLowerCase();
            var patron = new RegExp("^[" + CORE_PATTERN_LETTERS + "\\s]$")
            if (!patron.test(tecla))
                banSoloLetras = false;
            var banSoloNumeros = false;
            charCode = evt.which;

            var banTeclaEspecial = false;
            if (charCode == 8 || charCode == 13) {
                banTeclaEspecial = true;
            }

            if (charCode > 47 && charCode < 58)
                banSoloNumeros = true;
            if (banSoloLetras || banSoloNumeros || banTeclaEspecial)
                return true;
            else
                return false;
        }

    });
}

/*
    Permite letras y car??cteres especiales en el control determinado.
    Par??metros:
        nameControl: Nombre del control donde se establece la restricci??n.
        specialsChar: Caracteres especiales que se permitir??n en el control.
*/
function onlyTextAndCharAllowed(nameControl, specialsChar) {
    $('#' + nameControl).on('keypress', function (evt) {
        var banSoloLetrasYCarateresEspeciales = true;
        var key = evt.keyCode || evt.which;

        var tecla = String.fromCharCode(key).toLowerCase();
        var caracterEspecial = (specialsChar == null ? '' : specialsChar) + CORE_PATTERN_SPECIALS_ALLOWED;
        var ban = true;
        if (caracterEspecial.indexOf(tecla) == -1)
            ban = false;
        var patron = new RegExp("^[" + CORE_PATTERN_LETTERS + caracterEspecial + "\\s]$")
        if (patron.test(tecla)) {
            return true;
        } else {
            return false;
        }

    });

    $('#' + nameControl).on('keydown', function (evt) {
        var charCode = 0;
        if (window.event) {
            return true;
        } else {
            var banSoloLetrasYCarateresEspeciales = true;
            charCode = evt.which;
            var banTeclaEspecial = false;
            if (charCode == 8 || charCode == 13) {
                banTeclaEspecial = true;
            }
            var tecla = String.fromCharCode(charCode).toLowerCase();
            var caracterEspecial = (specialsChar == null ? '' : specialsChar) + CORE_PATTERN_SPECIALS_ALLOWED;
            var ban = true;
            if (caracterEspecial.indexOf(tecla) == -1)
                ban = false;
            var patron = new RegExp("^[" + CORE_PATTERN_LETTERS + caracterEspecial + "\\s]$")
            if (patron.test(tecla) || banTeclaEspecial) {
                return true;
            } else {
                return false;
            }
        }
    });
}

/*
    Permite n??meros y car??cteres especiales en el control determinado.
    Par??metros:
        nameControl: Nombre del control donde se establece la restricci??n.
        specialsChar: Caracteres especiales que se permitir??n en el control.
*/
function onlyNumberAndCharAllowed(nameControl, specialsChar) {
    $('#' + nameControl).on('keypress', function (evt) {
        key = evt.keyCode || evt.which;
        var tecla = String.fromCharCode(key).toLowerCase();
        var ban = true;
        var caracterEspecial = (specialsChar == null ? '' : specialsChar) + CORE_PATTERN_SPECIALS_ALLOWED;
        var patron = new RegExp("^[" + caracterEspecial + "]$");
        if (!patron.test(tecla))
            ban = false;
        var banSoloNumeros = false;
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 47 && charCode < 58)
            banSoloNumeros = true;
        if (ban || banSoloNumeros)
            return true;
        else
            return false;
    });


    $('#' + nameControl).on('keydown', function (evt) {
        var charCode = 0;
        if (window.event) {
            return true;
        } else {
            charCode = evt.which;
            var banTeclaEspecial = false;
            if (charCode == 8) {
                banTeclaEspecial = true;
            }
            var tecla = String.fromCharCode(charCode).toLowerCase();
            var ban = true;
            var caracterEspecial = (specialsChar == null ? '' : specialsChar) + CORE_PATTERN_SPECIALS_ALLOWED;
            var patron = new RegExp("^[" + caracterEspecial + "]$");
            if (!patron.test(tecla))
                ban = false;
            var banSoloNumeros = false;

            if (charCode > 47 && charCode < 58)
                banSoloNumeros = true;
            if (ban || banSoloNumeros || banTeclaEspecial)
                return true;
            else
                return false;
        }
    });
}

/*
    Permite letras, n??meros y caracteres especiales en el control determinado.
    Par??metros:
        nameControl: Nombre del control donde se establece la restricci??n.
        specialsChar: Caracteres especiales que se permitir??n en el control.
*/
function onlyTextNumberAndCharAllowed(nameControl, specialsChar) {
    $('#' + nameControl).on('keypress', function (evt) {
        var key = evt.keyCode || evt.which;
        var tecla = String.fromCharCode(key).toLowerCase();
        var caracterEspecial = (specialsChar == null ? '' : specialsChar) + CORE_PATTERN_SPECIALS_ALLOWED;
        var banSoloLetrasYCarateresEspeciales = true;
        var patron = new RegExp("^[" + CORE_PATTERN_LETTERS + caracterEspecial + "\\s]$")

        if (!patron.test(tecla))
            banSoloLetrasYCarateresEspeciales = false;
        var banSoloNumeros = false;
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 47 && charCode < 58)
            banSoloNumeros = true;
        if (banSoloLetrasYCarateresEspeciales || banSoloNumeros)
            return true;
        else
            return false;
    });

    $('#' + nameControl).on('keydown', function (evt) {
        var charCode = 0;
        if (window.event) {
            return true;
        } else {
            charCode = evt.which;
            var banTeclaEspecial = false;
            if (charCode == 8) {
                banTeclaEspecial = true;
            }
            var tecla = String.fromCharCode(key).toLowerCase();
            var caracterEspecial = (specialsChar == null ? '' : specialsChar) + CORE_PATTERN_SPECIALS_ALLOWED;
            var banSoloLetrasYCarateresEspeciales = true;
            var patron = new RegExp("^[" + CORE_PATTERN_LETTERS + caracterEspecial + "\\s]$")

            if (!patron.test(tecla))
                banSoloLetrasYCarateresEspeciales = false;
            var banSoloNumeros = false;
            var charCode = (evt.which) ? evt.which : event.keyCode
            if (charCode > 47 && charCode < 58)
                banSoloNumeros = true;
            if (banSoloLetrasYCarateresEspeciales || banSoloNumeros || banTeclaEspecial)
                return true;
            else
                return false;
        }
    });
}

/*
    Prepara la barra de herramientas para ser configurada en una pantalla.
*/
function initToolBar() {
    var toolBar = $('.toolbar');
    toolBar.attr('style', 'display:block');
    toolBar.empty();
}

/*
    Cambia el estado de un ??tem de la barra de herramientas.
    Par??metros:
        toolBarButton: ??tem de la barra de herramientas a cambiar el estado.
        stateToolBar: Estado al que queremos cambiar el ??tem. (Habilitado, Visible, Deshabilitado, Oculto).
*/
function changeStateToolBar(toolBarButton, stateToolBar, textButton) {
    var idItemToolBar = textButton ? toolBarButton + textButton.trim() : toolBarButton;
    var itemToolBar = document.getElementById(idItemToolBar);
    switch (stateToolBar) {
        case this.stateToolBar.enabled:
            itemToolBar.classList.add('toolbar-item');
            itemToolBar.classList.remove('toolbar-item-disabled');
            break;
        case this.stateToolBar.visible:
            itemToolBar.classList.add('toolbar-item');
            itemToolBar.classList.remove('toolbar-item-hidden');
            break;
        case this.stateToolBar.disabled:
            itemToolBar.classList.remove('toolbar-item');
            itemToolBar.classList.add('toolbar-item-disabled');
            break;
        case this.stateToolBar.hidden:
            itemToolBar.classList.remove('toolbar-item');
            itemToolBar.classList.add('toolbar-item-hidden');
            break;
        default:
            break;
    }
}

/*
    Configura un bot??n en la barra de herramientas de la aplicaci??n.
    Par??metros:
        toolBarButton: Tipo de Bot??n que se va a crear en la barra de herramientas.
        action: Acci??n que se detonar?? al hacer click en el bot??n.
        textButton: Texto Personalizado para un bot??n [Opcional].
        iconButton: ??cono Personalizado para un bot??n [Opcional].
*/
function setupButtonToolBar(toolBarButton, action, stateToolBar, textButton, iconButton) {
    var toolBar = $('.toolbar');
    var itemToolBar = document.createElement('a');
    var iconToolBar = document.createElement('i');
    var textToolBar = document.createElement('span');
    itemToolBar.id = toolBarButton;
    itemToolBar.className = 'toolbar-item';
    iconToolBar.classList.add('fa');
    switch (toolBarButton) {
        case this.toolBarButtons.New:
            iconToolBar.classList.add(iconosCore.file_o);
            textToolBar.innerText = CORE_TAG('Button_New');
            break;
        case this.toolBarButtons.Edit:
            iconToolBar.classList.add(iconosCore.edit);
            textToolBar.innerText = CORE_TAG('Button_Edit');
            break;
        case this.toolBarButtons.Save:
            iconToolBar.classList.add(iconosCore.floppy);
            textToolBar.innerText = CORE_TAG('Button_Save');
            break;
        case this.toolBarButtons.Print:
            iconToolBar.classList.add(iconosCore.print);
            textToolBar.innerText = CORE_TAG('Button_Print');
            break;
        case this.toolBarButtons.Search:
            iconToolBar.classList.add(iconosCore.search);
            textToolBar.innerText = CORE_TAG('Button_Search');
            break;
        case this.toolBarButtons.Send:
            iconToolBar.classList.add(iconosCore.send_o);
            textToolBar.innerText = CORE_TAG('Button_Send');
            break;
        case this.toolBarButtons.Cancel:
            iconToolBar.classList.add(iconosCore.times);
            textToolBar.innerText = CORE_TAG('Button_Cancel');
            break;
        case this.toolBarButtons.Export:
            iconToolBar.classList.add(iconosCore.file_excel_o);
            textToolBar.innerText = CORE_TAG('Button_Export');
            break;
        case this.toolBarButtons.Accept:
            iconToolBar.classList.add(iconosCore.check);
            textToolBar.innerText = CORE_TAG('Button_Accept');
            break;
        case this.toolBarButtons.Other:
            itemToolBar.id = itemToolBar.id + textButton.trim();
            iconToolBar.classList.add(iconButton);
            textToolBar.innerText = textButton;
            break;
        default:
            break;
    }

    itemToolBar.appendChild(iconToolBar);
    itemToolBar.appendChild(textToolBar);

    toolBar.append(itemToolBar);

    itemToolBar.onclick = function (evt) {
        if (action && this.className != 'toolbar-item-disabled') {
            action();
        }
    };

    if (stateToolBar) {
        changeStateToolBar(toolBarButton, stateToolBar, textButton);
    }

}

function searchArray(data, filterExpr, valueExpr, searchOperation) {
    if (!searchOperation)
        searchOperation = searchOperations.Equal;

    var dataArray = new DevExpress.data.DataSource({
        paginate: false,
        store: data,
        requireTotalCount: true
    });

    dataArray.searchExpr(filterExpr);
    dataArray.searchOperation(searchOperation);
    dataArray.searchValue(valueExpr);

    dataArray.reload();

    return dataArray._items;
}

/*
    Permite agregar o disminuir valores de segundos, minutos, horas, d??as, meses o a??os a una fecha determinada
    Par??metros:
        datePart: Parte de la fecha que se quiere agregar o disminuir el valor.
        number: N??mero a agregar a la fecha
*/
Date.prototype.addDate = function (datePart, number) {
    var newDate = new Date(this.toDateString());
    switch (datePart) {
        case dateParts.Seconds:
            newDate = newDate.setSeconds(newDate.getSeconds() + number);
            break;
        case dateParts.Minutes:
            newDate = newDate.setMinutes(newDate.getMinutes() + number);
            break;
        case dateParts.Hours:
            newDate = newDate.setHours(newDate.getHours() + number);
            break;
        case dateParts.Days:
            newDate = newDate.setDate(newDate.getDate() + number);
            break;
        case dateParts.Months:
            newDate = newDate.setMonth(newDate.getMonth() + number);
            break;
        case dateParts.Years:
            newDate = newDate.setYear(newDate.getYear() + number);
            break;
        default:
            break;
    }

    newDate = new Date(newDate);

    return newDate;
}

String.prototype.withoutAccent = function () {
    var valueString = this;
    valueString = valueString.replace('??', 'a');
    valueString = valueString.replace('??', 'e');
    valueString = valueString.replace('??', 'i');
    valueString = valueString.replace('??', 'o');
    valueString = valueString.replace('??', 'u');
    valueString = valueString.replace('??', 'A');
    valueString = valueString.replace('??', 'E');
    valueString = valueString.replace('??', 'I');
    valueString = valueString.replace('??', 'O');
    valueString = valueString.replace('??', 'U');
    valueString = valueString.replace('??', 'a');
    valueString = valueString.replace('??', 'e');
    valueString = valueString.replace('??', 'i');
    valueString = valueString.replace('??', 'o');
    valueString = valueString.replace('??', 'u');
    valueString = valueString.replace('??', 'A');
    valueString = valueString.replace('??', 'E');
    valueString = valueString.replace('??', 'I');
    valueString = valueString.replace('??', 'O');
    valueString = valueString.replace('??', 'U');

    return valueString;
}

String.prototype.withoutSpecialLetter = function () {
    var valueString = this;
    valueString = valueString.replace('??', 'n');
    valueString = valueString.replace('??', 'N');

    return valueString;
}
/*
    Dibuja una barra de progreso en el html
*/
HTMLElement.prototype.progressBar = function (startValue, progress, endValue, startTag, endTag) {
    this.innerHTML = "";
    this.style.paddingBottom = '5px';
    var div = document.createElement('div');
    div.style.width = '95%';
    div.style.margin = '10px';
    div.style.marginBottom = '10px';
    //Obtener progreso
    var widthProgreso = (progress * 100) / endValue;

    if (widthProgreso >= 100)
        widthProgreso = 99.5;

    var divTag = document.createElement('div');
    divTag.style.display = 'block';
    divTag.style.textAlign = 'left';

    var spanTag = document.createElement('span');
    spanTag.innerHTML = startTag + "<span style='font-size:15px'>$" + progress.toFixed(2) + "</span>";
    spanTag.style.fontSize = '12px';
    spanTag.style.color = mainColor;
    spanTag.style.fontWeight = 'bold';

    var spanEnd = document.createElement('span');
    spanEnd.innerHTML = endTag + "<span style='font-size:15px'>$" + endValue.toFixed(2) + "</span>";
    spanEnd.style.fontSize = '12px';
    spanEnd.style.fontWeight = 'bold';
    spanEnd.style.color = '#474453';
    spanEnd.style.cssFloat = 'right';

    divTag.appendChild(spanTag);
    divTag.appendChild(spanEnd);

    var divMain = document.createElement('div');
    divMain.style.height = '18px';
    divMain.style.border = '1px solid #888888';
    divMain.style.borderRadius = '10px';
    divMain.style.backgroundColor = "#474453";
    divMain.style.boxShadow = '2px 4px 3px #888888';
    var divProgress = document.createElement('div');
    var spanProgress = document.createElement('span');
    spanProgress.style.fontSize = '13px';
    spanProgress.style.top = '-5px';
    spanProgress.style.fontFamily = 'Kalinga';
    spanProgress.style.fontWeight = 'bold';
    spanProgress.style.position = 'relative';
    spanProgress.style.color = 'white';
    divProgress.style.height = '14px';
    divProgress.style.textAlign = 'center';
    divProgress.style.marginTop = '1px';
    divProgress.style.marginBottom = '2px';
    divProgress.style.marginLeft = '1px';
    divProgress.style.verticalAlign = 'middle';
    divProgress.style.backgroundColor = progress <= endValue ? mainColor : negativeColor;
    divProgress.style.borderRadius = '10px';
    divProgress.style.transition = 'width 1s ease-in';
    divProgress.style.width = '0%';
    setTimeout(function () {
        divProgress.style.width = widthProgreso + '%';
        setTimeout(function () {
            spanProgress.innerText = widthProgreso < 99.5 ? widthProgreso.toFixed(2) + '%' : 100.00 + '%';
        }, 500)
    }, 1000)

    divProgress.appendChild(spanProgress);

    divMain.appendChild(divProgress);
    div.appendChild(divTag);
    div.appendChild(divMain);

    this.appendChild(div);
}

HTMLElement.prototype.InfoCards = function (dataSource, rows, allowCollapse, colorBody, showButton, iconButton, actionButton) {
    try {
        this.innerHTML = '';
        if (!allowCollapse)
            allowCollapse = false;
        for (var i = 0; i < dataSource.length; i++) {
            var divCard = document.createElement('div');
            divCard.classList.add('cards');
            divCard.classList.add('cards-expand');
            divCard.id = 'cards' + i;
            var divData = document.createElement('div');
            divData.className = 'cards-expand';
            divData.id = 'data' + i;
            if (allowCollapse == true) {
                var expandir = document.createElement('i');
                expandir.classList.add('fa');
                expandir.classList.add('fa-chevron-up');
                expandir.id = 'exp_' + i;
            }
            var divInfo = document.createElement('div');
            divInfo.id = 'info' + i;
            for (var j = 0; j < rows.length; j++) {
                var divGroup = document.createElement('div');
                var labelData = document.createElement('label')
                var spanData = document.createElement('span');

                if (divGroup) {
                    divGroup.style.display = 'block';
                    divGroup.style.textAlign = 'justify';
                    divGroup.id = 'group' + j;
                }
                if (dataSource[i][rows[j].dataField]) {
                    spanData.innerText = dataSource[i][rows[j].dataField];
                    if (rows[j].isTitle && rows[j].isTitle == true) {
                        spanData.className = 'title-cards';
                        spanData.id = 'title_' + i;
                        if (allowCollapse == true) {
                            spanData.onclick = function (e) {
                                var id = e.srcElement.id.split('_')[1];
                                if ($('#data' + id).hasClass('cards-expand') == true) {
                                    $('#data' + id).removeClass('cards-expand');
                                    $('#data' + id).addClass('cards-collapse');
                                    $('#exp_' + id).removeClass('fa-chevron-up');
                                    $('#exp_' + id).addClass('fa-chevron-down');
                                    setTimeout(function () {
                                        $('#info' + id).hide();
                                        $('#button' + id).hide();
                                    }, 300);

                                } else {
                                    $('#info' + id).show();
                                    $('#button' + id).show();
                                    $('#data' + id).addClass('cards-expand');
                                    $('#data' + id).removeClass('cards-collapse');
                                    $('#exp_' + id).addClass('fa-chevron-up');
                                    $('#exp_' + id).removeClass('fa-chevron-down');
                                }
                            }
                            spanData.appendChild(expandir);
                        }
                        divData.appendChild(spanData);
                    }
                    else if (rows[j].isImage && rows[j].isImage == true) {
                        if (dataSource[i][rows[j].dataField]) {
                            var img = document.createElement('img');
                            img.setAttribute('src', './images/' + dataSource[i][rows[j].dataField]);
                            img.className = 'cards-image'
                            divGroup.appendChild(img);
                        }
                    }
                    else {
                        labelData.innerText = rows[j].caption + ': ';
                        labelData.className = 'tag-data-cards';
                        spanData.className = 'info-data-cards';
                        divGroup.appendChild(labelData);
                        divGroup.appendChild(spanData);
                    }
                }
                divInfo.appendChild(divGroup);
            }
            divData.appendChild(divInfo);
            divCard.appendChild(divData);
            if (showButton == true) {
                var divButton = document.createElement('div');
                var aButton = document.createElement('a');
                var iButton = document.createElement('i');
                iButton.classList.add('fa');
                iButton.classList.add(iconButton);
                aButton.appendChild(iButton);
                aButton.id = 'button_' + i;
                aButton.onclick = function (e) {
                    var id = e.currentTarget.id.split('_')[1];
                    if (actionButton) {
                        var agency = dataSource[id];
                        actionButton(agency);
                    }
                }
                divButton.className = 'cards-button';
                divButton.id = 'button' + i;
                divButton.appendChild(aButton);
                divCard.appendChild(divButton);
            }
            this.appendChild(divCard);
        }
    } catch (e) {
        showErrorMessage('', 'Error al crear los info cards, por favor comun??quese con el Administrador');
    }

}

HTMLElement.prototype.Draggable = function (text, icon, action) {

    this.innerHTML = '';
    var idContent = '#' + this.id;
    this.classList.add('content-drag');
    this.classList.add('inactive');
    var draggable = document.createElement('div');
    draggable.classList.add('draggable');
    draggable.id = 'draggableControl';
    var textDrag = document.createElement('p');
    textDrag.innerText = text;
    textDrag.classList.add('innerText');
    draggable.appendChild(textDrag);

    if (icon) {
        var iconDrag = document.createElement('img');
        iconDrag.src = 'images/' + icon + '.png';
        draggable.appendChild(iconDrag);
    }

    var droppable = document.createElement('div');
    droppable.classList.add('droppable');
    droppable.id = 'droppableControl';

    $(draggable).draggable({
        containment: idContent,
        scroll: false,
        axis: "x",
    });

    $(draggable).mouseup(function (event) {
        var left = parseInt(event.currentTarget.style.left.replace('px', ''));
        if (left < 150) {
            this.style.left = '0px';
        }
    })

    $(droppable).droppable({
        drop: function (event, ui) {
            if (action)
                action();
        },
    });

    this.appendChild(draggable);
    this.appendChild(droppable);
}

HTMLElement.prototype.TileView = function (dataSource) {
    this.innerHTML = '';
    for (var i = 0; i < dataSource.length; i++) {
        if (i % 2 == 0) {
            var divFilaTile = document.createElement('div');
            divFilaTile.style.display = 'block';
            divFilaTile.style.marginTop = '0px';
        }
        var divTile = document.createElement('div');
        divTile.style.width = '46%';
        divTile.style.height = '100%';
        divTile.style.backgroundColor = dataSource[i]["background"];
        divTile.style.cursor = 'pointer';
        divTile.style.display = 'inline-block';
        divTile.style.margin = '5px';
        divTile.id = 'tile_' + i;
        var divData = document.createElement('div');
        divData.style.display = 'block';
        divData.style.marginTop = '5px';
        divData.style.marginBottom = '5px';
        var imgTile = document.createElement('img');
        imgTile.style.height = '74px';
        imgTile.style.width = '74px';
        imgTile.style.marginTop = '6px';
        imgTile.src = 'images/' + dataSource[i]["image"];
        var spanTile = document.createElement('span');
        spanTile.style.color = 'white';
        spanTile.style.display = 'block';
        spanTile.style.fontSize = '14px';
        spanTile.style.position = 'relative';
        spanTile.style.textTransform = 'none';
        spanTile.style.fontFamily = 'Tahoma';
        spanTile.innerText = dataSource[i]["texto"];
        divData.appendChild(imgTile);
        divData.appendChild(spanTile);
        if (dataSource[i]["badget"] != undefined) {
            var divBadge = document.createElement('div');
            divBadge.style.height = '25px';
            divBadge.style.width = '25px';
            divBadge.style.borderRadius = '100%';
            divBadge.style.backgroundColor = 'deeppink';
            divBadge.style.cssFloat = 'right';
            divBadge.style.marginTop = '-100px';
            divBadge.style.marginRight = '8px';
            divBadge.style.opacity = '0.4';
            if (i > 0) {
                divBadge.style.position = 'relative';
                divBadge.style.top = '100px';
            }
            var spanBadge = document.createElement('span');
            spanBadge.style.fontSize = '18px';
            spanBadge.style.color = 'white';
            spanBadge.style.fontWeight = 'bold';
            spanBadge.innerText = dataSource[i]["badget"];
            divBadge.appendChild(spanBadge);
            divData.appendChild(divBadge);
        }
        divTile.appendChild(divData);
        divTile.onclick = function (e) {
            var id = e.currentTarget.id.split('_')[1];
            e.currentTarget.style.border = "3px solid #017aff";
            for (var j = 0; j < dataSource.length; j++) {
                if (j != id) {
                    var tile = document.getElementById('tile_' + j);
                    if (tile)
                        tile.style.border = 'none';
                }
            }
            if (dataSource[id]["accion"])
                dataSource[id]["accion"](e);
        }
        divTile.onmousedown = function (e) {
            e.currentTarget.style.boxShadow = '2px 6px 3px #26252C';
        }
        divTile.onmouseup = function (e) {
            e.currentTarget.style.boxShadow = 'none';
        }
        divFilaTile.appendChild(divTile);
        this.appendChild(divFilaTile);
    }
}




function orderBy(arrayBase, field, typeOrder) {
    var desc = false;
    if (typeOrder == typeOrders.Descendent)
        desc = true;
    var newArray = new DevExpress.data.DataSource({
        requireTotalCount: true,
        sort: { getter: field, desc: desc },
        store: { type: 'array', data: arrayBase },
        paginate: false
    })

    return newArray;
}

String.prototype.getCode = function (numberChar) {
    var code = '';
    var listWords = this.split(" ");
    if (listWords.length > 0 && numberChar > 0) {
        listWords.forEach(function (element, index, myArray) {
            if (numberChar <= element.length)
                code = code + element.substring(0, numberChar);
        });
    }

    return code
}

function getDeviceInfo() {
    if (typeof device != 'undefined') {
        DeviceInfo = {
            DeviceManufacturer: device.manufacturer,
            DevicePhoneGap: device.phonegap,
            DevicePlatform: device.platform,
            DeviceUUID: device.uuid,
            DeviceVersion: device.version,
            DeviceRegistrado: "",
            DeviceModel: device.model,
            DeviceToken: TokenAPN_GCM,
            DeviceIMEI: '',
            LastTimeAccesed: new Date(),
            LastTimeAccesedPosition: "[" + currentPosition.Latitud + ", " + currentPosition.Longitud + "]"
        }
    } else {
        Parameters.AppVersion = 'Apiv1.0'
        DeviceInfo = {
            DeviceName: 'NombreSimulador',
            DevicePhoneGap: 'PhoneGapSimulador',
            DevicePlatform: 'PlataformaSimulador',
            DeviceUUID: 'IMEITEST_MIGUEL',// 'IdDispositivoSimulador',
            DeviceVersion: 'VersionSimulador',
            DeviceRegistrado: "",
            DeviceManufacturer: 'ManufacturerSimulador',
            DeviceModel: 'ModelSimulador',
            DeviceToken: 'TokenSimulador',
            DeviceIMEI: 'IMEISimulador',
            LastTimeAccesed: new Date(),
            LastTimeAccesedPosition: "[" + currentPosition.Latitud + ", " + currentPosition.Longitud + "]"
        }
    }
}

var actionsPicture = [
    { id: 1, text: 'Tomar foto', icon: iconosCore.camera },
    { id: 2, text: 'Seleccionar fotograf??a del ??lbum', icon: iconosCore.folder_open },
]

function getStyleListMovements(itemData) {
    var descripcion = itemData.Descripcion;
    var colorText = mainColor;

    if (itemData.Descripcion && itemData.Descripcion.length > 20)
        descripcion = itemData.Descripcion.substring(0, 20) + '...';
    var content = "<div class='row-list'>";
    if (itemData.Descripcion) {
        content = content + "<span class='column-1'>" + itemData.Fecha + "</span>";
        content = content + "<div class='column-2'><p>" + descripcion + "</p></div>";
        content = content + "<div class='column-3' style='color:" + colorText + ";'>";
        content = content + "<span font-size:'11px'>(" + itemData.Moneda + ") </span><span style='font-size:16px;font-weight:bold'>" + itemData.Signo + itemData.ValorParcial + "</span>";
        content = content + "</div>"
        if (itemData.ValorTotal)
            content = content + "<div class='column-3-bottom' style='color:" + colorText + ";text-transform:none !important'><span>" + itemData.ValorTotal + "</span></div>";
    } else {
        content = content + "<span style='word-break:break-word'>NO EXISTEN MOVIMIENTOS</span>"
    }
    content = content + "</div>"

    return content;
}

HTMLElement.prototype.InfoCards = function (dataSource, rows, allowCollapse, colorBody, showButton, iconButton, actionButton) {
    try {
        this.innerHTML = '';
        if (!allowCollapse)
            allowCollapse = false;
        for (var i = 0; i < dataSource.length; i++) {
            var divCard = document.createElement('div');
            divCard.classList.add('cards');
            divCard.classList.add('cards-expand');
            divCard.id = 'cards' + i;
            var divData = document.createElement('div');
            divData.className = 'cards-expand';
            divData.id = 'data' + i;
            if (allowCollapse == true) {
                var expandir = document.createElement('i');
                expandir.classList.add('fa');
                expandir.classList.add('fa-chevron-up');
                expandir.id = 'exp_' + i;
            }
            var divInfo = document.createElement('div');
            divInfo.id = 'info' + i;
            for (var j = 0; j < rows.length; j++) {
                var divGroup = document.createElement('div');
                var labelData = document.createElement('label')
                var spanData = document.createElement('span');

                if (divGroup) {
                    divGroup.style.display = 'block';
                    divGroup.style.textAlign = 'justify';
                    divGroup.id = 'group' + j;
                }
                if (dataSource[i][rows[j].dataField]) {
                    spanData.innerText = dataSource[i][rows[j].dataField];
                    if (rows[j].isTitle && rows[j].isTitle == true) {
                        spanData.className = 'title-cards';
                        spanData.id = 'title_' + i;
                        if (allowCollapse == true) {
                            spanData.onclick = function (e) {
                                var id = e.srcElement.id.split('_')[1];
                                if ($('#data' + id).hasClass('cards-expand') == true) {
                                    $('#data' + id).removeClass('cards-expand');
                                    $('#data' + id).addClass('cards-collapse');
                                    $('#exp_' + id).removeClass('fa-chevron-up');
                                    $('#exp_' + id).addClass('fa-chevron-down');
                                    setTimeout(function () {
                                        $('#info' + id).hide();
                                        $('#button' + id).hide();
                                    }, 300);

                                } else {
                                    $('#info' + id).show();
                                    $('#button' + id).show();
                                    $('#data' + id).addClass('cards-expand');
                                    $('#data' + id).removeClass('cards-collapse');
                                    $('#exp_' + id).addClass('fa-chevron-up');
                                    $('#exp_' + id).removeClass('fa-chevron-down');
                                }
                            }
                            spanData.appendChild(expandir);
                        }
                        divData.appendChild(spanData);
                    }
                    else if (rows[j].isImage && rows[j].isImage == true) {
                        if (dataSource[i][rows[j].dataField]) {
                            var img = document.createElement('img');
                            img.setAttribute('src', './images/' + dataSource[i][rows[j].dataField]);
                            img.className = 'cards-image'
                            divGroup.appendChild(img);
                        }
                    }
                    else {
                        labelData.innerText = rows[j].caption + ': ';
                        labelData.className = 'tag-data-cards';
                        spanData.className = 'info-data-cards';
                        divGroup.appendChild(labelData);
                        divGroup.appendChild(spanData);
                    }
                }
                divInfo.appendChild(divGroup);
            }
            divData.appendChild(divInfo);
            divCard.appendChild(divData);
            if (showButton == true) {
                var divButton = document.createElement('div');
                var aButton = document.createElement('a');
                var iButton = document.createElement('i');
                iButton.classList.add('fa');
                iButton.classList.add(iconButton);
                aButton.appendChild(iButton);
                aButton.id = 'button_' + i;
                aButton.onclick = function (e) {
                    var id = e.currentTarget.id.split('_')[1];
                    if (actionButton) {
                        var agency = dataSource[id];
                        actionButton(agency);
                    }
                }
                divButton.className = 'cards-button';
                divButton.id = 'button' + i;
                divButton.appendChild(aButton);
                divCard.appendChild(divButton);
            }
            this.appendChild(divCard);
        }
    } catch (e) {
        showErrorMessage('', 'Error al crear los info cards, por favor comun??quese con el Administrador');
    }


}

HTMLElement.prototype.TileView = function (dataSource, info, columns, showImageBackGround, showDescription) {
    if (showImageBackGround == undefined)
        showImageBackGround = false;
    if (showDescription == undefined)
        showDescription = true;
    this.innerHTML = '';
    var width = (100 / columns) - 0;
    var height = 300 / columns;
    if (columns == 1)
        height = 300;
    for (var i = 0; i < dataSource.length; i++) {
        var divTile = document.createElement('div');
        if (divTile) {
            divTile.className = 'tile';
            divTile.style.width = width + '%';
            divTile.style.height = height + 'px';
            divTile.style.backgroundColor = dataSource[i].background ? dataSource[i].background : 'transparent';
            divTile.id = 'tile_' + i;
        }
        if (dataSource[i].image && showImageBackGround == true) {
            var imgTile = document.createElement('img');
            if (imgTile) {
                imgTile.setAttribute('src', './images/' + dataSource[i].image);
                imgTile.className = 'img-tile';
                imgTile.id = 'imgtile_' + i;
                imgTile.style.width = '100%';
                imgTile.style.height = (height - 100) + 'px';
                divTile.appendChild(imgTile);
            }
            divTile.onmouseover = function (e) {
                var id = e.currentTarget.id.split('_')[1];
                var imgTileB = document.getElementById('imgtile_' + id);
                if (imgTileB) {
                    imgTileB.parentElement.style.backgroundColor = 'black';
                    imgTileB.style.opacity = '0.7';
                }
            }
            divTile.onmouseleave = function (e) {
                var id = e.currentTarget.id.split('_')[1];
                var imgTileB = document.getElementById('imgtile_' + id);
                if (imgTileB) {
                    imgTileB.parentElement.style.backgroundColor = 'transparent';
                    imgTileB.style.opacity = '1';
                }
            }
        } else if (dataSource[i].image && showImageBackGround == false) {
            var imgTile = document.createElement('img');
            if (imgTile) {
                imgTile.setAttribute('src', './images/' + dataSource[i].image);
                imgTile.className = 'img-tile-bg';
                imgTile.id = 'imgtile_' + i;
                imgTile.style.height = (height - 100) + 'px';
                divTile.appendChild(imgTile);
            }
        }

        divTile.onmousedown = function (e) {
            var id = e.currentTarget.id.split('_')[1];
            this.style.width = (width - 3) + '%';
            this.style.height = (height - 40) + 'px';
            if (showImageBackGround == true) {
                var imgTileB = document.getElementById('imgtile_' + id);
                imgTileB.style.height = (this.style.height - 70);
            }
        }

        divTile.onmouseup = function (e) {
            var id = e.currentTarget.id.split('_')[1];
            this.style.width = (width) + '%';
            this.style.height = height + 'px';
            if (showImageBackGround == true) {
                var imgTileB = document.getElementById('imgtile_' + id);
                imgTileB.style.height = (this.style.height - 70);
            }
        }

        divTile.onclick = function (e) {
            var id = e.currentTarget.id.split('_')[1];
            dataSource[id].click();
        }

        for (var j = 0; j < info.length; j++) {
            if (info[j].isTitle && info[j].isTitle == true) {
                var divTexto = document.createElement('div');
                divTexto.className = 'text-tile-bg';
                divTile.appendChild(divTexto);
                var divText = document.createElement('div');
                divText.className = 'text-tile';
                var spanText = document.createElement('span');
                spanText.innerText = dataSource[i][info[j].dataField];
                divText.appendChild(spanText);
                divTile.appendChild(divText);
            } else {
                if (showDescription == true) {
                    var divDescripcion = document.createElement('div');
                    divDescripcion.className = 'description-tile';
                    var spanDescripcion = document.createElement('span');
                    spanDescripcion.style.color = info[j].color;
                    spanDescripcion.innerText = dataSource[i][info[j].dataField];
                    divDescripcion.appendChild(spanDescripcion);
                    divTile.appendChild(divDescripcion);
                }
            }

        }


        this.appendChild(divTile);
    }
}



///////FORMATEADOR PARA MONEDA////////
// c numero de decimales 
// d caracter separador decimales .
//t  caracter separador de miles ,

Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
/**
 * jslinq - Another LINQ provider for Javascript

 * @version    : 1.0.20
 * @author     : maurobussini
 * @license    : MIT
 * @repository : https://github.com/maurobussini/jslinq.git
 * @built      : 2017-1-9
 */
!function (t, e) { "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? module.exports = e() : t.jslinq = e() }(this, function () { function t(t) { if (!t) throw new Error("Provided data is invalid"); if (!(t instanceof Array)) throw new Error("Provided data is not a valid array"); return this.items = t, this.select = r, this.where = i, this.groupBy = n, this.join = s, this.intersect = L, this.distinct = h, this.orderBy = o, this.orderByDescending = u, this.selectMany = f, this.singleOrDefault = a, this.firstOrDefault = l, this.lastOrDefault = m, this.any = v, this.all = c, this.toList = w, this.count = g, this.skip = p, this.take = d, this.max = E, this.min = y, this.remove = b, this.subtract = x, this.sum = k, this.average = B, this } function e(t, i) { if (t === i) return !0; if (t == i) return !0; if (typeof t != typeof i) return !1; if ("object" != typeof t) return t == i; for (var r in t) { var n = t[r], s = i[r], h = "object" == typeof n ? e(n, s) : n == s; if (!h) return !1 } return !0 } function i(e) { if (!e) throw new Error("Expression is invalid"); for (var i = [], r = 0; r < this.items.length; r++) { var n = e(this.items[r]); n && i.push(this.items[r]) } return new t(i) } function r(e) { if (!e) throw new Error("Expression is invalid"); for (var i = [], r = 0; r < this.items.length; r++) { var n = e(this.items[r]); i.push(n) } return new t(i) } function n(i) { if (!i) throw new Error("Expression is invalid"); for (var r = [], n = 0; n < this.items.length; n++) { for (var s = i(this.items[n]), h = null, o = 0; o < r.length; o++)if (e(r[o].key, s)) { h = r[o]; break } h || (h = { key: s, count: 0, elements: [] }, r.push(h)), h.count++ , h.elements.push(this.items[n]) } return new t(r) } function s(e) { if (!e) return new t(this.items); for (var i = [], r = 0; r < this.items.length; r++)i.push(this.items[r]); for (var n = 0; n < e.length; n++)i.push(e[n]); return new t(i) } function h() { for (var i = [], r = 0; r < this.items.length; r++) { for (var n = !1, s = 0; s < i.length; s++)if (e(i[s], this.items[r])) { n = !0; break } n || i.push(this.items[r]) } return new t(i) } function o(e) { if (!e) throw new Error("Expression is invalid"); for (var i = function (t, i) { var r = e(t), n = e(i); return r < n ? -1 : r > n ? 1 : 0 }, r = [], n = 0; n < this.items.length; n++)r.push(this.items[n]); var s = r.sort(i); return new t(s) } function u(e) { if (!e) throw new Error("Expression is invalid"); var i = t(this.items).orderBy(e).toList(), r = i.reverse(); return new t(r) } function f(e) { if (!e) throw new Error("Expression is invalid"); for (var i = [], r = 0; r < this.items.length; r++) { var n = e(this.items[r]); if (!n) { i.push(n); break } for (var s = 0; s < n.length; s++)i.push(n[s]) } return new t(i) } function a(e) { var i; if (i = e ? t(this.items).where(e).toList() : this.items, 0 === i.length) return null; if (1 == i.length) return i[0]; throw new Error("Sequence contains " + i.length + " matching elements") } function l(e) { var i; return i = e ? t(this.items).where(e).toList() : this.items, 0 === i.length ? null : i[0] } function m(e) { var i; return i = e ? t(this.items).where(e).toList() : this.items, 0 === i.length ? null : i[i.length - 1] } function v(e) { var i; return i = e ? t(this.items).where(e).toList() : this.items, i.length > 0 } function c(e) { var i; return i = e ? t(this.items).where(e).toList() : this.items, i.length == this.items.length } function w() { return this.items } function g() { return this.items.length } function p(e) { if (e < 0) throw new Error("Value must be greater or equals zero"); for (var i = [], r = 0; r < this.items.length; r++)i.push(this.items[r]); var n = i.slice(e); return new t(n) } function d(e) { if (e < 0) throw new Error("Value must be greater or equals zero"); for (var i = [], r = 0; r < this.items.length; r++)i.push(this.items[r]); var n = i.slice(0, e); return new t(n) } function E(e) { var i; return i = e ? t(this.items).select(e).toList() : this.items, 0 === i.length ? null : (i = t(i).orderBy(function (t) { return t }).toList(), i[i.length - 1]) } function y(e) { var i; return i = e ? t(this.items).select(e).toList() : this.items, 0 === i.length ? null : (i = t(i).orderBy(function (t) { return t }).toList(), i[0]) } function L(i, r) { if (!i) return new t([]); for (var n = [], s = 0; s < this.items.length; s++)for (var h = this.items[s], o = 0; o < i.length; o++) { var u = i[o], f = !1; if (r) { var a = r(h), l = r(u); f = e(a, l) } else f = e(h, u); f && n.push(h) } return new t(n) } function b(i) { if (!i) return new t(this.items); for (var r = [], n = 0; n < this.items.length; n++)e(this.items[n], i) || r.push(this.items[n]); return new t(r) } function x(i, r) { if (!i) return new t([]); for (var n = [], s = 0; s < this.items.length; s++) { for (var h = this.items[s], o = !1, u = 0; u < i.length; u++)if (!o) { var f = i[u], a = !1; if (r) { var l = r(h), m = r(f); a = e(l, m) } else a = e(h, f); a && (o = !0) } o || n.push(h) } return new t(n) } function k(e) { if (!e) throw new Error("Expression is invalid"); for (var i = t(this.items).select(e).toList(), r = 0, n = 0; n < i.length; n++) { var s = i[n]; if ("number" != typeof s) throw Error("Value '" + s + "' is not a number"); r += s } return r } function B(e) { var i; if (i = e ? t(this.items).select(e).toList() : this.items, 0 === i.length) return null; for (var r = 0, n = 0; n < i.length; n++) { if (isNaN(i[n])) throw new Error("Element '" + i[n] + "' (index:" + n + ") is not a number"); r = i[n] + r } var s = r / i.length; return s } function j(e) { return new t(e) } return j });
var sessionWeb = null;
var sessionServer = {
    IdInstitucion: 0,
    IdOficina: 0,
    IdPerfilUsuario: 0,
    IdTransaccion: 0,
    IdUsuario: 0,
    IpEstacion: '',
    NombreEstacion: '',
    NombreCortoUsuario: '',
    CodigoPerfil: '',
    FechaSistema: undefined
}
function startSession(dataSession) {
    sessionStorage.setItem('Tipo', 'Full');
    sessionStorage.setItem('Estado', stateScreen.Active);
    sessionStorage.setItem('Transacciones', dataSession.Transacciones);
    sessionStorage.setItem('PerfilOficinaTransacciones', dataSession.PerfilOficinaTransacciones);
    sessionStorage.setItem('IPEstacion', dataSession.IpEstacion);
    sessionStorage.setItem('NombreEstacion', dataSession.NombreEstacion);
    sessionStorage.setItem('ServidorServicios', dataSession.ServidorServicios);
    sessionStorage.setItem('ServidorBDD', dataSession.ServidorBDD);
    sessionStorage.setItem('Usuario', dataSession.Usuario);
    sessionStorage.setItem('Sesion', dataSession.Sesion);
    sessionStorage.setItem('PantallaActual', undefined);
    sessionStorage.setItem('Sistemas', dataSession.Sistemas);
    sessionStorage.setItem('IdOficina', dataSession.IdOficina);
    sessionStorage.setItem('IdInstitucion', dataSession.IdInstitucion);
    sessionStorage.setItem('IdTransaccion', undefined);
    sessionStorage.setItem('IdPerfilUsuario', dataSession.IdPerfilUsuario);
    sessionStorage.setItem('NombreCortoUsuario', dataSession.NombreCortoUsuario);
    sessionStorage.setItem('CodigoPerfil', dataSession.CodigoPerfil);
    sessionStorage.setItem('FechaSistema', dataSession.FechaSistema);
    SesionWeb();
}

function endSesion() {
    sessionStorage.removeItem('Tipo');
    sessionStorage.removeItem('Transacciones');
    sessionStorage.removeItem('PerfilOficinaTransacciones');
    sessionStorage.removeItem('IPEstacion');
    sessionStorage.removeItem('NombreEstacion');
    sessionStorage.removeItem('ServidorServicios');
    sessionStorage.removeItem('ServidorBDD');
    sessionStorage.removeItem('Usuario');
    sessionStorage.removeItem('Sesion');
    sessionStorage.removeItem('PantallaActual');
    sessionStorage.removeItem('Sistemas');
    sessionStorage.removeItem('IdOficina');
    sessionStorage.removeItem('IdInstitucion');
    sessionStorage.removeItem('IdTransaccion');
    sessionStorage.removeItem('IdPerfilUsuario');
    sessionStorage.removeItem('NombreCortoUsuario');
    sessionStorage.removeItem('CodigoPerfil');
}

function SesionWeb() {
    if (sessionStorage.Sesion) {
        if (sessionStorage.Tipo == "Full") {
            var transacciones = sessionStorage.Transacciones != "undefined" ? JSON.parse(sessionStorage.Transacciones) : undefined;
            var perfilOficinaTransacciones = sessionStorage.PerfilOficinaTransacciones != "undefined" ? JSON.parse(sessionStorage.PerfilOficinaTransacciones) : undefined;
            var ipEstacion = sessionStorage.IPEstacion != "undefined" ? sessionStorage.IPEstacion : undefined;
            var nombreEstacion = sessionStorage.NombreEstacion != "undefined" ? sessionStorage.NombreEstacion : undefined;
            var servidorServicios = sessionStorage.ServidorServicios != "undefined" ? sessionStorage.ServidorServicios : undefined;
            var servidorBDD = sessionStorage.ServidorBDD != "undefined" ? sessionStorage.ServidorBDD : undefined;
            var sesion = sessionStorage.Sesion != "undefined" ? JSON.parse(sessionStorage.Sesion) : undefined;
            var usuario = sessionStorage.Usuario != "undefined" ? JSON.parse(sessionStorage.Usuario) : undefined;
            var pantallaActual = sessionStorage.PantallaActual != 'undefined' ? JSON.parse(sessionStorage.PantallaActual) : null;
            var sistemas = sessionStorage.Sistemas != "undefined" ? JSON.parse(sessionStorage.Sistemas) : undefined;
            var idOficina = parseInt(sessionStorage.IdOficina);
            var idInstitucion = parseInt(sessionStorage.IdInstitucion);
            var idTransaccion = parseInt(sessionStorage.IdTransaccion);
            var idPerfilUsuario = parseInt(sessionStorage.IdPerfilUsuario);
            var nombreCortoUsuario = sessionStorage.NombreCortoUsuario;
            var codigoPerfil = sessionStorage.CodigoPerfil;
            var fechaSistema = sessionStorage.FechaSistema;

            sessionWeb = {
                Transacciones: transacciones,
                PerfilOficinaTransacciones: perfilOficinaTransacciones,
                IpEstacion: ipEstacion,
                NombreEstacion: nombreEstacion,
                ServidorServicios: servidorServicios,
                ServidorBDD: servidorBDD,
                Sesion: sesion,
                Usuario: usuario,
                PantallaActual: pantallaActual,
                Sistemas: sistemas,
                IdOficina: idOficina,
                IdInstitucion: idInstitucion,
                IdTransaccion: idTransaccion,
                IdPerfilUsuario: idPerfilUsuario,
                NombreCortoUsuario: nombreCortoUsuario,
                CodigoPerfil: codigoPerfil,
                FechaSistema: fechaSistema
            }

            sessionServer.IdUsuario = sessionWeb.Usuario.IdUsuario;
            sessionServer.IdInstitucion = sessionWeb.Usuario.IdInstitucion;
            sessionServer.IpEstacion = sessionWeb.IpEstacion;
            sessionServer.NombreEstacion = sessionWeb.NombreEstacion;
            sessionServer.NombreCortoUsuario = sessionWeb.Usuario.CodigoUsuario;
            sessionServer.IdOficina = sessionWeb.IdOficina;
            sessionServer.IdInstitucion = sessionWeb.IdInstitucion;
            sessionServer.IdTransaccion = sessionWeb.IdTransaccion;
            sessionServer.IdPerfilUsuario = sessionWeb.IdPerfilUsuario;
            sessionServer.CodigoPerfil = sessionWeb.CodigoPerfil;
            sessionServer.FechaSistema = sessionWeb.FechaSistema
        }
        else {
            sessionWeb = {
                Sesion: JSON.parse(sessionStorage.Sesion)
            }

            sessionServer.IdUsuario = sessionWeb.Sesion.IdUsuario;
            sessionServer.IdInstitucion = sessionWeb.Sesion.IdInstitucion;
            sessionServer.IpEstacion = sessionWeb.Sesion.IpEstacion;
            sessionServer.NombreEstacion = sessionWeb.Sesion.NombreEstacion;
            sessionServer.NombreCortoUsuario = sessionWeb.Sesion.NombreCortoUsuario;
            sessionServer.IdOficina = sessionWeb.IdOficina;
            sessionServer.IdInstitucion = sessionWeb.IdInstitucion;
            sessionServer.IdTransaccion = sessionWeb.IdTransaccion;
            sessionServer.IdPerfilUsuario = sessionWeb.IdPerfilUsuario;
            sessionServer.CodigoPerfil = sessionWeb.CodigoPerfil;
            sessionServer.FechaSistema = sessionWeb.FechaSistema;
        }


    }

    return sessionWeb;
}

function startSessionLigth() {
    var sessionLigth = {
        IdOficina: 0,
        OficinaExterna: '',
        IdInstitucion: 0,
        EsInstitucionAdministrativa: false,
        IdPerfilUsuario: 0,
        CodigoPerfil: '',
        IdUsuario: 0,
        IdTransaccion: 0,
        FechaSistema: new Date(),
        NombreOficina: '',
        NombreInstitucion: '',
        NombreCompletoUsuario: '',
        NombreCortoUsuario: '',
        IPEstacion: Kernel_Shared.IpMaquina,
        NombreEstacion: '',
        TipoIdentificacionUsuario: '',
        IdentificacionUsuario: '',
        NombrePerfil: '',
    }
    sessionWeb = {
        Sesion: sessionLigth
    }
    sessionServer.IdUsuario = sessionLigth.IdUsuario;
    sessionServer.IdInstitucion = sessionLigth.IdInstitucion;
    sessionServer.IpEstacion = sessionLigth.IpEstacion;
    sessionServer.NombreEstacion = sessionLigth.NombreEstacion;
    sessionServer.NombreCortoUsuario = sessionLigth.NombreCortoUsuario;
    sessionServer.IdOficina = sessionLigth.IdOficina;
    sessionServer.IdInstitucion = sessionLigth.IdInstitucion;
    sessionServer.IdTransaccion = sessionLigth.IdTransaccion;
    sessionServer.IdPerfilUsuario = sessionLigth.IdPerfilUsuario;
    sessionServer.CodigoPerfil = sessionLigth.CodigoPerfil;
    sessionServer.FechaSistema = sessionLigth.FechaSistema;

    sessionStorage.setItem('Tipo', 'Ligth');
    sessionStorage.setItem('Sesion', JSON.stringify(sessionLigth));
}

function ConstantsBehaivor() {
}
/***************
***placeholder*****
*** aqu?? se debe cambiar por pais las etiquetas de los holders
***************/
//Formato del Numero de cuenta
ConstantsBehaivor.PLACEHOLDER_ACCOUNT_NUMBER = '28 caracteres (>AAAAAAAAAAAAAaaaaaaaaaaaaaaa)';
//Formato del n??mero Telefonico  Convencional
ConstantsBehaivor.PLACEHOLDER_PHONE = "8 d??gitos (######)";
//Formato del n??mero celular
ConstantsBehaivor.PLACEHOLDER_CELLPHONE = "8 d??gitos ([2-7]#######)";
//Formato de la identificaci??n Natural
ConstantsBehaivor.PLACEHOLDER_DNI = "13 d??gitos (#############)";
//Formato de la identificacion Jur??dica
ConstantsBehaivor.PLACEHOLDER_RUC = "";
//Formato hora 
ConstantsBehaivor.PLACEHOLDER_TIME = '24H(23:59)';
//Moneda
ConstantsBehaivor.SYMBOLMONEY = 'Q';

//Place Holder para campos Selecci??n
ConstantsBehaivor.PLACEHOLDER_SELECTION_FIELD = "Seleccione una opci??n";
//Place Holder para campos email
ConstantsBehaivor.PLACEHOLDER_EMAIL_FIELD = "ejemplo@correo.com";
//Place Holder para fecha corta
//ConstantsBehaivor.PLACEHOLDER_SHORT_DATE = "yyyy-MM-dd";
ConstantsBehaivor.PLACEHOLDER_SHORT_DATE = "dd-MM-yyyy";
//Place Holder para fecha larga
//ConstantsBehaivor.PLACEHOLDER_LONG_DATE = "yyyy-MM-dd HH:mm:ss";
ConstantsBehaivor.PLACEHOLDER_LONG_DATE = "dd-MM-yyyy HH:mm:ss";


/*************
***PATRONES***
** aqu?? se debe cambiar el formato de ingreso de los campos seg??n el pa??s
**************/
ConstantsBehaivor.PATTERN_ACCOUNT_NUMBER = '^([0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])+$';
ConstantsBehaivor.PATTERN_CELLPHONE = '^([2-7][0-9][0-9][0-9][0-9][0-9][0-9][0-9])+$';
ConstantsBehaivor.PATTERN_PHONE = '^([2-7][0-9][0-9][0-9][0-9][0-9][0-9][0-9])+$';
ConstantsBehaivor.PATTERN_CED = '^([0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])+$';
ConstantsBehaivor.PATTERN_RUC = '^([0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])+$';
// el separador debe coincidir con el ConstantsBehaivor.SEPARADOR_FORMATO_FECHA que est?? abajo
ConstantsBehaivor.PATTERN_SHORTDATE = 'dd/MM/yyyy';
ConstantsBehaivor.PATTERN_LONGDATE = 'dd/MM/yyyy HH:mm:ss';
ConstantsBehaivor.PATTERN_TIME = 'HH:mm';
ConstantsBehaivor.PATTERN_DATETIME = 'dd/MM/yyyy HH:mm';
ConstantsBehaivor.PATTERN_SHORTDATE_ES = 'dd/MM/aaaa';

/*************
***SEPARADORES***
** aqui se debe cambiar el formato d eingreso de los campos seg??n el pais
**************/
ConstantsBehaivor.SEPARATOR_DATE = "/";
ConstantsBehaivor.SEPARATOR_PHONE = "-";
ConstantsBehaivor.INIT_NUMBER_CELLPHONE = "";

/****************
***LONGITUDES****
*****************/

//Longitud del c??digo de la ubicaci??n geogr??fica 2
ConstantsBehaivor.CODE_LENGTH_UG2 = 2;
//Longitud del c??digo de la ubicaci??n geogr??fica 3
ConstantsBehaivor.CODE_LENGTH_UG3 = 8;
//Longitud del n??mero tel??fonico
ConstantsBehaivor.LENGTH_PHONE = 8;
ConstantsBehaivor.MIN_LENGTH_PHONE = 8;
ConstantsBehaivor.LENGTH_EXTENTION_PHONE = 8;
//Longitud del n??mero  celular
ConstantsBehaivor.LENGTH_CELLPHONE = 8;
//Longitud del n??mero de identificacion Natural
ConstantsBehaivor.LENGTH_DNI = 13;
//Longitud del n??mero de identificacion J??ridica
ConstantsBehaivor.LENGTH_RUC = 12;
//Longitud del n??mero de identificacion Extrangera
ConstantsBehaivor.LENGTH_PASSPORT = 16;
//Longitud Numero Cuenta
ConstantsBehaivor.LENGTH_ACCOUNT_NUMBER = 28;
//Longitud del n??mero de identificacion()
ConstantsBehaivor.LONGITUD_CEV = 16;

//longitud m??nima clave
ConstantsBehaivor.LENGTH_MIN_PWD = 6;

//longitud m??xima clave
ConstantsBehaivor.LENGTH_MAX_PWD = 16;

ConstantsBehaivor.PRECISION_DECIMAL = 2;

//LONGITUD MAXIMA NIR
ConstantsBehaivor.LENGTH_NIR = 18;
//L??ONGITUD MAXIMA NIS
ConstantsBehaivor.LENGTH_NIS = 10;

/*************
***VECTORES***
**************/
ConstantsBehaivor.DAYS_WEEK = new Array('Domingo', 'Lunes', 'Martes', 'Mi??rcoles', 'Jueves', 'Viernes', 'S??bado');
ConstantsBehaivor.MONTHS_YEAR = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');


/*******
CLASE PARA VALIDACIONES ESPECIFICAS DE GUATEMALA
******/

function ValidatorBehavior() {

};

/*
*PROPIEDADES ESTATICAS
*/

function DTOTypeID(code, isNatural, isMain, length) {
    this.codeTypeID = code;
    this.isNaturalTypeID = isNatural;
    this.isMainTypeID = isMain;
    this.lengthTypeID = length;
};

//Preparando tipo de Identificaciones
ValidatorBehavior.listTypeID = [new DTOTypeID("CED", true, true, ConstantsBehaivor.LENGTH_DNI)];
ValidatorBehavior.listTypeID.push(new DTOTypeID("CEV", true, false, ConstantsBehaivor.LENGTH_DNI));
ValidatorBehavior.listTypeID.push(new DTOTypeID("RUC", true, false, ConstantsBehaivor.LENGTH_RUC));
ValidatorBehavior.listTypeID.push(new DTOTypeID("PAS", true, false, ConstantsBehaivor.LENGTH_PASSPORT));

/*
* VALIDANDO IDENTIFICACIONES
*/

//Valida N??mero de Documento Identificaci??n Personal
// CAMBIAR LA L??GICA DE VALIDACI??N DE DCTO PARA OTRO PAIS
ValidatorBehavior.ValidateDNI = function (prmCedula, codeUB) {
    //departamentos vienen de un array
    var DPINIT = '';

    //trim ?? que esta cortando  
    var cui = null;
    cui = prmCedula.trim();

    //metodo fercho  
    var depto = parseInt(cui.substring(9, 11), 10);
    var muni = parseInt(cui.substring(11, 13));
    var numero = cui.substring(0, 8);
    var verificador = parseInt(cui.substring(8, 9));


    // Se asume que la codificaci??n de Municipios y
    // departamentos es la misma que esta publicada en
    // http://goo.gl/EsxN1a

    // Listado de municipios actualizado segun:
    // http://goo.gl/QLNglm

    // Este listado contiene la cantidad de municipios
    // existentes en cada departamento para poder
    // determinar el c??digo m??ximo aceptado por cada
    // uno de los departamentos.

    var munisPorDepto = [
    /* 01 - Guatemala tiene:      */ 17 /* municipios. */,
    /* 02 - El Progreso tiene:    */ 8 /* municipios. */,
    /* 03 - Sacatep??quez tiene:   */ 16 /* municipios. */,
    /* 04 - Chimaltenango tiene:  */ 16 /* municipios. */,
    /* 05 - Escuintla tiene:      */ 13 /* municipios. */,
    /* 06 - Santa Rosa tiene:     */ 14 /* municipios. */,
    /* 07 - Solol?? tiene:         */ 19 /* municipios. */,
    /* 08 - Totonicap??n tiene:    */ 8 /* municipios. */,
    /* 09 - Quetzaltenango tiene: */ 24 /* municipios. */,
    /* 10 - Suchitep??quez tiene:  */ 21 /* municipios. */,
    /* 11 - Retalhuleu tiene:     */ 9 /* municipios. */,
    /* 12 - San Marcos tiene:     */ 30 /* municipios. */,
    /* 13 - Huehuetenango tiene:  */ 32 /* municipios. */,
    /* 14 - Quich?? tiene:         */ 21 /* municipios. */,
    /* 15 - Baja Verapaz tiene:   */ 8 /* municipios. */,
    /* 16 - Alta Verapaz tiene:   */ 17 /* municipios. */,
    /* 17 - Pet??n tiene:          */ 14 /* municipios. */,
    /* 18 - Izabal tiene:         */ 5 /* municipios. */,
    /* 19 - Zacapa tiene:         */ 11 /* municipios. */,
    /* 20 - Chiquimula tiene:     */ 11 /* municipios. */,
    /* 21 - Jalapa tiene:         */ 7 /* municipios. */,
    /* 22 - Jutiapa tiene:        */ 17 /* municipios. */
    ];

    if (depto === 0 || muni === 0) {
        return false;
    }

    if (depto > munisPorDepto.length) {
        return false;
    }

    if (muni > munisPorDepto[depto - 1]) {
        return false;
    }
    // Se verifica el correlativo con base
    // en el algoritmo del complemento 11.

    var total = 0;

    for (var i = 0; i < numero.length; i++) {
        total += numero[i] * (i + 2);
    }

    var modulo = total % 11;
    return modulo === verificador;
};

ValidatorBehavior.ValidateCEV = function (prmCedula) {
    if (!prmCedula)
        return true;
    if (prmCedula.length <= ConstantsBehaivor.LONGITUD_CEV)
        return true;
    else
        return false;
}

//Obteniendo Tipos de Identificaciones Principales --PRIVADO
function obtenerListaTipoIdentificacionesPrinciapales() {
    var listaTI = [];
    for (var i = ValidatorBehavior.listTypeID.length - 1; i >= 0; i--) {
        if (ValidatorBehavior.listTypeID[i].isMainTypeID) {
            listaTI.push(ValidatorBehavior.listTypeID[i]);
        }
    };
    return listaTI;
};

//Obteniendo Tipos de Identificaciones Principales --PRIVADO
/*function getListMainTypeID () {
    var listTI = [];
    for (var i = ValidatorBehavior.listTypeID.length - 1; i >= 0; i--) {
        if (ValidatorBehavior.listTypeID[i].isMainTypeID) {
            listTI.push(ValidatorBehavior.listTypeID[i]);
        }
    };
    return listTI;
}; */

//Valida la longitud de una identificacion
function validateLengthID(ID, length) {

    if (ID != null) {
        var identificacionAux = ID.trim();

        if (identificacionAux.length == length || identificacionAux.length == 0) {
            return true;
        } else {
            return false;
        }
    } else
        return false;

};


//Valida N??mero de Documento Juridico
// CAMBIAR LA L??GICA DE VALIDACI??N DE DCTO RUC PARA OTRO PAIS
ValidatorBehavior.ValidateRUC = function (prmCedula, codigosUB) {
    var DPINIT = '';
    var strCedula2 = null;
    strCedula2 = prmCedula.trim();
    debugger;
    if (strCedula2.length >= 3 && strCedula2.length <= ConstantsBehaivor.LENGTH_RUC) {
        var validar = false;

        //if (strCedula2.Length > 7)
        //    DPINIT = strCedula2.Substring(0, 8);
        //else
        DPINIT = strCedula2;

        validar = verificarDPINIT(DPINIT);

        return validar;
    }
    else
        return true;

};




//Valida Pasaporte
// CAMBIAR LA L??GICA DE VALIDACI??N DE PASAPORTE PARA OTRO PAIS
ValidatorBehavior.ValidatePassport = function (passport, codesUB) {
    if (passport == 0) {
        return true;
    }

    if (passport == undefined || passport == null || passport.length == 0)
        return false;

    var pas = passport.trim();
    //var esCaracterValido = ValidadorBehaivor.EsLetrasYNumeros(pasaporte);
    if (pas.length <= ConstantsBehaivor.LENGTH_PASSPORT)
        return true;
    else
        return false;
};

//Valida una cadena como N??meroTelefonico
// CAMBIAR LA L??GICA DE VALIDACI??N DE TELEFONO CONVENCIONAL PARA OTRO PAIS
ValidatorBehavior.IsConventionalPhone = function (phone, codesProvince) {
    //No se realiza valicacion por Mascara
    return true;
}

//Valida una cadena como celular
// CAMBIAR LA L??GICA DE VALIDACI??N DE TELEFONO CELULAR PARA OTRO PAIS
ValidatorBehavior.IsCellPhone = function (cellphone) {

    var str = cellphone.value;
    if (str != undefined && str.length > 0) {
        var regexp = new RegExp(ConstantsBehaivor.PATTERN_CELLPHONE, "g");
        var result = regexp.exec(str);
        return result != null;
    }
    else
        return true;
}




var verificarDPI = function (strDPI) {
    /******************************************************************
    * ASUMIMOS QUE EL ULTIMO DIGITO CORRESPONDE AL DIGITO VERIFICADOR
    ****************************************************************/
    var Sum = 0;

    /******************************************************************
    * si es nit ponemos un cero al inicio de la cadena, longitud de 8
     * incluido el n??mero verificador
     * dpi longitud de 9 incluido digito verificador
    ****************************************************************/

    //999999
    //000999999
    if (strDPI.length < 9)
        strDPI = strDPI.padStart(9, '0');
    var Largo = strDPI.length;

    /******************************************************************
    * REVERSAMOS LA CADENA
    ****************************************************************/
    var strDPIReducido = strDPI.substring(0, strDPI.length - 1);
    var reverse = '';
    for (var i = strDPIReducido.length - 1; i > -1; i--) {
        reverse += strDPIReducido[i];
    }

    /******************************************************************
    * COMPLETAMOS LA LONGITUD A DIEZ CARACTERES CON "0" AL FINAL
    ******************************************************************/
    strDPIReducido = reverse.padStart(10, '0');
    for (var i = 0, Multiplier = 0; i < strDPIReducido.length; i++) {
        Sum += parseInt(strDPIReducido[i]) * Multiplier;

        if (++Multiplier == 10) Multiplier = 0;
    }
    var Validator = (11 - (Sum % 11)).toString();

    if (Validator == "11") Validator = "0";
    else if (Validator == "10") Validator = "X";

    if (Validator == strDPI.substring(Largo - 1, Largo))
        return true;
    else
        return false;
}

var verificarDPINIT = function (strDPI) {
    /******************************************************************
             * ASUMIMOS QUE EL ULTIMO DIGITO CORRESPONDE AL DIGITO VERIFICADOR
             ****************************************************************/
    var Sum = 0;

    /******************************************************************
    * si es nit ponemos un cero al inicio de la cadena, longitud de 8
     * incluido el n??mero verificador
     * dpi longitud de 9 incluido digito verificador
    ****************************************************************/
    var esNit = false;
    //999999
    //000999999
    if (strDPI.length <= 9) {
        esNit = true;
        //strDPI = strDPI.PadLeft(9, '0');
        return nitValido(strDPI);

    }
    var Largo = strDPI.length;

    /******************************************************************
    * REVERSAMOS LA CADENA
    ****************************************************************/
    var strDPIReducido = strDPI.substring(0, strDPI.length - 1);
    var reverse = '';
    for (var i = strDPIReducido.length - 1; i > -1; i--) {
        reverse += strDPIReducido[i];
    }

    /******************************************************************
    * COMPLETAMOS LA LONGITUD A DIEZ CARACTERES CON "0" AL FINAL
    ******************************************************************/
    strDPIReducido = reverse.padStart(10, '0');
    for (var i = 0, Multiplier = 0; i < strDPIReducido.length; i++) {
        Sum += parseInt(strDPIReducido[i]) * Multiplier;

        if (++Multiplier == 10) Multiplier = 0;
    }
    var Validator = (11 - (Sum % 11)).toString();

    if (Validator == "11") Validator = "0";
    else if (Validator == "10") Validator = "K";

    if (Validator == strDPI.substring(Largo - 1, Largo))
        return true;
    else
        return false;
}

var nitValido = function (Nit) {
    try {

        var _Correlativo, _DigitoVerificador;
        Nit = Nit.replace("-", "").toUpperCase();

        if (Nit.toString() == "0")
            return false;

        var pos = Nit.length - 1;

        _Correlativo = Nit.substring(0, pos);
        _DigitoVerificador = Nit.substring(Nit.length - 1, Nit.length);


        var Factor = _Correlativo.length + 1;

        var Suma = 0;
        var Valor = 0;

        for (var i = 0; i <= _Correlativo.length - 1; i++) {

            Valor = parseInt(Nit.substring(i, i + 1));
            Suma = Suma + (Valor * Factor);
            Factor = Factor - 1;

        }

        var xMOd11 = 0;
        xMOd11 = (11 - (Suma % 11)) % 11;
        var s = xMOd11.toString();

        if ((xMOd11 == 10 && _DigitoVerificador == "K") || (s == _DigitoVerificador))
            return true;

        return false;

    }
    catch (ex) {

        return false;
    }
}

/***********************************
**ESTRUCTURA TIPO DE IDENTIFICACI??N*
***********************************/




$(function () {
    $.when($.getJSON("js/devextreme/localization/dx.messages.es.json")).then(function (data) { Globalize.loadMessages(data); });
    $.when(
        $.getJSON("js/devextreme/localization/es-EC/ca-gregorian.json"),
        $.getJSON("js/devextreme/localization/es-EC/numbers.json"),
        $.getJSON("js/devextreme/localization/es-EC/dataFields.json"),
        $.getJSON("js/devextreme/localization/es-EC/numbers.json"),
        $.getJSON("js/devextreme/localization/es-EC/timeZoneNames.json"),
        $.getJSON("js/devextreme/localization/es-EC/suplemental/likelySubtags.json"),
        $.getJSON("js/devextreme/localization/es-EC/suplemental/timeData.json"),
        $.getJSON("js/devextreme/localization/es-EC/suplemental/weekData.json"),
        $.getJSON("js/devextreme/localization/es-EC/suplemental/currencyData.json"),
        $.getJSON("js/devextreme/localization/es-EC/suplemental/numberingSystem.json")
    ).then(function () {
        //The following code converts the got results into an array
        return [].slice.apply(arguments, [0]).map(function (result) {
            return result[0];
        });
    }).then(
        Globalize.load //loads data held in each array item to Globalize
    ).then(function () {
        Globalize.locale('es-EC');
    })
});
(function (e, t) { typeof define == "function" && define.amd ? define([], t) : e.forge = t() })(this, function () { var e, t, n; return function (r) { function v(e, t) { return h.call(e, t) } function m(e, t) { var n, r, i, s, o, u, a, f, c, h, p, v = t && t.split("/"), m = l.map, g = m && m["*"] || {}; if (e && e.charAt(0) === ".") if (t) { v = v.slice(0, v.length - 1), e = e.split("/"), o = e.length - 1, l.nodeIdCompat && d.test(e[o]) && (e[o] = e[o].replace(d, "")), e = v.concat(e); for (c = 0; c < e.length; c += 1) { p = e[c]; if (p === ".") e.splice(c, 1), c -= 1; else if (p === "..") { if (c === 1 && (e[2] === ".." || e[0] === "..")) break; c > 0 && (e.splice(c - 1, 2), c -= 2) } } e = e.join("/") } else e.indexOf("./") === 0 && (e = e.substring(2)); if ((v || g) && m) { n = e.split("/"); for (c = n.length; c > 0; c -= 1) { r = n.slice(0, c).join("/"); if (v) for (h = v.length; h > 0; h -= 1) { i = m[v.slice(0, h).join("/")]; if (i) { i = i[r]; if (i) { s = i, u = c; break } } } if (s) break; !a && g && g[r] && (a = g[r], f = c) } !s && a && (s = a, u = f), s && (n.splice(0, u, s), e = n.join("/")) } return e } function g(e, t) { return function () { return s.apply(r, p.call(arguments, 0).concat([e, t])) } } function y(e) { return function (t) { return m(t, e) } } function b(e) { return function (t) { a[e] = t } } function w(e) { if (v(f, e)) { var t = f[e]; delete f[e], c[e] = !0, i.apply(r, t) } if (!v(a, e) && !v(c, e)) throw new Error("No " + e); return a[e] } function E(e) { var t, n = e ? e.indexOf("!") : -1; return n > -1 && (t = e.substring(0, n), e = e.substring(n + 1, e.length)), [t, e] } function S(e) { return function () { return l && l.config && l.config[e] || {} } } var i, s, o, u, a = {}, f = {}, l = {}, c = {}, h = Object.prototype.hasOwnProperty, p = [].slice, d = /\.js$/; o = function (e, t) { var n, r = E(e), i = r[0]; return e = r[1], i && (i = m(i, t), n = w(i)), i ? n && n.normalize ? e = n.normalize(e, y(t)) : e = m(e, t) : (e = m(e, t), r = E(e), i = r[0], e = r[1], i && (n = w(i))), { f: i ? i + "!" + e : e, n: e, pr: i, p: n } }, u = { require: function (e) { return g(e) }, exports: function (e) { var t = a[e]; return typeof t != "undefined" ? t : a[e] = {} }, module: function (e) { return { id: e, uri: "", exports: a[e], config: S(e) } } }, i = function (e, t, n, i) { var s, l, h, p, d, m = [], y = typeof n, E; i = i || e; if (y === "undefined" || y === "function") { t = !t.length && n.length ? ["require", "exports", "module"] : t; for (d = 0; d < t.length; d += 1) { p = o(t[d], i), l = p.f; if (l === "require") m[d] = u.require(e); else if (l === "exports") m[d] = u.exports(e), E = !0; else if (l === "module") s = m[d] = u.module(e); else if (v(a, l) || v(f, l) || v(c, l)) m[d] = w(l); else { if (!p.p) throw new Error(e + " missing " + l); p.p.load(p.n, g(i, !0), b(l), {}), m[d] = a[l] } } h = n ? n.apply(a[e], m) : undefined; if (e) if (s && s.exports !== r && s.exports !== a[e]) a[e] = s.exports; else if (h !== r || !E) a[e] = h } else e && (a[e] = n) }, e = t = s = function (e, t, n, a, f) { if (typeof e == "string") return u[e] ? u[e](t) : w(o(e, t).f); if (!e.splice) { l = e, l.deps && s(l.deps, l.callback); if (!t) return; t.splice ? (e = t, t = n, n = null) : e = r } return t = t || function () { }, typeof n == "function" && (n = a, a = f), a ? i(r, e, t, n) : setTimeout(function () { i(r, e, t, n) }, 4), s }, s.config = function (e) { return s(e) }, e._defined = a, n = function (e, t, n) { t.splice || (n = t, t = []), !v(a, e) && !v(f, e) && (f[e] = [e, t, n]) }, n.amd = { jQuery: !0 } }(), n("node_modules/almond/almond", function () { }), function () { function e(e) { function n(e) { this.data = "", this.read = 0; if (typeof e == "string") this.data = e; else if (t.isArrayBuffer(e) || t.isArrayBufferView(e)) { var r = new Uint8Array(e); try { this.data = String.fromCharCode.apply(null, r) } catch (i) { for (var s = 0; s < r.length; ++s)this.putByte(r[s]) } } else if (e instanceof n || typeof e == "object" && typeof e.data == "string" && typeof e.read == "number") this.data = e.data, this.read = e.read; this._constructedStringLength = 0 } function i(e, n) { n = n || {}, this.read = n.readOffset || 0, this.growSize = n.growSize || 1024; var r = t.isArrayBuffer(e), i = t.isArrayBufferView(e); if (r || i) { r ? this.data = new DataView(e) : this.data = new DataView(e.buffer, e.byteOffset, e.byteLength), this.write = "writeOffset" in n ? n.writeOffset : this.data.byteLength; return } this.data = new DataView(new ArrayBuffer(0)), this.write = 0, e !== null && e !== undefined && this.putBytes(e), "writeOffset" in n && (this.write = n.writeOffset) } var t = e.util = e.util || {}; (function () { if (typeof process != "undefined" && process.nextTick) { t.nextTick = process.nextTick, typeof setImmediate == "function" ? t.setImmediate = setImmediate : t.setImmediate = t.nextTick; return } if (typeof setImmediate == "function") { t.setImmediate = function () { return setImmediate.apply(undefined, arguments) }, t.nextTick = function (e) { return setImmediate(e) }; return } t.setImmediate = function (e) { setTimeout(e, 0) }; if (typeof window != "undefined" && typeof window.postMessage == "function") { var e = "forge.setImmediate", n = []; t.setImmediate = function (t) { n.push(t), n.length === 1 && window.postMessage(e, "*") }; function r(t) { if (t.source === window && t.data === e) { t.stopPropagation(); var r = n.slice(); n.length = 0, r.forEach(function (e) { e() }) } } window.addEventListener("message", r, !0) } if (typeof MutationObserver != "undefined") { var i = Date.now(), s = !0, o = document.createElement("div"), n = []; (new MutationObserver(function () { var e = n.slice(); n.length = 0, e.forEach(function (e) { e() }) })).observe(o, { attributes: !0 }); var u = t.setImmediate; t.setImmediate = function (e) { Date.now() - i > 15 ? (i = Date.now(), u(e)) : (n.push(e), n.length === 1 && o.setAttribute("a", s = !s)) } } t.nextTick = t.setImmediate })(), t.isArray = Array.isArray || function (e) { return Object.prototype.toString.call(e) === "[object Array]" }, t.isArrayBuffer = function (e) { return typeof ArrayBuffer != "undefined" && e instanceof ArrayBuffer }, t.isArrayBufferView = function (e) { return e && t.isArrayBuffer(e.buffer) && e.byteLength !== undefined }, t.ByteBuffer = n, t.ByteStringBuffer = n; var r = 4096; t.ByteStringBuffer.prototype._optimizeConstructedString = function (e) { this._constructedStringLength += e, this._constructedStringLength > r && (this.data.substr(0, 1), this._constructedStringLength = 0) }, t.ByteStringBuffer.prototype.length = function () { return this.data.length - this.read }, t.ByteStringBuffer.prototype.isEmpty = function () { return this.length() <= 0 }, t.ByteStringBuffer.prototype.putByte = function (e) { return this.putBytes(String.fromCharCode(e)) }, t.ByteStringBuffer.prototype.fillWithByte = function (e, t) { e = String.fromCharCode(e); var n = this.data; while (t > 0) t & 1 && (n += e), t >>>= 1, t > 0 && (e += e); return this.data = n, this._optimizeConstructedString(t), this }, t.ByteStringBuffer.prototype.putBytes = function (e) { return this.data += e, this._optimizeConstructedString(e.length), this }, t.ByteStringBuffer.prototype.putString = function (e) { return this.putBytes(t.encodeUtf8(e)) }, t.ByteStringBuffer.prototype.putInt16 = function (e) { return this.putBytes(String.fromCharCode(e >> 8 & 255) + String.fromCharCode(e & 255)) }, t.ByteStringBuffer.prototype.putInt24 = function (e) { return this.putBytes(String.fromCharCode(e >> 16 & 255) + String.fromCharCode(e >> 8 & 255) + String.fromCharCode(e & 255)) }, t.ByteStringBuffer.prototype.putInt32 = function (e) { return this.putBytes(String.fromCharCode(e >> 24 & 255) + String.fromCharCode(e >> 16 & 255) + String.fromCharCode(e >> 8 & 255) + String.fromCharCode(e & 255)) }, t.ByteStringBuffer.prototype.putInt16Le = function (e) { return this.putBytes(String.fromCharCode(e & 255) + String.fromCharCode(e >> 8 & 255)) }, t.ByteStringBuffer.prototype.putInt24Le = function (e) { return this.putBytes(String.fromCharCode(e & 255) + String.fromCharCode(e >> 8 & 255) + String.fromCharCode(e >> 16 & 255)) }, t.ByteStringBuffer.prototype.putInt32Le = function (e) { return this.putBytes(String.fromCharCode(e & 255) + String.fromCharCode(e >> 8 & 255) + String.fromCharCode(e >> 16 & 255) + String.fromCharCode(e >> 24 & 255)) }, t.ByteStringBuffer.prototype.putInt = function (e, t) { var n = ""; do t -= 8, n += String.fromCharCode(e >> t & 255); while (t > 0); return this.putBytes(n) }, t.ByteStringBuffer.prototype.putSignedInt = function (e, t) { return e < 0 && (e += 2 << t - 1), this.putInt(e, t) }, t.ByteStringBuffer.prototype.putBuffer = function (e) { return this.putBytes(e.getBytes()) }, t.ByteStringBuffer.prototype.getByte = function () { return this.data.charCodeAt(this.read++) }, t.ByteStringBuffer.prototype.getInt16 = function () { var e = this.data.charCodeAt(this.read) << 8 ^ this.data.charCodeAt(this.read + 1); return this.read += 2, e }, t.ByteStringBuffer.prototype.getInt24 = function () { var e = this.data.charCodeAt(this.read) << 16 ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2); return this.read += 3, e }, t.ByteStringBuffer.prototype.getInt32 = function () { var e = this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3); return this.read += 4, e }, t.ByteStringBuffer.prototype.getInt16Le = function () { var e = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8; return this.read += 2, e }, t.ByteStringBuffer.prototype.getInt24Le = function () { var e = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16; return this.read += 3, e }, t.ByteStringBuffer.prototype.getInt32Le = function () { var e = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16 ^ this.data.charCodeAt(this.read + 3) << 24; return this.read += 4, e }, t.ByteStringBuffer.prototype.getInt = function (e) { var t = 0; do t = (t << 8) + this.data.charCodeAt(this.read++), e -= 8; while (e > 0); return t }, t.ByteStringBuffer.prototype.getSignedInt = function (e) { var t = this.getInt(e), n = 2 << e - 2; return t >= n && (t -= n << 1), t }, t.ByteStringBuffer.prototype.getBytes = function (e) { var t; return e ? (e = Math.min(this.length(), e), t = this.data.slice(this.read, this.read + e), this.read += e) : e === 0 ? t = "" : (t = this.read === 0 ? this.data : this.data.slice(this.read), this.clear()), t }, t.ByteStringBuffer.prototype.bytes = function (e) { return typeof e == "undefined" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + e) }, t.ByteStringBuffer.prototype.at = function (e) { return this.data.charCodeAt(this.read + e) }, t.ByteStringBuffer.prototype.setAt = function (e, t) { return this.data = this.data.substr(0, this.read + e) + String.fromCharCode(t) + this.data.substr(this.read + e + 1), this }, t.ByteStringBuffer.prototype.last = function () { return this.data.charCodeAt(this.data.length - 1) }, t.ByteStringBuffer.prototype.copy = function () { var e = t.createBuffer(this.data); return e.read = this.read, e }, t.ByteStringBuffer.prototype.compact = function () { return this.read > 0 && (this.data = this.data.slice(this.read), this.read = 0), this }, t.ByteStringBuffer.prototype.clear = function () { return this.data = "", this.read = 0, this }, t.ByteStringBuffer.prototype.truncate = function (e) { var t = Math.max(0, this.length() - e); return this.data = this.data.substr(this.read, t), this.read = 0, this }, t.ByteStringBuffer.prototype.toHex = function () { var e = ""; for (var t = this.read; t < this.data.length; ++t) { var n = this.data.charCodeAt(t); n < 16 && (e += "0"), e += n.toString(16) } return e }, t.ByteStringBuffer.prototype.toString = function () { return t.decodeUtf8(this.bytes()) }, t.DataBuffer = i, t.DataBuffer.prototype.length = function () { return this.write - this.read }, t.DataBuffer.prototype.isEmpty = function () { return this.length() <= 0 }, t.DataBuffer.prototype.accommodate = function (e, t) { if (this.length() >= e) return this; t = Math.max(t || this.growSize, e); var n = new Uint8Array(this.data.buffer, this.data.byteOffset, this.data.byteLength), r = new Uint8Array(this.length() + t); return r.set(n), this.data = new DataView(r.buffer), this }, t.DataBuffer.prototype.putByte = function (e) { return this.accommodate(1), this.data.setUint8(this.write++, e), this }, t.DataBuffer.prototype.fillWithByte = function (e, t) { this.accommodate(t); for (var n = 0; n < t; ++n)this.data.setUint8(e); return this }, t.DataBuffer.prototype.putBytes = function (e, n) { if (t.isArrayBufferView(e)) { var r = new Uint8Array(e.buffer, e.byteOffset, e.byteLength), i = r.byteLength - r.byteOffset; this.accommodate(i); var s = new Uint8Array(this.data.buffer, this.write); return s.set(r), this.write += i, this } if (t.isArrayBuffer(e)) { var r = new Uint8Array(e); this.accommodate(r.byteLength); var s = new Uint8Array(this.data.buffer); return s.set(r, this.write), this.write += r.byteLength, this } if (e instanceof t.DataBuffer || typeof e == "object" && typeof e.read == "number" && typeof e.write == "number" && t.isArrayBufferView(e.data)) { var r = new Uint8Array(e.data.byteLength, e.read, e.length()); this.accommodate(r.byteLength); var s = new Uint8Array(e.data.byteLength, this.write); return s.set(r), this.write += r.byteLength, this } e instanceof t.ByteStringBuffer && (e = e.data, n = "binary"), n = n || "binary"; if (typeof e == "string") { var o; if (n === "hex") return this.accommodate(Math.ceil(e.length / 2)), o = new Uint8Array(this.data.buffer, this.write), this.write += t.binary.hex.decode(e, o, this.write), this; if (n === "base64") return this.accommodate(Math.ceil(e.length / 4) * 3), o = new Uint8Array(this.data.buffer, this.write), this.write += t.binary.base64.decode(e, o, this.write), this; n === "utf8" && (e = t.encodeUtf8(e), n = "binary"); if (n === "binary" || n === "raw") return this.accommodate(e.length), o = new Uint8Array(this.data.buffer, this.write), this.write += t.binary.raw.decode(o), this; if (n === "utf16") return this.accommodate(e.length * 2), o = new Uint16Array(this.data.buffer, this.write), this.write += t.text.utf16.encode(o), this; throw new Error("Invalid encoding: " + n) } throw Error("Invalid parameter: " + e) }, t.DataBuffer.prototype.putBuffer = function (e) { return this.putBytes(e), e.clear(), this }, t.DataBuffer.prototype.putString = function (e) { return this.putBytes(e, "utf16") }, t.DataBuffer.prototype.putInt16 = function (e) { return this.accommodate(2), this.data.setInt16(this.write, e), this.write += 2, this }, t.DataBuffer.prototype.putInt24 = function (e) { return this.accommodate(3), this.data.setInt16(this.write, e >> 8 & 65535), this.data.setInt8(this.write, e >> 16 & 255), this.write += 3, this }, t.DataBuffer.prototype.putInt32 = function (e) { return this.accommodate(4), this.data.setInt32(this.write, e), this.write += 4, this }, t.DataBuffer.prototype.putInt16Le = function (e) { return this.accommodate(2), this.data.setInt16(this.write, e, !0), this.write += 2, this }, t.DataBuffer.prototype.putInt24Le = function (e) { return this.accommodate(3), this.data.setInt8(this.write, e >> 16 & 255), this.data.setInt16(this.write, e >> 8 & 65535, !0), this.write += 3, this }, t.DataBuffer.prototype.putInt32Le = function (e) { return this.accommodate(4), this.data.setInt32(this.write, e, !0), this.write += 4, this }, t.DataBuffer.prototype.putInt = function (e, t) { this.accommodate(t / 8); do t -= 8, this.data.setInt8(this.write++, e >> t & 255); while (t > 0); return this }, t.DataBuffer.prototype.putSignedInt = function (e, t) { return this.accommodate(t / 8), e < 0 && (e += 2 << t - 1), this.putInt(e, t) }, t.DataBuffer.prototype.getByte = function () { return this.data.getInt8(this.read++) }, t.DataBuffer.prototype.getInt16 = function () { var e = this.data.getInt16(this.read); return this.read += 2, e }, t.DataBuffer.prototype.getInt24 = function () { var e = this.data.getInt16(this.read) << 8 ^ this.data.getInt8(this.read + 2); return this.read += 3, e }, t.DataBuffer.prototype.getInt32 = function () { var e = this.data.getInt32(this.read); return this.read += 4, e }, t.DataBuffer.prototype.getInt16Le = function () { var e = this.data.getInt16(this.read, !0); return this.read += 2, e }, t.DataBuffer.prototype.getInt24Le = function () { var e = this.data.getInt8(this.read) ^ this.data.getInt16(this.read + 1, !0) << 8; return this.read += 3, e }, t.DataBuffer.prototype.getInt32Le = function () { var e = this.data.getInt32(this.read, !0); return this.read += 4, e }, t.DataBuffer.prototype.getInt = function (e) { var t = 0; do t = (t << 8) + this.data.getInt8(this.read++), e -= 8; while (e > 0); return t }, t.DataBuffer.prototype.getSignedInt = function (e) { var t = this.getInt(e), n = 2 << e - 2; return t >= n && (t -= n << 1), t }, t.DataBuffer.prototype.getBytes = function (e) { var t; return e ? (e = Math.min(this.length(), e), t = this.data.slice(this.read, this.read + e), this.read += e) : e === 0 ? t = "" : (t = this.read === 0 ? this.data : this.data.slice(this.read), this.clear()), t }, t.DataBuffer.prototype.bytes = function (e) { return typeof e == "undefined" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + e) }, t.DataBuffer.prototype.at = function (e) { return this.data.getUint8(this.read + e) }, t.DataBuffer.prototype.setAt = function (e, t) { return this.data.setUint8(e, t), this }, t.DataBuffer.prototype.last = function () { return this.data.getUint8(this.write - 1) }, t.DataBuffer.prototype.copy = function () { return new t.DataBuffer(this) }, t.DataBuffer.prototype.compact = function () { if (this.read > 0) { var e = new Uint8Array(this.data.buffer, this.read), t = new Uint8Array(e.byteLength); t.set(e), this.data = new DataView(t), this.write -= this.read, this.read = 0 } return this }, t.DataBuffer.prototype.clear = function () { return this.data = new DataView(new ArrayBuffer(0)), this.read = this.write = 0, this }, t.DataBuffer.prototype.truncate = function (e) { return this.write = Math.max(0, this.length() - e), this.read = Math.min(this.read, this.write), this }, t.DataBuffer.prototype.toHex = function () { var e = ""; for (var t = this.read; t < this.data.byteLength; ++t) { var n = this.data.getUint8(t); n < 16 && (e += "0"), e += n.toString(16) } return e }, t.DataBuffer.prototype.toString = function (e) { var n = new Uint8Array(this.data, this.read, this.length()); e = e || "utf8"; if (e === "binary" || e === "raw") return t.binary.raw.encode(n); if (e === "hex") return t.binary.hex.encode(n); if (e === "base64") return t.binary.base64.encode(n); if (e === "utf8") return t.text.utf8.decode(n); if (e === "utf16") return t.text.utf16.decode(n); throw new Error("Invalid encoding: " + e) }, t.createBuffer = function (e, n) { return n = n || "raw", e !== undefined && n === "utf8" && (e = t.encodeUtf8(e)), new t.ByteBuffer(e) }, t.fillString = function (e, t) { var n = ""; while (t > 0) t & 1 && (n += e), t >>>= 1, t > 0 && (e += e); return n }, t.xorBytes = function (e, t, n) { var r = "", i = "", s = "", o = 0, u = 0; for (; n > 0; --n, ++o)i = e.charCodeAt(o) ^ t.charCodeAt(o), u >= 10 && (r += s, s = "", u = 0), s += String.fromCharCode(i), ++u; return r += s, r }, t.hexToBytes = function (e) { var t = "", n = 0; e.length & !0 && (n = 1, t += String.fromCharCode(parseInt(e[0], 16))); for (; n < e.length; n += 2)t += String.fromCharCode(parseInt(e.substr(n, 2), 16)); return t }, t.bytesToHex = function (e) { return t.createBuffer(e).toHex() }, t.int32ToBytes = function (e) { return String.fromCharCode(e >> 24 & 255) + String.fromCharCode(e >> 16 & 255) + String.fromCharCode(e >> 8 & 255) + String.fromCharCode(e & 255) }; var s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", o = [62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]; t.encode64 = function (e, t) { var n = "", r = "", i, o, u, a = 0; while (a < e.length) i = e.charCodeAt(a++), o = e.charCodeAt(a++), u = e.charCodeAt(a++), n += s.charAt(i >> 2), n += s.charAt((i & 3) << 4 | o >> 4), isNaN(o) ? n += "==" : (n += s.charAt((o & 15) << 2 | u >> 6), n += isNaN(u) ? "=" : s.charAt(u & 63)), t && n.length > t && (r += n.substr(0, t) + "\r\n", n = n.substr(t)); return r += n, r }, t.decode64 = function (e) { e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); var t = "", n, r, i, s, u = 0; while (u < e.length) n = o[e.charCodeAt(u++) - 43], r = o[e.charCodeAt(u++) - 43], i = o[e.charCodeAt(u++) - 43], s = o[e.charCodeAt(u++) - 43], t += String.fromCharCode(n << 2 | r >> 4), i !== 64 && (t += String.fromCharCode((r & 15) << 4 | i >> 2), s !== 64 && (t += String.fromCharCode((i & 3) << 6 | s))); return t }, t.encodeUtf8 = function (e) { return unescape(encodeURIComponent(e)) }, t.decodeUtf8 = function (e) { return decodeURIComponent(escape(e)) }, t.binary = { raw: {}, hex: {}, base64: {} }, t.binary.raw.encode = function (e) { return String.fromCharCode.apply(null, e) }, t.binary.raw.decode = function (e, t, n) { var r = t; r || (r = new Uint8Array(e.length)), n = n || 0; var i = n; for (var s = 0; s < e.length; ++s)r[i++] = e.charCodeAt(s); return t ? i - n : r }, t.binary.hex.encode = t.bytesToHex, t.binary.hex.decode = function (e, t, n) { var r = t; r || (r = new Uint8Array(Math.ceil(e.length / 2))), n = n || 0; var i = 0, s = n; e.length & 1 && (i = 1, r[s++] = parseInt(e[0], 16)); for (; i < e.length; i += 2)r[s++] = parseInt(e.substr(i, 2), 16); return t ? s - n : r }, t.binary.base64.encode = function (e, t) { var n = "", r = "", i, o, u, a = 0; while (a < e.byteLength) i = e[a++], o = e[a++], u = e[a++], n += s.charAt(i >> 2), n += s.charAt((i & 3) << 4 | o >> 4), isNaN(o) ? n += "==" : (n += s.charAt((o & 15) << 2 | u >> 6), n += isNaN(u) ? "=" : s.charAt(u & 63)), t && n.length > t && (r += n.substr(0, t) + "\r\n", n = n.substr(t)); return r += n, r }, t.binary.base64.decode = function (e, t, n) { var r = t; r || (r = new Uint8Array(Math.ceil(e.length / 4) * 3)), e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""), n = n || 0; var i, s, u, a, f = 0, l = n; while (f < e.length) i = o[e.charCodeAt(f++) - 43], s = o[e.charCodeAt(f++) - 43], u = o[e.charCodeAt(f++) - 43], a = o[e.charCodeAt(f++) - 43], r[l++] = i << 2 | s >> 4, u !== 64 && (r[l++] = (s & 15) << 4 | u >> 2, a !== 64 && (r[l++] = (u & 3) << 6 | a)); return t ? l - n : r.subarray(0, l) }, t.text = { utf8: {}, utf16: {} }, t.text.utf8.encode = function (e, n, r) { e = t.encodeUtf8(e); var i = n; i || (i = new Uint8Array(e.length)), r = r || 0; var s = r; for (var o = 0; o < e.length; ++o)i[s++] = e.charCodeAt(o); return n ? s - r : i }, t.text.utf8.decode = function (e) { return t.decodeUtf8(String.fromCharCode.apply(null, e)) }, t.text.utf16.encode = function (e, t, n) { var r = t; r || (r = new Uint8Array(e.length * 2)); var i = new Uint16Array(r.buffer); n = n || 0; var s = n, o = n; for (var u = 0; u < e.length; ++u)i[o++] = e.charCodeAt(u), s += 2; return t ? s - n : r }, t.text.utf16.decode = function (e) { return String.fromCharCode.apply(null, new Uint16Array(e.buffer)) }, t.deflate = function (e, n, r) { n = t.decode64(e.deflate(t.encode64(n)).rval); if (r) { var i = 2, s = n.charCodeAt(1); s & 32 && (i = 6), n = n.substring(i, n.length - 4) } return n }, t.inflate = function (e, n, r) { var i = e.inflate(t.encode64(n)).rval; return i === null ? null : t.decode64(i) }; var u = function (e, n, r) { if (!e) throw new Error("WebStorage not available."); var i; r === null ? i = e.removeItem(n) : (r = t.encode64(JSON.stringify(r)), i = e.setItem(n, r)); if (typeof i != "undefined" && i.rval !== !0) { var s = new Error(i.error.message); throw s.id = i.error.id, s.name = i.error.name, s } }, a = function (e, n) { if (!e) throw new Error("WebStorage not available."); var r = e.getItem(n); if (e.init) if (r.rval === null) { if (r.error) { var i = new Error(r.error.message); throw i.id = r.error.id, i.name = r.error.name, i } r = null } else r = r.rval; return r !== null && (r = JSON.parse(t.decode64(r))), r }, f = function (e, t, n, r) { var i = a(e, t); i === null && (i = {}), i[n] = r, u(e, t, i) }, l = function (e, t, n) { var r = a(e, t); return r !== null && (r = n in r ? r[n] : null), r }, c = function (e, t, n) { var r = a(e, t); if (r !== null && n in r) { delete r[n]; var i = !0; for (var s in r) { i = !1; break } i && (r = null), u(e, t, r) } }, h = function (e, t) { u(e, t, null) }, p = function (e, t, n) { var r = null; typeof n == "undefined" && (n = ["web", "flash"]); var i, s = !1, o = null; for (var u in n) { i = n[u]; try { if (i === "flash" || i === "both") { if (t[0] === null) throw new Error("Flash local storage not available."); r = e.apply(this, t), s = i === "flash" } if (i === "web" || i === "both") t[0] = localStorage, r = e.apply(this, t), s = !0 } catch (a) { o = a } if (s) break } if (!s) throw o; return r }; t.setItem = function (e, t, n, r, i) { p(f, arguments, i) }, t.getItem = function (e, t, n, r) { return p(l, arguments, r) }, t.removeItem = function (e, t, n, r) { p(c, arguments, r) }, t.clearItems = function (e, t, n) { p(h, arguments, n) }, t.parseUrl = function (e) { var t = /^(https?):\/\/([^:&^\/]*):?(\d*)(.*)$/g; t.lastIndex = 0; var n = t.exec(e), r = n === null ? null : { full: e, scheme: n[1], host: n[2], port: n[3], path: n[4] }; return r && (r.fullHost = r.host, r.port ? r.port !== 80 && r.scheme === "http" ? r.fullHost += ":" + r.port : r.port !== 443 && r.scheme === "https" && (r.fullHost += ":" + r.port) : r.scheme === "http" ? r.port = 80 : r.scheme === "https" && (r.port = 443), r.full = r.scheme + "://" + r.fullHost), r }; var d = null; t.getQueryVariables = function (e) { var t = function (e) { var t = {}, n = e.split("&"); for (var r = 0; r < n.length; r++) { var i = n[r].indexOf("="), s, o; i > 0 ? (s = n[r].substring(0, i), o = n[r].substring(i + 1)) : (s = n[r], o = null), s in t || (t[s] = []), !(s in Object.prototype) && o !== null && t[s].push(unescape(o)) } return t }, n; return typeof e == "undefined" ? (d === null && (typeof window != "undefined" && window.location && window.location.search ? d = t(window.location.search.substring(1)) : d = {}), n = d) : n = t(e), n }, t.parseFragment = function (e) { var n = e, r = "", i = e.indexOf("?"); i > 0 && (n = e.substring(0, i), r = e.substring(i + 1)); var s = n.split("/"); s.length > 0 && s[0] === "" && s.shift(); var o = r === "" ? {} : t.getQueryVariables(r); return { pathString: n, queryString: r, path: s, query: o } }, t.makeRequest = function (e) { var n = t.parseFragment(e), r = { path: n.pathString, query: n.queryString, getPath: function (e) { return typeof e == "undefined" ? n.path : n.path[e] }, getQuery: function (e, t) { var r; return typeof e == "undefined" ? r = n.query : (r = n.query[e], r && typeof t != "undefined" && (r = r[t])), r }, getQueryLast: function (e, t) { var n, i = r.getQuery(e); return i ? n = i[i.length - 1] : n = t, n } }; return r }, t.makeLink = function (e, t, n) { e = jQuery.isArray(e) ? e.join("/") : e; var r = jQuery.param(t || {}); return n = n || "", e + (r.length > 0 ? "?" + r : "") + (n.length > 0 ? "#" + n : "") }, t.setPath = function (e, t, n) { if (typeof e == "object" && e !== null) { var r = 0, i = t.length; while (r < i) { var s = t[r++]; if (r == i) e[s] = n; else { var o = s in e; if (!o || o && typeof e[s] != "object" || o && e[s] === null) e[s] = {}; e = e[s] } } } }, t.getPath = function (e, t, n) { var r = 0, i = t.length, s = !0; while (s && r < i && typeof e == "object" && e !== null) { var o = t[r++]; s = o in e, s && (e = e[o]) } return s ? e : n }, t.deletePath = function (e, t) { if (typeof e == "object" && e !== null) { var n = 0, r = t.length; while (n < r) { var i = t[n++]; if (n == r) delete e[i]; else { if (!(i in e && typeof e[i] == "object" && e[i] !== null)) break; e = e[i] } } } }, t.isEmpty = function (e) { for (var t in e) if (e.hasOwnProperty(t)) return !1; return !0 }, t.format = function (e) { var t = /%./g, n, r, i = 0, s = [], o = 0; while (n = t.exec(e)) { r = e.substring(o, t.lastIndex - 2), r.length > 0 && s.push(r), o = t.lastIndex; var u = n[0][1]; switch (u) { case "s": case "o": i < arguments.length ? s.push(arguments[i++ + 1]) : s.push("<?>"); break; case "%": s.push("%"); break; default: s.push("<%" + u + "?>") } } return s.push(e.substring(o)), s.join("") }, t.formatNumber = function (e, t, n, r) { var i = e, s = isNaN(t = Math.abs(t)) ? 2 : t, o = n === undefined ? "," : n, u = r === undefined ? "." : r, a = i < 0 ? "-" : "", f = parseInt(i = Math.abs(+i || 0).toFixed(s), 10) + "", l = f.length > 3 ? f.length % 3 : 0; return a + (l ? f.substr(0, l) + u : "") + f.substr(l).replace(/(\d{3})(?=\d)/g, "$1" + u) + (s ? o + Math.abs(i - f).toFixed(s).slice(2) : "") }, t.formatSize = function (e) { return e >= 1073741824 ? e = t.formatNumber(e / 1073741824, 2, ".", "") + " GiB" : e >= 1048576 ? e = t.formatNumber(e / 1048576, 2, ".", "") + " MiB" : e >= 1024 ? e = t.formatNumber(e / 1024, 0) + " KiB" : e = t.formatNumber(e, 0) + " bytes", e }, t.bytesFromIP = function (e) { return e.indexOf(".") !== -1 ? t.bytesFromIPv4(e) : e.indexOf(":") !== -1 ? t.bytesFromIPv6(e) : null }, t.bytesFromIPv4 = function (e) { e = e.split("."); if (e.length !== 4) return null; var n = t.createBuffer(); for (var r = 0; r < e.length; ++r) { var i = parseInt(e[r], 10); if (isNaN(i)) return null; n.putByte(i) } return n.getBytes() }, t.bytesFromIPv6 = function (e) { var n = 0; e = e.split(":").filter(function (e) { return e.length === 0 && ++n, !0 }); var r = (8 - e.length + n) * 2, i = t.createBuffer(); for (var s = 0; s < 8; ++s) { if (!e[s] || e[s].length === 0) { i.fillWithByte(0, r), r = 0; continue } var o = t.hexToBytes(e[s]); o.length < 2 && i.putByte(0), i.putBytes(o) } return i.getBytes() }, t.bytesToIP = function (e) { return e.length === 4 ? t.bytesToIPv4(e) : e.length === 16 ? t.bytesToIPv6(e) : null }, t.bytesToIPv4 = function (e) { if (e.length !== 4) return null; var t = []; for (var n = 0; n < e.length; ++n)t.push(e.charCodeAt(n)); return t.join(".") }, t.bytesToIPv6 = function (e) { if (e.length !== 16) return null; var n = [], r = [], i = 0; for (var s = 0; s < e.length; s += 2) { var o = t.bytesToHex(e[s] + e[s + 1]); while (o[0] === "0" && o !== "0") o = o.substr(1); if (o === "0") { var u = r[r.length - 1], a = n.length; !u || a !== u.end + 1 ? r.push({ start: a, end: a }) : (u.end = a, u.end - u.start > r[i].end - r[i].start && (i = r.length - 1)) } n.push(o) } if (r.length > 0) { var f = r[i]; f.end - f.start > 0 && (n.splice(f.start, f.end - f.start + 1, ""), f.start === 0 && n.unshift(""), f.end === 7 && n.push("")) } return n.join(":") }, t.estimateCores = function (e, n) { function i(e, u, a) { if (u === 0) { var f = Math.floor(e.reduce(function (e, t) { return e + t }, 0) / e.length); return t.cores = Math.max(1, f), URL.revokeObjectURL(r), n(null, t.cores) } s(a, function (t, n) { e.push(o(a, n)), i(e, u - 1, a) }) } function s(e, t) { var n = [], i = []; for (var s = 0; s < e; ++s) { var o = new Worker(r); o.addEventListener("message", function (r) { i.push(r.data); if (i.length === e) { for (var s = 0; s < e; ++s)n[s].terminate(); t(null, i) } }), n.push(o) } for (var s = 0; s < e; ++s)n[s].postMessage(s) } function o(e, t) { var n = []; for (var r = 0; r < e; ++r) { var i = t[r], s = n[r] = []; for (var o = 0; o < e; ++o) { if (r === o) continue; var u = t[o]; (i.st > u.st && i.st < u.et || u.st > i.st && u.st < i.et) && s.push(o) } } return n.reduce(function (e, t) { return Math.max(e, t.length) }, 0) } typeof e == "function" && (n = e, e = {}), e = e || {}; if ("cores" in t && !e.update) return n(null, t.cores); if (typeof navigator != "undefined" && "hardwareConcurrency" in navigator && navigator.hardwareConcurrency > 0) return t.cores = navigator.hardwareConcurrency, n(null, t.cores); if (typeof Worker == "undefined") return t.cores = 1, n(null, t.cores); if (typeof Blob == "undefined") return t.cores = 2, n(null, t.cores); var r = URL.createObjectURL(new Blob(["(", function () { self.addEventListener("message", function (e) { var t = Date.now(), n = t + 4; while (Date.now() < n); self.postMessage({ st: t, et: n }) }) }.toString(), ")()"], { type: "application/javascript" })); i([], 5, 16) } } var r = "util"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/util", ["require", "module"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { e.cipher = e.cipher || {}, e.cipher.algorithms = e.cipher.algorithms || {}, e.cipher.createCipher = function (t, n) { var r = t; typeof r == "string" && (r = e.cipher.getAlgorithm(r), r && (r = r())); if (!r) throw new Error("Unsupported algorithm: " + t); return new e.cipher.BlockCipher({ algorithm: r, key: n, decrypt: !1 }) }, e.cipher.createDecipher = function (t, n) { var r = t; typeof r == "string" && (r = e.cipher.getAlgorithm(r), r && (r = r())); if (!r) throw new Error("Unsupported algorithm: " + t); return new e.cipher.BlockCipher({ algorithm: r, key: n, decrypt: !0 }) }, e.cipher.registerAlgorithm = function (t, n) { t = t.toUpperCase(), e.cipher.algorithms[t] = n }, e.cipher.getAlgorithm = function (t) { return t = t.toUpperCase(), t in e.cipher.algorithms ? e.cipher.algorithms[t] : null }; var t = e.cipher.BlockCipher = function (e) { this.algorithm = e.algorithm, this.mode = this.algorithm.mode, this.blockSize = this.mode.blockSize, this._finish = !1, this._input = null, this.output = null, this._op = e.decrypt ? this.mode.decrypt : this.mode.encrypt, this._decrypt = e.decrypt, this.algorithm.initialize(e) }; t.prototype.start = function (t) { t = t || {}; var n = {}; for (var r in t) n[r] = t[r]; n.decrypt = this._decrypt, this._finish = !1, this._input = e.util.createBuffer(), this.output = t.output || e.util.createBuffer(), this.mode.start(n) }, t.prototype.update = function (e) { e && this._input.putBuffer(e); while (!this._op.call(this.mode, this._input, this.output, this._finish) && !this._finish); this._input.compact() }, t.prototype.finish = function (e) { e && (this.mode.name === "ECB" || this.mode.name === "CBC") && (this.mode.pad = function (t) { return e(this.blockSize, t, !1) }, this.mode.unpad = function (t) { return e(this.blockSize, t, !0) }); var t = {}; return t.decrypt = this._decrypt, t.overflow = this._input.length() % this.blockSize, !this._decrypt && this.mode.pad && !this.mode.pad(this._input, t) ? !1 : (this._finish = !0, this.update(), this._decrypt && this.mode.unpad && !this.mode.unpad(this.output, t) ? !1 : this.mode.afterFinish && !this.mode.afterFinish(this.output, t) ? !1 : !0) } } var r = "cipher"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/cipher", ["require", "module", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function n(t) { typeof t == "string" && (t = e.util.createBuffer(t)); if (e.util.isArray(t) && t.length > 4) { var n = t; t = e.util.createBuffer(); for (var r = 0; r < n.length; ++r)t.putByte(n[r]) } return e.util.isArray(t) || (t = [t.getInt32(), t.getInt32(), t.getInt32(), t.getInt32()]), t } function r(e) { e[e.length - 1] = e[e.length - 1] + 1 & 4294967295 } function i(e) { return [e / 4294967296 | 0, e & 4294967295] } e.cipher = e.cipher || {}; var t = e.cipher.modes = e.cipher.modes || {}; t.ecb = function (e) { e = e || {}, this.name = "ECB", this.cipher = e.cipher, this.blockSize = e.blockSize || 16, this._ints = this.blockSize / 4, this._inBlock = new Array(this._ints), this._outBlock = new Array(this._ints) }, t.ecb.prototype.start = function (e) { }, t.ecb.prototype.encrypt = function (e, t, n) { if (e.length() < this.blockSize && !(n && e.length() > 0)) return !0; for (var r = 0; r < this._ints; ++r)this._inBlock[r] = e.getInt32(); this.cipher.encrypt(this._inBlock, this._outBlock); for (var r = 0; r < this._ints; ++r)t.putInt32(this._outBlock[r]) }, t.ecb.prototype.decrypt = function (e, t, n) { if (e.length() < this.blockSize && !(n && e.length() > 0)) return !0; for (var r = 0; r < this._ints; ++r)this._inBlock[r] = e.getInt32(); this.cipher.decrypt(this._inBlock, this._outBlock); for (var r = 0; r < this._ints; ++r)t.putInt32(this._outBlock[r]) }, t.ecb.prototype.pad = function (e, t) { var n = e.length() === this.blockSize ? this.blockSize : this.blockSize - e.length(); return e.fillWithByte(n, n), !0 }, t.ecb.prototype.unpad = function (e, t) { if (t.overflow > 0) return !1; var n = e.length(), r = e.at(n - 1); return r > this.blockSize << 2 ? !1 : (e.truncate(r), !0) }, t.cbc = function (e) { e = e || {}, this.name = "CBC", this.cipher = e.cipher, this.blockSize = e.blockSize || 16, this._ints = this.blockSize / 4, this._inBlock = new Array(this._ints), this._outBlock = new Array(this._ints) }, t.cbc.prototype.start = function (e) { if (e.iv === null) { if (!this._prev) throw new Error("Invalid IV parameter."); this._iv = this._prev.slice(0) } else { if (!("iv" in e)) throw new Error("Invalid IV parameter."); this._iv = n(e.iv), this._prev = this._iv.slice(0) } }, t.cbc.prototype.encrypt = function (e, t, n) { if (e.length() < this.blockSize && !(n && e.length() > 0)) return !0; for (var r = 0; r < this._ints; ++r)this._inBlock[r] = this._prev[r] ^ e.getInt32(); this.cipher.encrypt(this._inBlock, this._outBlock); for (var r = 0; r < this._ints; ++r)t.putInt32(this._outBlock[r]); this._prev = this._outBlock }, t.cbc.prototype.decrypt = function (e, t, n) { if (e.length() < this.blockSize && !(n && e.length() > 0)) return !0; for (var r = 0; r < this._ints; ++r)this._inBlock[r] = e.getInt32(); this.cipher.decrypt(this._inBlock, this._outBlock); for (var r = 0; r < this._ints; ++r)t.putInt32(this._prev[r] ^ this._outBlock[r]); this._prev = this._inBlock.slice(0) }, t.cbc.prototype.pad = function (e, t) { var n = e.length() === this.blockSize ? this.blockSize : this.blockSize - e.length(); return e.fillWithByte(n, n), !0 }, t.cbc.prototype.unpad = function (e, t) { if (t.overflow > 0) return !1; var n = e.length(), r = e.at(n - 1); return r > this.blockSize << 2 ? !1 : (e.truncate(r), !0) }, t.cfb = function (t) { t = t || {}, this.name = "CFB", this.cipher = t.cipher, this.blockSize = t.blockSize || 16, this._ints = this.blockSize / 4, this._inBlock = null, this._outBlock = new Array(this._ints), this._partialBlock = new Array(this._ints), this._partialOutput = e.util.createBuffer(), this._partialBytes = 0 }, t.cfb.prototype.start = function (e) { if (!("iv" in e)) throw new Error("Invalid IV parameter."); this._iv = n(e.iv), this._inBlock = this._iv.slice(0), this._partialBytes = 0 }, t.cfb.prototype.encrypt = function (e, t, n) { var r = e.length(); if (r === 0) return !0; this.cipher.encrypt(this._inBlock, this._outBlock); if (this._partialBytes === 0 && r >= this.blockSize) { for (var i = 0; i < this._ints; ++i)this._inBlock[i] = e.getInt32() ^ this._outBlock[i], t.putInt32(this._inBlock[i]); return } var s = (this.blockSize - r) % this.blockSize; s > 0 && (s = this.blockSize - s), this._partialOutput.clear(); for (var i = 0; i < this._ints; ++i)this._partialBlock[i] = e.getInt32() ^ this._outBlock[i], this._partialOutput.putInt32(this._partialBlock[i]); if (s > 0) e.read -= this.blockSize; else for (var i = 0; i < this._ints; ++i)this._inBlock[i] = this._partialBlock[i]; this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes); if (s > 0 && !n) return t.putBytes(this._partialOutput.getBytes(s - this._partialBytes)), this._partialBytes = s, !0; t.putBytes(this._partialOutput.getBytes(r - this._partialBytes)), this._partialBytes = 0 }, t.cfb.prototype.decrypt = function (e, t, n) { var r = e.length(); if (r === 0) return !0; this.cipher.encrypt(this._inBlock, this._outBlock); if (this._partialBytes === 0 && r >= this.blockSize) { for (var i = 0; i < this._ints; ++i)this._inBlock[i] = e.getInt32(), t.putInt32(this._inBlock[i] ^ this._outBlock[i]); return } var s = (this.blockSize - r) % this.blockSize; s > 0 && (s = this.blockSize - s), this._partialOutput.clear(); for (var i = 0; i < this._ints; ++i)this._partialBlock[i] = e.getInt32(), this._partialOutput.putInt32(this._partialBlock[i] ^ this._outBlock[i]); if (s > 0) e.read -= this.blockSize; else for (var i = 0; i < this._ints; ++i)this._inBlock[i] = this._partialBlock[i]; this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes); if (s > 0 && !n) return t.putBytes(this._partialOutput.getBytes(s - this._partialBytes)), this._partialBytes = s, !0; t.putBytes(this._partialOutput.getBytes(r - this._partialBytes)), this._partialBytes = 0 }, t.ofb = function (t) { t = t || {}, this.name = "OFB", this.cipher = t.cipher, this.blockSize = t.blockSize || 16, this._ints = this.blockSize / 4, this._inBlock = null, this._outBlock = new Array(this._ints), this._partialOutput = e.util.createBuffer(), this._partialBytes = 0 }, t.ofb.prototype.start = function (e) { if (!("iv" in e)) throw new Error("Invalid IV parameter."); this._iv = n(e.iv), this._inBlock = this._iv.slice(0), this._partialBytes = 0 }, t.ofb.prototype.encrypt = function (e, t, n) { var r = e.length(); if (e.length() === 0) return !0; this.cipher.encrypt(this._inBlock, this._outBlock); if (this._partialBytes === 0 && r >= this.blockSize) { for (var i = 0; i < this._ints; ++i)t.putInt32(e.getInt32() ^ this._outBlock[i]), this._inBlock[i] = this._outBlock[i]; return } var s = (this.blockSize - r) % this.blockSize; s > 0 && (s = this.blockSize - s), this._partialOutput.clear(); for (var i = 0; i < this._ints; ++i)this._partialOutput.putInt32(e.getInt32() ^ this._outBlock[i]); if (s > 0) e.read -= this.blockSize; else for (var i = 0; i < this._ints; ++i)this._inBlock[i] = this._outBlock[i]; this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes); if (s > 0 && !n) return t.putBytes(this._partialOutput.getBytes(s - this._partialBytes)), this._partialBytes = s, !0; t.putBytes(this._partialOutput.getBytes(r - this._partialBytes)), this._partialBytes = 0 }, t.ofb.prototype.decrypt = t.ofb.prototype.encrypt, t.ctr = function (t) { t = t || {}, this.name = "CTR", this.cipher = t.cipher, this.blockSize = t.blockSize || 16, this._ints = this.blockSize / 4, this._inBlock = null, this._outBlock = new Array(this._ints), this._partialOutput = e.util.createBuffer(), this._partialBytes = 0 }, t.ctr.prototype.start = function (e) { if (!("iv" in e)) throw new Error("Invalid IV parameter."); this._iv = n(e.iv), this._inBlock = this._iv.slice(0), this._partialBytes = 0 }, t.ctr.prototype.encrypt = function (e, t, n) { var i = e.length(); if (i === 0) return !0; this.cipher.encrypt(this._inBlock, this._outBlock); if (this._partialBytes === 0 && i >= this.blockSize) for (var s = 0; s < this._ints; ++s)t.putInt32(e.getInt32() ^ this._outBlock[s]); else { var o = (this.blockSize - i) % this.blockSize; o > 0 && (o = this.blockSize - o), this._partialOutput.clear(); for (var s = 0; s < this._ints; ++s)this._partialOutput.putInt32(e.getInt32() ^ this._outBlock[s]); o > 0 && (e.read -= this.blockSize), this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes); if (o > 0 && !n) return t.putBytes(this._partialOutput.getBytes(o - this._partialBytes)), this._partialBytes = o, !0; t.putBytes(this._partialOutput.getBytes(i - this._partialBytes)), this._partialBytes = 0 } r(this._inBlock) }, t.ctr.prototype.decrypt = t.ctr.prototype.encrypt, t.gcm = function (t) { t = t || {}, this.name = "GCM", this.cipher = t.cipher, this.blockSize = t.blockSize || 16, this._ints = this.blockSize / 4, this._inBlock = new Array(this._ints), this._outBlock = new Array(this._ints), this._partialOutput = e.util.createBuffer(), this._partialBytes = 0, this._R = 3774873600 }, t.gcm.prototype.start = function (t) { if (!("iv" in t)) throw new Error("Invalid IV parameter."); var n = e.util.createBuffer(t.iv); this._cipherLength = 0; var s; "additionalData" in t ? s = e.util.createBuffer(t.additionalData) : s = e.util.createBuffer(), "tagLength" in t ? this._tagLength = t.tagLength : this._tagLength = 128, this._tag = null; if (t.decrypt) { this._tag = e.util.createBuffer(t.tag).getBytes(); if (this._tag.length !== this._tagLength / 8) throw new Error("Authentication tag does not match tag length.") } this._hashBlock = new Array(this._ints), this.tag = null, this._hashSubkey = new Array(this._ints), this.cipher.encrypt([0, 0, 0, 0], this._hashSubkey), this.componentBits = 4, this._m = this.generateHashTable(this._hashSubkey, this.componentBits); var o = n.length(); if (o === 12) this._j0 = [n.getInt32(), n.getInt32(), n.getInt32(), 1]; else { this._j0 = [0, 0, 0, 0]; while (n.length() > 0) this._j0 = this.ghash(this._hashSubkey, this._j0, [n.getInt32(), n.getInt32(), n.getInt32(), n.getInt32()]); this._j0 = this.ghash(this._hashSubkey, this._j0, [0, 0].concat(i(o * 8))) } this._inBlock = this._j0.slice(0), r(this._inBlock), this._partialBytes = 0, s = e.util.createBuffer(s), this._aDataLength = i(s.length() * 8); var u = s.length() % this.blockSize; u && s.fillWithByte(0, this.blockSize - u), this._s = [0, 0, 0, 0]; while (s.length() > 0) this._s = this.ghash(this._hashSubkey, this._s, [s.getInt32(), s.getInt32(), s.getInt32(), s.getInt32()]) }, t.gcm.prototype.encrypt = function (e, t, n) { var i = e.length(); if (i === 0) return !0; this.cipher.encrypt(this._inBlock, this._outBlock); if (this._partialBytes === 0 && i >= this.blockSize) { for (var s = 0; s < this._ints; ++s)t.putInt32(this._outBlock[s] ^= e.getInt32()); this._cipherLength += this.blockSize } else { var o = (this.blockSize - i) % this.blockSize; o > 0 && (o = this.blockSize - o), this._partialOutput.clear(); for (var s = 0; s < this._ints; ++s)this._partialOutput.putInt32(e.getInt32() ^ this._outBlock[s]); if (o === 0 || n) { if (n) { var u = i % this.blockSize; this._cipherLength += u, this._partialOutput.truncate(this.blockSize - u) } else this._cipherLength += this.blockSize; for (var s = 0; s < this._ints; ++s)this._outBlock[s] = this._partialOutput.getInt32(); this._partialOutput.read -= this.blockSize } this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes); if (o > 0 && !n) return e.read -= this.blockSize, t.putBytes(this._partialOutput.getBytes(o - this._partialBytes)), this._partialBytes = o, !0; t.putBytes(this._partialOutput.getBytes(i - this._partialBytes)), this._partialBytes = 0 } this._s = this.ghash(this._hashSubkey, this._s, this._outBlock), r(this._inBlock) }, t.gcm.prototype.decrypt = function (e, t, n) { var i = e.length(); if (i < this.blockSize && !(n && i > 0)) return !0; this.cipher.encrypt(this._inBlock, this._outBlock), r(this._inBlock), this._hashBlock[0] = e.getInt32(), this._hashBlock[1] = e.getInt32(), this._hashBlock[2] = e.getInt32(), this._hashBlock[3] = e.getInt32(), this._s = this.ghash(this._hashSubkey, this._s, this._hashBlock); for (var s = 0; s < this._ints; ++s)t.putInt32(this._outBlock[s] ^ this._hashBlock[s]); i < this.blockSize ? this._cipherLength += i % this.blockSize : this._cipherLength += this.blockSize }, t.gcm.prototype.afterFinish = function (t, n) { var r = !0; n.decrypt && n.overflow && t.truncate(this.blockSize - n.overflow), this.tag = e.util.createBuffer(); var s = this._aDataLength.concat(i(this._cipherLength * 8)); this._s = this.ghash(this._hashSubkey, this._s, s); var o = []; this.cipher.encrypt(this._j0, o); for (var u = 0; u < this._ints; ++u)this.tag.putInt32(this._s[u] ^ o[u]); return this.tag.truncate(this.tag.length() % (this._tagLength / 8)), n.decrypt && this.tag.bytes() !== this._tag && (r = !1), r }, t.gcm.prototype.multiply = function (e, t) { var n = [0, 0, 0, 0], r = t.slice(0); for (var i = 0; i < 128; ++i) { var s = e[i / 32 | 0] & 1 << 31 - i % 32; s && (n[0] ^= r[0], n[1] ^= r[1], n[2] ^= r[2], n[3] ^= r[3]), this.pow(r, r) } return n }, t.gcm.prototype.pow = function (e, t) { var n = e[3] & 1; for (var r = 3; r > 0; --r)t[r] = e[r] >>> 1 | (e[r - 1] & 1) << 31; t[0] = e[0] >>> 1, n && (t[0] ^= this._R) }, t.gcm.prototype.tableMultiply = function (e) { var t = [0, 0, 0, 0]; for (var n = 0; n < 32; ++n) { var r = n / 8 | 0, i = e[r] >>> (7 - n % 8) * 4 & 15, s = this._m[n][i]; t[0] ^= s[0], t[1] ^= s[1], t[2] ^= s[2], t[3] ^= s[3] } return t }, t.gcm.prototype.ghash = function (e, t, n) { return t[0] ^= n[0], t[1] ^= n[1], t[2] ^= n[2], t[3] ^= n[3], this.tableMultiply(t) }, t.gcm.prototype.generateHashTable = function (e, t) { var n = 8 / t, r = 4 * n, i = 16 * n, s = new Array(i); for (var o = 0; o < i; ++o) { var u = [0, 0, 0, 0], a = o / r | 0, f = (r - 1 - o % r) * t; u[a] = 1 << t - 1 << f, s[o] = this.generateSubHashTable(this.multiply(u, e), t) } return s }, t.gcm.prototype.generateSubHashTable = function (e, t) { var n = 1 << t, r = n >>> 1, i = new Array(n); i[r] = e.slice(0); var s = r >>> 1; while (s > 0) this.pow(i[2 * s], i[s] = []), s >>= 1; s = 2; while (s < r) { for (var o = 1; o < s; ++o) { var u = i[s], a = i[o]; i[s + o] = [u[0] ^ a[0], u[1] ^ a[1], u[2] ^ a[2], u[3] ^ a[3]] } s *= 2 } i[0] = [0, 0, 0, 0]; for (s = r + 1; s < n; ++s) { var f = i[s ^ r]; i[s] = [e[0] ^ f[0], e[1] ^ f[1], e[2] ^ f[2], e[3] ^ f[3]] } return i } } var r = "cipherModes"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/cipherModes", ["require", "module", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function t(t, n) { var r = function () { return new e.aes.Algorithm(t, n) }; e.cipher.registerAlgorithm(t, r) } function f() { n = !0, o = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54]; var e = new Array(256); for (var t = 0; t < 128; ++t)e[t] = t << 1, e[t + 128] = t + 128 << 1 ^ 283; i = new Array(256), s = new Array(256), u = new Array(4), a = new Array(4); for (var t = 0; t < 4; ++t)u[t] = new Array(256), a[t] = new Array(256); var r = 0, f = 0, l, c, h, p, d, v, m; for (var t = 0; t < 256; ++t) { p = f ^ f << 1 ^ f << 2 ^ f << 3 ^ f << 4, p = p >> 8 ^ p & 255 ^ 99, i[r] = p, s[p] = r, d = e[p], l = e[r], c = e[l], h = e[c], v = d << 24 ^ p << 16 ^ p << 8 ^ (p ^ d), m = (l ^ c ^ h) << 24 ^ (r ^ h) << 16 ^ (r ^ c ^ h) << 8 ^ (r ^ l ^ h); for (var g = 0; g < 4; ++g)u[g][r] = v, a[g][p] = m, v = v << 24 | v >>> 8, m = m << 24 | m >>> 8; r === 0 ? r = f = 1 : (r = l ^ e[e[e[l ^ h]]], f ^= e[e[f]]) } } function l(e, t) { var n = e.slice(0), s, u = 1, f = n.length, l = f + 6 + 1, c = r * l; for (var h = f; h < c; ++h)s = n[h - 1], h % f === 0 ? (s = i[s >>> 16 & 255] << 24 ^ i[s >>> 8 & 255] << 16 ^ i[s & 255] << 8 ^ i[s >>> 24] ^ o[u] << 24, u++) : f > 6 && h % f === 4 && (s = i[s >>> 24] << 24 ^ i[s >>> 16 & 255] << 16 ^ i[s >>> 8 & 255] << 8 ^ i[s & 255]), n[h] = n[h - f] ^ s; if (t) { var p, d = a[0], v = a[1], m = a[2], g = a[3], y = n.slice(0); c = n.length; for (var h = 0, b = c - r; h < c; h += r, b -= r)if (h === 0 || h === c - r) y[h] = n[b], y[h + 1] = n[b + 3], y[h + 2] = n[b + 2], y[h + 3] = n[b + 1]; else for (var w = 0; w < r; ++w)p = n[b + w], y[h + (3 & -w)] = d[i[p >>> 24]] ^ v[i[p >>> 16 & 255]] ^ m[i[p >>> 8 & 255]] ^ g[i[p & 255]]; n = y } return n } function c(e, t, n, r) { var o = e.length / 4 - 1, f, l, c, h, p; r ? (f = a[0], l = a[1], c = a[2], h = a[3], p = s) : (f = u[0], l = u[1], c = u[2], h = u[3], p = i); var d, v, m, g, y, b, w; d = t[0] ^ e[0], v = t[r ? 3 : 1] ^ e[1], m = t[2] ^ e[2], g = t[r ? 1 : 3] ^ e[3]; var E = 3; for (var S = 1; S < o; ++S)y = f[d >>> 24] ^ l[v >>> 16 & 255] ^ c[m >>> 8 & 255] ^ h[g & 255] ^ e[++E], b = f[v >>> 24] ^ l[m >>> 16 & 255] ^ c[g >>> 8 & 255] ^ h[d & 255] ^ e[++E], w = f[m >>> 24] ^ l[g >>> 16 & 255] ^ c[d >>> 8 & 255] ^ h[v & 255] ^ e[++E], g = f[g >>> 24] ^ l[d >>> 16 & 255] ^ c[v >>> 8 & 255] ^ h[m & 255] ^ e[++E], d = y, v = b, m = w; n[0] = p[d >>> 24] << 24 ^ p[v >>> 16 & 255] << 16 ^ p[m >>> 8 & 255] << 8 ^ p[g & 255] ^ e[++E], n[r ? 3 : 1] = p[v >>> 24] << 24 ^ p[m >>> 16 & 255] << 16 ^ p[g >>> 8 & 255] << 8 ^ p[d & 255] ^ e[++E], n[2] = p[m >>> 24] << 24 ^ p[g >>> 16 & 255] << 16 ^ p[d >>> 8 & 255] << 8 ^ p[v & 255] ^ e[++E], n[r ? 1 : 3] = p[g >>> 24] << 24 ^ p[d >>> 16 & 255] << 16 ^ p[v >>> 8 & 255] << 8 ^ p[m & 255] ^ e[++E] } function h(t) { t = t || {}; var n = (t.mode || "CBC").toUpperCase(), r = "AES-" + n, i; t.decrypt ? i = e.cipher.createDecipher(r, t.key) : i = e.cipher.createCipher(r, t.key); var s = i.start; return i.start = function (t, n) { var r = null; n instanceof e.util.ByteBuffer && (r = n, n = {}), n = n || {}, n.output = r, n.iv = t, s.call(i, n) }, i } e.aes = e.aes || {}, e.aes.startEncrypting = function (e, t, n, r) { var i = h({ key: e, output: n, decrypt: !1, mode: r }); return i.start(t), i }, e.aes.createEncryptionCipher = function (e, t) { return h({ key: e, output: null, decrypt: !1, mode: t }) }, e.aes.startDecrypting = function (e, t, n, r) { var i = h({ key: e, output: n, decrypt: !0, mode: r }); return i.start(t), i }, e.aes.createDecryptionCipher = function (e, t) { return h({ key: e, output: null, decrypt: !0, mode: t }) }, e.aes.Algorithm = function (e, t) { n || f(); var r = this; r.name = e, r.mode = new t({ blockSize: 16, cipher: { encrypt: function (e, t) { return c(r._w, e, t, !1) }, decrypt: function (e, t) { return c(r._w, e, t, !0) } } }), r._init = !1 }, e.aes.Algorithm.prototype.initialize = function (t) { if (this._init) return; var n = t.key, r; if (typeof n != "string" || n.length !== 16 && n.length !== 24 && n.length !== 32) { if (e.util.isArray(n) && (n.length === 16 || n.length === 24 || n.length === 32)) { r = n, n = e.util.createBuffer(); for (var i = 0; i < r.length; ++i)n.putByte(r[i]) } } else n = e.util.createBuffer(n); if (!e.util.isArray(n)) { r = n, n = []; var s = r.length(); if (s === 16 || s === 24 || s === 32) { s >>>= 2; for (var i = 0; i < s; ++i)n.push(r.getInt32()) } } if (!e.util.isArray(n) || n.length !== 4 && n.length !== 6 && n.length !== 8) throw new Error("Invalid key parameter."); var o = this.mode.name, u = ["CFB", "OFB", "CTR", "GCM"].indexOf(o) !== -1; this._w = l(n, t.decrypt && !u), this._init = !0 }, e.aes._expandKey = function (e, t) { return n || f(), l(e, t) }, e.aes._updateBlock = c, t("AES-ECB", e.cipher.modes.ecb), t("AES-CBC", e.cipher.modes.cbc), t("AES-CFB", e.cipher.modes.cfb), t("AES-OFB", e.cipher.modes.ofb), t("AES-CTR", e.cipher.modes.ctr), t("AES-GCM", e.cipher.modes.gcm); var n = !1, r = 4, i, s, o, u, a } var r = "aes"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/aes", ["require", "module", "./cipher", "./cipherModes", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { e.pki = e.pki || {}; var t = e.pki.oids = e.oids = e.oids || {}; t["1.2.840.113549.1.1.1"] = "rsaEncryption", t.rsaEncryption = "1.2.840.113549.1.1.1", t["1.2.840.113549.1.1.4"] = "md5WithRSAEncryption", t.md5WithRSAEncryption = "1.2.840.113549.1.1.4", t["1.2.840.113549.1.1.5"] = "sha1WithRSAEncryption", t.sha1WithRSAEncryption = "1.2.840.113549.1.1.5", t["1.2.840.113549.1.1.7"] = "RSAES-OAEP", t["RSAES-OAEP"] = "1.2.840.113549.1.1.7", t["1.2.840.113549.1.1.8"] = "mgf1", t.mgf1 = "1.2.840.113549.1.1.8", t["1.2.840.113549.1.1.9"] = "pSpecified", t.pSpecified = "1.2.840.113549.1.1.9", t["1.2.840.113549.1.1.10"] = "RSASSA-PSS", t["RSASSA-PSS"] = "1.2.840.113549.1.1.10", t["1.2.840.113549.1.1.11"] = "sha256WithRSAEncryption", t.sha256WithRSAEncryption = "1.2.840.113549.1.1.11", t["1.2.840.113549.1.1.12"] = "sha384WithRSAEncryption", t.sha384WithRSAEncryption = "1.2.840.113549.1.1.12", t["1.2.840.113549.1.1.13"] = "sha512WithRSAEncryption", t.sha512WithRSAEncryption = "1.2.840.113549.1.1.13", t["1.3.14.3.2.7"] = "desCBC", t.desCBC = "1.3.14.3.2.7", t["1.3.14.3.2.26"] = "sha1", t.sha1 = "1.3.14.3.2.26", t["2.16.840.1.101.3.4.2.1"] = "sha256", t.sha256 = "2.16.840.1.101.3.4.2.1", t["2.16.840.1.101.3.4.2.2"] = "sha384", t.sha384 = "2.16.840.1.101.3.4.2.2", t["2.16.840.1.101.3.4.2.3"] = "sha512", t.sha512 = "2.16.840.1.101.3.4.2.3", t["1.2.840.113549.2.5"] = "md5", t.md5 = "1.2.840.113549.2.5", t["1.2.840.113549.1.7.1"] = "data", t.data = "1.2.840.113549.1.7.1", t["1.2.840.113549.1.7.2"] = "signedData", t.signedData = "1.2.840.113549.1.7.2", t["1.2.840.113549.1.7.3"] = "envelopedData", t.envelopedData = "1.2.840.113549.1.7.3", t["1.2.840.113549.1.7.4"] = "signedAndEnvelopedData", t.signedAndEnvelopedData = "1.2.840.113549.1.7.4", t["1.2.840.113549.1.7.5"] = "digestedData", t.digestedData = "1.2.840.113549.1.7.5", t["1.2.840.113549.1.7.6"] = "encryptedData", t.encryptedData = "1.2.840.113549.1.7.6", t["1.2.840.113549.1.9.1"] = "emailAddress", t.emailAddress = "1.2.840.113549.1.9.1", t["1.2.840.113549.1.9.2"] = "unstructuredName", t.unstructuredName = "1.2.840.113549.1.9.2", t["1.2.840.113549.1.9.3"] = "contentType", t.contentType = "1.2.840.113549.1.9.3", t["1.2.840.113549.1.9.4"] = "messageDigest", t.messageDigest = "1.2.840.113549.1.9.4", t["1.2.840.113549.1.9.5"] = "signingTime", t.signingTime = "1.2.840.113549.1.9.5", t["1.2.840.113549.1.9.6"] = "counterSignature", t.counterSignature = "1.2.840.113549.1.9.6", t["1.2.840.113549.1.9.7"] = "challengePassword", t.challengePassword = "1.2.840.113549.1.9.7", t["1.2.840.113549.1.9.8"] = "unstructuredAddress", t.unstructuredAddress = "1.2.840.113549.1.9.8", t["1.2.840.113549.1.9.14"] = "extensionRequest", t.extensionRequest = "1.2.840.113549.1.9.14", t["1.2.840.113549.1.9.20"] = "friendlyName", t.friendlyName = "1.2.840.113549.1.9.20", t["1.2.840.113549.1.9.21"] = "localKeyId", t.localKeyId = "1.2.840.113549.1.9.21", t["1.2.840.113549.1.9.22.1"] = "x509Certificate", t.x509Certificate = "1.2.840.113549.1.9.22.1", t["1.2.840.113549.1.12.10.1.1"] = "keyBag", t.keyBag = "1.2.840.113549.1.12.10.1.1", t["1.2.840.113549.1.12.10.1.2"] = "pkcs8ShroudedKeyBag", t.pkcs8ShroudedKeyBag = "1.2.840.113549.1.12.10.1.2", t["1.2.840.113549.1.12.10.1.3"] = "certBag", t.certBag = "1.2.840.113549.1.12.10.1.3", t["1.2.840.113549.1.12.10.1.4"] = "crlBag", t.crlBag = "1.2.840.113549.1.12.10.1.4", t["1.2.840.113549.1.12.10.1.5"] = "secretBag", t.secretBag = "1.2.840.113549.1.12.10.1.5", t["1.2.840.113549.1.12.10.1.6"] = "safeContentsBag", t.safeContentsBag = "1.2.840.113549.1.12.10.1.6", t["1.2.840.113549.1.5.13"] = "pkcs5PBES2", t.pkcs5PBES2 = "1.2.840.113549.1.5.13", t["1.2.840.113549.1.5.12"] = "pkcs5PBKDF2", t.pkcs5PBKDF2 = "1.2.840.113549.1.5.12", t["1.2.840.113549.1.12.1.1"] = "pbeWithSHAAnd128BitRC4", t.pbeWithSHAAnd128BitRC4 = "1.2.840.113549.1.12.1.1", t["1.2.840.113549.1.12.1.2"] = "pbeWithSHAAnd40BitRC4", t.pbeWithSHAAnd40BitRC4 = "1.2.840.113549.1.12.1.2", t["1.2.840.113549.1.12.1.3"] = "pbeWithSHAAnd3-KeyTripleDES-CBC", t["pbeWithSHAAnd3-KeyTripleDES-CBC"] = "1.2.840.113549.1.12.1.3", t["1.2.840.113549.1.12.1.4"] = "pbeWithSHAAnd2-KeyTripleDES-CBC", t["pbeWithSHAAnd2-KeyTripleDES-CBC"] = "1.2.840.113549.1.12.1.4", t["1.2.840.113549.1.12.1.5"] = "pbeWithSHAAnd128BitRC2-CBC", t["pbeWithSHAAnd128BitRC2-CBC"] = "1.2.840.113549.1.12.1.5", t["1.2.840.113549.1.12.1.6"] = "pbewithSHAAnd40BitRC2-CBC", t["pbewithSHAAnd40BitRC2-CBC"] = "1.2.840.113549.1.12.1.6", t["1.2.840.113549.3.7"] = "des-EDE3-CBC", t["des-EDE3-CBC"] = "1.2.840.113549.3.7", t["2.16.840.1.101.3.4.1.2"] = "aes128-CBC", t["aes128-CBC"] = "2.16.840.1.101.3.4.1.2", t["2.16.840.1.101.3.4.1.22"] = "aes192-CBC", t["aes192-CBC"] = "2.16.840.1.101.3.4.1.22", t["2.16.840.1.101.3.4.1.42"] = "aes256-CBC", t["aes256-CBC"] = "2.16.840.1.101.3.4.1.42", t["2.5.4.3"] = "commonName", t.commonName = "2.5.4.3", t["2.5.4.5"] = "serialName", t.serialName = "2.5.4.5", t["2.5.4.6"] = "countryName", t.countryName = "2.5.4.6", t["2.5.4.7"] = "localityName", t.localityName = "2.5.4.7", t["2.5.4.8"] = "stateOrProvinceName", t.stateOrProvinceName = "2.5.4.8", t["2.5.4.10"] = "organizationName", t.organizationName = "2.5.4.10", t["2.5.4.11"] = "organizationalUnitName", t.organizationalUnitName = "2.5.4.11", t["2.16.840.1.113730.1.1"] = "nsCertType", t.nsCertType = "2.16.840.1.113730.1.1", t["2.5.29.1"] = "authorityKeyIdentifier", t["2.5.29.2"] = "keyAttributes", t["2.5.29.3"] = "certificatePolicies", t["2.5.29.4"] = "keyUsageRestriction", t["2.5.29.5"] = "policyMapping", t["2.5.29.6"] = "subtreesConstraint", t["2.5.29.7"] = "subjectAltName", t["2.5.29.8"] = "issuerAltName", t["2.5.29.9"] = "subjectDirectoryAttributes", t["2.5.29.10"] = "basicConstraints", t["2.5.29.11"] = "nameConstraints", t["2.5.29.12"] = "policyConstraints", t["2.5.29.13"] = "basicConstraints", t["2.5.29.14"] = "subjectKeyIdentifier", t.subjectKeyIdentifier = "2.5.29.14", t["2.5.29.15"] = "keyUsage", t.keyUsage = "2.5.29.15", t["2.5.29.16"] = "privateKeyUsagePeriod", t["2.5.29.17"] = "subjectAltName", t.subjectAltName = "2.5.29.17", t["2.5.29.18"] = "issuerAltName", t.issuerAltName = "2.5.29.18", t["2.5.29.19"] = "basicConstraints", t.basicConstraints = "2.5.29.19", t["2.5.29.20"] = "cRLNumber", t["2.5.29.21"] = "cRLReason", t["2.5.29.22"] = "expirationDate", t["2.5.29.23"] = "instructionCode", t["2.5.29.24"] = "invalidityDate", t["2.5.29.25"] = "cRLDistributionPoints", t["2.5.29.26"] = "issuingDistributionPoint", t["2.5.29.27"] = "deltaCRLIndicator", t["2.5.29.28"] = "issuingDistributionPoint", t["2.5.29.29"] = "certificateIssuer", t["2.5.29.30"] = "nameConstraints", t["2.5.29.31"] = "cRLDistributionPoints", t["2.5.29.32"] = "certificatePolicies", t["2.5.29.33"] = "policyMappings", t["2.5.29.34"] = "policyConstraints", t["2.5.29.35"] = "authorityKeyIdentifier", t.authorityKeyIdentifier = "2.5.29.35", t["2.5.29.36"] = "policyConstraints", t["2.5.29.37"] = "extKeyUsage", t.extKeyUsage = "2.5.29.37", t["2.5.29.46"] = "freshestCRL", t["2.5.29.54"] = "inhibitAnyPolicy", t["1.3.6.1.5.5.7.3.1"] = "serverAuth", t.serverAuth = "1.3.6.1.5.5.7.3.1", t["1.3.6.1.5.5.7.3.2"] = "clientAuth", t.clientAuth = "1.3.6.1.5.5.7.3.2", t["1.3.6.1.5.5.7.3.3"] = "codeSigning", t.codeSigning = "1.3.6.1.5.5.7.3.3", t["1.3.6.1.5.5.7.3.4"] = "emailProtection", t.emailProtection = "1.3.6.1.5.5.7.3.4", t["1.3.6.1.5.5.7.3.8"] = "timeStamping", t.timeStamping = "1.3.6.1.5.5.7.3.8" } var r = "oids"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/oids", ["require", "module"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { var t = e.asn1 = e.asn1 || {}; t.Class = { UNIVERSAL: 0, APPLICATION: 64, CONTEXT_SPECIFIC: 128, PRIVATE: 192 }, t.Type = { NONE: 0, BOOLEAN: 1, INTEGER: 2, BITSTRING: 3, OCTETSTRING: 4, NULL: 5, OID: 6, ODESC: 7, EXTERNAL: 8, REAL: 9, ENUMERATED: 10, EMBEDDED: 11, UTF8: 12, ROID: 13, SEQUENCE: 16, SET: 17, PRINTABLESTRING: 19, IA5STRING: 22, UTCTIME: 23, GENERALIZEDTIME: 24, BMPSTRING: 30 }, t.create = function (t, n, r, i) { if (e.util.isArray(i)) { var s = []; for (var o = 0; o < i.length; ++o)i[o] !== undefined && s.push(i[o]); i = s } return { tagClass: t, type: n, constructed: r, composed: r || e.util.isArray(i), value: i } }; var n = t.getBerValueLength = function (e) { var t = e.getByte(); if (t === 128) return undefined; var n, r = t & 128; return r ? n = e.getInt((t & 127) << 3) : n = t, n }; t.fromDer = function (r, i) { i === undefined && (i = !0), typeof r == "string" && (r = e.util.createBuffer(r)); if (r.length() < 2) { var s = new Error("Too few bytes to parse DER."); throw s.bytes = r.length(), s } var o = r.getByte(), u = o & 192, a = o & 31, f = n(r); if (r.length() < f) { if (i) { var s = new Error("Too few bytes to read ASN.1 value."); throw s.detail = r.length() + " < " + f, s } f = r.length() } var l, c = (o & 32) === 32, h = c; if (!h && u === t.Class.UNIVERSAL && a === t.Type.BITSTRING && f > 1) { var p = r.read, d = r.getByte(); if (d === 0) { o = r.getByte(); var v = o & 192; if (v === t.Class.UNIVERSAL || v === t.Class.CONTEXT_SPECIFIC) try { var m = n(r); h = m === f - (r.read - p), h && (++p, --f) } catch (g) { } } r.read = p } if (h) { l = []; if (f === undefined) for (; ;) { if (r.bytes(2) === String.fromCharCode(0, 0)) { r.getBytes(2); break } l.push(t.fromDer(r, i)) } else { var y = r.length(); while (f > 0) l.push(t.fromDer(r, i)), f -= y - r.length(), y = r.length() } } else { if (f === undefined) { if (i) throw new Error("Non-constructed ASN.1 object of indefinite length."); f = r.length() } if (a === t.Type.BMPSTRING) { l = ""; for (var b = 0; b < f; b += 2)l += String.fromCharCode(r.getInt16()) } else l = r.getBytes(f) } return t.create(u, a, c, l) }, t.toDer = function (n) { var r = e.util.createBuffer(), i = n.tagClass | n.type, s = e.util.createBuffer(); if (n.composed) { n.constructed ? i |= 32 : s.putByte(0); for (var o = 0; o < n.value.length; ++o)n.value[o] !== undefined && s.putBuffer(t.toDer(n.value[o])) } else if (n.type === t.Type.BMPSTRING) for (var o = 0; o < n.value.length; ++o)s.putInt16(n.value.charCodeAt(o)); else s.putBytes(n.value); r.putByte(i); if (s.length() <= 127) r.putByte(s.length() & 127); else { var u = s.length(), a = ""; do a += String.fromCharCode(u & 255), u >>>= 8; while (u > 0); r.putByte(a.length | 128); for (var o = a.length - 1; o >= 0; --o)r.putByte(a.charCodeAt(o)) } return r.putBuffer(s), r }, t.oidToDer = function (t) { var n = t.split("."), r = e.util.createBuffer(); r.putByte(40 * parseInt(n[0], 10) + parseInt(n[1], 10)); var i, s, o, u; for (var a = 2; a < n.length; ++a) { i = !0, s = [], o = parseInt(n[a], 10); do u = o & 127, o >>>= 7, i || (u |= 128), s.push(u), i = !1; while (o > 0); for (var f = s.length - 1; f >= 0; --f)r.putByte(s[f]) } return r }, t.derToOid = function (t) { var n; typeof t == "string" && (t = e.util.createBuffer(t)); var r = t.getByte(); n = Math.floor(r / 40) + "." + r % 40; var i = 0; while (t.length() > 0) r = t.getByte(), i <<= 7, r & 128 ? i += r & 127 : (n += "." + (i + r), i = 0); return n }, t.utcTimeToDate = function (e) { var t = new Date, n = parseInt(e.substr(0, 2), 10); n = n >= 50 ? 1900 + n : 2e3 + n; var r = parseInt(e.substr(2, 2), 10) - 1, i = parseInt(e.substr(4, 2), 10), s = parseInt(e.substr(6, 2), 10), o = parseInt(e.substr(8, 2), 10), u = 0; if (e.length > 11) { var a = e.charAt(10), f = 10; a !== "+" && a !== "-" && (u = parseInt(e.substr(10, 2), 10), f += 2) } t.setUTCFullYear(n, r, i), t.setUTCHours(s, o, u, 0); if (f) { a = e.charAt(f); if (a === "+" || a === "-") { var l = parseInt(e.substr(f + 1, 2), 10), c = parseInt(e.substr(f + 4, 2), 10), h = l * 60 + c; h *= 6e4, a === "+" ? t.setTime(+t - h) : t.setTime(+t + h) } } return t }, t.generalizedTimeToDate = function (e) { var t = new Date, n = parseInt(e.substr(0, 4), 10), r = parseInt(e.substr(4, 2), 10) - 1, i = parseInt(e.substr(6, 2), 10), s = parseInt(e.substr(8, 2), 10), o = parseInt(e.substr(10, 2), 10), u = parseInt(e.substr(12, 2), 10), a = 0, f = 0, l = !1; e.charAt(e.length - 1) === "Z" && (l = !0); var c = e.length - 5, h = e.charAt(c); if (h === "+" || h === "-") { var p = parseInt(e.substr(c + 1, 2), 10), d = parseInt(e.substr(c + 4, 2), 10); f = p * 60 + d, f *= 6e4, h === "+" && (f *= -1), l = !0 } return e.charAt(14) === "." && (a = parseFloat(e.substr(14), 10) * 1e3), l ? (t.setUTCFullYear(n, r, i), t.setUTCHours(s, o, u, a), t.setTime(+t + f)) : (t.setFullYear(n, r, i), t.setHours(s, o, u, a)), t }, t.dateToUtcTime = function (e) { if (typeof e == "string") return e; var t = "", n = []; n.push(("" + e.getUTCFullYear()).substr(2)), n.push("" + (e.getUTCMonth() + 1)), n.push("" + e.getUTCDate()), n.push("" + e.getUTCHours()), n.push("" + e.getUTCMinutes()), n.push("" + e.getUTCSeconds()); for (var r = 0; r < n.length; ++r)n[r].length < 2 && (t += "0"), t += n[r]; return t += "Z", t }, t.dateToGeneralizedTime = function (e) { if (typeof e == "string") return e; var t = "", n = []; n.push("" + e.getUTCFullYear()), n.push("" + (e.getUTCMonth() + 1)), n.push("" + e.getUTCDate()), n.push("" + e.getUTCHours()), n.push("" + e.getUTCMinutes()), n.push("" + e.getUTCSeconds()); for (var r = 0; r < n.length; ++r)n[r].length < 2 && (t += "0"), t += n[r]; return t += "Z", t }, t.integerToDer = function (t) { var n = e.util.createBuffer(); if (t >= -128 && t < 128) return n.putSignedInt(t, 8); if (t >= -32768 && t < 32768) return n.putSignedInt(t, 16); if (t >= -8388608 && t < 8388608) return n.putSignedInt(t, 24); if (t >= -2147483648 && t < 2147483648) return n.putSignedInt(t, 32); var r = new Error("Integer too large; max is 32-bits."); throw r.integer = t, r }, t.derToInteger = function (t) { typeof t == "string" && (t = e.util.createBuffer(t)); var n = t.length() * 8; if (n > 32) throw new Error("Integer too large; max is 32-bits."); return t.getSignedInt(n) }, t.validate = function (n, r, i, s) { var o = !1; if (n.tagClass !== r.tagClass && typeof r.tagClass != "undefined" || n.type !== r.type && typeof r.type != "undefined") s && (n.tagClass !== r.tagClass && s.push("[" + r.name + "] " + 'Expected tag class "' + r.tagClass + '", got "' + n.tagClass + '"'), n.type !== r.type && s.push("[" + r.name + "] " + 'Expected type "' + r.type + '", got "' + n.type + '"')); else if (n.constructed === r.constructed || typeof r.constructed == "undefined") { o = !0; if (r.value && e.util.isArray(r.value)) { var u = 0; for (var a = 0; o && a < r.value.length; ++a)o = r.value[a].optional || !1, n.value[u] && (o = t.validate(n.value[u], r.value[a], i, s), o ? ++u : r.value[a].optional && (o = !0)), !o && s && s.push("[" + r.name + "] " + 'Tag class "' + r.tagClass + '", type "' + r.type + '" expected value length "' + r.value.length + '", got "' + n.value.length + '"') } o && i && (r.capture && (i[r.capture] = n.value), r.captureAsn1 && (i[r.captureAsn1] = n)) } else s && s.push("[" + r.name + "] " + 'Expected constructed "' + r.constructed + '", got "' + n.constructed + '"'); return o }; var r = /[^\\u0000-\\u00ff]/; t.prettyPrint = function (n, i, s) { var o = ""; i = i || 0, s = s || 2, i > 0 && (o += "\n"); var u = ""; for (var a = 0; a < i * s; ++a)u += " "; o += u + "Tag: "; switch (n.tagClass) { case t.Class.UNIVERSAL: o += "Universal:"; break; case t.Class.APPLICATION: o += "Application:"; break; case t.Class.CONTEXT_SPECIFIC: o += "Context-Specific:"; break; case t.Class.PRIVATE: o += "Private:" }if (n.tagClass === t.Class.UNIVERSAL) { o += n.type; switch (n.type) { case t.Type.NONE: o += " (None)"; break; case t.Type.BOOLEAN: o += " (Boolean)"; break; case t.Type.BITSTRING: o += " (Bit string)"; break; case t.Type.INTEGER: o += " (Integer)"; break; case t.Type.OCTETSTRING: o += " (Octet string)"; break; case t.Type.NULL: o += " (Null)"; break; case t.Type.OID: o += " (Object Identifier)"; break; case t.Type.ODESC: o += " (Object Descriptor)"; break; case t.Type.EXTERNAL: o += " (External or Instance of)"; break; case t.Type.REAL: o += " (Real)"; break; case t.Type.ENUMERATED: o += " (Enumerated)"; break; case t.Type.EMBEDDED: o += " (Embedded PDV)"; break; case t.Type.UTF8: o += " (UTF8)"; break; case t.Type.ROID: o += " (Relative Object Identifier)"; break; case t.Type.SEQUENCE: o += " (Sequence)"; break; case t.Type.SET: o += " (Set)"; break; case t.Type.PRINTABLESTRING: o += " (Printable String)"; break; case t.Type.IA5String: o += " (IA5String (ASCII))"; break; case t.Type.UTCTIME: o += " (UTC time)"; break; case t.Type.GENERALIZEDTIME: o += " (Generalized time)"; break; case t.Type.BMPSTRING: o += " (BMP String)" } } else o += n.type; o += "\n", o += u + "Constructed: " + n.constructed + "\n"; if (n.composed) { var f = 0, l = ""; for (var a = 0; a < n.value.length; ++a)n.value[a] !== undefined && (f += 1, l += t.prettyPrint(n.value[a], i + 1, s), a + 1 < n.value.length && (l += ",")); o += u + "Sub values: " + f + l } else { o += u + "Value: "; if (n.type === t.Type.OID) { var c = t.derToOid(n.value); o += c, e.pki && e.pki.oids && c in e.pki.oids && (o += " (" + e.pki.oids[c] + ") ") } if (n.type === t.Type.INTEGER) try { o += t.derToInteger(n.value) } catch (h) { o += "0x" + e.util.bytesToHex(n.value) } else n.type === t.Type.OCTETSTRING ? (r.test(n.value) || (o += "(" + n.value + ") "), o += "0x" + e.util.bytesToHex(n.value)) : n.type === t.Type.UTF8 ? o += e.util.decodeUtf8(n.value) : n.type === t.Type.PRINTABLESTRING || n.type === t.Type.IA5String ? o += n.value : r.test(n.value) ? o += "0x" + e.util.bytesToHex(n.value) : n.value.length === 0 ? o += "[null]" : o += n.value } return o } } var r = "asn1"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/asn1", ["require", "module", "./util", "./oids"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function u() { n = String.fromCharCode(128), n += e.util.fillString(String.fromCharCode(0), 64), r = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1, 6, 11, 0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 5, 8, 11, 14, 1, 4, 7, 10, 13, 0, 3, 6, 9, 12, 15, 2, 0, 7, 14, 5, 12, 3, 10, 1, 8, 15, 6, 13, 4, 11, 2, 9], i = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21], s = new Array(64); for (var t = 0; t < 64; ++t)s[t] = Math.floor(Math.abs(Math.sin(t + 1)) * 4294967296); o = !0 } function a(e, t, n) { var o, u, a, f, l, c, h, p, d = n.length(); while (d >= 64) { u = e.h0, a = e.h1, f = e.h2, l = e.h3; for (p = 0; p < 16; ++p)t[p] = n.getInt32Le(), c = l ^ a & (f ^ l), o = u + c + s[p] + t[p], h = i[p], u = l, l = f, f = a, a += o << h | o >>> 32 - h; for (; p < 32; ++p)c = f ^ l & (a ^ f), o = u + c + s[p] + t[r[p]], h = i[p], u = l, l = f, f = a, a += o << h | o >>> 32 - h; for (; p < 48; ++p)c = a ^ f ^ l, o = u + c + s[p] + t[r[p]], h = i[p], u = l, l = f, f = a, a += o << h | o >>> 32 - h; for (; p < 64; ++p)c = f ^ (a | ~l), o = u + c + s[p] + t[r[p]], h = i[p], u = l, l = f, f = a, a += o << h | o >>> 32 - h; e.h0 = e.h0 + u | 0, e.h1 = e.h1 + a | 0, e.h2 = e.h2 + f | 0, e.h3 = e.h3 + l | 0, d -= 64 } } var t = e.md5 = e.md5 || {}; e.md = e.md || {}, e.md.algorithms = e.md.algorithms || {}, e.md.md5 = e.md.algorithms.md5 = t, t.create = function () { o || u(); var t = null, r = e.util.createBuffer(), i = new Array(16), s = { algorithm: "md5", blockLength: 64, digestLength: 16, messageLength: 0, fullMessageLength: null, messageLengthSize: 8 }; return s.start = function () { s.messageLength = 0, s.fullMessageLength = s.messageLength64 = []; var n = s.messageLengthSize / 4; for (var i = 0; i < n; ++i)s.fullMessageLength.push(0); return r = e.util.createBuffer(), t = { h0: 1732584193, h1: 4023233417, h2: 2562383102, h3: 271733878 }, s }, s.start(), s.update = function (n, o) { o === "utf8" && (n = e.util.encodeUtf8(n)); var u = n.length; s.messageLength += u, u = [u / 4294967296 >>> 0, u >>> 0]; for (var f = s.fullMessageLength.length - 1; f >= 0; --f)s.fullMessageLength[f] += u[1], u[1] = u[0] + (s.fullMessageLength[f] / 4294967296 >>> 0), s.fullMessageLength[f] = s.fullMessageLength[f] >>> 0, u[0] = u[1] / 4294967296 >>> 0; return r.putBytes(n), a(t, i, r), (r.read > 2048 || r.length() === 0) && r.compact(), s }, s.digest = function () { var o = e.util.createBuffer(); o.putBytes(r.bytes()); var u = s.fullMessageLength[s.fullMessageLength.length - 1] + s.messageLengthSize, f = u & s.blockLength - 1; o.putBytes(n.substr(0, s.blockLength - f)); var l, c = 0; for (var h = s.fullMessageLength.length - 1; h >= 0; --h)l = s.fullMessageLength[h] * 8 + c, c = l / 4294967296 >>> 0, o.putInt32Le(l >>> 0); var p = { h0: t.h0, h1: t.h1, h2: t.h2, h3: t.h3 }; a(p, i, o); var d = e.util.createBuffer(); return d.putInt32Le(p.h0), d.putInt32Le(p.h1), d.putInt32Le(p.h2), d.putInt32Le(p.h3), d }, s }; var n = null, r = null, i = null, s = null, o = !1 } var r = "md5"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/md5", ["require", "module", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function i() { n = String.fromCharCode(128), n += e.util.fillString(String.fromCharCode(0), 64), r = !0 } function s(e, t, n) { var r, i, s, o, u, a, f, l, c = n.length(); while (c >= 64) { i = e.h0, s = e.h1, o = e.h2, u = e.h3, a = e.h4; for (l = 0; l < 16; ++l)r = n.getInt32(), t[l] = r, f = u ^ s & (o ^ u), r = (i << 5 | i >>> 27) + f + a + 1518500249 + r, a = u, u = o, o = s << 30 | s >>> 2, s = i, i = r; for (; l < 20; ++l)r = t[l - 3] ^ t[l - 8] ^ t[l - 14] ^ t[l - 16], r = r << 1 | r >>> 31, t[l] = r, f = u ^ s & (o ^ u), r = (i << 5 | i >>> 27) + f + a + 1518500249 + r, a = u, u = o, o = s << 30 | s >>> 2, s = i, i = r; for (; l < 32; ++l)r = t[l - 3] ^ t[l - 8] ^ t[l - 14] ^ t[l - 16], r = r << 1 | r >>> 31, t[l] = r, f = s ^ o ^ u, r = (i << 5 | i >>> 27) + f + a + 1859775393 + r, a = u, u = o, o = s << 30 | s >>> 2, s = i, i = r; for (; l < 40; ++l)r = t[l - 6] ^ t[l - 16] ^ t[l - 28] ^ t[l - 32], r = r << 2 | r >>> 30, t[l] = r, f = s ^ o ^ u, r = (i << 5 | i >>> 27) + f + a + 1859775393 + r, a = u, u = o, o = s << 30 | s >>> 2, s = i, i = r; for (; l < 60; ++l)r = t[l - 6] ^ t[l - 16] ^ t[l - 28] ^ t[l - 32], r = r << 2 | r >>> 30, t[l] = r, f = s & o | u & (s ^ o), r = (i << 5 | i >>> 27) + f + a + 2400959708 + r, a = u, u = o, o = s << 30 | s >>> 2, s = i, i = r; for (; l < 80; ++l)r = t[l - 6] ^ t[l - 16] ^ t[l - 28] ^ t[l - 32], r = r << 2 | r >>> 30, t[l] = r, f = s ^ o ^ u, r = (i << 5 | i >>> 27) + f + a + 3395469782 + r, a = u, u = o, o = s << 30 | s >>> 2, s = i, i = r; e.h0 = e.h0 + i | 0, e.h1 = e.h1 + s | 0, e.h2 = e.h2 + o | 0, e.h3 = e.h3 + u | 0, e.h4 = e.h4 + a | 0, c -= 64 } } var t = e.sha1 = e.sha1 || {}; e.md = e.md || {}, e.md.algorithms = e.md.algorithms || {}, e.md.sha1 = e.md.algorithms.sha1 = t, t.create = function () { r || i(); var t = null, o = e.util.createBuffer(), u = new Array(80), a = { algorithm: "sha1", blockLength: 64, digestLength: 20, messageLength: 0, fullMessageLength: null, messageLengthSize: 8 }; return a.start = function () { a.messageLength = 0, a.fullMessageLength = a.messageLength64 = []; var n = a.messageLengthSize / 4; for (var r = 0; r < n; ++r)a.fullMessageLength.push(0); return o = e.util.createBuffer(), t = { h0: 1732584193, h1: 4023233417, h2: 2562383102, h3: 271733878, h4: 3285377520 }, a }, a.start(), a.update = function (n, r) { r === "utf8" && (n = e.util.encodeUtf8(n)); var i = n.length; a.messageLength += i, i = [i / 4294967296 >>> 0, i >>> 0]; for (var f = a.fullMessageLength.length - 1; f >= 0; --f)a.fullMessageLength[f] += i[1], i[1] = i[0] + (a.fullMessageLength[f] / 4294967296 >>> 0), a.fullMessageLength[f] = a.fullMessageLength[f] >>> 0, i[0] = i[1] / 4294967296 >>> 0; return o.putBytes(n), s(t, u, o), (o.read > 2048 || o.length() === 0) && o.compact(), a }, a.digest = function () { var r = e.util.createBuffer(); r.putBytes(o.bytes()); var i = a.fullMessageLength[a.fullMessageLength.length - 1] + a.messageLengthSize, f = i & a.blockLength - 1; r.putBytes(n.substr(0, a.blockLength - f)); var l = e.util.createBuffer(), c, h, p = a.fullMessageLength[0] * 8; for (var d = 0; d < a.fullMessageLength.length; ++d)c = a.fullMessageLength[d + 1] * 8, h = c / 4294967296 >>> 0, p += h, r.putInt32(p >>> 0), p = c; var v = { h0: t.h0, h1: t.h1, h2: t.h2, h3: t.h3, h4: t.h4 }; s(v, u, r); var m = e.util.createBuffer(); return m.putInt32(v.h0), m.putInt32(v.h1), m.putInt32(v.h2), m.putInt32(v.h3), m.putInt32(v.h4), m }, a }; var n = null, r = !1 } var r = "sha1"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/sha1", ["require", "module", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function s() { n = String.fromCharCode(128), n += e.util.fillString(String.fromCharCode(0), 64), i = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], r = !0 } function o(e, t, n) { var r, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b = n.length(); while (b >= 64) { for (l = 0; l < 16; ++l)t[l] = n.getInt32(); for (; l < 64; ++l)r = t[l - 2], r = (r >>> 17 | r << 15) ^ (r >>> 19 | r << 13) ^ r >>> 10, s = t[l - 15], s = (s >>> 7 | s << 25) ^ (s >>> 18 | s << 14) ^ s >>> 3, t[l] = r + t[l - 7] + s + t[l - 16] | 0; c = e.h0, h = e.h1, p = e.h2, d = e.h3, v = e.h4, m = e.h5, g = e.h6, y = e.h7; for (l = 0; l < 64; ++l)u = (v >>> 6 | v << 26) ^ (v >>> 11 | v << 21) ^ (v >>> 25 | v << 7), a = g ^ v & (m ^ g), o = (c >>> 2 | c << 30) ^ (c >>> 13 | c << 19) ^ (c >>> 22 | c << 10), f = c & h | p & (c ^ h), r = y + u + a + i[l] + t[l], s = o + f, y = g, g = m, m = v, v = d + r | 0, d = p, p = h, h = c, c = r + s | 0; e.h0 = e.h0 + c | 0, e.h1 = e.h1 + h | 0, e.h2 = e.h2 + p | 0, e.h3 = e.h3 + d | 0, e.h4 = e.h4 + v | 0, e.h5 = e.h5 + m | 0, e.h6 = e.h6 + g | 0, e.h7 = e.h7 + y | 0, b -= 64 } } var t = e.sha256 = e.sha256 || {}; e.md = e.md || {}, e.md.algorithms = e.md.algorithms || {}, e.md.sha256 = e.md.algorithms.sha256 = t, t.create = function () { r || s(); var t = null, i = e.util.createBuffer(), u = new Array(64), a = { algorithm: "sha256", blockLength: 64, digestLength: 32, messageLength: 0, fullMessageLength: null, messageLengthSize: 8 }; return a.start = function () { a.messageLength = 0, a.fullMessageLength = a.messageLength64 = []; var n = a.messageLengthSize / 4; for (var r = 0; r < n; ++r)a.fullMessageLength.push(0); return i = e.util.createBuffer(), t = { h0: 1779033703, h1: 3144134277, h2: 1013904242, h3: 2773480762, h4: 1359893119, h5: 2600822924, h6: 528734635, h7: 1541459225 }, a }, a.start(), a.update = function (n, r) { r === "utf8" && (n = e.util.encodeUtf8(n)); var s = n.length; a.messageLength += s, s = [s / 4294967296 >>> 0, s >>> 0]; for (var f = a.fullMessageLength.length - 1; f >= 0; --f)a.fullMessageLength[f] += s[1], s[1] = s[0] + (a.fullMessageLength[f] / 4294967296 >>> 0), a.fullMessageLength[f] = a.fullMessageLength[f] >>> 0, s[0] = s[1] / 4294967296 >>> 0; return i.putBytes(n), o(t, u, i), (i.read > 2048 || i.length() === 0) && i.compact(), a }, a.digest = function () { var r = e.util.createBuffer(); r.putBytes(i.bytes()); var s = a.fullMessageLength[a.fullMessageLength.length - 1] + a.messageLengthSize, f = s & a.blockLength - 1; r.putBytes(n.substr(0, a.blockLength - f)); var l = e.util.createBuffer(), c, h, p = a.fullMessageLength[0] * 8; for (var d = 0; d < a.fullMessageLength.length; ++d)c = a.fullMessageLength[d + 1] * 8, h = c / 4294967296 >>> 0, p += h, r.putInt32(p >>> 0), p = c; var v = { h0: t.h0, h1: t.h1, h2: t.h2, h3: t.h3, h4: t.h4, h5: t.h5, h6: t.h6, h7: t.h7 }; o(v, u, r); var m = e.util.createBuffer(); return m.putInt32(v.h0), m.putInt32(v.h1), m.putInt32(v.h2), m.putInt32(v.h3), m.putInt32(v.h4), m.putInt32(v.h5), m.putInt32(v.h6), m.putInt32(v.h7), m }, a }; var n = null, r = !1, i = null } var r = "sha256"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/sha256", ["require", "module", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function u() { r = String.fromCharCode(128), r += e.util.fillString(String.fromCharCode(0), 128), s = [[1116352408, 3609767458], [1899447441, 602891725], [3049323471, 3964484399], [3921009573, 2173295548], [961987163, 4081628472], [1508970993, 3053834265], [2453635748, 2937671579], [2870763221, 3664609560], [3624381080, 2734883394], [310598401, 1164996542], [607225278, 1323610764], [1426881987, 3590304994], [1925078388, 4068182383], [2162078206, 991336113], [2614888103, 633803317], [3248222580, 3479774868], [3835390401, 2666613458], [4022224774, 944711139], [264347078, 2341262773], [604807628, 2007800933], [770255983, 1495990901], [1249150122, 1856431235], [1555081692, 3175218132], [1996064986, 2198950837], [2554220882, 3999719339], [2821834349, 766784016], [2952996808, 2566594879], [3210313671, 3203337956], [3336571891, 1034457026], [3584528711, 2466948901], [113926993, 3758326383], [338241895, 168717936], [666307205, 1188179964], [773529912, 1546045734], [1294757372, 1522805485], [1396182291, 2643833823], [1695183700, 2343527390], [1986661051, 1014477480], [2177026350, 1206759142], [2456956037, 344077627], [2730485921, 1290863460], [2820302411, 3158454273], [3259730800, 3505952657], [3345764771, 106217008], [3516065817, 3606008344], [3600352804, 1432725776], [4094571909, 1467031594], [275423344, 851169720], [430227734, 3100823752], [506948616, 1363258195], [659060556, 3750685593], [883997877, 3785050280], [958139571, 3318307427], [1322822218, 3812723403], [1537002063, 2003034995], [1747873779, 3602036899], [1955562222, 1575990012], [2024104815, 1125592928], [2227730452, 2716904306], [2361852424, 442776044], [2428436474, 593698344], [2756734187, 3733110249], [3204031479, 2999351573], [3329325298, 3815920427], [3391569614, 3928383900], [3515267271, 566280711], [3940187606, 3454069534], [4118630271, 4000239992], [116418474, 1914138554], [174292421, 2731055270], [289380356, 3203993006], [460393269, 320620315], [685471733, 587496836], [852142971, 1086792851], [1017036298, 365543100], [1126000580, 2618297676], [1288033470, 3409855158], [1501505948, 4234509866], [1607167915, 987167468], [1816402316, 1246189591]], o = {}, o["SHA-512"] = [[1779033703, 4089235720], [3144134277, 2227873595], [1013904242, 4271175723], [2773480762, 1595750129], [1359893119, 2917565137], [2600822924, 725511199], [528734635, 4215389547], [1541459225, 327033209]], o["SHA-384"] = [[3418070365, 3238371032], [1654270250, 914150663], [2438529370, 812702999], [355462360, 4144912697], [1731405415, 4290775857], [2394180231, 1750603025], [3675008525, 1694076839], [1203062813, 3204075428]], o["SHA-512/256"] = [[573645204, 4230739756], [2673172387, 3360449730], [596883563, 1867755857], [2520282905, 1497426621], [2519219938, 2827943907], [3193839141, 1401305490], [721525244, 746961066], [246885852, 2177182882]], o["SHA-512/224"] = [[2352822216, 424955298], [1944164710, 2312950998], [502970286, 855612546], [1738396948, 1479516111], [258812777, 2077511080], [2011393907, 79989058], [1067287976, 1780299464], [286451373, 2446758561]], i = !0 } function a(e, t, n) { var r, i, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N, C, k, L, A, O, M, _, D, P, H, B, j, F, I = n.length(); while (I >= 128) { for (_ = 0; _ < 16; ++_)t[_][0] = n.getInt32() >>> 0, t[_][1] = n.getInt32() >>> 0; for (; _ < 80; ++_)H = t[_ - 2], D = H[0], P = H[1], r = ((D >>> 19 | P << 13) ^ (P >>> 29 | D << 3) ^ D >>> 6) >>> 0, i = ((D << 13 | P >>> 19) ^ (P << 3 | D >>> 29) ^ (D << 26 | P >>> 6)) >>> 0, j = t[_ - 15], D = j[0], P = j[1], o = ((D >>> 1 | P << 31) ^ (D >>> 8 | P << 24) ^ D >>> 7) >>> 0, u = ((D << 31 | P >>> 1) ^ (D << 24 | P >>> 8) ^ (D << 25 | P >>> 7)) >>> 0, B = t[_ - 7], F = t[_ - 16], P = i + B[1] + u + F[1], t[_][0] = r + B[0] + o + F[0] + (P / 4294967296 >>> 0) >>> 0, t[_][1] = P >>> 0; m = e[0][0], g = e[0][1], y = e[1][0], b = e[1][1], w = e[2][0], E = e[2][1], S = e[3][0], x = e[3][1], T = e[4][0], N = e[4][1], C = e[5][0], k = e[5][1], L = e[6][0], A = e[6][1], O = e[7][0], M = e[7][1]; for (_ = 0; _ < 80; ++_)l = ((T >>> 14 | N << 18) ^ (T >>> 18 | N << 14) ^ (N >>> 9 | T << 23)) >>> 0, c = ((T << 18 | N >>> 14) ^ (T << 14 | N >>> 18) ^ (N << 23 | T >>> 9)) >>> 0, h = (L ^ T & (C ^ L)) >>> 0, p = (A ^ N & (k ^ A)) >>> 0, a = ((m >>> 28 | g << 4) ^ (g >>> 2 | m << 30) ^ (g >>> 7 | m << 25)) >>> 0, f = ((m << 4 | g >>> 28) ^ (g << 30 | m >>> 2) ^ (g << 25 | m >>> 7)) >>> 0, d = (m & y | w & (m ^ y)) >>> 0, v = (g & b | E & (g ^ b)) >>> 0, P = M + c + p + s[_][1] + t[_][1], r = O + l + h + s[_][0] + t[_][0] + (P / 4294967296 >>> 0) >>> 0, i = P >>> 0, P = f + v, o = a + d + (P / 4294967296 >>> 0) >>> 0, u = P >>> 0, O = L, M = A, L = C, A = k, C = T, k = N, P = x + i, T = S + r + (P / 4294967296 >>> 0) >>> 0, N = P >>> 0, S = w, x = E, w = y, E = b, y = m, b = g, P = i + u, m = r + o + (P / 4294967296 >>> 0) >>> 0, g = P >>> 0; P = e[0][1] + g, e[0][0] = e[0][0] + m + (P / 4294967296 >>> 0) >>> 0, e[0][1] = P >>> 0, P = e[1][1] + b, e[1][0] = e[1][0] + y + (P / 4294967296 >>> 0) >>> 0, e[1][1] = P >>> 0, P = e[2][1] + E, e[2][0] = e[2][0] + w + (P / 4294967296 >>> 0) >>> 0, e[2][1] = P >>> 0, P = e[3][1] + x, e[3][0] = e[3][0] + S + (P / 4294967296 >>> 0) >>> 0, e[3][1] = P >>> 0, P = e[4][1] + N, e[4][0] = e[4][0] + T + (P / 4294967296 >>> 0) >>> 0, e[4][1] = P >>> 0, P = e[5][1] + k, e[5][0] = e[5][0] + C + (P / 4294967296 >>> 0) >>> 0, e[5][1] = P >>> 0, P = e[6][1] + A, e[6][0] = e[6][0] + L + (P / 4294967296 >>> 0) >>> 0, e[6][1] = P >>> 0, P = e[7][1] + M, e[7][0] = e[7][0] + O + (P / 4294967296 >>> 0) >>> 0, e[7][1] = P >>> 0, I -= 128 } } var t = e.sha512 = e.sha512 || {}; e.md = e.md || {}, e.md.algorithms = e.md.algorithms || {}, e.md.sha512 = e.md.algorithms.sha512 = t; var n = e.sha384 = e.sha512.sha384 = e.sha512.sha384 || {}; n.create = function () { return t.create("SHA-384") }, e.md.sha384 = e.md.algorithms.sha384 = n, e.sha512.sha256 = e.sha512.sha256 || { create: function () { return t.create("SHA-512/256") } }, e.md["sha512/256"] = e.md.algorithms["sha512/256"] = e.sha512.sha256, e.sha512.sha224 = e.sha512.sha224 || { create: function () { return t.create("SHA-512/224") } }, e.md["sha512/224"] = e.md.algorithms["sha512/224"] = e.sha512.sha224, t.create = function (t) { i || u(), typeof t == "undefined" && (t = "SHA-512"); if (t in o) { var n = o[t], s = null, f = e.util.createBuffer(), l = new Array(80); for (var c = 0; c < 80; ++c)l[c] = new Array(2); var h = { algorithm: t.replace("-", "").toLowerCase(), blockLength: 128, digestLength: 64, messageLength: 0, fullMessageLength: null, messageLengthSize: 16 }; return h.start = function () { h.messageLength = 0, h.fullMessageLength = h.messageLength128 = []; var t = h.messageLengthSize / 4; for (var r = 0; r < t; ++r)h.fullMessageLength.push(0); f = e.util.createBuffer(), s = new Array(n.length); for (var r = 0; r < n.length; ++r)s[r] = n[r].slice(0); return h }, h.start(), h.update = function (t, n) { n === "utf8" && (t = e.util.encodeUtf8(t)); var r = t.length; h.messageLength += r, r = [r / 4294967296 >>> 0, r >>> 0]; for (var i = h.fullMessageLength.length - 1; i >= 0; --i)h.fullMessageLength[i] += r[1], r[1] = r[0] + (h.fullMessageLength[i] / 4294967296 >>> 0), h.fullMessageLength[i] = h.fullMessageLength[i] >>> 0, r[0] = r[1] / 4294967296 >>> 0; return f.putBytes(t), a(s, l, f), (f.read > 2048 || f.length() === 0) && f.compact(), h }, h.digest = function () { var n = e.util.createBuffer(); n.putBytes(f.bytes()); var i = h.fullMessageLength[h.fullMessageLength.length - 1] + h.messageLengthSize, o = i & h.blockLength - 1; n.putBytes(r.substr(0, h.blockLength - o)); var u = e.util.createBuffer(), c, p, d = h.fullMessageLength[0] * 8; for (var v = 0; v < h.fullMessageLength.length; ++v)c = h.fullMessageLength[v + 1] * 8, p = c / 4294967296 >>> 0, d += p, n.putInt32(d >>> 0), d = c; var m = new Array(s.length); for (var v = 0; v < s.length; ++v)m[v] = s[v].slice(0); a(m, l, n); var g = e.util.createBuffer(), y; t === "SHA-512" ? y = m.length : t === "SHA-384" ? y = m.length - 2 : y = m.length - 4; for (var v = 0; v < y; ++v)g.putInt32(m[v][0]), (v !== y - 1 || t !== "SHA-512/224") && g.putInt32(m[v][1]); return g }, h } throw new Error("Invalid SHA-512 algorithm: " + t) }; var r = null, i = !1, s = null, o = null } var r = "sha512"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/sha512", ["require", "module", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { e.md = e.md || {}, e.md.algorithms = { md5: e.md5, sha1: e.sha1, sha256: e.sha256 }, e.md.md5 = e.md5, e.md.sha1 = e.sha1, e.md.sha256 = e.sha256 } var r = "md"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/md", ["require", "module", "./md5", "./sha1", "./sha256", "./sha512"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { var t = e.hmac = e.hmac || {}; t.create = function () { var t = null, n = null, r = null, i = null, s = {}; return s.start = function (s, o) { if (s !== null) if (typeof s == "string") { s = s.toLowerCase(); if (!(s in e.md.algorithms)) throw new Error('Unknown hash algorithm "' + s + '"'); n = e.md.algorithms[s].create() } else n = s; if (o === null) o = t; else { if (typeof o == "string") o = e.util.createBuffer(o); else if (e.util.isArray(o)) { var u = o; o = e.util.createBuffer(); for (var a = 0; a < u.length; ++a)o.putByte(u[a]) } var f = o.length(); f > n.blockLength && (n.start(), n.update(o.bytes()), o = n.digest()), r = e.util.createBuffer(), i = e.util.createBuffer(), f = o.length(); for (var a = 0; a < f; ++a) { var u = o.at(a); r.putByte(54 ^ u), i.putByte(92 ^ u) } if (f < n.blockLength) { var u = n.blockLength - f; for (var a = 0; a < u; ++a)r.putByte(54), i.putByte(92) } t = o, r = r.bytes(), i = i.bytes() } n.start(), n.update(r) }, s.update = function (e) { n.update(e) }, s.getMac = function () { var e = n.digest().bytes(); return n.start(), n.update(i), n.update(e), n.digest() }, s.digest = s.getMac, s } } var r = "hmac"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/hmac", ["require", "module", "./md", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function n(e) { var t = e.name + ": ", n = [], r = function (e, t) { return " " + t }; for (var i = 0; i < e.values.length; ++i)n.push(e.values[i].replace(/^(\S+\r\n)/, r)); t += n.join(",") + "\r\n"; var s = 0, o = -1; for (var i = 0; i < t.length; ++i, ++s)if (s > 65 && o !== -1) { var u = t[o]; u === "," ? (++o, t = t.substr(0, o) + "\r\n " + t.substr(o)) : t = t.substr(0, o) + "\r\n" + u + t.substr(o + 1), s = i - o - 1, o = -1, ++i } else if (t[i] === " " || t[i] === "	" || t[i] === ",") o = i; return t } function r(e) { return e.replace(/^\s+/, "") } var t = e.pem = e.pem || {}; t.encode = function (t, r) { r = r || {}; var i = "-----BEGIN " + t.type + "-----\r\n", s; t.procType && (s = { name: "Proc-Type", values: [String(t.procType.version), t.procType.type] }, i += n(s)), t.contentDomain && (s = { name: "Content-Domain", values: [t.contentDomain] }, i += n(s)), t.dekInfo && (s = { name: "DEK-Info", values: [t.dekInfo.algorithm] }, t.dekInfo.parameters && s.values.push(t.dekInfo.parameters), i += n(s)); if (t.headers) for (var o = 0; o < t.headers.length; ++o)i += n(t.headers[o]); return t.procType && (i += "\r\n"), i += e.util.encode64(t.body, r.maxline || 64) + "\r\n", i += "-----END " + t.type + "-----\r\n", i }, t.decode = function (t) { var n = [], i = /\s*-----BEGIN ([A-Z0-9- ]+)-----\r?\n?([\x21-\x7e\s]+?(?:\r?\n\r?\n))?([:A-Za-z0-9+\/=\s]+?)-----END \1-----/g, s = /([\x21-\x7e]+):\s*([\x21-\x7e\s^:]+)/, o = /\r?\n/, u; for (; ;) { u = i.exec(t); if (!u) break; var a = { type: u[1], procType: null, contentDomain: null, dekInfo: null, headers: [], body: e.util.decode64(u[3]) }; n.push(a); if (!u[2]) continue; var f = u[2].split(o), l = 0; while (u && l < f.length) { var c = f[l].replace(/\s+$/, ""); for (var h = l + 1; h < f.length; ++h) { var p = f[h]; if (!/\s/.test(p[0])) break; c += p, l = h } u = c.match(s); if (u) { var d = { name: u[1], values: [] }, v = u[2].split(","); for (var m = 0; m < v.length; ++m)d.values.push(r(v[m])); if (!a.procType) { if (d.name !== "Proc-Type") throw new Error('Invalid PEM formatted message. The first encapsulated header must be "Proc-Type".'); if (d.values.length !== 2) throw new Error('Invalid PEM formatted message. The "Proc-Type" header must have two subfields.'); a.procType = { version: v[0], type: v[1] } } else if (!a.contentDomain && d.name === "Content-Domain") a.contentDomain = v[0] || ""; else if (!a.dekInfo && d.name === "DEK-Info") { if (d.values.length === 0) throw new Error('Invalid PEM formatted message. The "DEK-Info" header must have at least one subfield.'); a.dekInfo = { algorithm: v[0], parameters: v[1] || null } } else a.headers.push(d) } ++l } if (a.procType === "ENCRYPTED" && !a.dekInfo) throw new Error('Invalid PEM formatted message. The "DEK-Info" header must be present if "Proc-Type" is "ENCRYPTED".') } if (n.length === 0) throw new Error("Invalid PEM formatted message."); return n } } var r = "pem"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/pem", ["require", "module", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function t(t, n) { var r = function () { return new e.des.Algorithm(t, n) }; e.cipher.registerAlgorithm(t, r) } function l(e) { var t = [0, 4, 536870912, 536870916, 65536, 65540, 536936448, 536936452, 512, 516, 536871424, 536871428, 66048, 66052, 536936960, 536936964], n = [0, 1, 1048576, 1048577, 67108864, 67108865, 68157440, 68157441, 256, 257, 1048832, 1048833, 67109120, 67109121, 68157696, 68157697], r = [0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272, 0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272], i = [0, 2097152, 134217728, 136314880, 8192, 2105344, 134225920, 136323072, 131072, 2228224, 134348800, 136445952, 139264, 2236416, 134356992, 136454144], s = [0, 262144, 16, 262160, 0, 262144, 16, 262160, 4096, 266240, 4112, 266256, 4096, 266240, 4112, 266256], o = [0, 1024, 32, 1056, 0, 1024, 32, 1056, 33554432, 33555456, 33554464, 33555488, 33554432, 33555456, 33554464, 33555488], u = [0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746, 0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746], a = [0, 65536, 2048, 67584, 536870912, 536936448, 536872960, 536938496, 131072, 196608, 133120, 198656, 537001984, 537067520, 537004032, 537069568], f = [0, 262144, 0, 262144, 2, 262146, 2, 262146, 33554432, 33816576, 33554432, 33816576, 33554434, 33816578, 33554434, 33816578], l = [0, 268435456, 8, 268435464, 0, 268435456, 8, 268435464, 1024, 268436480, 1032, 268436488, 1024, 268436480, 1032, 268436488], c = [0, 32, 0, 32, 1048576, 1048608, 1048576, 1048608, 8192, 8224, 8192, 8224, 1056768, 1056800, 1056768, 1056800], h = [0, 16777216, 512, 16777728, 2097152, 18874368, 2097664, 18874880, 67108864, 83886080, 67109376, 83886592, 69206016, 85983232, 69206528, 85983744], p = [0, 4096, 134217728, 134221824, 524288, 528384, 134742016, 134746112, 16, 4112, 134217744, 134221840, 524304, 528400, 134742032, 134746128], d = [0, 4, 256, 260, 0, 4, 256, 260, 1, 5, 257, 261, 1, 5, 257, 261], v = e.length() > 8 ? 3 : 1, m = [], g = [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0], y = 0, b; for (var w = 0; w < v; w++) { var E = e.getInt32(), S = e.getInt32(); b = (E >>> 4 ^ S) & 252645135, S ^= b, E ^= b << 4, b = (S >>> -16 ^ E) & 65535, E ^= b, S ^= b << -16, b = (E >>> 2 ^ S) & 858993459, S ^= b, E ^= b << 2, b = (S >>> -16 ^ E) & 65535, E ^= b, S ^= b << -16, b = (E >>> 1 ^ S) & 1431655765, S ^= b, E ^= b << 1, b = (S >>> 8 ^ E) & 16711935, E ^= b, S ^= b << 8, b = (E >>> 1 ^ S) & 1431655765, S ^= b, E ^= b << 1, b = E << 8 | S >>> 20 & 240, E = S << 24 | S << 8 & 16711680 | S >>> 8 & 65280 | S >>> 24 & 240, S = b; for (var x = 0; x < g.length; ++x) { g[x] ? (E = E << 2 | E >>> 26, S = S << 2 | S >>> 26) : (E = E << 1 | E >>> 27, S = S << 1 | S >>> 27), E &= -15, S &= -15; var T = t[E >>> 28] | n[E >>> 24 & 15] | r[E >>> 20 & 15] | i[E >>> 16 & 15] | s[E >>> 12 & 15] | o[E >>> 8 & 15] | u[E >>> 4 & 15], N = a[S >>> 28] | f[S >>> 24 & 15] | l[S >>> 20 & 15] | c[S >>> 16 & 15] | h[S >>> 12 & 15] | p[S >>> 8 & 15] | d[S >>> 4 & 15]; b = (N >>> 16 ^ T) & 65535, m[y++] = T ^ b, m[y++] = N ^ b << 16 } } return m } function c(e, t, l, c) { var h = e.length === 32 ? 3 : 9, p; h === 3 ? p = c ? [30, -2, -2] : [0, 32, 2] : p = c ? [94, 62, -2, 32, 64, 2, 30, -2, -2] : [0, 32, 2, 62, 30, -2, 64, 96, 2]; var d, v = t[0], m = t[1]; d = (v >>> 4 ^ m) & 252645135, m ^= d, v ^= d << 4, d = (v >>> 16 ^ m) & 65535, m ^= d, v ^= d << 16, d = (m >>> 2 ^ v) & 858993459, v ^= d, m ^= d << 2, d = (m >>> 8 ^ v) & 16711935, v ^= d, m ^= d << 8, d = (v >>> 1 ^ m) & 1431655765, m ^= d, v ^= d << 1, v = v << 1 | v >>> 31, m = m << 1 | m >>> 31; for (var g = 0; g < h; g += 3) { var y = p[g + 1], b = p[g + 2]; for (var w = p[g]; w != y; w += b) { var E = m ^ e[w], S = (m >>> 4 | m << 28) ^ e[w + 1]; d = v, v = m, m = d ^ (r[E >>> 24 & 63] | s[E >>> 16 & 63] | u[E >>> 8 & 63] | f[E & 63] | n[S >>> 24 & 63] | i[S >>> 16 & 63] | o[S >>> 8 & 63] | a[S & 63]) } d = v, v = m, m = d } v = v >>> 1 | v << 31, m = m >>> 1 | m << 31, d = (v >>> 1 ^ m) & 1431655765, m ^= d, v ^= d << 1, d = (m >>> 8 ^ v) & 16711935, v ^= d, m ^= d << 8, d = (m >>> 2 ^ v) & 858993459, v ^= d, m ^= d << 2, d = (v >>> 16 ^ m) & 65535, m ^= d, v ^= d << 16, d = (v >>> 4 ^ m) & 252645135, m ^= d, v ^= d << 4, l[0] = v, l[1] = m } function h(t) { t = t || {}; var n = (t.mode || "CBC").toUpperCase(), r = "DES-" + n, i; t.decrypt ? i = e.cipher.createDecipher(r, t.key) : i = e.cipher.createCipher(r, t.key); var s = i.start; return i.start = function (t, n) { var r = null; n instanceof e.util.ByteBuffer && (r = n, n = {}), n = n || {}, n.output = r, n.iv = t, s.call(i, n) }, i } e.des = e.des || {}, e.des.startEncrypting = function (e, t, n, r) { var i = h({ key: e, output: n, decrypt: !1, mode: r || (t === null ? "ECB" : "CBC") }); return i.start(t), i }, e.des.createEncryptionCipher = function (e, t) { return h({ key: e, output: null, decrypt: !1, mode: t }) }, e.des.startDecrypting = function (e, t, n, r) { var i = h({ key: e, output: n, decrypt: !0, mode: r || (t === null ? "ECB" : "CBC") }); return i.start(t), i }, e.des.createDecryptionCipher = function (e, t) { return h({ key: e, output: null, decrypt: !0, mode: t }) }, e.des.Algorithm = function (e, t) { var n = this; n.name = e, n.mode = new t({ blockSize: 8, cipher: { encrypt: function (e, t) { return c(n._keys, e, t, !1) }, decrypt: function (e, t) { return c(n._keys, e, t, !0) } } }), n._init = !1 }, e.des.Algorithm.prototype.initialize = function (t) { if (this._init) return; var n = e.util.createBuffer(t.key); if (this.name.indexOf("3DES") === 0 && n.length() !== 24) throw new Error("Invalid Triple-DES key size: " + n.length() * 8); this._keys = l(n), this._init = !0 }, t("DES-ECB", e.cipher.modes.ecb), t("DES-CBC", e.cipher.modes.cbc), t("DES-CFB", e.cipher.modes.cfb), t("DES-OFB", e.cipher.modes.ofb), t("DES-CTR", e.cipher.modes.ctr), t("3DES-ECB", e.cipher.modes.ecb), t("3DES-CBC", e.cipher.modes.cbc), t("3DES-CFB", e.cipher.modes.cfb), t("3DES-OFB", e.cipher.modes.ofb), t("3DES-CTR", e.cipher.modes.ctr); var n = [16843776, 0, 65536, 16843780, 16842756, 66564, 4, 65536, 1024, 16843776, 16843780, 1024, 16778244, 16842756, 16777216, 4, 1028, 16778240, 16778240, 66560, 66560, 16842752, 16842752, 16778244, 65540, 16777220, 16777220, 65540, 0, 1028, 66564, 16777216, 65536, 16843780, 4, 16842752, 16843776, 16777216, 16777216, 1024, 16842756, 65536, 66560, 16777220, 1024, 4, 16778244, 66564, 16843780, 65540, 16842752, 16778244, 16777220, 1028, 66564, 16843776, 1028, 16778240, 16778240, 0, 65540, 66560, 0, 16842756], r = [-2146402272, -2147450880, 32768, 1081376, 1048576, 32, -2146435040, -2147450848, -2147483616, -2146402272, -2146402304, -2147483648, -2147450880, 1048576, 32, -2146435040, 1081344, 1048608, -2147450848, 0, -2147483648, 32768, 1081376, -2146435072, 1048608, -2147483616, 0, 1081344, 32800, -2146402304, -2146435072, 32800, 0, 1081376, -2146435040, 1048576, -2147450848, -2146435072, -2146402304, 32768, -2146435072, -2147450880, 32, -2146402272, 1081376, 32, 32768, -2147483648, 32800, -2146402304, 1048576, -2147483616, 1048608, -2147450848, -2147483616, 1048608, 1081344, 0, -2147450880, 32800, -2147483648, -2146435040, -2146402272, 1081344], i = [520, 134349312, 0, 134348808, 134218240, 0, 131592, 134218240, 131080, 134217736, 134217736, 131072, 134349320, 131080, 134348800, 520, 134217728, 8, 134349312, 512, 131584, 134348800, 134348808, 131592, 134218248, 131584, 131072, 134218248, 8, 134349320, 512, 134217728, 134349312, 134217728, 131080, 520, 131072, 134349312, 134218240, 0, 512, 131080, 134349320, 134218240, 134217736, 512, 0, 134348808, 134218248, 131072, 134217728, 134349320, 8, 131592, 131584, 134217736, 134348800, 134218248, 520, 134348800, 131592, 8, 134348808, 131584], s = [8396801, 8321, 8321, 128, 8396928, 8388737, 8388609, 8193, 0, 8396800, 8396800, 8396929, 129, 0, 8388736, 8388609, 1, 8192, 8388608, 8396801, 128, 8388608, 8193, 8320, 8388737, 1, 8320, 8388736, 8192, 8396928, 8396929, 129, 8388736, 8388609, 8396800, 8396929, 129, 0, 0, 8396800, 8320, 8388736, 8388737, 1, 8396801, 8321, 8321, 128, 8396929, 129, 1, 8192, 8388609, 8193, 8396928, 8388737, 8193, 8320, 8388608, 8396801, 128, 8388608, 8192, 8396928], o = [256, 34078976, 34078720, 1107296512, 524288, 256, 1073741824, 34078720, 1074266368, 524288, 33554688, 1074266368, 1107296512, 1107820544, 524544, 1073741824, 33554432, 1074266112, 1074266112, 0, 1073742080, 1107820800, 1107820800, 33554688, 1107820544, 1073742080, 0, 1107296256, 34078976, 33554432, 1107296256, 524544, 524288, 1107296512, 256, 33554432, 1073741824, 34078720, 1107296512, 1074266368, 33554688, 1073741824, 1107820544, 34078976, 1074266368, 256, 33554432, 1107820544, 1107820800, 524544, 1107296256, 1107820800, 34078720, 0, 1074266112, 1107296256, 524544, 33554688, 1073742080, 524288, 0, 1074266112, 34078976, 1073742080], u = [536870928, 541065216, 16384, 541081616, 541065216, 16, 541081616, 4194304, 536887296, 4210704, 4194304, 536870928, 4194320, 536887296, 536870912, 16400, 0, 4194320, 536887312, 16384, 4210688, 536887312, 16, 541065232, 541065232, 0, 4210704, 541081600, 16400, 4210688, 541081600, 536870912, 536887296, 16, 541065232, 4210688, 541081616, 4194304, 16400, 536870928, 4194304, 536887296, 536870912, 16400, 536870928, 541081616, 4210688, 541065216, 4210704, 541081600, 0, 541065232, 16, 16384, 541065216, 4210704, 16384, 4194320, 536887312, 0, 541081600, 536870912, 4194320, 536887312], a = [2097152, 69206018, 67110914, 0, 2048, 67110914, 2099202, 69208064, 69208066, 2097152, 0, 67108866, 2, 67108864, 69206018, 2050, 67110912, 2099202, 2097154, 67110912, 67108866, 69206016, 69208064, 2097154, 69206016, 2048, 2050, 69208066, 2099200, 2, 67108864, 2099200, 67108864, 2099200, 2097152, 67110914, 67110914, 69206018, 69206018, 2, 2097154, 67108864, 67110912, 2097152, 69208064, 2050, 2099202, 69208064, 2050, 67108866, 69208066, 69206016, 2099200, 0, 2, 69208066, 0, 2099202, 69206016, 2048, 67108866, 67110912, 2048, 2097154], f = [268439616, 4096, 262144, 268701760, 268435456, 268439616, 64, 268435456, 262208, 268697600, 268701760, 266240, 268701696, 266304, 4096, 64, 268697600, 268435520, 268439552, 4160, 266240, 262208, 268697664, 268701696, 4160, 0, 0, 268697664, 268435520, 268439552, 266304, 262144, 266304, 262144, 268701696, 4096, 64, 268697664, 4096, 266304, 268439552, 64, 268435520, 268697600, 268697664, 268435456, 262144, 268439616, 0, 268701760, 262208, 268435520, 268697600, 268439552, 268439616, 0, 268701760, 266240, 266240, 4160, 4160, 262208, 268435456, 268701696] } var r = "des"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/des", ["require", "module", "./cipher", "./cipherModes", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { var n = e.pkcs5 = e.pkcs5 || {}, r = typeof process != "undefined" && process.versions && process.versions.node, i; r && !e.disableNativeCode && (i = t("crypto")), e.pbkdf2 = n.pbkdf2 = function (t, n, s, o, u, a) { function w() { if (y > c) return a(null, d); p.start(null, null), p.update(n), p.update(e.util.int32ToBytes(y)), v = g = p.digest().getBytes(), b = 2, E() } function E() { if (b <= s) return p.start(null, null), p.update(g), m = p.digest().getBytes(), v = e.util.xorBytes(v, m, f), g = m, ++b, e.util.setImmediate(E); d += y < c ? v : v.substr(0, h), ++y, w() } typeof u == "function" && (a = u, u = null); if (r && !e.disableNativeCode && i.pbkdf2 && (u === null || typeof u != "object") && (i.pbkdf2Sync.length > 4 || !u || u === "sha1")) return typeof u != "string" && (u = "sha1"), n = new Buffer(n, "binary"), a ? i.pbkdf2Sync.length === 4 ? i.pbkdf2(t, n, s, o, function (e, t) { if (e) return a(e); a(null, t.toString("binary")) }) : i.pbkdf2(t, n, s, o, u, function (e, t) { if (e) return a(e); a(null, t.toString("binary")) }) : i.pbkdf2Sync.length === 4 ? i.pbkdf2Sync(t, n, s, o).toString("binary") : i.pbkdf2Sync(t, n, s, o, u).toString("binary"); if (typeof u == "undefined" || u === null) u = e.md.sha1.create(); if (typeof u == "string") { if (!(u in e.md.algorithms)) throw new Error("Unknown hash algorithm: " + u); u = e.md[u].create() } var f = u.digestLength; if (o > 4294967295 * f) { var l = new Error("Derived key is too long."); if (a) return a(l); throw l } var c = Math.ceil(o / f), h = o - (c - 1) * f, p = e.hmac.create(); p.start(u, t); var d = "", v, m, g; if (!a) { for (var y = 1; y <= c; ++y) { p.start(null, null), p.update(n), p.update(e.util.int32ToBytes(y)), v = g = p.digest().getBytes(); for (var b = 2; b <= s; ++b)p.start(null, null), p.update(g), m = p.digest().getBytes(), v = e.util.xorBytes(v, m, f), g = m; d += y < c ? v : v.substr(0, h) } return d } var y = 1, b; w() } } var r = "pbkdf2"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/pbkdf2", ["require", "module", "./hmac", "./md", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { var n = typeof process != "undefined" && process.versions && process.versions.node, r = null; !e.disableNativeCode && n && !process.versions["node-webkit"] && (r = t("crypto")); var i = e.prng = e.prng || {}; i.create = function (t) { function u(e) { if (n.pools[0].messageLength >= 32) return f(), e(); var t = 32 - n.pools[0].messageLength << 5; n.seedFile(t, function (t, r) { if (t) return e(t); n.collect(r), f(), e() }) } function a() { if (n.pools[0].messageLength >= 32) return f(); var e = 32 - n.pools[0].messageLength << 5; n.collect(n.seedFileSync(e)), f() } function f() { var e = n.plugin.md.create(); e.update(n.pools[0].digest().getBytes()), n.pools[0].start(); var t = 1; for (var r = 1; r < 32; ++r)t = t === 31 ? 2147483648 : t << 2, t % n.reseeds === 0 && (e.update(n.pools[r].digest().getBytes()), n.pools[r].start()); var i = e.digest().getBytes(); e.start(), e.update(i); var s = e.digest().getBytes(); n.key = n.plugin.formatKey(i), n.seed = n.plugin.formatSeed(s), n.reseeds = n.reseeds === 4294967295 ? 0 : n.reseeds + 1, n.generated = 0 } function l(t) { var n = null; if (typeof window != "undefined") { var r = window.crypto || window.msCrypto; r && r.getRandomValues && (n = function (e) { return r.getRandomValues(e) }) } var i = e.util.createBuffer(); if (n) while (i.length() < t) { var s = Math.max(1, Math.min(t - i.length(), 65536) / 4), o = new Uint32Array(Math.floor(s)); try { n(o); for (var u = 0; u < o.length; ++u)i.putInt32(o[u]) } catch (a) { if (!(typeof QuotaExceededError != "undefined" && a instanceof QuotaExceededError)) throw a } } if (i.length() < t) { var f, l, c, h = Math.floor(Math.random() * 65536); while (i.length() < t) { l = 16807 * (h & 65535), f = 16807 * (h >> 16), l += (f & 32767) << 16, l += f >> 15, l = (l & 2147483647) + (l >> 31), h = l & 4294967295; for (var u = 0; u < 3; ++u)c = h >>> (u << 3), c ^= Math.floor(Math.random() * 256), i.putByte(String.fromCharCode(c & 255)) } } return i.getBytes(t) } var n = { plugin: t, key: null, seed: null, time: null, reseeds: 0, generated: 0 }, i = t.md, s = new Array(32); for (var o = 0; o < 32; ++o)s[o] = i.create(); return n.pools = s, n.pool = 0, n.generate = function (t, r) { function l(c) { if (c) return r(c); if (f.length() >= t) return r(null, f.getBytes(t)); n.generated > 1048575 && (n.key = null); if (n.key === null) return e.util.nextTick(function () { u(l) }); var h = i(n.key, n.seed); n.generated += h.length, f.putBytes(h), n.key = o(i(n.key, s(n.seed))), n.seed = a(i(n.key, n.seed)), e.util.setImmediate(l) } if (!r) return n.generateSync(t); var i = n.plugin.cipher, s = n.plugin.increment, o = n.plugin.formatKey, a = n.plugin.formatSeed, f = e.util.createBuffer(); n.key = null, l() }, n.generateSync = function (t) { var r = n.plugin.cipher, i = n.plugin.increment, s = n.plugin.formatKey, o = n.plugin.formatSeed; n.key = null; var u = e.util.createBuffer(); while (u.length() < t) { n.generated > 1048575 && (n.key = null), n.key === null && a(); var f = r(n.key, n.seed); n.generated += f.length, u.putBytes(f), n.key = s(r(n.key, i(n.seed))), n.seed = o(r(n.key, n.seed)) } return u.getBytes(t) }, r ? (n.seedFile = function (e, t) { r.randomBytes(e, function (e, n) { if (e) return t(e); t(null, n.toString()) }) }, n.seedFileSync = function (e) { return r.randomBytes(e).toString() }) : (n.seedFile = function (e, t) { try { t(null, l(e)) } catch (n) { t(n) } }, n.seedFileSync = l), n.collect = function (e) { var t = e.length; for (var r = 0; r < t; ++r)n.pools[n.pool].update(e.substr(r, 1)), n.pool = n.pool === 31 ? 0 : n.pool + 1 }, n.collectInt = function (e, t) { var r = ""; for (var i = 0; i < t; i += 8)r += String.fromCharCode(e >> i & 255); n.collect(r) }, n.registerWorker = function (e) { if (e === self) n.seedFile = function (e, t) { function n(e) { var r = e.data; r.forge && r.forge.prng && (self.removeEventListener("message", n), t(r.forge.prng.err, r.forge.prng.bytes)) } self.addEventListener("message", n), self.postMessage({ forge: { prng: { needed: e } } }) }; else { var t = function (t) { var r = t.data; r.forge && r.forge.prng && n.seedFile(r.forge.prng.needed, function (t, n) { e.postMessage({ forge: { prng: { err: t, bytes: n } } }) }) }; e.addEventListener("message", t) } }, n } } var r = "prng"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/prng", ["require", "module", "./md", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { if (e.random && e.random.getBytes) return; (function (t) { function s() { var t = e.prng.create(n); return t.getBytes = function (e, n) { return t.generate(e, n) }, t.getBytesSync = function (e) { return t.generate(e) }, t } var n = {}, r = new Array(4), i = e.util.createBuffer(); n.formatKey = function (t) { var n = e.util.createBuffer(t); return t = new Array(4), t[0] = n.getInt32(), t[1] = n.getInt32(), t[2] = n.getInt32(), t[3] = n.getInt32(), e.aes._expandKey(t, !1) }, n.formatSeed = function (t) { var n = e.util.createBuffer(t); return t = new Array(4), t[0] = n.getInt32(), t[1] = n.getInt32(), t[2] = n.getInt32(), t[3] = n.getInt32(), t }, n.cipher = function (t, n) { return e.aes._updateBlock(t, n, r, !1), i.putInt32(r[0]), i.putInt32(r[1]), i.putInt32(r[2]), i.putInt32(r[3]), i.getBytes() }, n.increment = function (e) { return ++e[3], e }, n.md = e.md.sha256; var o = s(), u = typeof process != "undefined" && process.versions && process.versions.node, a = null; if (typeof window != "undefined") { var f = window.crypto || window.msCrypto; f && f.getRandomValues && (a = function (e) { return f.getRandomValues(e) }) } if (e.disableNativeCode || !u && !a) { typeof window == "undefined" || window.document === undefined, o.collectInt(+(new Date), 32); if (typeof navigator != "undefined") { var l = ""; for (var c in navigator) try { typeof navigator[c] == "string" && (l += navigator[c]) } catch (h) { } o.collect(l), l = null } t && (t().mousemove(function (e) { o.collectInt(e.clientX, 16), o.collectInt(e.clientY, 16) }), t().keypress(function (e) { o.collectInt(e.charCode, 8) })) } if (!e.random) e.random = o; else for (var c in o) e.random[c] = o[c]; e.random.createInstance = s })(typeof jQuery != "undefined" ? jQuery : null) } var r = "random"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/random", ["require", "module", "./aes", "./md", "./prng", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { var t = [217, 120, 249, 196, 25, 221, 181, 237, 40, 233, 253, 121, 74, 160, 216, 157, 198, 126, 55, 131, 43, 118, 83, 142, 98, 76, 100, 136, 68, 139, 251, 162, 23, 154, 89, 245, 135, 179, 79, 19, 97, 69, 109, 141, 9, 129, 125, 50, 189, 143, 64, 235, 134, 183, 123, 11, 240, 149, 33, 34, 92, 107, 78, 130, 84, 214, 101, 147, 206, 96, 178, 28, 115, 86, 192, 20, 167, 140, 241, 220, 18, 117, 202, 31, 59, 190, 228, 209, 66, 61, 212, 48, 163, 60, 182, 38, 111, 191, 14, 218, 70, 105, 7, 87, 39, 242, 29, 155, 188, 148, 67, 3, 248, 17, 199, 246, 144, 239, 62, 231, 6, 195, 213, 47, 200, 102, 30, 215, 8, 232, 234, 222, 128, 82, 238, 247, 132, 170, 114, 172, 53, 77, 106, 42, 150, 26, 210, 113, 90, 21, 73, 116, 75, 159, 208, 94, 4, 24, 164, 236, 194, 224, 65, 110, 15, 81, 203, 204, 36, 145, 175, 80, 161, 244, 112, 57, 153, 124, 58, 133, 35, 184, 180, 122, 252, 2, 54, 91, 37, 85, 151, 49, 45, 93, 250, 152, 227, 138, 146, 174, 5, 223, 41, 16, 103, 108, 186, 201, 211, 0, 230, 207, 225, 158, 168, 44, 99, 22, 1, 63, 88, 226, 137, 169, 13, 56, 52, 27, 171, 51, 255, 176, 187, 72, 12, 95, 185, 177, 205, 46, 197, 243, 219, 71, 229, 165, 156, 119, 10, 166, 32, 104, 254, 127, 193, 173], n = [1, 2, 3, 5], r = function (e, t) { return e << t & 65535 | (e & 65535) >> 16 - t }, i = function (e, t) { return (e & 65535) >> t | e << 16 - t & 65535 }; e.rc2 = e.rc2 || {}, e.rc2.expandKey = function (n, r) { typeof n == "string" && (n = e.util.createBuffer(n)), r = r || 128; var i = n, s = n.length(), o = r, u = Math.ceil(o / 8), a = 255 >> (o & 7), f; for (f = s; f < 128; f++)i.putByte(t[i.at(f - 1) + i.at(f - s) & 255]); i.setAt(128 - u, t[i.at(128 - u) & a]); for (f = 127 - u; f >= 0; f--)i.setAt(f, t[i.at(f + 1) ^ i.at(f + u)]); return i }; var s = function (t, s, o) { var u = !1, a = null, f = null, l = null, c, h, p, d, v = []; t = e.rc2.expandKey(t, s); for (p = 0; p < 64; p++)v.push(t.getInt16Le()); o ? (c = function (e) { for (p = 0; p < 4; p++)e[p] += v[d] + (e[(p + 3) % 4] & e[(p + 2) % 4]) + (~e[(p + 3) % 4] & e[(p + 1) % 4]), e[p] = r(e[p], n[p]), d++ }, h = function (e) { for (p = 0; p < 4; p++)e[p] += v[e[(p + 3) % 4] & 63] }) : (c = function (e) { for (p = 3; p >= 0; p--)e[p] = i(e[p], n[p]), e[p] -= v[d] + (e[(p + 3) % 4] & e[(p + 2) % 4]) + (~e[(p + 3) % 4] & e[(p + 1) % 4]), d-- }, h = function (e) { for (p = 3; p >= 0; p--)e[p] -= v[e[(p + 3) % 4] & 63] }); var m = function (e) { var t = []; for (p = 0; p < 4; p++) { var n = a.getInt16Le(); l !== null && (o ? n ^= l.getInt16Le() : l.putInt16Le(n)), t.push(n & 65535) } d = o ? 0 : 63; for (var r = 0; r < e.length; r++)for (var i = 0; i < e[r][0]; i++)e[r][1](t); for (p = 0; p < 4; p++)l !== null && (o ? l.putInt16Le(t[p]) : t[p] ^= l.getInt16Le()), f.putInt16Le(t[p]) }, g = null; return g = { start: function (t, n) { t && typeof t == "string" && (t = e.util.createBuffer(t)), u = !1, a = e.util.createBuffer(), f = n || new e.util.createBuffer, l = t, g.output = f }, update: function (e) { u || a.putBuffer(e); while (a.length() >= 8) m([[5, c], [1, h], [6, c], [1, h], [5, c]]) }, finish: function (e) { var t = !0; if (o) if (e) t = e(8, a, !o); else { var n = a.length() === 8 ? 8 : 8 - a.length(); a.fillWithByte(n, n) } t && (u = !0, g.update()); if (!o) { t = a.length() === 0; if (t) if (e) t = e(8, f, !o); else { var r = f.length(), i = f.at(r - 1); i > r ? t = !1 : f.truncate(i) } } return t } }, g }; e.rc2.startEncrypting = function (t, n, r) { var i = e.rc2.createEncryptionCipher(t, 128); return i.start(n, r), i }, e.rc2.createEncryptionCipher = function (e, t) { return s(e, t, !0) }, e.rc2.startDecrypting = function (t, n, r) { var i = e.rc2.createDecryptionCipher(t, 128); return i.start(n, r), i }, e.rc2.createDecryptionCipher = function (e, t) { return s(e, t, !1) } } var r = "rc2"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/rc2", ["require", "module", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function i(e, t, n) { this.data = [], e != null && ("number" == typeof e ? this.fromNumber(e, t, n) : t == null && "string" != typeof e ? this.fromString(e, 256) : this.fromString(e, t)) } function s() { return new i(null) } function o(e, t, n, r, i, s) { while (--s >= 0) { var o = t * this.data[e++] + n.data[r] + i; i = Math.floor(o / 67108864), n.data[r++] = o & 67108863 } return i } function u(e, t, n, r, i, s) { var o = t & 32767, u = t >> 15; while (--s >= 0) { var a = this.data[e] & 32767, f = this.data[e++] >> 15, l = u * a + f * o; a = o * a + ((l & 32767) << 15) + n.data[r] + (i & 1073741823), i = (a >>> 30) + (l >>> 15) + u * f + (i >>> 30), n.data[r++] = a & 1073741823 } return i } function a(e, t, n, r, i, s) { var o = t & 16383, u = t >> 14; while (--s >= 0) { var a = this.data[e] & 16383, f = this.data[e++] >> 14, l = u * a + f * o; a = o * a + ((l & 16383) << 14) + n.data[r] + i, i = (a >> 28) + (l >> 14) + u * f, n.data[r++] = a & 268435455 } return i } function d(e) { return l.charAt(e) } function v(e, t) { var n = c[e.charCodeAt(t)]; return n == null ? -1 : n } function m(e) { for (var t = this.t - 1; t >= 0; --t)e.data[t] = this.data[t]; e.t = this.t, e.s = this.s } function g(e) { this.t = 1, this.s = e < 0 ? -1 : 0, e > 0 ? this.data[0] = e : e < -1 ? this.data[0] = e + this.DV : this.t = 0 } function y(e) { var t = s(); return t.fromInt(e), t } function b(e, t) { var n; if (t == 16) n = 4; else if (t == 8) n = 3; else if (t == 256) n = 8; else if (t == 2) n = 1; else if (t == 32) n = 5; else { if (t != 4) { this.fromRadix(e, t); return } n = 2 } this.t = 0, this.s = 0; var r = e.length, s = !1, o = 0; while (--r >= 0) { var u = n == 8 ? e[r] & 255 : v(e, r); if (u < 0) { e.charAt(r) == "-" && (s = !0); continue } s = !1, o == 0 ? this.data[this.t++] = u : o + n > this.DB ? (this.data[this.t - 1] |= (u & (1 << this.DB - o) - 1) << o, this.data[this.t++] = u >> this.DB - o) : this.data[this.t - 1] |= u << o, o += n, o >= this.DB && (o -= this.DB) } n == 8 && (e[0] & 128) != 0 && (this.s = -1, o > 0 && (this.data[this.t - 1] |= (1 << this.DB - o) - 1 << o)), this.clamp(), s && i.ZERO.subTo(this, this) } function w() { var e = this.s & this.DM; while (this.t > 0 && this.data[this.t - 1] == e)--this.t } function E(e) { if (this.s < 0) return "-" + this.negate().toString(e); var t; if (e == 16) t = 4; else if (e == 8) t = 3; else if (e == 2) t = 1; else if (e == 32) t = 5; else { if (e != 4) return this.toRadix(e); t = 2 } var n = (1 << t) - 1, r, i = !1, s = "", o = this.t, u = this.DB - o * this.DB % t; if (o-- > 0) { u < this.DB && (r = this.data[o] >> u) > 0 && (i = !0, s = d(r)); while (o >= 0) u < t ? (r = (this.data[o] & (1 << u) - 1) << t - u, r |= this.data[--o] >> (u += this.DB - t)) : (r = this.data[o] >> (u -= t) & n, u <= 0 && (u += this.DB, --o)), r > 0 && (i = !0), i && (s += d(r)) } return i ? s : "0" } function S() { var e = s(); return i.ZERO.subTo(this, e), e } function x() { return this.s < 0 ? this.negate() : this } function T(e) { var t = this.s - e.s; if (t != 0) return t; var n = this.t; t = n - e.t; if (t != 0) return this.s < 0 ? -t : t; while (--n >= 0) if ((t = this.data[n] - e.data[n]) != 0) return t; return 0 } function N(e) { var t = 1, n; return (n = e >>> 16) != 0 && (e = n, t += 16), (n = e >> 8) != 0 && (e = n, t += 8), (n = e >> 4) != 0 && (e = n, t += 4), (n = e >> 2) != 0 && (e = n, t += 2), (n = e >> 1) != 0 && (e = n, t += 1), t } function C() { return this.t <= 0 ? 0 : this.DB * (this.t - 1) + N(this.data[this.t - 1] ^ this.s & this.DM) } function k(e, t) { var n; for (n = this.t - 1; n >= 0; --n)t.data[n + e] = this.data[n]; for (n = e - 1; n >= 0; --n)t.data[n] = 0; t.t = this.t + e, t.s = this.s } function L(e, t) { for (var n = e; n < this.t; ++n)t.data[n - e] = this.data[n]; t.t = Math.max(this.t - e, 0), t.s = this.s } function A(e, t) { var n = e % this.DB, r = this.DB - n, i = (1 << r) - 1, s = Math.floor(e / this.DB), o = this.s << n & this.DM, u; for (u = this.t - 1; u >= 0; --u)t.data[u + s + 1] = this.data[u] >> r | o, o = (this.data[u] & i) << n; for (u = s - 1; u >= 0; --u)t.data[u] = 0; t.data[s] = o, t.t = this.t + s + 1, t.s = this.s, t.clamp() } function O(e, t) { t.s = this.s; var n = Math.floor(e / this.DB); if (n >= this.t) { t.t = 0; return } var r = e % this.DB, i = this.DB - r, s = (1 << r) - 1; t.data[0] = this.data[n] >> r; for (var o = n + 1; o < this.t; ++o)t.data[o - n - 1] |= (this.data[o] & s) << i, t.data[o - n] = this.data[o] >> r; r > 0 && (t.data[this.t - n - 1] |= (this.s & s) << i), t.t = this.t - n, t.clamp() } function M(e, t) { var n = 0, r = 0, i = Math.min(e.t, this.t); while (n < i) r += this.data[n] - e.data[n], t.data[n++] = r & this.DM, r >>= this.DB; if (e.t < this.t) { r -= e.s; while (n < this.t) r += this.data[n], t.data[n++] = r & this.DM, r >>= this.DB; r += this.s } else { r += this.s; while (n < e.t) r -= e.data[n], t.data[n++] = r & this.DM, r >>= this.DB; r -= e.s } t.s = r < 0 ? -1 : 0, r < -1 ? t.data[n++] = this.DV + r : r > 0 && (t.data[n++] = r), t.t = n, t.clamp() } function _(e, t) { var n = this.abs(), r = e.abs(), s = n.t; t.t = s + r.t; while (--s >= 0) t.data[s] = 0; for (s = 0; s < r.t; ++s)t.data[s + n.t] = n.am(0, r.data[s], t, s, 0, n.t); t.s = 0, t.clamp(), this.s != e.s && i.ZERO.subTo(t, t) } function D(e) { var t = this.abs(), n = e.t = 2 * t.t; while (--n >= 0) e.data[n] = 0; for (n = 0; n < t.t - 1; ++n) { var r = t.am(n, t.data[n], e, 2 * n, 0, 1); (e.data[n + t.t] += t.am(n + 1, 2 * t.data[n], e, 2 * n + 1, r, t.t - n - 1)) >= t.DV && (e.data[n + t.t] -= t.DV, e.data[n + t.t + 1] = 1) } e.t > 0 && (e.data[e.t - 1] += t.am(n, t.data[n], e, 2 * n, 0, 1)), e.s = 0, e.clamp() } function P(e, t, n) { var r = e.abs(); if (r.t <= 0) return; var o = this.abs(); if (o.t < r.t) { t != null && t.fromInt(0), n != null && this.copyTo(n); return } n == null && (n = s()); var u = s(), a = this.s, f = e.s, l = this.DB - N(r.data[r.t - 1]); l > 0 ? (r.lShiftTo(l, u), o.lShiftTo(l, n)) : (r.copyTo(u), o.copyTo(n)); var c = u.t, h = u.data[c - 1]; if (h == 0) return; var p = h * (1 << this.F1) + (c > 1 ? u.data[c - 2] >> this.F2 : 0), d = this.FV / p, v = (1 << this.F1) / p, m = 1 << this.F2, g = n.t, y = g - c, b = t == null ? s() : t; u.dlShiftTo(y, b), n.compareTo(b) >= 0 && (n.data[n.t++] = 1, n.subTo(b, n)), i.ONE.dlShiftTo(c, b), b.subTo(u, u); while (u.t < c) u.data[u.t++] = 0; while (--y >= 0) { var w = n.data[--g] == h ? this.DM : Math.floor(n.data[g] * d + (n.data[g - 1] + m) * v); if ((n.data[g] += u.am(0, w, n, y, 0, c)) < w) { u.dlShiftTo(y, b), n.subTo(b, n); while (n.data[g] < --w) n.subTo(b, n) } } t != null && (n.drShiftTo(c, t), a != f && i.ZERO.subTo(t, t)), n.t = c, n.clamp(), l > 0 && n.rShiftTo(l, n), a < 0 && i.ZERO.subTo(n, n) } function H(e) { var t = s(); return this.abs().divRemTo(e, null, t), this.s < 0 && t.compareTo(i.ZERO) > 0 && e.subTo(t, t), t } function B(e) { this.m = e } function j(e) { return e.s < 0 || e.compareTo(this.m) >= 0 ? e.mod(this.m) : e } function F(e) { return e } function I(e) { e.divRemTo(this.m, null, e) } function q(e, t, n) { e.multiplyTo(t, n), this.reduce(n) } function R(e, t) { e.squareTo(t), this.reduce(t) } function U() { if (this.t < 1) return 0; var e = this.data[0]; if ((e & 1) == 0) return 0; var t = e & 3; return t = t * (2 - (e & 15) * t) & 15, t = t * (2 - (e & 255) * t) & 255, t = t * (2 - ((e & 65535) * t & 65535)) & 65535, t = t * (2 - e * t % this.DV) % this.DV, t > 0 ? this.DV - t : -t } function z(e) { this.m = e, this.mp = e.invDigit(), this.mpl = this.mp & 32767, this.mph = this.mp >> 15, this.um = (1 << e.DB - 15) - 1, this.mt2 = 2 * e.t } function W(e) { var t = s(); return e.abs().dlShiftTo(this.m.t, t), t.divRemTo(this.m, null, t), e.s < 0 && t.compareTo(i.ZERO) > 0 && this.m.subTo(t, t), t } function X(e) { var t = s(); return e.copyTo(t), this.reduce(t), t } function V(e) { while (e.t <= this.mt2) e.data[e.t++] = 0; for (var t = 0; t < this.m.t; ++t) { var n = e.data[t] & 32767, r = n * this.mpl + ((n * this.mph + (e.data[t] >> 15) * this.mpl & this.um) << 15) & e.DM; n = t + this.m.t, e.data[n] += this.m.am(0, r, e, t, 0, this.m.t); while (e.data[n] >= e.DV) e.data[n] -= e.DV, e.data[++n]++ } e.clamp(), e.drShiftTo(this.m.t, e), e.compareTo(this.m) >= 0 && e.subTo(this.m, e) } function $(e, t) { e.squareTo(t), this.reduce(t) } function J(e, t, n) { e.multiplyTo(t, n), this.reduce(n) } function K() { return (this.t > 0 ? this.data[0] & 1 : this.s) == 0 } function Q(e, t) { if (e > 4294967295 || e < 1) return i.ONE; var n = s(), r = s(), o = t.convert(this), u = N(e) - 1; o.copyTo(n); while (--u >= 0) { t.sqrTo(n, r); if ((e & 1 << u) > 0) t.mulTo(r, o, n); else { var a = n; n = r, r = a } } return t.revert(n) } function G(e, t) { var n; return e < 256 || t.isEven() ? n = new B(t) : n = new z(t), this.exp(e, n) } function Y() { var e = s(); return this.copyTo(e), e } function Z() { if (this.s < 0) { if (this.t == 1) return this.data[0] - this.DV; if (this.t == 0) return -1 } else { if (this.t == 1) return this.data[0]; if (this.t == 0) return 0 } return (this.data[1] & (1 << 32 - this.DB) - 1) << this.DB | this.data[0] } function et() { return this.t == 0 ? this.s : this.data[0] << 24 >> 24 } function tt() { return this.t == 0 ? this.s : this.data[0] << 16 >> 16 } function nt(e) { return Math.floor(Math.LN2 * this.DB / Math.log(e)) } function rt() { return this.s < 0 ? -1 : this.t <= 0 || this.t == 1 && this.data[0] <= 0 ? 0 : 1 } function it(e) { e == null && (e = 10); if (this.signum() == 0 || e < 2 || e > 36) return "0"; var t = this.chunkSize(e), n = Math.pow(e, t), r = y(n), i = s(), o = s(), u = ""; this.divRemTo(r, i, o); while (i.signum() > 0) u = (n + o.intValue()).toString(e).substr(1) + u, i.divRemTo(r, i, o); return o.intValue().toString(e) + u } function st(e, t) { this.fromInt(0), t == null && (t = 10); var n = this.chunkSize(t), r = Math.pow(t, n), s = !1, o = 0, u = 0; for (var a = 0; a < e.length; ++a) { var f = v(e, a); if (f < 0) { e.charAt(a) == "-" && this.signum() == 0 && (s = !0); continue } u = t * u + f, ++o >= n && (this.dMultiply(r), this.dAddOffset(u, 0), o = 0, u = 0) } o > 0 && (this.dMultiply(Math.pow(t, o)), this.dAddOffset(u, 0)), s && i.ZERO.subTo(this, this) } function ot(e, t, n) { if ("number" == typeof t) if (e < 2) this.fromInt(1); else { this.fromNumber(e, n), this.testBit(e - 1) || this.bitwiseTo(i.ONE.shiftLeft(e - 1), dt, this), this.isEven() && this.dAddOffset(1, 0); while (!this.isProbablePrime(t)) this.dAddOffset(2, 0), this.bitLength() > e && this.subTo(i.ONE.shiftLeft(e - 1), this) } else { var r = new Array, s = e & 7; r.length = (e >> 3) + 1, t.nextBytes(r), s > 0 ? r[0] &= (1 << s) - 1 : r[0] = 0, this.fromString(r, 256) } } function ut() { var e = this.t, t = new Array; t[0] = this.s; var n = this.DB - e * this.DB % 8, r, i = 0; if (e-- > 0) { n < this.DB && (r = this.data[e] >> n) != (this.s & this.DM) >> n && (t[i++] = r | this.s << this.DB - n); while (e >= 0) { n < 8 ? (r = (this.data[e] & (1 << n) - 1) << 8 - n, r |= this.data[--e] >> (n += this.DB - 8)) : (r = this.data[e] >> (n -= 8) & 255, n <= 0 && (n += this.DB, --e)), (r & 128) != 0 && (r |= -256), i == 0 && (this.s & 128) != (r & 128) && ++i; if (i > 0 || r != this.s) t[i++] = r } } return t } function at(e) { return this.compareTo(e) == 0 } function ft(e) { return this.compareTo(e) < 0 ? this : e } function lt(e) { return this.compareTo(e) > 0 ? this : e } function ct(e, t, n) { var r, i, s = Math.min(e.t, this.t); for (r = 0; r < s; ++r)n.data[r] = t(this.data[r], e.data[r]); if (e.t < this.t) { i = e.s & this.DM; for (r = s; r < this.t; ++r)n.data[r] = t(this.data[r], i); n.t = this.t } else { i = this.s & this.DM; for (r = s; r < e.t; ++r)n.data[r] = t(i, e.data[r]); n.t = e.t } n.s = t(this.s, e.s), n.clamp() } function ht(e, t) { return e & t } function pt(e) { var t = s(); return this.bitwiseTo(e, ht, t), t } function dt(e, t) { return e | t } function vt(e) { var t = s(); return this.bitwiseTo(e, dt, t), t } function mt(e, t) { return e ^ t } function gt(e) { var t = s(); return this.bitwiseTo(e, mt, t), t } function yt(e, t) { return e & ~t } function bt(e) { var t = s(); return this.bitwiseTo(e, yt, t), t } function wt() { var e = s(); for (var t = 0; t < this.t; ++t)e.data[t] = this.DM & ~this.data[t]; return e.t = this.t, e.s = ~this.s, e } function Et(e) { var t = s(); return e < 0 ? this.rShiftTo(-e, t) : this.lShiftTo(e, t), t } function St(e) { var t = s(); return e < 0 ? this.lShiftTo(-e, t) : this.rShiftTo(e, t), t } function xt(e) { if (e == 0) return -1; var t = 0; return (e & 65535) == 0 && (e >>= 16, t += 16), (e & 255) == 0 && (e >>= 8, t += 8), (e & 15) == 0 && (e >>= 4, t += 4), (e & 3) == 0 && (e >>= 2, t += 2), (e & 1) == 0 && ++t, t } function Tt() { for (var e = 0; e < this.t; ++e)if (this.data[e] != 0) return e * this.DB + xt(this.data[e]); return this.s < 0 ? this.t * this.DB : -1 } function Nt(e) { var t = 0; while (e != 0) e &= e - 1, ++t; return t } function Ct() { var e = 0, t = this.s & this.DM; for (var n = 0; n < this.t; ++n)e += Nt(this.data[n] ^ t); return e } function kt(e) { var t = Math.floor(e / this.DB); return t >= this.t ? this.s != 0 : (this.data[t] & 1 << e % this.DB) != 0 } function Lt(e, t) { var n = i.ONE.shiftLeft(e); return this.bitwiseTo(n, t, n), n } function At(e) { return this.changeBit(e, dt) } function Ot(e) { return this.changeBit(e, yt) } function Mt(e) { return this.changeBit(e, mt) } function _t(e, t) { var n = 0, r = 0, i = Math.min(e.t, this.t); while (n < i) r += this.data[n] + e.data[n], t.data[n++] = r & this.DM, r >>= this.DB; if (e.t < this.t) { r += e.s; while (n < this.t) r += this.data[n], t.data[n++] = r & this.DM, r >>= this.DB; r += this.s } else { r += this.s; while (n < e.t) r += e.data[n], t.data[n++] = r & this.DM, r >>= this.DB; r += e.s } t.s = r < 0 ? -1 : 0, r > 0 ? t.data[n++] = r : r < -1 && (t.data[n++] = this.DV + r), t.t = n, t.clamp() } function Dt(e) { var t = s(); return this.addTo(e, t), t } function Pt(e) { var t = s(); return this.subTo(e, t), t } function Ht(e) { var t = s(); return this.multiplyTo(e, t), t } function Bt(e) { var t = s(); return this.divRemTo(e, t, null), t } function jt(e) { var t = s(); return this.divRemTo(e, null, t), t } function Ft(e) { var t = s(), n = s(); return this.divRemTo(e, t, n), new Array(t, n) } function It(e) { this.data[this.t] = this.am(0, e - 1, this, 0, 0, this.t), ++this.t, this.clamp() } function qt(e, t) { if (e == 0) return; while (this.t <= t) this.data[this.t++] = 0; this.data[t] += e; while (this.data[t] >= this.DV) this.data[t] -= this.DV, ++t >= this.t && (this.data[this.t++] = 0), ++this.data[t] } function Rt() { } function Ut(e) { return e } function zt(e, t, n) { e.multiplyTo(t, n) } function Wt(e, t) { e.squareTo(t) } function Xt(e) { return this.exp(e, new Rt) } function Vt(e, t, n) { var r = Math.min(this.t + e.t, t); n.s = 0, n.t = r; while (r > 0) n.data[--r] = 0; var i; for (i = n.t - this.t; r < i; ++r)n.data[r + this.t] = this.am(0, e.data[r], n, r, 0, this.t); for (i = Math.min(e.t, t); r < i; ++r)this.am(0, e.data[r], n, r, 0, t - r); n.clamp() } function $t(e, t, n) { --t; var r = n.t = this.t + e.t - t; n.s = 0; while (--r >= 0) n.data[r] = 0; for (r = Math.max(t - this.t, 0); r < e.t; ++r)n.data[this.t + r - t] = this.am(t - r, e.data[r], n, 0, 0, this.t + r - t); n.clamp(), n.drShiftTo(1, n) } function Jt(e) { this.r2 = s(), this.q3 = s(), i.ONE.dlShiftTo(2 * e.t, this.r2), this.mu = this.r2.divide(e), this.m = e } function Kt(e) { if (e.s < 0 || e.t > 2 * this.m.t) return e.mod(this.m); if (e.compareTo(this.m) < 0) return e; var t = s(); return e.copyTo(t), this.reduce(t), t } function Qt(e) { return e } function Gt(e) { e.drShiftTo(this.m.t - 1, this.r2), e.t > this.m.t + 1 && (e.t = this.m.t + 1, e.clamp()), this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3), this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); while (e.compareTo(this.r2) < 0) e.dAddOffset(1, this.m.t + 1); e.subTo(this.r2, e); while (e.compareTo(this.m) >= 0) e.subTo(this.m, e) } function Yt(e, t) { e.squareTo(t), this.reduce(t) } function Zt(e, t, n) { e.multiplyTo(t, n), this.reduce(n) } function en(e, t) { var n = e.bitLength(), r, i = y(1), o; if (n <= 0) return i; n < 18 ? r = 1 : n < 48 ? r = 3 : n < 144 ? r = 4 : n < 768 ? r = 5 : r = 6, n < 8 ? o = new B(t) : t.isEven() ? o = new Jt(t) : o = new z(t); var u = new Array, a = 3, f = r - 1, l = (1 << r) - 1; u[1] = o.convert(this); if (r > 1) { var c = s(); o.sqrTo(u[1], c); while (a <= l) u[a] = s(), o.mulTo(c, u[a - 2], u[a]), a += 2 } var h = e.t - 1, p, d = !0, v = s(), m; n = N(e.data[h]) - 1; while (h >= 0) { n >= f ? p = e.data[h] >> n - f & l : (p = (e.data[h] & (1 << n + 1) - 1) << f - n, h > 0 && (p |= e.data[h - 1] >> this.DB + n - f)), a = r; while ((p & 1) == 0) p >>= 1, --a; (n -= a) < 0 && (n += this.DB, --h); if (d) u[p].copyTo(i), d = !1; else { while (a > 1) o.sqrTo(i, v), o.sqrTo(v, i), a -= 2; a > 0 ? o.sqrTo(i, v) : (m = i, i = v, v = m), o.mulTo(v, u[p], i) } while (h >= 0 && (e.data[h] & 1 << n) == 0) o.sqrTo(i, v), m = i, i = v, v = m, --n < 0 && (n = this.DB - 1, --h) } return o.revert(i) } function tn(e) { var t = this.s < 0 ? this.negate() : this.clone(), n = e.s < 0 ? e.negate() : e.clone(); if (t.compareTo(n) < 0) { var r = t; t = n, n = r } var i = t.getLowestSetBit(), s = n.getLowestSetBit(); if (s < 0) return t; i < s && (s = i), s > 0 && (t.rShiftTo(s, t), n.rShiftTo(s, n)); while (t.signum() > 0) (i = t.getLowestSetBit()) > 0 && t.rShiftTo(i, t), (i = n.getLowestSetBit()) > 0 && n.rShiftTo(i, n), t.compareTo(n) >= 0 ? (t.subTo(n, t), t.rShiftTo(1, t)) : (n.subTo(t, n), n.rShiftTo(1, n)); return s > 0 && n.lShiftTo(s, n), n } function nn(e) { if (e <= 0) return 0; var t = this.DV % e, n = this.s < 0 ? e - 1 : 0; if (this.t > 0) if (t == 0) n = this.data[0] % e; else for (var r = this.t - 1; r >= 0; --r)n = (t * n + this.data[r]) % e; return n } function rn(e) { var t = e.isEven(); if (this.isEven() && t || e.signum() == 0) return i.ZERO; var n = e.clone(), r = this.clone(), s = y(1), o = y(0), u = y(0), a = y(1); while (n.signum() != 0) { while (n.isEven()) { n.rShiftTo(1, n); if (t) { if (!s.isEven() || !o.isEven()) s.addTo(this, s), o.subTo(e, o); s.rShiftTo(1, s) } else o.isEven() || o.subTo(e, o); o.rShiftTo(1, o) } while (r.isEven()) { r.rShiftTo(1, r); if (t) { if (!u.isEven() || !a.isEven()) u.addTo(this, u), a.subTo(e, a); u.rShiftTo(1, u) } else a.isEven() || a.subTo(e, a); a.rShiftTo(1, a) } n.compareTo(r) >= 0 ? (n.subTo(r, n), t && s.subTo(u, s), o.subTo(a, o)) : (r.subTo(n, r), t && u.subTo(s, u), a.subTo(o, a)) } return r.compareTo(i.ONE) != 0 ? i.ZERO : a.compareTo(e) >= 0 ? a.subtract(e) : a.signum() < 0 ? (a.addTo(e, a), a.signum() < 0 ? a.add(e) : a) : a } function un(e) { var t, n = this.abs(); if (n.t == 1 && n.data[0] <= sn[sn.length - 1]) { for (t = 0; t < sn.length; ++t)if (n.data[0] == sn[t]) return !0; return !1 } if (n.isEven()) return !1; t = 1; while (t < sn.length) { var r = sn[t], i = t + 1; while (i < sn.length && r < on) r *= sn[i++]; r = n.modInt(r); while (t < i) if (r % sn[t++] == 0) return !1 } return n.millerRabin(e) } function an(e) { var t = this.subtract(i.ONE), n = t.getLowestSetBit(); if (n <= 0) return !1; var r = t.shiftRight(n), s = fn(), o; for (var u = 0; u < e; ++u) { do o = new i(this.bitLength(), s); while (o.compareTo(i.ONE) <= 0 || o.compareTo(t) >= 0); var a = o.modPow(r, this); if (a.compareTo(i.ONE) != 0 && a.compareTo(t) != 0) { var f = 1; while (f++ < n && a.compareTo(t) != 0) { a = a.modPowInt(2, this); if (a.compareTo(i.ONE) == 0) return !1 } if (a.compareTo(t) != 0) return !1 } } return !0 } function fn() { return { nextBytes: function (e) { for (var t = 0; t < e.length; ++t)e[t] = Math.floor(Math.random() * 256) } } } var t, n = 0xdeadbeefcafe, r = (n & 16777215) == 15715070; typeof navigator == "undefined" ? (i.prototype.am = a, t = 28) : r && navigator.appName == "Microsoft Internet Explorer" ? (i.prototype.am = u, t = 30) : r && navigator.appName != "Netscape" ? (i.prototype.am = o, t = 26) : (i.prototype.am = a, t = 28), i.prototype.DB = t, i.prototype.DM = (1 << t) - 1, i.prototype.DV = 1 << t; var f = 52; i.prototype.FV = Math.pow(2, f), i.prototype.F1 = f - t, i.prototype.F2 = 2 * t - f; var l = "0123456789abcdefghijklmnopqrstuvwxyz", c = new Array, h, p; h = "0".charCodeAt(0); for (p = 0; p <= 9; ++p)c[h++] = p; h = "a".charCodeAt(0); for (p = 10; p < 36; ++p)c[h++] = p; h = "A".charCodeAt(0); for (p = 10; p < 36; ++p)c[h++] = p; B.prototype.convert = j, B.prototype.revert = F, B.prototype.reduce = I, B.prototype.mulTo = q, B.prototype.sqrTo = R, z.prototype.convert = W, z.prototype.revert = X, z.prototype.reduce = V, z.prototype.mulTo = J, z.prototype.sqrTo = $, i.prototype.copyTo = m, i.prototype.fromInt = g, i.prototype.fromString = b, i.prototype.clamp = w, i.prototype.dlShiftTo = k, i.prototype.drShiftTo = L, i.prototype.lShiftTo = A, i.prototype.rShiftTo = O, i.prototype.subTo = M, i.prototype.multiplyTo = _, i.prototype.squareTo = D, i.prototype.divRemTo = P, i.prototype.invDigit = U, i.prototype.isEven = K, i.prototype.exp = Q, i.prototype.toString = E, i.prototype.negate = S, i.prototype.abs = x, i.prototype.compareTo = T, i.prototype.bitLength = C, i.prototype.mod = H, i.prototype.modPowInt = G, i.ZERO = y(0), i.ONE = y(1), Rt.prototype.convert = Ut, Rt.prototype.revert = Ut, Rt.prototype.mulTo = zt, Rt.prototype.sqrTo = Wt, Jt.prototype.convert = Kt, Jt.prototype.revert = Qt, Jt.prototype.reduce = Gt, Jt.prototype.mulTo = Zt, Jt.prototype.sqrTo = Yt; var sn = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509], on = (1 << 26) / sn[sn.length - 1]; i.prototype.chunkSize = nt, i.prototype.toRadix = it, i.prototype.fromRadix = st, i.prototype.fromNumber = ot, i.prototype.bitwiseTo = ct, i.prototype.changeBit = Lt, i.prototype.addTo = _t, i.prototype.dMultiply = It, i.prototype.dAddOffset = qt, i.prototype.multiplyLowerTo = Vt, i.prototype.multiplyUpperTo = $t, i.prototype.modInt = nn, i.prototype.millerRabin = an, i.prototype.clone = Y, i.prototype.intValue = Z, i.prototype.byteValue = et, i.prototype.shortValue = tt, i.prototype.signum = rt, i.prototype.toByteArray = ut, i.prototype.equals = at, i.prototype.min = ft, i.prototype.max = lt, i.prototype.and = pt, i.prototype.or = vt, i.prototype.xor = gt, i.prototype.andNot = bt, i.prototype.not = wt, i.prototype.shiftLeft = Et, i.prototype.shiftRight = St, i.prototype.getLowestSetBit = Tt, i.prototype.bitCount = Ct, i.prototype.testBit = kt, i.prototype.setBit = At, i.prototype.clearBit = Ot, i.prototype.flipBit = Mt, i.prototype.add = Dt, i.prototype.subtract = Pt, i.prototype.multiply = Ht, i.prototype.divide = Bt, i.prototype.remainder = jt, i.prototype.divideAndRemainder = Ft, i.prototype.modPow = en, i.prototype.modInverse = rn, i.prototype.pow = Xt, i.prototype.gcd = tn, i.prototype.isProbablePrime = un, e.jsbn = e.jsbn || {}, e.jsbn.BigInteger = i } var r = "jsbn"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/jsbn", ["require", "module"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function n(t, n, r) { r || (r = e.md.sha1.create()); var i = "", s = Math.ceil(n / r.digestLength); for (var o = 0; o < s; ++o) { var u = String.fromCharCode(o >> 24 & 255, o >> 16 & 255, o >> 8 & 255, o & 255); r.start(), r.update(t + u), i += r.digest().getBytes() } return i.substring(0, n) } var t = e.pkcs1 = e.pkcs1 || {}; t.encode_rsa_oaep = function (t, r, i) { var s, o, u, a; typeof i == "string" ? (s = i, o = arguments[3] || undefined, u = arguments[4] || undefined) : i && (s = i.label || undefined, o = i.seed || undefined, u = i.md || undefined, i.mgf1 && i.mgf1.md && (a = i.mgf1.md)), u ? u.start() : u = e.md.sha1.create(), a || (a = u); var f = Math.ceil(t.n.bitLength() / 8), l = f - 2 * u.digestLength - 2; if (r.length > l) { var c = new Error("RSAES-OAEP input message length is too long."); throw c.length = r.length, c.maxLength = l, c } s || (s = ""), u.update(s, "raw"); var h = u.digest(), p = "", d = l - r.length; for (var v = 0; v < d; v++)p += "\0"; var m = h.getBytes() + p + "" + r; if (!o) o = e.random.getBytes(u.digestLength); else if (o.length !== u.digestLength) { var c = new Error("Invalid RSAES-OAEP seed. The seed length must match the digest length."); throw c.seedLength = o.length, c.digestLength = u.digestLength, c } var g = n(o, f - u.digestLength - 1, a), y = e.util.xorBytes(m, g, m.length), b = n(y, u.digestLength, a), w = e.util.xorBytes(o, b, o.length); return "\0" + w + y }, t.decode_rsa_oaep = function (t, r, i) { var s, o, u; typeof i == "string" ? (s = i, o = arguments[3] || undefined) : i && (s = i.label || undefined, o = i.md || undefined, i.mgf1 && i.mgf1.md && (u = i.mgf1.md)); var a = Math.ceil(t.n.bitLength() / 8); if (r.length !== a) { var f = new Error("RSAES-OAEP encoded message length is invalid."); throw f.length = r.length, f.expectedLength = a, f } o === undefined ? o = e.md.sha1.create() : o.start(), u || (u = o); if (a < 2 * o.digestLength + 2) throw new Error("RSAES-OAEP key is too short for the hash function."); s || (s = ""), o.update(s, "raw"); var l = o.digest().getBytes(), c = r.charAt(0), h = r.substring(1, o.digestLength + 1), p = r.substring(1 + o.digestLength), d = n(p, o.digestLength, u), v = e.util.xorBytes(h, d, h.length), m = n(v, a - o.digestLength - 1, u), g = e.util.xorBytes(p, m, p.length), y = g.substring(0, o.digestLength), f = c !== "\0"; for (var b = 0; b < o.digestLength; ++b)f |= l.charAt(b) !== y.charAt(b); var w = 1, E = o.digestLength; for (var S = o.digestLength; S < g.length; S++) { var x = g.charCodeAt(S), T = x & 1 ^ 1, N = w ? 65534 : 0; f |= x & N, w &= T, E += w } if (f || g.charCodeAt(E) !== 1) throw new Error("Invalid RSAES-OAEP padding."); return g.substring(E + 1) } } var r = "pkcs1"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/pkcs1", ["require", "module", "./util", "./random", "./sha1"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function o(e, t, n, r) { return "workers" in n ? a(e, t, n, r) : u(e, t, n, r) } function u(t, n, i, s) { var o = f(t, n), a = 0, c = l(o.bitLength()); "millerRabinTests" in i && (c = i.millerRabinTests); var h = 10; "maxBlockTime" in i && (h = i.maxBlockTime); var p = +(new Date); do { o.bitLength() > t && (o = f(t, n)); if (o.isProbablePrime(c)) return s(null, o); o.dAddOffset(r[a++ % 8], 0) } while (h < 0 || +(new Date) - p < h); e.util.setImmediate(function () { u(t, n, i, s) }) } function a(t, r, i, s) { function p() { function d(i) { if (p) return; --u; var a = i.data; if (a.found) { for (var h = 0; h < e.length; ++h)e[h].terminate(); return p = !0, s(null, new n(a.prime, 16)) } o.bitLength() > t && (o = f(t, r)); var d = o.toString(16); i.target.postMessage({ hex: d, workLoad: l }), o.dAddOffset(c, 0) } a = Math.max(1, a); var e = []; for (var i = 0; i < a; ++i)e[i] = new Worker(h); var u = a; for (var i = 0; i < a; ++i)e[i].addEventListener("message", d); var p = !1 } if (typeof Worker == "undefined") return u(t, r, i, s); var o = f(t, r), a = i.workers, l = i.workLoad || 100, c = l * 30 / 8, h = i.workerScript || "forge/prime.worker.js"; if (a === -1) return e.util.estimateCores(function (e, t) { e && (t = 2), a = t - 1, p() }); p() } function f(e, t) { var r = new n(e, t), o = e - 1; return r.testBit(o) || r.bitwiseTo(n.ONE.shiftLeft(o), s, r), r.dAddOffset(31 - r.mod(i).byteValue(), 0), r } function l(e) { return e <= 100 ? 27 : e <= 150 ? 18 : e <= 200 ? 15 : e <= 250 ? 12 : e <= 300 ? 9 : e <= 350 ? 8 : e <= 400 ? 7 : e <= 500 ? 6 : e <= 600 ? 5 : e <= 800 ? 4 : e <= 1250 ? 3 : 2 } if (e.prime) return; var t = e.prime = e.prime || {}, n = e.jsbn.BigInteger, r = [6, 4, 2, 4, 2, 4, 6, 2], i = new n(null); i.fromInt(30); var s = function (e, t) { return e | t }; t.generateProbablePrime = function (t, n, r) { typeof n == "function" && (r = n, n = {}), n = n || {}; var i = n.algorithm || "PRIMEINC"; typeof i == "string" && (i = { name: i }), i.options = i.options || {}; var s = n.prng || e.random, u = { nextBytes: function (e) { var t = s.getBytesSync(e.length); for (var n = 0; n < e.length; ++n)e[n] = t.charCodeAt(n) } }; if (i.name === "PRIMEINC") return o(t, u, i.options, r); throw new Error("Invalid prime generation algorithm: " + i.name) } } var r = "prime"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/prime", ["require", "module", "./util", "./jsbn", "./random"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function c(t, n, r) { var i = e.util.createBuffer(), s = Math.ceil(n.n.bitLength() / 8); if (t.length > s - 11) { var o = new Error("Message is too long for PKCS#1 v1.5 padding."); throw o.length = t.length, o.max = s - 11, o } i.putByte(0), i.putByte(r); var u = s - 3 - t.length, a; if (r === 0 || r === 1) { a = r === 0 ? 0 : 255; for (var f = 0; f < u; ++f)i.putByte(a) } else while (u > 0) { var l = 0, c = e.random.getBytes(u); for (var f = 0; f < u; ++f)a = c.charCodeAt(f), a === 0 ? ++l : i.putByte(a); u = l } return i.putByte(0), i.putBytes(t), i } function h(t, n, r, i) { var s = Math.ceil(n.n.bitLength() / 8), o = e.util.createBuffer(t), u = o.getByte(), a = o.getByte(); if (u !== 0 || r && a !== 0 && a !== 1 || !r && a != 2 || r && a === 0 && typeof i == "undefined") throw new Error("Encryption block is invalid."); var f = 0; if (a === 0) { f = s - 3 - i; for (var l = 0; l < f; ++l)if (o.getByte() !== 0) throw new Error("Encryption block is invalid.") } else if (a === 1) { f = 0; while (o.length() > 1) { if (o.getByte() !== 255) { --o.read; break } ++f } } else if (a === 2) { f = 0; while (o.length() > 1) { if (o.getByte() === 0) { --o.read; break } ++f } } var c = o.getByte(); if (c !== 0 || f !== s - 3 - o.length()) throw new Error("Encryption block is invalid."); return o.getBytes() } function p(n, i, s) { function u() { a(n.pBits, function (e, t) { if (e) return s(e); n.p = t; if (n.q !== null) return f(e, n.q); a(n.qBits, f) }) } function a(t, n) { e.prime.generateProbablePrime(t, o, n) } function f(e, i) { if (e) return s(e); n.q = i; if (n.p.compareTo(n.q) < 0) { var o = n.p; n.p = n.q, n.q = o } if (n.p.subtract(t.ONE).gcd(n.e).compareTo(t.ONE) !== 0) { n.p = null, u(); return } if (n.q.subtract(t.ONE).gcd(n.e).compareTo(t.ONE) !== 0) { n.q = null, a(n.qBits, f); return } n.p1 = n.p.subtract(t.ONE), n.q1 = n.q.subtract(t.ONE), n.phi = n.p1.multiply(n.q1); if (n.phi.gcd(n.e).compareTo(t.ONE) !== 0) { n.p = n.q = null, u(); return } n.n = n.p.multiply(n.q); if (n.n.bitLength() !== n.bits) { n.q = null, a(n.qBits, f); return } var l = n.e.modInverse(n.phi); n.keys = { privateKey: r.rsa.setPrivateKey(n.n, n.e, l, n.p, n.q, l.mod(n.p1), l.mod(n.q1), n.q.modInverse(n.p)), publicKey: r.rsa.setPublicKey(n.n, n.e) }, s(null, n.keys) } typeof i == "function" && (s = i, i = {}), i = i || {}; var o = { algorithm: { name: i.algorithm || "PRIMEINC", options: { workers: i.workers || 2, workLoad: i.workLoad || 100, workerScript: i.workerScript } } }; "prng" in i && (o.prng = i.prng), u() } function d(t) { var n = t.toString(16); return n[0] >= "8" && (n = "00" + n), e.util.hexToBytes(n) } function v(e) { return e <= 100 ? 27 : e <= 150 ? 18 : e <= 200 ? 15 : e <= 250 ? 12 : e <= 300 ? 9 : e <= 350 ? 8 : e <= 400 ? 7 : e <= 500 ? 6 : e <= 600 ? 5 : e <= 800 ? 4 : e <= 1250 ? 3 : 2 } function m(e) { return typeof window != "undefined" && typeof window.crypto == "object" && typeof window.crypto.subtle == "object" && typeof window.crypto.subtle[e] == "function" } function g(e) { return typeof window != "undefined" && typeof window.msCrypto == "object" && typeof window.msCrypto.subtle == "object" && typeof window.msCrypto.subtle[e] == "function" } function y(t) { var n = e.util.hexToBytes(t.toString(16)), r = new Uint8Array(n.length); for (var i = 0; i < n.length; ++i)r[i] = n.charCodeAt(i); return r } function b(e) { if (e.kty !== "RSA") throw new Error('Unsupported key algorithm "' + e.kty + '"; algorithm must be "RSA".'); return r.setRsaPrivateKey(E(e.n), E(e.e), E(e.d), E(e.p), E(e.q), E(e.dp), E(e.dq), E(e.qi)) } function w(e) { if (e.kty !== "RSA") throw new Error('Key algorithm must be "RSA".'); return r.setRsaPublicKey(E(e.n), E(e.e)) } function E(n) { return new t(e.util.bytesToHex(e.util.decode64(n)), 16) } if (typeof t == "undefined") var t = e.jsbn.BigInteger; var n = e.asn1; e.pki = e.pki || {}, e.pki.rsa = e.rsa = e.rsa || {}; var r = e.pki, i = [6, 4, 2, 4, 2, 4, 6, 2], s = { name: "PrivateKeyInfo", tagClass: n.Class.UNIVERSAL, type: n.Type.SEQUENCE, constructed: !0, value: [{ name: "PrivateKeyInfo.version", tagClass: n.Class.UNIVERSAL, type: n.Type.INTEGER, constructed: !1, capture: "privateKeyVersion" }, { name: "PrivateKeyInfo.privateKeyAlgorithm", tagClass: n.Class.UNIVERSAL, type: n.Type.SEQUENCE, constructed: !0, value: [{ name: "AlgorithmIdentifier.algorithm", tagClass: n.Class.UNIVERSAL, type: n.Type.OID, constructed: !1, capture: "privateKeyOid" }] }, { name: "PrivateKeyInfo", tagClass: n.Class.UNIVERSAL, type: n.Type.OCTETSTRING, constructed: !1, capture: "privateKey" }] }, o = { name: "RSAPrivateKey", tagClass: n.Class.UNIVERSAL, type: n.Type.SEQUENCE, constructed: !0, value: [{ name: "RSAPrivateKey.version", tagClass: n.Class.UNIVERSAL, type: n.Type.INTEGER, constructed: !1, capture: "privateKeyVersion" }, { name: "RSAPrivateKey.modulus", tagClass: n.Class.UNIVERSAL, type: n.Type.INTEGER, constructed: !1, capture: "privateKeyModulus" }, { name: "RSAPrivateKey.publicExponent", tagClass: n.Class.UNIVERSAL, type: n.Type.INTEGER, constructed: !1, capture: "privateKeyPublicExponent" }, { name: "RSAPrivateKey.privateExponent", tagClass: n.Class.UNIVERSAL, type: n.Type.INTEGER, constructed: !1, capture: "privateKeyPrivateExponent" }, { name: "RSAPrivateKey.prime1", tagClass: n.Class.UNIVERSAL, type: n.Type.INTEGER, constructed: !1, capture: "privateKeyPrime1" }, { name: "RSAPrivateKey.prime2", tagClass: n.Class.UNIVERSAL, type: n.Type.INTEGER, constructed: !1, capture: "privateKeyPrime2" }, { name: "RSAPrivateKey.exponent1", tagClass: n.Class.UNIVERSAL, type: n.Type.INTEGER, constructed: !1, capture: "privateKeyExponent1" }, { name: "RSAPrivateKey.exponent2", tagClass: n.Class.UNIVERSAL, type: n.Type.INTEGER, constructed: !1, capture: "privateKeyExponent2" }, { name: "RSAPrivateKey.coefficient", tagClass: n.Class.UNIVERSAL, type: n.Type.INTEGER, constructed: !1, capture: "privateKeyCoefficient" }] }, u = { name: "RSAPublicKey", tagClass: n.Class.UNIVERSAL, type: n.Type.SEQUENCE, constructed: !0, value: [{ name: "RSAPublicKey.modulus", tagClass: n.Class.UNIVERSAL, type: n.Type.INTEGER, constructed: !1, capture: "publicKeyModulus" }, { name: "RSAPublicKey.exponent", tagClass: n.Class.UNIVERSAL, type: n.Type.INTEGER, constructed: !1, capture: "publicKeyExponent" }] }, a = e.pki.rsa.publicKeyValidator = { name: "SubjectPublicKeyInfo", tagClass: n.Class.UNIVERSAL, type: n.Type.SEQUENCE, constructed: !0, captureAsn1: "subjectPublicKeyInfo", value: [{ name: "SubjectPublicKeyInfo.AlgorithmIdentifier", tagClass: n.Class.UNIVERSAL, type: n.Type.SEQUENCE, constructed: !0, value: [{ name: "AlgorithmIdentifier.algorithm", tagClass: n.Class.UNIVERSAL, type: n.Type.OID, constructed: !1, capture: "publicKeyOid" }] }, { name: "SubjectPublicKeyInfo.subjectPublicKey", tagClass: n.Class.UNIVERSAL, type: n.Type.BITSTRING, constructed: !1, value: [{ name: "SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey", tagClass: n.Class.UNIVERSAL, type: n.Type.SEQUENCE, constructed: !0, optional: !0, captureAsn1: "rsaPublicKey" }] }] }, f = function (e) { var t; if (e.algorithm in r.oids) { t = r.oids[e.algorithm]; var s = n.oidToDer(t).getBytes(), o = n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, []), u = n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, []); u.value.push(n.create(n.Class.UNIVERSAL, n.Type.OID, !1, s)), u.value.push(n.create(n.Class.UNIVERSAL, n.Type.NULL, !1, "")); var a = n.create(n.Class.UNIVERSAL, n.Type.OCTETSTRING, !1, e.digest().getBytes()); return o.value.push(u), o.value.push(a), n.toDer(o).getBytes() } var i = new Error("Unknown message digest algorithm."); throw i.algorithm = e.algorithm, i }, l = function (n, r, i) { if (i) return n.modPow(r.e, r.n); if (!r.p || !r.q) return n.modPow(r.d, r.n); r.dP || (r.dP = r.d.mod(r.p.subtract(t.ONE))), r.dQ || (r.dQ = r.d.mod(r.q.subtract(t.ONE))), r.qInv || (r.qInv = r.q.modInverse(r.p)); var s; do s = new t(e.util.bytesToHex(e.random.getBytes(r.n.bitLength() / 8)), 16); while (s.compareTo(r.n) >= 0 || !s.gcd(r.n).equals(t.ONE)); n = n.multiply(s.modPow(r.e, r.n)).mod(r.n); var o = n.mod(r.p).modPow(r.dP, r.p), u = n.mod(r.q).modPow(r.dQ, r.q); while (o.compareTo(u) < 0) o = o.add(r.p); var a = o.subtract(u).multiply(r.qInv).mod(r.p).multiply(r.q).add(u); return a = a.multiply(s.modInverse(r.n)).mod(r.n), a }; r.rsa.encrypt = function (n, r, i) { var s = i, o, u = Math.ceil(r.n.bitLength() / 8); i !== !1 && i !== !0 ? (s = i === 2, o = c(n, r, i)) : (o = e.util.createBuffer(), o.putBytes(n)); var a = new t(o.toHex(), 16), f = l(a, r, s), h = f.toString(16), p = e.util.createBuffer(), d = u - Math.ceil(h.length / 2); while (d > 0) p.putByte(0), --d; return p.putBytes(e.util.hexToBytes(h)), p.getBytes() }, r.rsa.decrypt = function (n, r, i, s) { var o = Math.ceil(r.n.bitLength() / 8); if (n.length !== o) { var u = new Error("Encrypted message length is invalid."); throw u.length = n.length, u.expected = o, u } var a = new t(e.util.createBuffer(n).toHex(), 16); if (a.compareTo(r.n) >= 0) throw new Error("Encrypted message is invalid."); var f = l(a, r, i), c = f.toString(16), p = e.util.createBuffer(), d = o - Math.ceil(c.length / 2); while (d > 0) p.putByte(0), --d; return p.putBytes(e.util.hexToBytes(c)), s !== !1 ? h(p.getBytes(), r, i) : p.getBytes() }, r.rsa.createKeyPairGenerationState = function (n, r, i) { typeof n == "string" && (n = parseInt(n, 10)), n = n || 2048, i = i || {}; var s = i.prng || e.random, o = { nextBytes: function (e) { var t = s.getBytesSync(e.length); for (var n = 0; n < e.length; ++n)e[n] = t.charCodeAt(n) } }, u = i.algorithm || "PRIMEINC", a; if (u !== "PRIMEINC") throw new Error("Invalid key generation algorithm: " + u); return a = { algorithm: u, state: 0, bits: n, rng: o, eInt: r || 65537, e: new t(null), p: null, q: null, qBits: n >> 1, pBits: n - (n >> 1), pqState: 0, num: null, keys: null }, a.e.fromInt(a.eInt), a }, r.rsa.stepKeyPairGenerationState = function (e, n) { "algorithm" in e || (e.algorithm = "PRIMEINC"); var s = new t(null); s.fromInt(30); var o = 0, u = function (e, t) { return e | t }, a = +(new Date), f, l = 0; while (e.keys === null && (n <= 0 || l < n)) { if (e.state === 0) { var c = e.p === null ? e.pBits : e.qBits, h = c - 1; e.pqState === 0 ? (e.num = new t(c, e.rng), e.num.testBit(h) || e.num.bitwiseTo(t.ONE.shiftLeft(h), u, e.num), e.num.dAddOffset(31 - e.num.mod(s).byteValue(), 0), o = 0, ++e.pqState) : e.pqState === 1 ? e.num.bitLength() > c ? e.pqState = 0 : e.num.isProbablePrime(v(e.num.bitLength())) ? ++e.pqState : e.num.dAddOffset(i[o++ % 8], 0) : e.pqState === 2 ? e.pqState = e.num.subtract(t.ONE).gcd(e.e).compareTo(t.ONE) === 0 ? 3 : 0 : e.pqState === 3 && (e.pqState = 0, e.p === null ? e.p = e.num : e.q = e.num, e.p !== null && e.q !== null && ++e.state, e.num = null) } else if (e.state === 1) e.p.compareTo(e.q) < 0 && (e.num = e.p, e.p = e.q, e.q = e.num), ++e.state; else if (e.state === 2) e.p1 = e.p.subtract(t.ONE), e.q1 = e.q.subtract(t.ONE), e.phi = e.p1.multiply(e.q1), ++e.state; else if (e.state === 3) e.phi.gcd(e.e).compareTo(t.ONE) === 0 ? ++e.state : (e.p = null, e.q = null, e.state = 0); else if (e.state === 4) e.n = e.p.multiply(e.q), e.n.bitLength() === e.bits ? ++e.state : (e.q = null, e.state = 0); else if (e.state === 5) { var p = e.e.modInverse(e.phi); e.keys = { privateKey: r.rsa.setPrivateKey(e.n, e.e, p, e.p, e.q, p.mod(e.p1), p.mod(e.q1), e.q.modInverse(e.p)), publicKey: r.rsa.setPublicKey(e.n, e.e) } } f = +(new Date), l += f - a, a = f } return e.keys !== null }, r.rsa.generateKeyPair = function (t, i, s, o) { arguments.length === 1 ? typeof t == "object" ? (s = t, t = undefined) : typeof t == "function" && (o = t, t = undefined) : arguments.length === 2 ? typeof t == "number" ? typeof i == "function" ? (o = i, i = undefined) : typeof i != "number" && (s = i, i = undefined) : (s = t, o = i, t = undefined, i = undefined) : arguments.length === 3 && (typeof i == "number" ? typeof s == "function" && (o = s, s = undefined) : (o = s, s = i, i = undefined)), s = s || {}, t === undefined && (t = s.bits || 2048), i === undefined && (i = s.e || 65537); if (!e.disableNativeCode && o && t >= 256 && t <= 16384 && (i === 65537 || i === 3)) { if (m("generateKey") && m("exportKey")) return window.crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: t, publicExponent: y(i), hash: { name: "SHA-256" } }, !0, ["sign", "verify"]).then(function (e) { return window.crypto.subtle.exportKey("pkcs8", e.privateKey) }).catch(function (e) { o(e) }).then(function (t) { if (t) { var i = r.privateKeyFromAsn1(n.fromDer(e.util.createBuffer(t))); o(null, { privateKey: i, publicKey: r.setRsaPublicKey(i.n, i.e) }) } }); if (g("generateKey") && g("exportKey")) { var u = window.msCrypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: t, publicExponent: y(i), hash: { name: "SHA-256" } }, !0, ["sign", "verify"]); u.oncomplete = function (t) { var i = t.target.result, s = window.msCrypto.subtle.exportKey("pkcs8", i.privateKey); s.oncomplete = function (t) { var i = t.target.result, s = r.privateKeyFromAsn1(n.fromDer(e.util.createBuffer(i))); o(null, { privateKey: s, publicKey: r.setRsaPublicKey(s.n, s.e) }) }, s.onerror = function (e) { o(e) } }, u.onerror = function (e) { o(e) }; return } } var a = r.rsa.createKeyPairGenerationState(t, i, s); if (!o) return r.rsa.stepKeyPairGenerationState(a, 0), a.keys; p(a, s, o) }, r.setRsaPublicKey = r.rsa.setPublicKey = function (t, i) { var s = { n: t, e: i }; return s.encrypt = function (t, n, i) { typeof n == "string" ? n = n.toUpperCase() : n === undefined && (n = "RSAES-PKCS1-V1_5"); if (n === "RSAES-PKCS1-V1_5") n = { encode: function (e, t, n) { return c(e, t, 2).getBytes() } }; else if (n === "RSA-OAEP" || n === "RSAES-OAEP") n = { encode: function (t, n) { return e.pkcs1.encode_rsa_oaep(n, t, i) } }; else if (["RAW", "NONE", "NULL", null].indexOf(n) !== -1) n = { encode: function (e) { return e } }; else if (typeof n == "string") throw new Error('Unsupported encryption scheme: "' + n + '".'); var o = n.encode(t, s, !0); return r.rsa.encrypt(o, s, !0) }, s.verify = function (e, t, i) { typeof i == "string" ? i = i.toUpperCase() : i === undefined && (i = "RSASSA-PKCS1-V1_5"); if (i === "RSASSA-PKCS1-V1_5") i = { verify: function (e, t) { t = h(t, s, !0); var r = n.fromDer(t); return e === r.value[1].value } }; else if (i === "NONE" || i === "NULL" || i === null) i = { verify: function (e, t) { return t = h(t, s, !0), e === t } }; var o = r.rsa.decrypt(t, s, !0, !1); return i.verify(e, o, s.n.bitLength()) }, s }, r.setRsaPrivateKey = r.rsa.setPrivateKey = function (t, n, i, s, o, u, a, l) { var c = { n: t, e: n, d: i, p: s, q: o, dP: u, dQ: a, qInv: l }; return c.decrypt = function (t, n, i) { typeof n == "string" ? n = n.toUpperCase() : n === undefined && (n = "RSAES-PKCS1-V1_5"); var s = r.rsa.decrypt(t, c, !1, !1); if (n === "RSAES-PKCS1-V1_5") n = { decode: h }; else if (n === "RSA-OAEP" || n === "RSAES-OAEP") n = { decode: function (t, n) { return e.pkcs1.decode_rsa_oaep(n, t, i) } }; else { if (["RAW", "NONE", "NULL", null].indexOf(n) === -1) throw new Error('Unsupported encryption scheme: "' + n + '".'); n = { decode: function (e) { return e } } } return n.decode(s, c, !1) }, c.sign = function (e, t) { var n = !1; typeof t == "string" && (t = t.toUpperCase()); if (t === undefined || t === "RSASSA-PKCS1-V1_5") t = { encode: f }, n = 1; else if (t === "NONE" || t === "NULL" || t === null) t = { encode: function () { return e } }, n = 1; var i = t.encode(e, c.n.bitLength()); return r.rsa.encrypt(i, c, n) }, c }, r.wrapRsaPrivateKey = function (e) { return n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, [n.create(n.Class.UNIVERSAL, n.Type.INTEGER, !1, n.integerToDer(0).getBytes()), n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, [n.create(n.Class.UNIVERSAL, n.Type.OID, !1, n.oidToDer(r.oids.rsaEncryption).getBytes()), n.create(n.Class.UNIVERSAL, n.Type.NULL, !1, "")]), n.create(n.Class.UNIVERSAL, n.Type.OCTETSTRING, !1, n.toDer(e).getBytes())]) }, r.privateKeyFromAsn1 = function (i) { var u = {}, a = []; n.validate(i, s, u, a) && (i = n.fromDer(e.util.createBuffer(u.privateKey))), u = {}, a = []; if (!n.validate(i, o, u, a)) { var f = new Error("Cannot read private key. ASN.1 object does not contain an RSAPrivateKey."); throw f.errors = a, f } var l, c, h, p, d, v, m, g; return l = e.util.createBuffer(u.privateKeyModulus).toHex(), c = e.util.createBuffer(u.privateKeyPublicExponent).toHex(), h = e.util.createBuffer(u.privateKeyPrivateExponent).toHex(), p = e.util.createBuffer(u.privateKeyPrime1).toHex(), d = e.util.createBuffer(u.privateKeyPrime2).toHex(), v = e.util.createBuffer(u.privateKeyExponent1).toHex(), m = e.util.createBuffer(u.privateKeyExponent2).toHex(), g = e.util.createBuffer(u.privateKeyCoefficient).toHex(), r.setRsaPrivateKey(new t(l, 16), new t(c, 16), new t(h, 16), new t(p, 16), new t(d, 16), new t(v, 16), new t(m, 16), new t(g, 16)) }, r.privateKeyToAsn1 = r.privateKeyToRSAPrivateKey = function (e) { return n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, [n.create(n.Class.UNIVERSAL, n.Type.INTEGER, !1, n.integerToDer(0).getBytes()), n.create(n.Class.UNIVERSAL, n.Type.INTEGER, !1, d(e.n)), n.create(n.Class.UNIVERSAL, n.Type.INTEGER, !1, d(e.e)), n.create(n.Class.UNIVERSAL, n.Type.INTEGER, !1, d(e.d)), n.create(n.Class.UNIVERSAL, n.Type.INTEGER, !1, d(e.p)), n.create(n.Class.UNIVERSAL, n.Type.INTEGER, !1, d(e.q)), n.create(n.Class.UNIVERSAL, n.Type.INTEGER, !1, d(e.dP)), n.create(n.Class.UNIVERSAL, n.Type.INTEGER, !1, d(e.dQ)), n.create(n.Class.UNIVERSAL, n.Type.INTEGER, !1, d(e.qInv))]) }, r.publicKeyFromAsn1 = function (i) { var s = {}, o = []; if (n.validate(i, a, s, o)) { var f = n.derToOid(s.publicKeyOid); if (f !== r.oids.rsaEncryption) { var l = new Error("Cannot read public key. Unknown OID."); throw l.oid = f, l } i = s.rsaPublicKey } o = []; if (!n.validate(i, u, s, o)) { var l = new Error("Cannot read public key. ASN.1 object does not contain an RSAPublicKey."); throw l.errors = o, l } var c = e.util.createBuffer(s.publicKeyModulus).toHex(), h = e.util.createBuffer(s.publicKeyExponent).toHex(); return r.setRsaPublicKey(new t(c, 16), new t(h, 16)) }, r.publicKeyToAsn1 = r.publicKeyToSubjectPublicKeyInfo = function (e) { return n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, [n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, [n.create(n.Class.UNIVERSAL, n.Type.OID, !1, n.oidToDer(r.oids.rsaEncryption).getBytes()), n.create(n.Class.UNIVERSAL, n.Type.NULL, !1, "")]), n.create(n.Class.UNIVERSAL, n.Type.BITSTRING, !1, [r.publicKeyToRSAPublicKey(e)])]) }, r.publicKeyToRSAPublicKey = function (e) { return n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, [n.create(n.Class.UNIVERSAL, n.Type.INTEGER, !1, d(e.n)), n.create(n.Class.UNIVERSAL, n.Type.INTEGER, !1, d(e.e))]) } } var r = "rsa"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/rsa", ["require", "module", "./asn1", "./jsbn", "./oids", "./pkcs1", "./prime", "./random", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function a(e, t) { return e.start().update(t).digest().getBytes() } if (typeof t == "undefined") var t = e.jsbn.BigInteger; var n = e.asn1, r = e.pki = e.pki || {}; r.pbe = e.pbe = e.pbe || {}; var i = r.oids, s = { name: "EncryptedPrivateKeyInfo", tagClass: n.Class.UNIVERSAL, type: n.Type.SEQUENCE, constructed: !0, value: [{ name: "EncryptedPrivateKeyInfo.encryptionAlgorithm", tagClass: n.Class.UNIVERSAL, type: n.Type.SEQUENCE, constructed: !0, value: [{ name: "AlgorithmIdentifier.algorithm", tagClass: n.Class.UNIVERSAL, type: n.Type.OID, constructed: !1, capture: "encryptionOid" }, { name: "AlgorithmIdentifier.parameters", tagClass: n.Class.UNIVERSAL, type: n.Type.SEQUENCE, constructed: !0, captureAsn1: "encryptionParams" }] }, { name: "EncryptedPrivateKeyInfo.encryptedData", tagClass: n.Class.UNIVERSAL, type: n.Type.OCTETSTRING, constructed: !1, capture: "encryptedData" }] }, o = { name: "PBES2Algorithms", tagClass: n.Class.UNIVERSAL, type: n.Type.SEQUENCE, constructed: !0, value: [{ name: "PBES2Algorithms.keyDerivationFunc", tagClass: n.Class.UNIVERSAL, type: n.Type.SEQUENCE, constructed: !0, value: [{ name: "PBES2Algorithms.keyDerivationFunc.oid", tagClass: n.Class.UNIVERSAL, type: n.Type.OID, constructed: !1, capture: "kdfOid" }, { name: "PBES2Algorithms.params", tagClass: n.Class.UNIVERSAL, type: n.Type.SEQUENCE, constructed: !0, value: [{ name: "PBES2Algorithms.params.salt", tagClass: n.Class.UNIVERSAL, type: n.Type.OCTETSTRING, constructed: !1, capture: "kdfSalt" }, { name: "PBES2Algorithms.params.iterationCount", tagClass: n.Class.UNIVERSAL, type: n.Type.INTEGER, onstructed: !0, capture: "kdfIterationCount" }] }] }, { name: "PBES2Algorithms.encryptionScheme", tagClass: n.Class.UNIVERSAL, type: n.Type.SEQUENCE, constructed: !0, value: [{ name: "PBES2Algorithms.encryptionScheme.oid", tagClass: n.Class.UNIVERSAL, type: n.Type.OID, constructed: !1, capture: "encOid" }, { name: "PBES2Algorithms.encryptionScheme.iv", tagClass: n.Class.UNIVERSAL, type: n.Type.OCTETSTRING, constructed: !1, capture: "encIv" }] }] }, u = { name: "pkcs-12PbeParams", tagClass: n.Class.UNIVERSAL, type: n.Type.SEQUENCE, constructed: !0, value: [{ name: "pkcs-12PbeParams.salt", tagClass: n.Class.UNIVERSAL, type: n.Type.OCTETSTRING, constructed: !1, capture: "salt" }, { name: "pkcs-12PbeParams.iterations", tagClass: n.Class.UNIVERSAL, type: n.Type.INTEGER, constructed: !1, capture: "iterations" }] }; r.encryptPrivateKeyInfo = function (t, s, o) { o = o || {}, o.saltSize = o.saltSize || 8, o.count = o.count || 2048, o.algorithm = o.algorithm || "aes128"; var u = e.random.getBytesSync(o.saltSize), a = o.count, f = n.integerToDer(a), l, c, h; if (o.algorithm.indexOf("aes") === 0 || o.algorithm === "des") { var p, d, v; switch (o.algorithm) { case "aes128": l = 16, p = 16, d = i["aes128-CBC"], v = e.aes.createEncryptionCipher; break; case "aes192": l = 24, p = 16, d = i["aes192-CBC"], v = e.aes.createEncryptionCipher; break; case "aes256": l = 32, p = 16, d = i["aes256-CBC"], v = e.aes.createEncryptionCipher; break; case "des": l = 8, p = 8, d = i.desCBC, v = e.des.createEncryptionCipher; break; default: var m = new Error("Cannot encrypt private key. Unknown encryption algorithm."); throw m.algorithm = o.algorithm, m }var g = e.pkcs5.pbkdf2(s, u, a, l), y = e.random.getBytesSync(p), b = v(g); b.start(y), b.update(n.toDer(t)), b.finish(), h = b.output.getBytes(), c = n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, [n.create(n.Class.UNIVERSAL, n.Type.OID, !1, n.oidToDer(i.pkcs5PBES2).getBytes()), n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, [n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, [n.create(n.Class.UNIVERSAL, n.Type.OID, !1, n.oidToDer(i.pkcs5PBKDF2).getBytes()), n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, [n.create(n.Class.UNIVERSAL, n.Type.OCTETSTRING, !1, u), n.create(n.Class.UNIVERSAL, n.Type.INTEGER, !1, f.getBytes())])]), n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, [n.create(n.Class.UNIVERSAL, n.Type.OID, !1, n.oidToDer(d).getBytes()), n.create(n.Class.UNIVERSAL, n.Type.OCTETSTRING, !1, y)])])]) } else { if (o.algorithm !== "3des") { var m = new Error("Cannot encrypt private key. Unknown encryption algorithm."); throw m.algorithm = o.algorithm, m } l = 24; var w = new e.util.ByteBuffer(u), g = r.pbe.generatePkcs12Key(s, w, 1, a, l), y = r.pbe.generatePkcs12Key(s, w, 2, a, l), b = e.des.createEncryptionCipher(g); b.start(y), b.update(n.toDer(t)), b.finish(), h = b.output.getBytes(), c = n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, [n.create(n.Class.UNIVERSAL, n.Type.OID, !1, n.oidToDer(i["pbeWithSHAAnd3-KeyTripleDES-CBC"]).getBytes()), n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, [n.create(n.Class.UNIVERSAL, n.Type.OCTETSTRING, !1, u), n.create(n.Class.UNIVERSAL, n.Type.INTEGER, !1, f.getBytes())])]) } var E = n.create(n.Class.UNIVERSAL, n.Type.SEQUENCE, !0, [c, n.create(n.Class.UNIVERSAL, n.Type.OCTETSTRING, !1, h)]); return E }, r.decryptPrivateKeyInfo = function (t, i) { var o = null, u = {}, a = []; if (!n.validate(t, s, u, a)) { var f = new Error("Cannot read encrypted private key. ASN.1 object is not a supported EncryptedPrivateKeyInfo."); throw f.errors = a, f } var l = n.derToOid(u.encryptionOid), c = r.pbe.getCipher(l, u.encryptionParams, i), h = e.util.createBuffer(u.encryptedData); return c.update(h), c.finish() && (o = n.fromDer(c.output)), o }, r.encryptedPrivateKeyToPem = function (t, r) { var i = { type: "ENCRYPTED PRIVATE KEY", body: n.toDer(t).getBytes() }; return e.pem.encode(i, { maxline: r }) }, r.encryptedPrivateKeyFromPem = function (t) { var r = e.pem.decode(t)[0]; if (r.type !== "ENCRYPTED PRIVATE KEY") { var i = new Error('Could not convert encrypted private key from PEM; PEM header type is "ENCRYPTED PRIVATE KEY".'); throw i.headerType = r.type, i } if (r.procType && r.procType.type === "ENCRYPTED") throw new Error("Could not convert encrypted private key from PEM; PEM is encrypted."); return n.fromDer(r.body) }, r.encryptRsaPrivateKey = function (t, i, s) { s = s || {}; if (!s.legacy) { var o = r.wrapRsaPrivateKey(r.privateKeyToAsn1(t)); return o = r.encryptPrivateKeyInfo(o, i, s), r.encryptedPrivateKeyToPem(o) } var u, a, f, l; switch (s.algorithm) { case "aes128": u = "AES-128-CBC", f = 16, a = e.random.getBytesSync(16), l = e.aes.createEncryptionCipher; break; case "aes192": u = "AES-192-CBC", f = 24, a = e.random.getBytesSync(16), l = e.aes.createEncryptionCipher; break; case "aes256": u = "AES-256-CBC", f = 32, a = e.random.getBytesSync(16), l = e.aes.createEncryptionCipher; break; case "3des": u = "DES-EDE3-CBC", f = 24, a = e.random.getBytesSync(8), l = e.des.createEncryptionCipher; break; case "des": u = "DES-CBC", f = 8, a = e.random.getBytesSync(8), l = e.des.createEncryptionCipher; break; default: var c = new Error('Could not encrypt RSA private key; unsupported encryption algorithm "' + s.algorithm + '".'); throw c.algorithm = s.algorithm, c }var h = e.pbe.opensslDeriveBytes(i, a.substr(0, 8), f), p = l(h); p.start(a), p.update(n.toDer(r.privateKeyToAsn1(t))), p.finish(); var d = { type: "RSA PRIVATE KEY", procType: { version: "4", type: "ENCRYPTED" }, dekInfo: { algorithm: u, parameters: e.util.bytesToHex(a).toUpperCase() }, body: p.output.getBytes() }; return e.pem.encode(d) }, r.decryptRsaPrivateKey = function (t, i) { var s = null, o = e.pem.decode(t)[0]; if (o.type !== "ENCRYPTED PRIVATE KEY" && o.type !== "PRIVATE KEY" && o.type !== "RSA PRIVATE KEY") { var u = new Error('Could not convert private key from PEM; PEM header type is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".'); throw u.headerType = u, u } if (o.procType && o.procType.type === "ENCRYPTED") { var a, f; switch (o.dekInfo.algorithm) { case "DES-CBC": a = 8, f = e.des.createDecryptionCipher; break; case "DES-EDE3-CBC": a = 24, f = e.des.createDecryptionCipher; break; case "AES-128-CBC": a = 16, f = e.aes.createDecryptionCipher; break; case "AES-192-CBC": a = 24, f = e.aes.createDecryptionCipher; break; case "AES-256-CBC": a = 32, f = e.aes.createDecryptionCipher; break; case "RC2-40-CBC": a = 5, f = function (t) { return e.rc2.createDecryptionCipher(t, 40) }; break; case "RC2-64-CBC": a = 8, f = function (t) { return e.rc2.createDecryptionCipher(t, 64) }; break; case "RC2-128-CBC": a = 16, f = function (t) { return e.rc2.createDecryptionCipher(t, 128) }; break; default: var u = new Error('Could not decrypt private key; unsupported encryption algorithm "' + o.dekInfo.algorithm + '".'); throw u.algorithm = o.dekInfo.algorithm, u }var l = e.util.hexToBytes(o.dekInfo.parameters), c = e.pbe.opensslDeriveBytes(i, l.substr(0, 8), a), h = f(c); h.start(l), h.update(e.util.createBuffer(o.body)); if (!h.finish()) return s; s = h.output.getBytes() } else s = o.body; return o.type === "ENCRYPTED PRIVATE KEY" ? s = r.decryptPrivateKeyInfo(n.fromDer(s), i) : s = n.fromDer(s), s !== null && (s = r.privateKeyFromAsn1(s)), s }, r.pbe.generatePkcs12Key = function (t, n, r, i, s, o) { var u, a; if (typeof o == "undefined" || o === null) o = e.md.sha1.create(); var f = o.digestLength, l = o.blockLength, c = new e.util.ByteBuffer, h = new e.util.ByteBuffer; if (t !== null && t !== undefined) { for (a = 0; a < t.length; a++)h.putInt16(t.charCodeAt(a)); h.putInt16(0) } var p = h.length(), d = n.length(), v = new e.util.ByteBuffer; v.fillWithByte(r, l); var m = l * Math.ceil(d / l), g = new e.util.ByteBuffer; for (a = 0; a < m; a++)g.putByte(n.at(a % d)); var y = l * Math.ceil(p / l), b = new e.util.ByteBuffer; for (a = 0; a < y; a++)b.putByte(h.at(a % p)); var w = g; w.putBuffer(b); var E = Math.ceil(s / f); for (var S = 1; S <= E; S++) { var x = new e.util.ByteBuffer; x.putBytes(v.bytes()), x.putBytes(w.bytes()); for (var T = 0; T < i; T++)o.start(), o.update(x.getBytes()), x = o.digest(); var N = new e.util.ByteBuffer; for (a = 0; a < l; a++)N.putByte(x.at(a % f)); var C = Math.ceil(d / l) + Math.ceil(p / l), k = new e.util.ByteBuffer; for (u = 0; u < C; u++) { var L = new e.util.ByteBuffer(w.getBytes(l)), A = 511; for (a = N.length() - 1; a >= 0; a--)A >>= 8, A += N.at(a) + L.at(a), L.setAt(a, A & 255); k.putBuffer(L) } w = k, c.putBuffer(x) } return c.truncate(c.length() - s), c }, r.pbe.getCipher = function (e, t, n) { switch (e) { case r.oids.pkcs5PBES2: return r.pbe.getCipherForPBES2(e, t, n); case r.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]: case r.oids["pbewithSHAAnd40BitRC2-CBC"]: return r.pbe.getCipherForPKCS12PBE(e, t, n); default: var i = new Error("Cannot read encrypted PBE data block. Unsupported OID."); throw i.oid = e, i.supportedOids = ["pkcs5PBES2", "pbeWithSHAAnd3-KeyTripleDES-CBC", "pbewithSHAAnd40BitRC2-CBC"], i } }, r.pbe.getCipherForPBES2 = function (t, i, s) { var u = {}, a = []; if (!n.validate(i, o, u, a)) { var f = new Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo."); throw f.errors = a, f } t = n.derToOid(u.kdfOid); if (t !== r.oids.pkcs5PBKDF2) { var f = new Error("Cannot read encrypted private key. Unsupported key derivation function OID."); throw f.oid = t, f.supportedOids = ["pkcs5PBKDF2"], f } t = n.derToOid(u.encOid); if (t !== r.oids["aes128-CBC"] && t !== r.oids["aes192-CBC"] && t !== r.oids["aes256-CBC"] && t !== r.oids["des-EDE3-CBC"] && t !== r.oids.desCBC) { var f = new Error("Cannot read encrypted private key. Unsupported encryption scheme OID."); throw f.oid = t, f.supportedOids = ["aes128-CBC", "aes192-CBC", "aes256-CBC", "des-EDE3-CBC", "desCBC"], f } var l = u.kdfSalt, c = e.util.createBuffer(u.kdfIterationCount); c = c.getInt(c.length() << 3); var h, p; switch (r.oids[t]) { case "aes128-CBC": h = 16, p = e.aes.createDecryptionCipher; break; case "aes192-CBC": h = 24, p = e.aes.createDecryptionCipher; break; case "aes256-CBC": h = 32, p = e.aes.createDecryptionCipher; break; case "des-EDE3-CBC": h = 24, p = e.des.createDecryptionCipher; break; case "desCBC": h = 8, p = e.des.createDecryptionCipher }var d = e.pkcs5.pbkdf2(s, l, c, h), v = u.encIv, m = p(d); return m.start(v), m }, r.pbe.getCipherForPKCS12PBE = function (t, i, s) { var o = {}, a = []; if (!n.validate(i, u, o, a)) { var f = new Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo."); throw f.errors = a, f } var l = e.util.createBuffer(o.salt), c = e.util.createBuffer(o.iterations); c = c.getInt(c.length() << 3); var h, p, d; switch (t) { case r.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]: h = 24, p = 8, d = e.des.startDecrypting; break; case r.oids["pbewithSHAAnd40BitRC2-CBC"]: h = 5, p = 8, d = function (t, n) { var r = e.rc2.createDecryptionCipher(t, 40); return r.start(n, null), r }; break; default: var f = new Error("Cannot read PKCS #12 PBE data block. Unsupported OID."); throw f.oid = t, f }var v = r.pbe.generatePkcs12Key(s, l, 1, c, h), m = r.pbe.generatePkcs12Key(s, l, 2, c, p); return d(v, m) }, r.pbe.opensslDeriveBytes = function (t, n, r, i) { if (typeof i == "undefined" || i === null) i = e.md.md5.create(); n === null && (n = ""); var s = [a(i, t + n)]; for (var o = 16, u = 1; o < r; ++u, o += 16)s.push(a(i, s[u - 1] + t + n)); return s.join("").substr(0, r) } } var r = "pbe"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/pbe", ["require", "module", "./aes", "./asn1", "./des", "./md", "./oids", "./pem", "./pbkdf2", "./random", "./rc2", "./rsa", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { var t = e.asn1, n = e.pkcs7asn1 = e.pkcs7asn1 || {}; e.pkcs7 = e.pkcs7 || {}, e.pkcs7.asn1 = n; var r = { name: "ContentInfo", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "ContentInfo.ContentType", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "contentType" }, { name: "ContentInfo.content", tagClass: t.Class.CONTEXT_SPECIFIC, type: 0, constructed: !0, optional: !0, captureAsn1: "content" }] }; n.contentInfoValidator = r; var i = { name: "EncryptedContentInfo", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "EncryptedContentInfo.contentType", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "contentType" }, { name: "EncryptedContentInfo.contentEncryptionAlgorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "EncryptedContentInfo.contentEncryptionAlgorithm.algorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "encAlgorithm" }, { name: "EncryptedContentInfo.contentEncryptionAlgorithm.parameter", tagClass: t.Class.UNIVERSAL, captureAsn1: "encParameter" }] }, { name: "EncryptedContentInfo.encryptedContent", tagClass: t.Class.CONTEXT_SPECIFIC, type: 0, capture: "encryptedContent", captureAsn1: "encryptedContentAsn1" }] }; n.envelopedDataValidator = { name: "EnvelopedData", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "EnvelopedData.Version", tagClass: t.Class.UNIVERSAL, type: t.Type.INTEGER, constructed: !1, capture: "version" }, { name: "EnvelopedData.RecipientInfos", tagClass: t.Class.UNIVERSAL, type: t.Type.SET, constructed: !0, captureAsn1: "recipientInfos" }].concat(i) }, n.encryptedDataValidator = { name: "EncryptedData", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "EncryptedData.Version", tagClass: t.Class.UNIVERSAL, type: t.Type.INTEGER, constructed: !1, capture: "version" }].concat(i) }; var s = { name: "SignerInfo", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "SignerInfo.version", tagClass: t.Class.UNIVERSAL, type: t.Type.INTEGER, constructed: !1 }, { name: "SignerInfo.issuerAndSerialNumber", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "SignerInfo.issuerAndSerialNumber.issuer", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, captureAsn1: "issuer" }, { name: "SignerInfo.issuerAndSerialNumber.serialNumber", tagClass: t.Class.UNIVERSAL, type: t.Type.INTEGER, constructed: !1, capture: "serial" }] }, { name: "SignerInfo.digestAlgorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "SignerInfo.digestAlgorithm.algorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "digestAlgorithm" }, { name: "SignerInfo.digestAlgorithm.parameter", tagClass: t.Class.UNIVERSAL, constructed: !1, captureAsn1: "digestParameter", optional: !0 }] }, { name: "SignerInfo.authenticatedAttributes", tagClass: t.Class.CONTEXT_SPECIFIC, type: 0, constructed: !0, optional: !0, capture: "authenticatedAttributes" }, { name: "SignerInfo.digestEncryptionAlgorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, capture: "signatureAlgorithm" }, { name: "SignerInfo.encryptedDigest", tagClass: t.Class.UNIVERSAL, type: t.Type.OCTETSTRING, constructed: !1, capture: "signature" }, { name: "SignerInfo.unauthenticatedAttributes", tagClass: t.Class.CONTEXT_SPECIFIC, type: 1, constructed: !0, optional: !0, capture: "unauthenticatedAttributes" }] }; n.signedDataValidator = { name: "SignedData", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "SignedData.Version", tagClass: t.Class.UNIVERSAL, type: t.Type.INTEGER, constructed: !1, capture: "version" }, { name: "SignedData.DigestAlgorithms", tagClass: t.Class.UNIVERSAL, type: t.Type.SET, constructed: !0, captureAsn1: "digestAlgorithms" }, r, { name: "SignedData.Certificates", tagClass: t.Class.CONTEXT_SPECIFIC, type: 0, optional: !0, captureAsn1: "certificates" }, { name: "SignedData.CertificateRevocationLists", tagClass: t.Class.CONTEXT_SPECIFIC, type: 1, optional: !0, captureAsn1: "crls" }, { name: "SignedData.SignerInfos", tagClass: t.Class.UNIVERSAL, type: t.Type.SET, capture: "signerInfos", optional: !0, value: [s] }] }, n.recipientInfoValidator = { name: "RecipientInfo", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "RecipientInfo.version", tagClass: t.Class.UNIVERSAL, type: t.Type.INTEGER, constructed: !1, capture: "version" }, { name: "RecipientInfo.issuerAndSerial", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "RecipientInfo.issuerAndSerial.issuer", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, captureAsn1: "issuer" }, { name: "RecipientInfo.issuerAndSerial.serialNumber", tagClass: t.Class.UNIVERSAL, type: t.Type.INTEGER, constructed: !1, capture: "serial" }] }, { name: "RecipientInfo.keyEncryptionAlgorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "RecipientInfo.keyEncryptionAlgorithm.algorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "encAlgorithm" }, { name: "RecipientInfo.keyEncryptionAlgorithm.parameter", tagClass: t.Class.UNIVERSAL, constructed: !1, captureAsn1: "encParameter" }] }, { name: "RecipientInfo.encryptedKey", tagClass: t.Class.UNIVERSAL, type: t.Type.OCTETSTRING, constructed: !1, capture: "encKey" }] } } var r = "pkcs7asn1"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/pkcs7asn1", ["require", "module", "./asn1", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { e.mgf = e.mgf || {}; var t = e.mgf.mgf1 = e.mgf1 = e.mgf1 || {}; t.create = function (t) { var n = { generate: function (n, r) { var i = new e.util.ByteBuffer, s = Math.ceil(r / t.digestLength); for (var o = 0; o < s; o++) { var u = new e.util.ByteBuffer; u.putInt32(o), t.start(), t.update(n + u.getBytes()), i.putBuffer(t.digest()) } return i.truncate(i.length() - r), i.getBytes() } }; return n } } var r = "mgf1"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/mgf1", ["require", "module", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { e.mgf = e.mgf || {}, e.mgf.mgf1 = e.mgf1 } var r = "mgf"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/mgf", ["require", "module", "./mgf1"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { var t = e.pss = e.pss || {}; t.create = function (t) { arguments.length === 3 && (t = { md: arguments[0], mgf: arguments[1], saltLength: arguments[2] }); var n = t.md, r = t.mgf, i = n.digestLength, s = t.salt || null; typeof s == "string" && (s = e.util.createBuffer(s)); var o; if ("saltLength" in t) o = t.saltLength; else { if (s === null) throw new Error("Salt length not specified or specific salt not given."); o = s.length() } if (s !== null && s.length() !== o) throw new Error("Given salt length does not match length of given salt."); var u = t.prng || e.random, a = {}; return a.encode = function (t, a) { var f, l = a - 1, c = Math.ceil(l / 8), h = t.digest().getBytes(); if (c < i + o + 2) throw new Error("Message is too long to encrypt."); var p; s === null ? p = u.getBytesSync(o) : p = s.bytes(); var d = new e.util.ByteBuffer; d.fillWithByte(0, 8), d.putBytes(h), d.putBytes(p), n.start(), n.update(d.getBytes()); var v = n.digest().getBytes(), m = new e.util.ByteBuffer; m.fillWithByte(0, c - o - i - 2), m.putByte(1), m.putBytes(p); var g = m.getBytes(), y = c - i - 1, b = r.generate(v, y), w = ""; for (f = 0; f < y; f++)w += String.fromCharCode(g.charCodeAt(f) ^ b.charCodeAt(f)); var E = 65280 >> 8 * c - l & 255; return w = String.fromCharCode(w.charCodeAt(0) & ~E) + w.substr(1), w + v + String.fromCharCode(188) }, a.verify = function (t, s, u) { var a, f = u - 1, l = Math.ceil(f / 8); s = s.substr(-l); if (l < i + o + 2) throw new Error("Inconsistent parameters to PSS signature verification."); if (s.charCodeAt(l - 1) !== 188) throw new Error("Encoded message does not end in 0xBC."); var c = l - i - 1, h = s.substr(0, c), p = s.substr(c, i), d = 65280 >> 8 * l - f & 255; if ((h.charCodeAt(0) & d) !== 0) throw new Error("Bits beyond keysize not zero as expected."); var v = r.generate(p, c), m = ""; for (a = 0; a < c; a++)m += String.fromCharCode(h.charCodeAt(a) ^ v.charCodeAt(a)); m = String.fromCharCode(m.charCodeAt(0) & ~d) + m.substr(1); var g = l - i - o - 2; for (a = 0; a < g; a++)if (m.charCodeAt(a) !== 0) throw new Error("Leftmost octets not zero as expected"); if (m.charCodeAt(g) !== 1) throw new Error("Inconsistent PSS signature, 0x01 marker not found"); var y = m.substr(-o), b = new e.util.ByteBuffer; b.fillWithByte(0, 8), b.putBytes(t), b.putBytes(y), n.start(), n.update(b.getBytes()); var w = n.digest().getBytes(); return p === w }, a } } var r = "pss"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/pss", ["require", "module", "./random", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function l(e, t) { typeof t == "string" && (t = { shortName: t }); var n = null, r; for (var i = 0; n === null && i < e.attributes.length; ++i)r = e.attributes[i], t.type && t.type === r.type ? n = r : t.name && t.name === r.name ? n = r : t.shortName && t.shortName === r.shortName && (n = r); return n } function h(n) { var r = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, []), i, s, o = n.attributes; for (var u = 0; u < o.length; ++u) { i = o[u]; var a = i.value, f = t.Type.PRINTABLESTRING; "valueTagClass" in i && (f = i.valueTagClass, f === t.Type.UTF8 && (a = e.util.encodeUtf8(a))), s = t.create(t.Class.UNIVERSAL, t.Type.SET, !0, [t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(i.type).getBytes()), t.create(t.Class.UNIVERSAL, f, !1, a)])]), r.value.push(s) } return r } function p(n) { var r = {}; for (var i = 0; i < n.length; ++i) { var s = n[i]; if (s.shortName && (s.valueTagClass === t.Type.UTF8 || s.valueTagClass === t.Type.PRINTABLESTRING || s.valueTagClass === t.Type.IA5STRING)) { var o = s.value; s.valueTagClass === t.Type.UTF8 && (o = e.util.encodeUtf8(s.value)), s.shortName in r ? e.util.isArray(r[s.shortName]) ? r[s.shortName].push(o) : r[s.shortName] = [r[s.shortName], o] : r[s.shortName] = o } } return r } function d(e) { var s; for (var o = 0; o < e.length; ++o) { s = e[o], typeof s.name == "undefined" && (s.type && s.type in n.oids ? s.name = n.oids[s.type] : s.shortName && s.shortName in i && (s.name = n.oids[i[s.shortName]])); if (typeof s.type == "undefined") { if (!(s.name && s.name in n.oids)) { var u = new Error("Attribute type not specified."); throw u.attribute = s, u } s.type = n.oids[s.name] } typeof s.shortName == "undefined" && s.name && s.name in i && (s.shortName = i[s.name]); if (s.type === r.extensionRequest) { s.valueConstructed = !0, s.valueTagClass = t.Type.SEQUENCE; if (!s.value && s.extensions) { s.value = []; for (var a = 0; a < s.extensions.length; ++a)s.value.push(n.certificateExtensionToAsn1(v(s.extensions[a]))) } } if (typeof s.value == "undefined") { var u = new Error("Attribute value not specified."); throw u.attribute = s, u } } } function v(i, s) { s = s || {}, typeof i.name == "undefined" && i.id && i.id in n.oids && (i.name = n.oids[i.id]); if (typeof i.id == "undefined") { if (!(i.name && i.name in n.oids)) { var o = new Error("Extension ID not specified."); throw o.extension = i, o } i.id = n.oids[i.name] } if (typeof i.value != "undefined") return i; if (i.name === "keyUsage") { var u = 0, a = 0, f = 0; i.digitalSignature && (a |= 128, u = 7), i.nonRepudiation && (a |= 64, u = 6), i.keyEncipherment && (a |= 32, u = 5), i.dataEncipherment && (a |= 16, u = 4), i.keyAgreement && (a |= 8, u = 3), i.keyCertSign && (a |= 4, u = 2), i.cRLSign && (a |= 2, u = 1), i.encipherOnly && (a |= 1, u = 0), i.decipherOnly && (f |= 128, u = 7); var l = String.fromCharCode(u); f !== 0 ? l += String.fromCharCode(a) + String.fromCharCode(f) : a !== 0 && (l += String.fromCharCode(a)), i.value = t.create(t.Class.UNIVERSAL, t.Type.BITSTRING, !1, l) } else if (i.name === "basicConstraints") i.value = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, []), i.cA && i.value.value.push(t.create(t.Class.UNIVERSAL, t.Type.BOOLEAN, !1, String.fromCharCode(255))), "pathLenConstraint" in i && i.value.value.push(t.create(t.Class.UNIVERSAL, t.Type.INTEGER, !1, t.integerToDer(i.pathLenConstraint).getBytes())); else if (i.name === "extKeyUsage") { i.value = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, []); var c = i.value.value; for (var p in i) { if (i[p] !== !0) continue; p in r ? c.push(t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(r[p]).getBytes())) : p.indexOf(".") !== -1 && c.push(t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(p).getBytes())) } } else if (i.name === "nsCertType") { var u = 0, a = 0; i.client && (a |= 128, u = 7), i.server && (a |= 64, u = 6), i.email && (a |= 32, u = 5), i.objsign && (a |= 16, u = 4), i.reserved && (a |= 8, u = 3), i.sslCA && (a |= 4, u = 2), i.emailCA && (a |= 2, u = 1), i.objCA && (a |= 1, u = 0); var l = String.fromCharCode(u); a !== 0 && (l += String.fromCharCode(a)), i.value = t.create(t.Class.UNIVERSAL, t.Type.BITSTRING, !1, l) } else if (i.name === "subjectAltName" || i.name === "issuerAltName") { i.value = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, []); var d; for (var v = 0; v < i.altNames.length; ++v) { d = i.altNames[v]; var l = d.value; if (d.type === 7 && d.ip) { l = e.util.bytesFromIP(d.ip); if (l === null) { var o = new Error('Extension "ip" value is not a valid IPv4 or IPv6 address.'); throw o.extension = i, o } } else d.type === 8 && (d.oid ? l = t.oidToDer(t.oidToDer(d.oid)) : l = t.oidToDer(l)); i.value.value.push(t.create(t.Class.CONTEXT_SPECIFIC, d.type, !1, l)) } } else if (i.name === "subjectKeyIdentifier" && s.cert) { var m = s.cert.generateSubjectKeyIdentifier(); i.subjectKeyIdentifier = m.toHex(), i.value = t.create(t.Class.UNIVERSAL, t.Type.OCTETSTRING, !1, m.getBytes()) } else if (i.name === "authorityKeyIdentifier" && s.cert) { i.value = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, []); var c = i.value.value; if (i.keyIdentifier) { var g = i.keyIdentifier === !0 ? s.cert.generateSubjectKeyIdentifier().getBytes() : i.keyIdentifier; c.push(t.create(t.Class.CONTEXT_SPECIFIC, 0, !1, g)) } if (i.authorityCertIssuer) { var y = [t.create(t.Class.CONTEXT_SPECIFIC, 4, !0, [h(i.authorityCertIssuer === !0 ? s.cert.issuer : i.authorityCertIssuer)])]; c.push(t.create(t.Class.CONTEXT_SPECIFIC, 1, !0, y)) } if (i.serialNumber) { var b = e.util.hexToBytes(i.serialNumber === !0 ? s.cert.serialNumber : i.serialNumber); c.push(t.create(t.Class.CONTEXT_SPECIFIC, 2, !1, b)) } } else if (i.name === "cRLDistributionPoints") { i.value = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, []); var c = i.value.value, w = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, []), E = t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, []), d; for (var v = 0; v < i.altNames.length; ++v) { d = i.altNames[v]; var l = d.value; if (d.type === 7 && d.ip) { l = e.util.bytesFromIP(d.ip); if (l === null) { var o = new Error('Extension "ip" value is not a valid IPv4 or IPv6 address.'); throw o.extension = i, o } } else d.type === 8 && (d.oid ? l = t.oidToDer(t.oidToDer(d.oid)) : l = t.oidToDer(l)); E.value.push(t.create(t.Class.CONTEXT_SPECIFIC, d.type, !1, l)) } w.value.push(t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, [E])), c.push(w) } if (typeof i.value == "undefined") { var o = new Error("Extension value not specified."); throw o.extension = i, o } return i } function m(e, n) { switch (e) { case r["RSASSA-PSS"]: var i = []; return n.hash.algorithmOid !== undefined && i.push(t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, [t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.hash.algorithmOid).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.NULL, !1, "")])])), n.mgf.algorithmOid !== undefined && i.push(t.create(t.Class.CONTEXT_SPECIFIC, 1, !0, [t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.mgf.algorithmOid).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.mgf.hash.algorithmOid).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.NULL, !1, "")])])])), n.saltLength !== undefined && i.push(t.create(t.Class.CONTEXT_SPECIFIC, 2, !0, [t.create(t.Class.UNIVERSAL, t.Type.INTEGER, !1, t.integerToDer(n.saltLength).getBytes())])), t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, i); default: return t.create(t.Class.UNIVERSAL, t.Type.NULL, !1, "") } } function g(n) { var r = t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, []); if (n.attributes.length === 0) return r; var i = n.attributes; for (var s = 0; s < i.length; ++s) { var o = i[s], u = o.value, a = t.Type.UTF8; "valueTagClass" in o && (a = o.valueTagClass), a === t.Type.UTF8 && (u = e.util.encodeUtf8(u)); var f = !1; "valueConstructed" in o && (f = o.valueConstructed); var l = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(o.type).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.SET, !0, [t.create(t.Class.UNIVERSAL, a, f, u)])]); r.value.push(l) } return r } var t = e.asn1, n = e.pki = e.pki || {}, r = n.oids, i = {}; i.CN = r.commonName, i.commonName = "CN", i.C = r.countryName, i.countryName = "C", i.L = r.localityName, i.localityName = "L", i.ST = r.stateOrProvinceName, i.stateOrProvinceName = "ST", i.O = r.organizationName, i.organizationName = "O", i.OU = r.organizationalUnitName, i.organizationalUnitName = "OU", i.E = r.emailAddress, i.emailAddress = "E"; var s = e.pki.rsa.publicKeyValidator, o = { name: "Certificate", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "Certificate.TBSCertificate", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, captureAsn1: "tbsCertificate", value: [{ name: "Certificate.TBSCertificate.version", tagClass: t.Class.CONTEXT_SPECIFIC, type: 0, constructed: !0, optional: !0, value: [{ name: "Certificate.TBSCertificate.version.integer", tagClass: t.Class.UNIVERSAL, type: t.Type.INTEGER, constructed: !1, capture: "certVersion" }] }, { name: "Certificate.TBSCertificate.serialNumber", tagClass: t.Class.UNIVERSAL, type: t.Type.INTEGER, constructed: !1, capture: "certSerialNumber" }, { name: "Certificate.TBSCertificate.signature", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "Certificate.TBSCertificate.signature.algorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "certinfoSignatureOid" }, { name: "Certificate.TBSCertificate.signature.parameters", tagClass: t.Class.UNIVERSAL, optional: !0, captureAsn1: "certinfoSignatureParams" }] }, { name: "Certificate.TBSCertificate.issuer", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, captureAsn1: "certIssuer" }, { name: "Certificate.TBSCertificate.validity", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "Certificate.TBSCertificate.validity.notBefore (utc)", tagClass: t.Class.UNIVERSAL, type: t.Type.UTCTIME, constructed: !1, optional: !0, capture: "certValidity1UTCTime" }, { name: "Certificate.TBSCertificate.validity.notBefore (generalized)", tagClass: t.Class.UNIVERSAL, type: t.Type.GENERALIZEDTIME, constructed: !1, optional: !0, capture: "certValidity2GeneralizedTime" }, { name: "Certificate.TBSCertificate.validity.notAfter (utc)", tagClass: t.Class.UNIVERSAL, type: t.Type.UTCTIME, constructed: !1, optional: !0, capture: "certValidity3UTCTime" }, { name: "Certificate.TBSCertificate.validity.notAfter (generalized)", tagClass: t.Class.UNIVERSAL, type: t.Type.GENERALIZEDTIME, constructed: !1, optional: !0, capture: "certValidity4GeneralizedTime" }] }, { name: "Certificate.TBSCertificate.subject", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, captureAsn1: "certSubject" }, s, { name: "Certificate.TBSCertificate.issuerUniqueID", tagClass: t.Class.CONTEXT_SPECIFIC, type: 1, constructed: !0, optional: !0, value: [{ name: "Certificate.TBSCertificate.issuerUniqueID.id", tagClass: t.Class.UNIVERSAL, type: t.Type.BITSTRING, constructed: !1, capture: "certIssuerUniqueId" }] }, { name: "Certificate.TBSCertificate.subjectUniqueID", tagClass: t.Class.CONTEXT_SPECIFIC, type: 2, constructed: !0, optional: !0, value: [{ name: "Certificate.TBSCertificate.subjectUniqueID.id", tagClass: t.Class.UNIVERSAL, type: t.Type.BITSTRING, constructed: !1, capture: "certSubjectUniqueId" }] }, { name: "Certificate.TBSCertificate.extensions", tagClass: t.Class.CONTEXT_SPECIFIC, type: 3, constructed: !0, captureAsn1: "certExtensions", optional: !0 }] }, { name: "Certificate.signatureAlgorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "Certificate.signatureAlgorithm.algorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "certSignatureOid" }, { name: "Certificate.TBSCertificate.signature.parameters", tagClass: t.Class.UNIVERSAL, optional: !0, captureAsn1: "certSignatureParams" }] }, { name: "Certificate.signatureValue", tagClass: t.Class.UNIVERSAL, type: t.Type.BITSTRING, constructed: !1, capture: "certSignature" }] }, u = { name: "rsapss", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "rsapss.hashAlgorithm", tagClass: t.Class.CONTEXT_SPECIFIC, type: 0, constructed: !0, value: [{ name: "rsapss.hashAlgorithm.AlgorithmIdentifier", tagClass: t.Class.UNIVERSAL, type: t.Class.SEQUENCE, constructed: !0, optional: !0, value: [{ name: "rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "hashOid" }] }] }, { name: "rsapss.maskGenAlgorithm", tagClass: t.Class.CONTEXT_SPECIFIC, type: 1, constructed: !0, value: [{ name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier", tagClass: t.Class.UNIVERSAL, type: t.Class.SEQUENCE, constructed: !0, optional: !0, value: [{ name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "maskGenOid" }, { name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "maskGenHashOid" }] }] }] }, { name: "rsapss.saltLength", tagClass: t.Class.CONTEXT_SPECIFIC, type: 2, optional: !0, value: [{ name: "rsapss.saltLength.saltLength", tagClass: t.Class.UNIVERSAL, type: t.Class.INTEGER, constructed: !1, capture: "saltLength" }] }, { name: "rsapss.trailerField", tagClass: t.Class.CONTEXT_SPECIFIC, type: 3, optional: !0, value: [{ name: "rsapss.trailer.trailer", tagClass: t.Class.UNIVERSAL, type: t.Class.INTEGER, constructed: !1, capture: "trailer" }] }] }, a = { name: "CertificationRequestInfo", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, captureAsn1: "certificationRequestInfo", value: [{ name: "CertificationRequestInfo.integer", tagClass: t.Class.UNIVERSAL, type: t.Type.INTEGER, constructed: !1, capture: "certificationRequestInfoVersion" }, { name: "CertificationRequestInfo.subject", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, captureAsn1: "certificationRequestInfoSubject" }, s, { name: "CertificationRequestInfo.attributes", tagClass: t.Class.CONTEXT_SPECIFIC, type: 0, constructed: !0, optional: !0, capture: "certificationRequestInfoAttributes", value: [{ name: "CertificationRequestInfo.attributes", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "CertificationRequestInfo.attributes.type", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1 }, { name: "CertificationRequestInfo.attributes.value", tagClass: t.Class.UNIVERSAL, type: t.Type.SET, constructed: !0 }] }] }] }, f = { name: "CertificationRequest", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, captureAsn1: "csr", value: [a, { name: "CertificationRequest.signatureAlgorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "CertificationRequest.signatureAlgorithm.algorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "csrSignatureOid" }, { name: "CertificationRequest.signatureAlgorithm.parameters", tagClass: t.Class.UNIVERSAL, optional: !0, captureAsn1: "csrSignatureParams" }] }, { name: "CertificationRequest.signature", tagClass: t.Class.UNIVERSAL, type: t.Type.BITSTRING, constructed: !1, capture: "csrSignature" }] }; n.RDNAttributesAsArray = function (e, n) { var s = [], o, u, a; for (var f = 0; f < e.value.length; ++f) { o = e.value[f]; for (var l = 0; l < o.value.length; ++l)a = {}, u = o.value[l], a.type = t.derToOid(u.value[0].value), a.value = u.value[1].value, a.valueTagClass = u.value[1].type, a.type in r && (a.name = r[a.type], a.name in i && (a.shortName = i[a.name])), n && (n.update(a.type), n.update(a.value)), s.push(a) } return s }, n.CRIAttributesAsArray = function (e) { var s = []; for (var o = 0; o < e.length; ++o) { var u = e[o], a = t.derToOid(u.value[0].value), f = u.value[1].value; for (var l = 0; l < f.length; ++l) { var c = {}; c.type = a, c.value = f[l].value, c.valueTagClass = f[l].type, c.type in r && (c.name = r[c.type], c.name in i && (c.shortName = i[c.name])); if (c.type === r.extensionRequest) { c.extensions = []; for (var h = 0; h < c.value.length; ++h)c.extensions.push(n.certificateExtensionFromAsn1(c.value[h])) } s.push(c) } } return s }; var c = function (e, n, i) { var s = {}; if (e !== r["RSASSA-PSS"]) return s; i && (s = { hash: { algorithmOid: r.sha1 }, mgf: { algorithmOid: r.mgf1, hash: { algorithmOid: r.sha1 } }, saltLength: 20 }); var o = {}, a = []; if (!t.validate(n, u, o, a)) { var f = new Error("Cannot read RSASSA-PSS parameter block."); throw f.errors = a, f } return o.hashOid !== undefined && (s.hash = s.hash || {}, s.hash.algorithmOid = t.derToOid(o.hashOid)), o.maskGenOid !== undefined && (s.mgf = s.mgf || {}, s.mgf.algorithmOid = t.derToOid(o.maskGenOid), s.mgf.hash = s.mgf.hash || {}, s.mgf.hash.algorithmOid = t.derToOid(o.maskGenHashOid)), o.saltLength !== undefined && (s.saltLength = o.saltLength.charCodeAt(0)), s }; n.certificateFromPem = function (r, i, s) { var o = e.pem.decode(r)[0]; if (o.type !== "CERTIFICATE" && o.type !== "X509 CERTIFICATE" && o.type !== "TRUSTED CERTIFICATE") { var u = new Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".'); throw u.headerType = o.type, u } if (o.procType && o.procType.type === "ENCRYPTED") throw new Error("Could not convert certificate from PEM; PEM is encrypted."); var a = t.fromDer(o.body, s); return n.certificateFromAsn1(a, i) }, n.certificateToPem = function (r, i) { var s = { type: "CERTIFICATE", body: t.toDer(n.certificateToAsn1(r)).getBytes() }; return e.pem.encode(s, { maxline: i }) }, n.publicKeyFromPem = function (r) { var i = e.pem.decode(r)[0]; if (i.type !== "PUBLIC KEY" && i.type !== "RSA PUBLIC KEY") { var s = new Error('Could not convert public key from PEM; PEM header type is not "PUBLIC KEY" or "RSA PUBLIC KEY".'); throw s.headerType = i.type, s } if (i.procType && i.procType.type === "ENCRYPTED") throw new Error("Could not convert public key from PEM; PEM is encrypted."); var o = t.fromDer(i.body); return n.publicKeyFromAsn1(o) }, n.publicKeyToPem = function (r, i) { var s = { type: "PUBLIC KEY", body: t.toDer(n.publicKeyToAsn1(r)).getBytes() }; return e.pem.encode(s, { maxline: i }) }, n.publicKeyToRSAPublicKeyPem = function (r, i) { var s = { type: "RSA PUBLIC KEY", body: t.toDer(n.publicKeyToRSAPublicKey(r)).getBytes() }; return e.pem.encode(s, { maxline: i }) }, n.getPublicKeyFingerprint = function (r, i) { i = i || {}; var s = i.md || e.md.sha1.create(), o = i.type || "RSAPublicKey", u; switch (o) { case "RSAPublicKey": u = t.toDer(n.publicKeyToRSAPublicKey(r)).getBytes(); break; case "SubjectPublicKeyInfo": u = t.toDer(n.publicKeyToAsn1(r)).getBytes(); break; default: throw new Error('Unknown fingerprint type "' + i.type + '".') }s.start(), s.update(u); var a = s.digest(); if (i.encoding === "hex") { var f = a.toHex(); return i.delimiter ? f.match(/.{2}/g).join(i.delimiter) : f } if (i.encoding === "binary") return a.getBytes(); if (i.encoding) throw new Error('Unknown encoding "' + i.encoding + '".'); return a }, n.certificationRequestFromPem = function (r, i, s) { var o = e.pem.decode(r)[0]; if (o.type !== "CERTIFICATE REQUEST") { var u = new Error('Could not convert certification request from PEM; PEM header type is not "CERTIFICATE REQUEST".'); throw u.headerType = o.type, u } if (o.procType && o.procType.type === "ENCRYPTED") throw new Error("Could not convert certification request from PEM; PEM is encrypted."); var a = t.fromDer(o.body, s); return n.certificationRequestFromAsn1(a, i) }, n.certificationRequestToPem = function (r, i) { var s = { type: "CERTIFICATE REQUEST", body: t.toDer(n.certificationRequestToAsn1(r)).getBytes() }; return e.pem.encode(s, { maxline: i }) }, n.createCertificate = function () { var i = {}; return i.version = 2, i.serialNumber = "00", i.signatureOid = null, i.signature = null, i.siginfo = {}, i.siginfo.algorithmOid = null, i.validity = {}, i.validity.notBefore = new Date, i.validity.notAfter = new Date, i.issuer = {}, i.issuer.getField = function (e) { return l(i.issuer, e) }, i.issuer.addField = function (e) { d([e]), i.issuer.attributes.push(e) }, i.issuer.attributes = [], i.issuer.hash = null, i.subject = {}, i.subject.getField = function (e) { return l(i.subject, e) }, i.subject.addField = function (e) { d([e]), i.subject.attributes.push(e) }, i.subject.attributes = [], i.subject.hash = null, i.extensions = [], i.publicKey = null, i.md = null, i.setSubject = function (e, t) { d(e), i.subject.attributes = e, delete i.subject.uniqueId, t && (i.subject.uniqueId = t), i.subject.hash = null }, i.setIssuer = function (e, t) { d(e), i.issuer.attributes = e, delete i.issuer.uniqueId, t && (i.issuer.uniqueId = t), i.issuer.hash = null }, i.setExtensions = function (e) { for (var t = 0; t < e.length; ++t)v(e[t], { cert: i }); i.extensions = e }, i.getExtension = function (e) { typeof e == "string" && (e = { name: e }); var t = null, n; for (var r = 0; t === null && r < i.extensions.length; ++r)n = i.extensions[r], e.id && n.id === e.id ? t = n : e.name && n.name === e.name && (t = n); return t }, i.sign = function (s, o) { i.md = o || e.md.sha1.create(); var u = r[i.md.algorithm + "WithRSAEncryption"]; if (!u) { var a = new Error("Could not compute certificate digest. Unknown message digest algorithm OID."); throw a.algorithm = i.md.algorithm, a } i.signatureOid = i.siginfo.algorithmOid = u, i.tbsCertificate = n.getTBSCertificate(i); var f = t.toDer(i.tbsCertificate); i.md.update(f.getBytes()), i.signature = s.sign(i.md) }, i.verify = function (s) { var o = !1; if (!i.issued(s)) { var u = s.issuer, a = i.subject, f = new Error("The parent certificate did not issue the given child certificate; the child certificate's issuer does not match the parent's subject."); throw f.expectedIssuer = u.attributes, f.actualIssuer = a.attributes, f } var l = s.md; if (l === null) { if (s.signatureOid in r) { var c = r[s.signatureOid]; switch (c) { case "sha1WithRSAEncryption": l = e.md.sha1.create(); break; case "md5WithRSAEncryption": l = e.md.md5.create(); break; case "sha256WithRSAEncryption": l = e.md.sha256.create(); break; case "sha512WithRSAEncryption": l = e.md.sha512.create(); break; case "RSASSA-PSS": l = e.md.sha256.create() } } if (l === null) { var f = new Error("Could not compute certificate digest. Unknown signature OID."); throw f.signatureOid = s.signatureOid, f } var h = s.tbsCertificate || n.getTBSCertificate(s), p = t.toDer(h); l.update(p.getBytes()) } if (l !== null) { var d; switch (s.signatureOid) { case r.sha1WithRSAEncryption: d = undefined; break; case r["RSASSA-PSS"]: var v, m; v = r[s.signatureParameters.mgf.hash.algorithmOid]; if (v === undefined || e.md[v] === undefined) { var f = new Error("Unsupported MGF hash function."); throw f.oid = s.signatureParameters.mgf.hash.algorithmOid, f.name = v, f } m = r[s.signatureParameters.mgf.algorithmOid]; if (m === undefined || e.mgf[m] === undefined) { var f = new Error("Unsupported MGF function."); throw f.oid = s.signatureParameters.mgf.algorithmOid, f.name = m, f } m = e.mgf[m].create(e.md[v].create()), v = r[s.signatureParameters.hash.algorithmOid]; if (v === undefined || e.md[v] === undefined) throw { message: "Unsupported RSASSA-PSS hash function.", oid: s.signatureParameters.hash.algorithmOid, name: v }; d = e.pss.create(e.md[v].create(), m, s.signatureParameters.saltLength) }o = i.publicKey.verify(l.digest().getBytes(), s.signature, d) } return o }, i.isIssuer = function (e) { var t = !1, n = i.issuer, r = e.subject; if (n.hash && r.hash) t = n.hash === r.hash; else if (n.attributes.length === r.attributes.length) { t = !0; var s, o; for (var u = 0; t && u < n.attributes.length; ++u) { s = n.attributes[u], o = r.attributes[u]; if (s.type !== o.type || s.value !== o.value) t = !1 } } return t }, i.issued = function (e) { return e.isIssuer(i) }, i.generateSubjectKeyIdentifier = function () { return n.getPublicKeyFingerprint(i.publicKey, { type: "RSAPublicKey" }) }, i.verifySubjectKeyIdentifier = function () { var t = r.subjectKeyIdentifier; for (var n = 0; n < i.extensions.length; ++n) { var s = i.extensions[n]; if (s.id === t) { var o = i.generateSubjectKeyIdentifier().getBytes(); return e.util.hexToBytes(s.subjectKeyIdentifier) === o } } return !1 }, i }, n.certificateFromAsn1 = function (i, s) { var u = {}, a = []; if (!t.validate(i, o, u, a)) { var f = new Error("Cannot read X.509 certificate. ASN.1 object is not an X509v3 Certificate."); throw f.errors = a, f } if (typeof u.certSignature != "string") { var h = "\0"; for (var p = 0; p < u.certSignature.length; ++p)h += t.toDer(u.certSignature[p]).getBytes(); u.certSignature = h } var v = t.derToOid(u.publicKeyOid); if (v !== n.oids.rsaEncryption) throw new Error("Cannot read public key. OID is not RSA."); var m = n.createCertificate(); m.version = u.certVersion ? u.certVersion.charCodeAt(0) : 0; var g = e.util.createBuffer(u.certSerialNumber); m.serialNumber = g.toHex(), m.signatureOid = e.asn1.derToOid(u.certSignatureOid), m.signatureParameters = c(m.signatureOid, u.certSignatureParams, !0), m.siginfo.algorithmOid = e.asn1.derToOid(u.certinfoSignatureOid), m.siginfo.parameters = c(m.siginfo.algorithmOid, u.certinfoSignatureParams, !1); var y = e.util.createBuffer(u.certSignature); ++y.read, m.signature = y.getBytes(); var b = []; u.certValidity1UTCTime !== undefined && b.push(t.utcTimeToDate(u.certValidity1UTCTime)), u.certValidity2GeneralizedTime !== undefined && b.push(t.generalizedTimeToDate(u.certValidity2GeneralizedTime)), u.certValidity3UTCTime !== undefined && b.push(t.utcTimeToDate(u.certValidity3UTCTime)), u.certValidity4GeneralizedTime !== undefined && b.push(t.generalizedTimeToDate(u.certValidity4GeneralizedTime)); if (b.length > 2) throw new Error("Cannot read notBefore/notAfter validity times; more than two times were provided in the certificate."); if (b.length < 2) throw new Error("Cannot read notBefore/notAfter validity times; they were not provided as either UTCTime or GeneralizedTime."); m.validity.notBefore = b[0], m.validity.notAfter = b[1], m.tbsCertificate = u.tbsCertificate; if (s) { m.md = null; if (m.signatureOid in r) { var v = r[m.signatureOid]; switch (v) { case "sha1WithRSAEncryption": m.md = e.md.sha1.create(); break; case "md5WithRSAEncryption": m.md = e.md.md5.create(); break; case "sha256WithRSAEncryption": m.md = e.md.sha256.create(); break; case "sha512WithRSAEncryption": m.md = e.md.sha512.create(); break; case "RSASSA-PSS": m.md = e.md.sha256.create() } } if (m.md === null) { var f = new Error("Could not compute certificate digest. Unknown signature OID."); throw f.signatureOid = m.signatureOid, f } var w = t.toDer(m.tbsCertificate); m.md.update(w.getBytes()) } var E = e.md.sha1.create(); m.issuer.getField = function (e) { return l(m.issuer, e) }, m.issuer.addField = function (e) { d([e]), m.issuer.attributes.push(e) }, m.issuer.attributes = n.RDNAttributesAsArray(u.certIssuer, E), u.certIssuerUniqueId && (m.issuer.uniqueId = u.certIssuerUniqueId), m.issuer.hash = E.digest().toHex(); var S = e.md.sha1.create(); return m.subject.getField = function (e) { return l(m.subject, e) }, m.subject.addField = function (e) { d([e]), m.subject.attributes.push(e) }, m.subject.attributes = n.RDNAttributesAsArray(u.certSubject, S), u.certSubjectUniqueId && (m.subject.uniqueId = u.certSubjectUniqueId), m.subject.hash = S.digest().toHex(), u.certExtensions ? m.extensions = n.certificateExtensionsFromAsn1(u.certExtensions) : m.extensions = [], m.publicKey = n.publicKeyFromAsn1(u.subjectPublicKeyInfo), m }, n.certificateExtensionsFromAsn1 = function (e) { var t = []; for (var r = 0; r < e.value.length; ++r) { var i = e.value[r]; for (var s = 0; s < i.value.length; ++s)t.push(n.certificateExtensionFromAsn1(i.value[s])) } return t }, n.certificateExtensionFromAsn1 = function (n) { var i = {}; i.id = t.derToOid(n.value[0].value), i.critical = !1, n.value[1].type === t.Type.BOOLEAN ? (i.critical = n.value[1].value.charCodeAt(0) !== 0, i.value = n.value[2].value) : i.value = n.value[1].value; if (i.id in r) { i.name = r[i.id]; if (i.name === "keyUsage") { var s = t.fromDer(i.value), o = 0, u = 0; s.value.length > 1 && (o = s.value.charCodeAt(1), u = s.value.length > 2 ? s.value.charCodeAt(2) : 0), i.digitalSignature = (o & 128) === 128, i.nonRepudiation = (o & 64) === 64, i.keyEncipherment = (o & 32) === 32, i.dataEncipherment = (o & 16) === 16, i.keyAgreement = (o & 8) === 8, i.keyCertSign = (o & 4) === 4, i.cRLSign = (o & 2) === 2, i.encipherOnly = (o & 1) === 1, i.decipherOnly = (u & 128) === 128 } else if (i.name === "basicConstraints") { var s = t.fromDer(i.value); s.value.length > 0 && s.value[0].type === t.Type.BOOLEAN ? i.cA = s.value[0].value.charCodeAt(0) !== 0 : i.cA = !1; var a = null; s.value.length > 0 && s.value[0].type === t.Type.INTEGER ? a = s.value[0].value : s.value.length > 1 && (a = s.value[1].value), a !== null && (i.pathLenConstraint = t.derToInteger(a)) } else if (i.name === "extKeyUsage") { var s = t.fromDer(i.value); for (var f = 0; f < s.value.length; ++f) { var l = t.derToOid(s.value[f].value); l in r ? i[r[l]] = !0 : i[l] = !0 } } else if (i.name === "nsCertType") { var s = t.fromDer(i.value), o = 0; s.value.length > 1 && (o = s.value.charCodeAt(1)), i.client = (o & 128) === 128, i.server = (o & 64) === 64, i.email = (o & 32) === 32, i.objsign = (o & 16) === 16, i.reserved = (o & 8) === 8, i.sslCA = (o & 4) === 4, i.emailCA = (o & 2) === 2, i.objCA = (o & 1) === 1 } else if (i.name === "subjectAltName" || i.name === "issuerAltName") { i.altNames = []; var c, s = t.fromDer(i.value); for (var h = 0; h < s.value.length; ++h) { c = s.value[h]; var p = { type: c.type, value: c.value }; i.altNames.push(p); switch (c.type) { case 1: case 2: case 6: break; case 7: p.ip = e.util.bytesToIP(c.value); break; case 8: p.oid = t.derToOid(c.value); break; default: } } } else if (i.name === "subjectKeyIdentifier") { var s = t.fromDer(i.value); i.subjectKeyIdentifier = e.util.bytesToHex(s.value) } } return i }, n.certificationRequestFromAsn1 = function (i, s) { var o = {}, u = []; if (!t.validate(i, f, o, u)) { var a = new Error("Cannot read PKCS#10 certificate request. ASN.1 object is not a PKCS#10 CertificationRequest."); throw a.errors = u, a } if (typeof o.csrSignature != "string") { var h = "\0"; for (var p = 0; p < o.csrSignature.length; ++p)h += t.toDer(o.csrSignature[p]).getBytes(); o.csrSignature = h } var v = t.derToOid(o.publicKeyOid); if (v !== n.oids.rsaEncryption) throw new Error("Cannot read public key. OID is not RSA."); var m = n.createCertificationRequest(); m.version = o.csrVersion ? o.csrVersion.charCodeAt(0) : 0, m.signatureOid = e.asn1.derToOid(o.csrSignatureOid), m.signatureParameters = c(m.signatureOid, o.csrSignatureParams, !0), m.siginfo.algorithmOid = e.asn1.derToOid(o.csrSignatureOid), m.siginfo.parameters = c(m.siginfo.algorithmOid, o.csrSignatureParams, !1); var g = e.util.createBuffer(o.csrSignature); ++g.read, m.signature = g.getBytes(), m.certificationRequestInfo = o.certificationRequestInfo; if (s) { m.md = null; if (m.signatureOid in r) { var v = r[m.signatureOid]; switch (v) { case "sha1WithRSAEncryption": m.md = e.md.sha1.create(); break; case "md5WithRSAEncryption": m.md = e.md.md5.create(); break; case "sha256WithRSAEncryption": m.md = e.md.sha256.create(); break; case "sha512WithRSAEncryption": m.md = e.md.sha512.create(); break; case "RSASSA-PSS": m.md = e.md.sha256.create() } } if (m.md === null) { var a = new Error("Could not compute certification request digest. Unknown signature OID."); throw a.signatureOid = m.signatureOid, a } var y = t.toDer(m.certificationRequestInfo); m.md.update(y.getBytes()) } var b = e.md.sha1.create(); return m.subject.getField = function (e) { return l(m.subject, e) }, m.subject.addField = function (e) { d([e]), m.subject.attributes.push(e) }, m.subject.attributes = n.RDNAttributesAsArray(o.certificationRequestInfoSubject, b), m.subject.hash = b.digest().toHex(), m.publicKey = n.publicKeyFromAsn1(o.subjectPublicKeyInfo), m.getAttribute = function (e) { return l(m, e) }, m.addAttribute = function (e) { d([e]), m.attributes.push(e) }, m.attributes = n.CRIAttributesAsArray(o.certificationRequestInfoAttributes || []), m }, n.createCertificationRequest = function () { var i = {}; return i.version = 0, i.signatureOid = null, i.signature = null, i.siginfo = {}, i.siginfo.algorithmOid = null, i.subject = {}, i.subject.getField = function (e) { return l(i.subject, e) }, i.subject.addField = function (e) { d([e]), i.subject.attributes.push(e) }, i.subject.attributes = [], i.subject.hash = null, i.publicKey = null, i.attributes = [], i.getAttribute = function (e) { return l(i, e) }, i.addAttribute = function (e) { d([e]), i.attributes.push(e) }, i.md = null, i.setSubject = function (e) { d(e), i.subject.attributes = e, i.subject.hash = null }, i.setAttributes = function (e) { d(e), i.attributes = e }, i.sign = function (s, o) { i.md = o || e.md.sha1.create(); var u = r[i.md.algorithm + "WithRSAEncryption"]; if (!u) { var a = new Error("Could not compute certification request digest. Unknown message digest algorithm OID."); throw a.algorithm = i.md.algorithm, a } i.signatureOid = i.siginfo.algorithmOid = u, i.certificationRequestInfo = n.getCertificationRequestInfo(i); var f = t.toDer(i.certificationRequestInfo); i.md.update(f.getBytes()), i.signature = s.sign(i.md) }, i.verify = function () { var s = !1, o = i.md; if (o === null) { if (i.signatureOid in r) { var u = r[i.signatureOid]; switch (u) { case "sha1WithRSAEncryption": o = e.md.sha1.create(); break; case "md5WithRSAEncryption": o = e.md.md5.create(); break; case "sha256WithRSAEncryption": o = e.md.sha256.create(); break; case "sha512WithRSAEncryption": o = e.md.sha512.create(); break; case "RSASSA-PSS": o = e.md.sha256.create() } } if (o === null) { var a = new Error("Could not compute certification request digest. Unknown signature OID."); throw a.signatureOid = i.signatureOid, a } var f = i.certificationRequestInfo || n.getCertificationRequestInfo(i), l = t.toDer(f); o.update(l.getBytes()) } if (o !== null) { var c; switch (i.signatureOid) { case r.sha1WithRSAEncryption: break; case r["RSASSA-PSS"]: var h, p; h = r[i.signatureParameters.mgf.hash.algorithmOid]; if (h === undefined || e.md[h] === undefined) { var a = new Error("Unsupported MGF hash function."); throw a.oid = i.signatureParameters.mgf.hash.algorithmOid, a.name = h, a } p = r[i.signatureParameters.mgf.algorithmOid]; if (p === undefined || e.mgf[p] === undefined) { var a = new Error("Unsupported MGF function."); throw a.oid = i.signatureParameters.mgf.algorithmOid, a.name = p, a } p = e.mgf[p].create(e.md[h].create()), h = r[i.signatureParameters.hash.algorithmOid]; if (h === undefined || e.md[h] === undefined) { var a = new Error("Unsupported RSASSA-PSS hash function."); throw a.oid = i.signatureParameters.hash.algorithmOid, a.name = h, a } c = e.pss.create(e.md[h].create(), p, i.signatureParameters.saltLength) }s = i.publicKey.verify(o.digest().getBytes(), i.signature, c) } return s }, i }, n.getTBSCertificate = function (r) { var i = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, [t.create(t.Class.UNIVERSAL, t.Type.INTEGER, !1, t.integerToDer(r.version).getBytes())]), t.create(t.Class.UNIVERSAL, t.Type.INTEGER, !1, e.util.hexToBytes(r.serialNumber)), t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(r.siginfo.algorithmOid).getBytes()), m(r.siginfo.algorithmOid, r.siginfo.parameters)]), h(r.issuer), t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.UTCTIME, !1, t.dateToUtcTime(r.validity.notBefore)), t.create(t.Class.UNIVERSAL, t.Type.UTCTIME, !1, t.dateToUtcTime(r.validity.notAfter))]), h(r.subject), n.publicKeyToAsn1(r.publicKey)]); return r.issuer.uniqueId && i.value.push(t.create(t.Class.CONTEXT_SPECIFIC, 1, !0, [t.create(t.Class.UNIVERSAL, t.Type.BITSTRING, !1, String.fromCharCode(0) + r.issuer.uniqueId)])), r.subject.uniqueId && i.value.push(t.create(t.Class.CONTEXT_SPECIFIC, 2, !0, [t.create(t.Class.UNIVERSAL, t.Type.BITSTRING, !1, String.fromCharCode(0) + r.subject.uniqueId)])), r.extensions.length > 0 && i.value.push(n.certificateExtensionsToAsn1(r.extensions)), i }, n.getCertificationRequestInfo = function (e) { var r = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.INTEGER, !1, t.integerToDer(e.version).getBytes()), h(e.subject), n.publicKeyToAsn1(e.publicKey), g(e)]); return r }, n.distinguishedNameToAsn1 = function (e) { return h(e) }, n.certificateToAsn1 = function (e) { var r = e.tbsCertificate || n.getTBSCertificate(e); return t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [r, t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(e.signatureOid).getBytes()), m(e.signatureOid, e.signatureParameters)]), t.create(t.Class.UNIVERSAL, t.Type.BITSTRING, !1, String.fromCharCode(0) + e.signature)]) }, n.certificateExtensionsToAsn1 = function (e) { var r = t.create(t.Class.CONTEXT_SPECIFIC, 3, !0, []), i = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, []); r.value.push(i); for (var s = 0; s < e.length; ++s)i.value.push(n.certificateExtensionToAsn1(e[s])); return r }, n.certificateExtensionToAsn1 = function (e) { var n = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, []); n.value.push(t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(e.id).getBytes())), e.critical && n.value.push(t.create(t.Class.UNIVERSAL, t.Type.BOOLEAN, !1, String.fromCharCode(255))); var r = e.value; return typeof e.value != "string" && (r = t.toDer(r).getBytes()), n.value.push(t.create(t.Class.UNIVERSAL, t.Type.OCTETSTRING, !1, r)), n }, n.certificationRequestToAsn1 = function (e) { var r = e.certificationRequestInfo || n.getCertificationRequestInfo(e); return t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [r, t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(e.signatureOid).getBytes()), m(e.signatureOid, e.signatureParameters)]), t.create(t.Class.UNIVERSAL, t.Type.BITSTRING, !1, String.fromCharCode(0) + e.signature)]) }, n.createCaStore = function (r) { function s(t) { if (!t.hash) { var r = e.md.sha1.create(); t.attributes = n.RDNAttributesAsArray(h(t), r), t.hash = r.digest().toHex() } return i.certs[t.hash] || null } var i = { certs: {} }; i.getIssuer = function (e) { var t = s(e.issuer); return t }, i.addCertificate = function (t) { typeof t == "string" && (t = e.pki.certificateFromPem(t)); if (!t.subject.hash) { var r = e.md.sha1.create(); t.subject.attributes = n.RDNAttributesAsArray(h(t.subject), r), t.subject.hash = r.digest().toHex() } if (t.subject.hash in i.certs) { var s = i.certs[t.subject.hash]; e.util.isArray(s) || (s = [s]), s.push(t) } else i.certs[t.subject.hash] = t }, i.hasCertificate = function (r) { var i = s(r.subject); if (!i) return !1; e.util.isArray(i) || (i = [i]); var o = t.toDer(n.certificateToAsn1(r)).getBytes(); for (var u = 0; u < i.length; ++u) { var a = t.toDer(n.certificateToAsn1(i[u])).getBytes(); if (o === a) return !0 } return !1 }; if (r) for (var o = 0; o < r.length; ++o) { var u = r[o]; i.addCertificate(u) } return i }, n.certificateError = { bad_certificate: "forge.pki.BadCertificate", unsupported_certificate: "forge.pki.UnsupportedCertificate", certificate_revoked: "forge.pki.CertificateRevoked", certificate_expired: "forge.pki.CertificateExpired", certificate_unknown: "forge.pki.CertificateUnknown", unknown_ca: "forge.pki.UnknownCertificateAuthority" }, n.verifyCertificateChain = function (t, r, i) { r = r.slice(0); var s = r.slice(0), o = new Date, u = !0, a = null, f = 0; do { var l = r.shift(), c = null, h = !1; if (o < l.validity.notBefore || o > l.validity.notAfter) a = { message: "Certificate is not valid yet or has expired.", error: n.certificateError.certificate_expired, notBefore: l.validity.notBefore, notAfter: l.validity.notAfter, now: o }; if (a === null) { c = r[0] || t.getIssuer(l), c === null && l.isIssuer(l) && (h = !0, c = l); if (c) { var p = c; e.util.isArray(p) || (p = [p]); var d = !1; while (!d && p.length > 0) { c = p.shift(); try { d = c.verify(l) } catch (v) { } } d || (a = { message: "Certificate signature is invalid.", error: n.certificateError.bad_certificate }) } a === null && (!c || h) && !t.hasCertificate(l) && (a = { message: "Certificate is not trusted.", error: n.certificateError.unknown_ca }) } a === null && c && !l.isIssuer(c) && (a = { message: "Certificate issuer is invalid.", error: n.certificateError.bad_certificate }); if (a === null) { var m = { keyUsage: !0, basicConstraints: !0 }; for (var g = 0; a === null && g < l.extensions.length; ++g) { var y = l.extensions[g]; y.critical && !(y.name in m) && (a = { message: "Certificate has an unsupported critical extension.", error: n.certificateError.unsupported_certificate }) } } if (a === null && (!u || r.length === 0 && (!c || h))) { var b = l.getExtension("basicConstraints"), w = l.getExtension("keyUsage"); w !== null && (!w.keyCertSign || b === null) && (a = { message: "Certificate keyUsage or basicConstraints conflict or indicate that the certificate is not a CA. If the certificate is the only one in the chain or isn't the first then the certificate must be a valid CA.", error: n.certificateError.bad_certificate }), a === null && b !== null && !b.cA && (a = { message: "Certificate basicConstraints indicates the certificate is not a CA.", error: n.certificateError.bad_certificate }); if (a === null && w !== null && "pathLenConstraint" in b) { var E = f - 1; E > b.pathLenConstraint && (a = { message: "Certificate basicConstraints pathLenConstraint violated.", error: n.certificateError.bad_certificate }) } } var S = a === null ? !0 : a.error, x = i ? i(S, f, s) : S; if (x !== !0) { S === !0 && (a = { message: "The application rejected the certificate.", error: n.certificateError.bad_certificate }); if (x || x === 0) typeof x == "object" && !e.util.isArray(x) ? (x.message && (a.message = x.message), x.error && (a.error = x.error)) : typeof x == "string" && (a.error = x); throw a } a = null, u = !1, ++f } while (r.length > 0); return !0 } } var r = "x509"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n.pki } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/x509", ["require", "module", "./aes", "./asn1", "./des", "./md", "./mgf", "./oids", "./pem", "./pss", "./rsa", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function f(e, t, n, r) { var i = []; for (var s = 0; s < e.length; s++)for (var o = 0; o < e[s].safeBags.length; o++) { var u = e[s].safeBags[o]; if (r !== undefined && u.type !== r) continue; if (t === null) { i.push(u); continue } u.attributes[t] !== undefined && u.attributes[t].indexOf(n) >= 0 && i.push(u) } return i } function l(t) { if (t.composed || t.constructed) { var n = e.util.createBuffer(); for (var r = 0; r < t.value.length; ++r)n.putBytes(t.value[r].value); t.composed = t.constructed = !1, t.value = n.getBytes() } return t } function c(e, r, s, o) { r = t.fromDer(r, s); if (r.tagClass !== t.Class.UNIVERSAL || r.type !== t.Type.SEQUENCE || r.constructed !== !0) throw new Error("PKCS#12 AuthenticatedSafe expected to be a SEQUENCE OF ContentInfo"); for (var u = 0; u < r.value.length; u++) { var a = r.value[u], f = {}, c = []; if (!t.validate(a, i, f, c)) { var d = new Error("Cannot read ContentInfo."); throw d.errors = c, d } var v = { encrypted: !1 }, m = null, g = f.content.value[0]; switch (t.derToOid(f.contentType)) { case n.oids.data: if (g.tagClass !== t.Class.UNIVERSAL || g.type !== t.Type.OCTETSTRING) throw new Error("PKCS#12 SafeContents Data is not an OCTET STRING."); m = l(g).value; break; case n.oids.encryptedData: m = h(g, o), v.encrypted = !0; break; default: var d = new Error("Unsupported PKCS#12 contentType."); throw d.contentType = t.derToOid(f.contentType), d }v.safeBags = p(m, s, o), e.safeContents.push(v) } } function h(r, i) { var s = {}, o = []; if (!t.validate(r, e.pkcs7.asn1.encryptedDataValidator, s, o)) { var u = new Error("Cannot read EncryptedContentInfo."); throw u.errors = o, u } var a = t.derToOid(s.contentType); if (a !== n.oids.data) { var u = new Error("PKCS#12 EncryptedContentInfo ContentType is not Data."); throw u.oid = a, u } a = t.derToOid(s.encAlgorithm); var f = n.pbe.getCipher(a, s.encParameter, i), c = l(s.encryptedContentAsn1), h = e.util.createBuffer(c.value); f.update(h); if (!f.finish()) throw new Error("Failed to decrypt PKCS#12 SafeContents."); return f.output.getBytes() } function p(e, r, i) { if (!r && e.length === 0) return []; e = t.fromDer(e, r); if (e.tagClass !== t.Class.UNIVERSAL || e.type !== t.Type.SEQUENCE || e.constructed !== !0) throw new Error("PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag."); var s = []; for (var u = 0; u < e.value.length; u++) { var f = e.value[u], l = {}, c = []; if (!t.validate(f, o, l, c)) { var h = new Error("Cannot read SafeBag."); throw h.errors = c, h } var p = { type: t.derToOid(l.bagId), attributes: d(l.bagAttributes) }; s.push(p); var v, m, g = l.bagValue.value[0]; switch (p.type) { case n.oids.pkcs8ShroudedKeyBag: g = n.decryptPrivateKeyInfo(g, i); if (g === null) throw new Error("Unable to decrypt PKCS#8 ShroudedKeyBag, wrong password?"); case n.oids.keyBag: try { p.key = n.privateKeyFromAsn1(g) } catch (y) { p.key = null, p.asn1 = g } continue; case n.oids.certBag: v = a, m = function () { if (t.derToOid(l.certId) !== n.oids.x509Certificate) { var e = new Error("Unsupported certificate type, only X.509 supported."); throw e.oid = t.derToOid(l.certId), e } var i = t.fromDer(l.cert, r); try { p.cert = n.certificateFromAsn1(i, !0) } catch (s) { p.cert = null, p.asn1 = i } }; break; default: var h = new Error("Unsupported PKCS#12 SafeBag type."); throw h.oid = p.type, h }if (v !== undefined && !t.validate(g, v, l, c)) { var h = new Error("Cannot read PKCS#12 " + v.name); throw h.errors = c, h } m() } return s } function d(e) { var r = {}; if (e !== undefined) for (var i = 0; i < e.length; ++i) { var s = {}, o = []; if (!t.validate(e[i], u, s, o)) { var a = new Error("Cannot read PKCS#12 BagAttribute."); throw a.errors = o, a } var f = t.derToOid(s.oid); if (n.oids[f] === undefined) continue; r[n.oids[f]] = []; for (var l = 0; l < s.values.length; ++l)r[n.oids[f]].push(s.values[l].value) } return r } var t = e.asn1, n = e.pki, r = e.pkcs12 = e.pkcs12 || {}, i = { name: "ContentInfo", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "ContentInfo.contentType", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "contentType" }, { name: "ContentInfo.content", tagClass: t.Class.CONTEXT_SPECIFIC, constructed: !0, captureAsn1: "content" }] }, s = { name: "PFX", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "PFX.version", tagClass: t.Class.UNIVERSAL, type: t.Type.INTEGER, constructed: !1, capture: "version" }, i, { name: "PFX.macData", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, optional: !0, captureAsn1: "mac", value: [{ name: "PFX.macData.mac", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "PFX.macData.mac.digestAlgorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "PFX.macData.mac.digestAlgorithm.algorithm", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "macAlgorithm" }, { name: "PFX.macData.mac.digestAlgorithm.parameters", tagClass: t.Class.UNIVERSAL, captureAsn1: "macAlgorithmParameters" }] }, { name: "PFX.macData.mac.digest", tagClass: t.Class.UNIVERSAL, type: t.Type.OCTETSTRING, constructed: !1, capture: "macDigest" }] }, { name: "PFX.macData.macSalt", tagClass: t.Class.UNIVERSAL, type: t.Type.OCTETSTRING, constructed: !1, capture: "macSalt" }, { name: "PFX.macData.iterations", tagClass: t.Class.UNIVERSAL, type: t.Type.INTEGER, constructed: !1, optional: !0, capture: "macIterations" }] }] }, o = { name: "SafeBag", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "SafeBag.bagId", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "bagId" }, { name: "SafeBag.bagValue", tagClass: t.Class.CONTEXT_SPECIFIC, constructed: !0, captureAsn1: "bagValue" }, { name: "SafeBag.bagAttributes", tagClass: t.Class.UNIVERSAL, type: t.Type.SET, constructed: !0, optional: !0, capture: "bagAttributes" }] }, u = { name: "Attribute", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "Attribute.attrId", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "oid" }, { name: "Attribute.attrValues", tagClass: t.Class.UNIVERSAL, type: t.Type.SET, constructed: !0, capture: "values" }] }, a = { name: "CertBag", tagClass: t.Class.UNIVERSAL, type: t.Type.SEQUENCE, constructed: !0, value: [{ name: "CertBag.certId", tagClass: t.Class.UNIVERSAL, type: t.Type.OID, constructed: !1, capture: "certId" }, { name: "CertBag.certValue", tagClass: t.Class.CONTEXT_SPECIFIC, constructed: !0, value: [{ name: "CertBag.certValue[0]", tagClass: t.Class.UNIVERSAL, type: t.Class.OCTETSTRING, constructed: !1, capture: "cert" }] }] }; r.pkcs12FromAsn1 = function (i, o, u) { typeof o == "string" ? (u = o, o = !0) : o === undefined && (o = !0); var a = {}, h = []; if (!t.validate(i, s, a, h)) { var p = new Error("Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX."); throw p.errors = p, p } var d = { version: a.version.charCodeAt(0), safeContents: [], getBags: function (t) { var n = {}, r; return "localKeyId" in t ? r = t.localKeyId : "localKeyIdHex" in t && (r = e.util.hexToBytes(t.localKeyIdHex)), r === undefined && !("friendlyName" in t) && "bagType" in t && (n[t.bagType] = f(d.safeContents, null, null, t.bagType)), r !== undefined && (n.localKeyId = f(d.safeContents, "localKeyId", r, t.bagType)), "friendlyName" in t && (n.friendlyName = f(d.safeContents, "friendlyName", t.friendlyName, t.bagType)), n }, getBagsByFriendlyName: function (e, t) { return f(d.safeContents, "friendlyName", e, t) }, getBagsByLocalKeyId: function (e, t) { return f(d.safeContents, "localKeyId", e, t) } }; if (a.version.charCodeAt(0) !== 3) { var p = new Error("PKCS#12 PFX of version other than 3 not supported."); throw p.version = a.version.charCodeAt(0), p } if (t.derToOid(a.contentType) !== n.oids.data) { var p = new Error("Only PKCS#12 PFX in password integrity mode supported."); throw p.oid = t.derToOid(a.contentType), p } var v = a.content.value[0]; if (v.tagClass !== t.Class.UNIVERSAL || v.type !== t.Type.OCTETSTRING) throw new Error("PKCS#12 authSafe content data is not an OCTET STRING."); v = l(v); if (a.mac) { var m = null, g = 0, y = t.derToOid(a.macAlgorithm); switch (y) { case n.oids.sha1: m = e.md.sha1.create(), g = 20; break; case n.oids.sha256: m = e.md.sha256.create(), g = 32; break; case n.oids.sha384: m = e.md.sha384.create(), g = 48; break; case n.oids.sha512: m = e.md.sha512.create(), g = 64; break; case n.oids.md5: m = e.md.md5.create(), g = 16 }if (m === null) throw new Error("PKCS#12 uses unsupported MAC algorithm: " + y); var b = new e.util.ByteBuffer(a.macSalt), w = "macIterations" in a ? parseInt(e.util.bytesToHex(a.macIterations), 16) : 1, E = r.generateKey(u, b, 3, w, g, m), S = e.hmac.create(); S.start(m, E), S.update(v.value); var x = S.getMac(); if (x.getBytes() !== a.macDigest) throw new Error("PKCS#12 MAC could not be verified. Invalid password?") } return c(d, v.value, o, u), d }, r.toPkcs12Asn1 = function (i, s, o, u) { u = u || {}, u.saltSize = u.saltSize || 8, u.count = u.count || 2048, u.algorithm = u.algorithm || u.encAlgorithm || "aes128", "useMac" in u || (u.useMac = !0), "localKeyId" in u || (u.localKeyId = null), "generateLocalKeyId" in u || (u.generateLocalKeyId = !0); var a = u.localKeyId, f; if (a !== null) a = e.util.hexToBytes(a); else if (u.generateLocalKeyId) if (s) { var l = e.util.isArray(s) ? s[0] : s; typeof l == "string" && (l = n.certificateFromPem(l)); var c = e.md.sha1.create(); c.update(t.toDer(n.certificateToAsn1(l)).getBytes()), a = c.digest().getBytes() } else a = e.random.getBytes(20); var h = []; a !== null && h.push(t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.oids.localKeyId).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.SET, !0, [t.create(t.Class.UNIVERSAL, t.Type.OCTETSTRING, !1, a)])])), "friendlyName" in u && h.push(t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.oids.friendlyName).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.SET, !0, [t.create(t.Class.UNIVERSAL, t.Type.BMPSTRING, !1, u.friendlyName)])])), h.length > 0 && (f = t.create(t.Class.UNIVERSAL, t.Type.SET, !0, h)); var p = [], d = []; s !== null && (e.util.isArray(s) ? d = s : d = [s]); var v = []; for (var m = 0; m < d.length; ++m) { s = d[m], typeof s == "string" && (s = n.certificateFromPem(s)); var g = m === 0 ? f : undefined, y = n.certificateToAsn1(s), b = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.oids.certBag).getBytes()), t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, [t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.oids.x509Certificate).getBytes()), t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, [t.create(t.Class.UNIVERSAL, t.Type.OCTETSTRING, !1, t.toDer(y).getBytes())])])]), g]); v.push(b) } if (v.length > 0) { var w = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, v), E = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.oids.data).getBytes()), t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, [t.create(t.Class.UNIVERSAL, t.Type.OCTETSTRING, !1, t.toDer(w).getBytes())])]); p.push(E) } var S = null; if (i !== null) { var x = n.wrapRsaPrivateKey(n.privateKeyToAsn1(i)); o === null ? S = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.oids.keyBag).getBytes()), t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, [x]), f]) : S = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.oids.pkcs8ShroudedKeyBag).getBytes()), t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, [n.encryptPrivateKeyInfo(x, o, u)]), f]); var T = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [S]), N = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.oids.data).getBytes()), t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, [t.create(t.Class.UNIVERSAL, t.Type.OCTETSTRING, !1, t.toDer(T).getBytes())])]); p.push(N) } var C = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, p), k; if (u.useMac) { var c = e.md.sha1.create(), L = new e.util.ByteBuffer(e.random.getBytes(u.saltSize)), A = u.count, i = r.generateKey(o, L, 3, A, 20), O = e.hmac.create(); O.start(c, i), O.update(t.toDer(C).getBytes()); var M = O.getMac(); k = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.oids.sha1).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.NULL, !1, "")]), t.create(t.Class.UNIVERSAL, t.Type.OCTETSTRING, !1, M.getBytes())]), t.create(t.Class.UNIVERSAL, t.Type.OCTETSTRING, !1, L.getBytes()), t.create(t.Class.UNIVERSAL, t.Type.INTEGER, !1, t.integerToDer(A).getBytes())]) } return t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.INTEGER, !1, t.integerToDer(3).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.oids.data).getBytes()), t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, [t.create(t.Class.UNIVERSAL, t.Type.OCTETSTRING, !1, t.toDer(C).getBytes())])]), k]) }, r.generateKey = e.pbe.generatePkcs12Key } var r = "pkcs12"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/pkcs12", ["require", "module", "./asn1", "./hmac", "./oids", "./pkcs7asn1", "./pbe", "./random", "./rsa", "./sha1", "./util", "./x509"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { var t = e.asn1, n = e.pki = e.pki || {}; n.pemToDer = function (t) { var n = e.pem.decode(t)[0]; if (n.procType && n.procType.type === "ENCRYPTED") throw new Error("Could not convert PEM to DER; PEM is encrypted."); return e.util.createBuffer(n.body) }, n.privateKeyFromPem = function (r) { var i = e.pem.decode(r)[0]; if (i.type !== "PRIVATE KEY" && i.type !== "RSA PRIVATE KEY") { var s = new Error('Could not convert private key from PEM; PEM header type is not "PRIVATE KEY" or "RSA PRIVATE KEY".'); throw s.headerType = i.type, s } if (i.procType && i.procType.type === "ENCRYPTED") throw new Error("Could not convert private key from PEM; PEM is encrypted."); var o = t.fromDer(i.body); return n.privateKeyFromAsn1(o) }, n.privateKeyToPem = function (r, i) { var s = { type: "RSA PRIVATE KEY", body: t.toDer(n.privateKeyToAsn1(r)).getBytes() }; return e.pem.encode(s, { maxline: i }) }, n.privateKeyInfoToPem = function (n, r) { var i = { type: "PRIVATE KEY", body: t.toDer(n).getBytes() }; return e.pem.encode(i, { maxline: r }) } } var r = "pki"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/pki", ["require", "module", "./asn1", "./oids", "./pbe", "./pem", "./pbkdf2", "./pkcs12", "./pss", "./rsa", "./util", "./x509"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { var t = function (t, n, r, i) { var s = e.util.createBuffer(), o = t.length >> 1, u = o + (t.length & 1), a = t.substr(0, u), f = t.substr(o, u), l = e.util.createBuffer(), c = e.hmac.create(); r = n + r; var h = Math.ceil(i / 16), p = Math.ceil(i / 20); c.start("MD5", a); var d = e.util.createBuffer(); l.putBytes(r); for (var v = 0; v < h; ++v)c.start(null, null), c.update(l.getBytes()), l.putBuffer(c.digest()), c.start(null, null), c.update(l.bytes() + r), d.putBuffer(c.digest()); c.start("SHA1", f); var m = e.util.createBuffer(); l.clear(), l.putBytes(r); for (var v = 0; v < p; ++v)c.start(null, null), c.update(l.getBytes()), l.putBuffer(c.digest()), c.start(null, null), c.update(l.bytes() + r), m.putBuffer(c.digest()); return s.putBytes(e.util.xorBytes(d.getBytes(), m.getBytes(), i)), s }, n = function (e, t, n, r) { }, r = function (t, n, r) { var i = e.hmac.create(); i.start("SHA1", t); var s = e.util.createBuffer(); return s.putInt32(n[0]), s.putInt32(n[1]), s.putByte(r.type), s.putByte(r.version.major), s.putByte(r.version.minor), s.putInt16(r.length), s.putBytes(r.fragment.bytes()), i.update(s.getBytes()), i.digest().getBytes() }, i = function (t, n, r) { var i = !1; try { var s = t.deflate(n.fragment.getBytes()); n.fragment = e.util.createBuffer(s), n.length = s.length, i = !0 } catch (o) { } return i }, s = function (t, n, r) { var i = !1; try { var s = t.inflate(n.fragment.getBytes()); n.fragment = e.util.createBuffer(s), n.length = s.length, i = !0 } catch (o) { } return i }, o = function (t, n) { var r = 0; switch (n) { case 1: r = t.getByte(); break; case 2: r = t.getInt16(); break; case 3: r = t.getInt24(); break; case 4: r = t.getInt32() }return e.util.createBuffer(t.getBytes(r)) }, u = function (e, t, n) { e.putInt(n.length(), t << 3), e.putBuffer(n) }, a = {}; a.Versions = { TLS_1_0: { major: 3, minor: 1 }, TLS_1_1: { major: 3, minor: 2 }, TLS_1_2: { major: 3, minor: 3 } }, a.SupportedVersions = [a.Versions.TLS_1_1, a.Versions.TLS_1_0], a.Version = a.SupportedVersions[0], a.MaxFragment = 15360, a.ConnectionEnd = { server: 0, client: 1 }, a.PRFAlgorithm = { tls_prf_sha256: 0 }, a.BulkCipherAlgorithm = { none: null, rc4: 0, des3: 1, aes: 2 }, a.CipherType = { stream: 0, block: 1, aead: 2 }, a.MACAlgorithm = { none: null, hmac_md5: 0, hmac_sha1: 1, hmac_sha256: 2, hmac_sha384: 3, hmac_sha512: 4 }, a.CompressionMethod = { none: 0, deflate: 1 }, a.ContentType = { change_cipher_spec: 20, alert: 21, handshake: 22, application_data: 23, heartbeat: 24 }, a.HandshakeType = { hello_request: 0, client_hello: 1, server_hello: 2, certificate: 11, server_key_exchange: 12, certificate_request: 13, server_hello_done: 14, certificate_verify: 15, client_key_exchange: 16, finished: 20 }, a.Alert = {}, a.Alert.Level = { warning: 1, fatal: 2 }, a.Alert.Description = { close_notify: 0, unexpected_message: 10, bad_record_mac: 20, decryption_failed: 21, record_overflow: 22, decompression_failure: 30, handshake_failure: 40, bad_certificate: 42, unsupported_certificate: 43, certificate_revoked: 44, certificate_expired: 45, certificate_unknown: 46, illegal_parameter: 47, unknown_ca: 48, access_denied: 49, decode_error: 50, decrypt_error: 51, export_restriction: 60, protocol_version: 70, insufficient_security: 71, internal_error: 80, user_canceled: 90, no_renegotiation: 100 }, a.HeartbeatMessageType = { heartbeat_request: 1, heartbeat_response: 2 }, a.CipherSuites = {}, a.getCipherSuite = function (e) { var t = null; for (var n in a.CipherSuites) { var r = a.CipherSuites[n]; if (r.id[0] === e.charCodeAt(0) && r.id[1] === e.charCodeAt(1)) { t = r; break } } return t }, a.handleUnexpected = function (e, t) { var n = !e.open && e.entity === a.ConnectionEnd.client; n || e.error(e, { message: "Unexpected message. Received TLS record out of order.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.unexpected_message } }) }, a.handleHelloRequest = function (e, t, n) { !e.handshaking && e.handshakes > 0 && (a.queue(e, a.createAlert(e, { level: a.Alert.Level.warning, description: a.Alert.Description.no_renegotiation })), a.flush(e)), e.process() }, a.parseHelloMessage = function (t, n, r) { var i = null, s = t.entity === a.ConnectionEnd.client; if (r < 38) t.error(t, { message: s ? "Invalid ServerHello message. Message too short." : "Invalid ClientHello message. Message too short.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.illegal_parameter } }); else { var u = n.fragment, f = u.length(); i = { version: { major: u.getByte(), minor: u.getByte() }, random: e.util.createBuffer(u.getBytes(32)), session_id: o(u, 1), extensions: [] }, s ? (i.cipher_suite = u.getBytes(2), i.compression_method = u.getByte()) : (i.cipher_suites = o(u, 2), i.compression_methods = o(u, 1)), f = r - (f - u.length()); if (f > 0) { var l = o(u, 2); while (l.length() > 0) i.extensions.push({ type: [l.getByte(), l.getByte()], data: o(l, 2) }); if (!s) for (var c = 0; c < i.extensions.length; ++c) { var h = i.extensions[c]; if (h.type[0] === 0 && h.type[1] === 0) { var p = o(h.data, 2); while (p.length() > 0) { var d = p.getByte(); if (d !== 0) break; t.session.extensions.server_name.serverNameList.push(o(p, 2).getBytes()) } } } } if (t.session.version) if (i.version.major !== t.session.version.major || i.version.minor !== t.session.version.minor) return t.error(t, { message: "TLS version change is disallowed during renegotiation.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.protocol_version } }); if (s) t.session.cipherSuite = a.getCipherSuite(i.cipher_suite); else { var v = e.util.createBuffer(i.cipher_suites.bytes()); while (v.length() > 0) { t.session.cipherSuite = a.getCipherSuite(v.getBytes(2)); if (t.session.cipherSuite !== null) break } } if (t.session.cipherSuite === null) return t.error(t, { message: "No cipher suites in common.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.handshake_failure }, cipherSuite: e.util.bytesToHex(i.cipher_suite) }); s ? t.session.compressionMethod = i.compression_method : t.session.compressionMethod = a.CompressionMethod.none } return i }, a.createSecurityParameters = function (e, t) { var n = e.entity === a.ConnectionEnd.client, r = t.random.bytes(), i = n ? e.session.sp.client_random : r, s = n ? r : a.createRandom().getBytes(); e.session.sp = { entity: e.entity, prf_algorithm: a.PRFAlgorithm.tls_prf_sha256, bulk_cipher_algorithm: null, cipher_type: null, enc_key_length: null, block_length: null, fixed_iv_length: null, record_iv_length: null, mac_algorithm: null, mac_length: null, mac_key_length: null, compression_algorithm: e.session.compressionMethod, pre_master_secret: null, master_secret: null, client_random: i, server_random: s } }, a.handleServerHello = function (e, t, n) { var r = a.parseHelloMessage(e, t, n); if (e.fail) return; if (!(r.version.minor <= e.version.minor)) return e.error(e, { message: "Incompatible TLS version.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.protocol_version } }); e.version.minor = r.version.minor, e.session.version = e.version; var i = r.session_id.bytes(); i.length > 0 && i === e.session.id ? (e.expect = d, e.session.resuming = !0, e.session.sp.server_random = r.random.bytes()) : (e.expect = l, e.session.resuming = !1, a.createSecurityParameters(e, r)), e.session.id = i, e.process() }, a.handleClientHello = function (t, n, r) { var i = a.parseHelloMessage(t, n, r); if (t.fail) return; var s = i.session_id.bytes(), o = null; if (t.sessionCache) { o = t.sessionCache.getSession(s); if (o === null) s = ""; else if (o.version.major !== i.version.major || o.version.minor > i.version.minor) o = null, s = "" } s.length === 0 && (s = e.random.getBytes(32)), t.session.id = s, t.session.clientHelloVersion = i.version, t.session.sp = {}; if (o) t.version = t.session.version = o.version, t.session.sp = o.sp; else { var u; for (var f = 1; f < a.SupportedVersions.length; ++f) { u = a.SupportedVersions[f]; if (u.minor <= i.version.minor) break } t.version = { major: u.major, minor: u.minor }, t.session.version = t.version } o !== null ? (t.expect = S, t.session.resuming = !0, t.session.sp.client_random = i.random.bytes()) : (t.expect = t.verifyClient !== !1 ? b : w, t.session.resuming = !1, a.createSecurityParameters(t, i)), t.open = !0, a.queue(t, a.createRecord(t, { type: a.ContentType.handshake, data: a.createServerHello(t) })), t.session.resuming ? (a.queue(t, a.createRecord(t, { type: a.ContentType.change_cipher_spec, data: a.createChangeCipherSpec() })), t.state.pending = a.createConnectionState(t), t.state.current.write = t.state.pending.write, a.queue(t, a.createRecord(t, { type: a.ContentType.handshake, data: a.createFinished(t) }))) : (a.queue(t, a.createRecord(t, { type: a.ContentType.handshake, data: a.createCertificate(t) })), t.fail || (a.queue(t, a.createRecord(t, { type: a.ContentType.handshake, data: a.createServerKeyExchange(t) })), t.verifyClient !== !1 && a.queue(t, a.createRecord(t, { type: a.ContentType.handshake, data: a.createCertificateRequest(t) })), a.queue(t, a.createRecord(t, { type: a.ContentType.handshake, data: a.createServerHelloDone(t) })))), a.flush(t), t.process() }, a.handleCertificate = function (t, n, r) { if (r < 3) return t.error(t, { message: "Invalid Certificate message. Message too short.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.illegal_parameter } }); var i = n.fragment, s = { certificate_list: o(i, 3) }, u, f, l = []; try { while (s.certificate_list.length() > 0) u = o(s.certificate_list, 3), f = e.asn1.fromDer(u), u = e.pki.certificateFromAsn1(f, !0), l.push(u) } catch (h) { return t.error(t, { message: "Could not parse certificate list.", cause: h, send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.bad_certificate } }) } var p = t.entity === a.ConnectionEnd.client; !p && t.verifyClient !== !0 || l.length !== 0 ? l.length === 0 ? t.expect = p ? c : w : (p ? t.session.serverCertificate = l[0] : t.session.clientCertificate = l[0], a.verifyCertificateChain(t, l) && (t.expect = p ? c : w)) : t.error(t, { message: p ? "No server certificate provided." : "No client certificate provided.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.illegal_parameter } }), t.process() }, a.handleServerKeyExchange = function (e, t, n) { if (n > 0) return e.error(e, { message: "Invalid key parameters. Only RSA is supported.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.unsupported_certificate } }); e.expect = h, e.process() }, a.handleClientKeyExchange = function (t, n, r) { if (r < 48) return t.error(t, { message: "Invalid key parameters. Only RSA is supported.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.unsupported_certificate } }); var i = n.fragment, s = { enc_pre_master_secret: o(i, 2).getBytes() }, u = null; if (t.getPrivateKey) try { u = t.getPrivateKey(t, t.session.serverCertificate), u = e.pki.privateKeyFromPem(u) } catch (f) { t.error(t, { message: "Could not get private key.", cause: f, send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.internal_error } }) } if (u === null) return t.error(t, { message: "No private key set.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.internal_error } }); try { var l = t.session.sp; l.pre_master_secret = u.decrypt(s.enc_pre_master_secret); var c = t.session.clientHelloVersion; if (c.major !== l.pre_master_secret.charCodeAt(0) || c.minor !== l.pre_master_secret.charCodeAt(1)) throw new Error("TLS version rollback attack detected.") } catch (f) { l.pre_master_secret = e.random.getBytes(48) } t.expect = S, t.session.clientCertificate !== null && (t.expect = E), t.process() }, a.handleCertificateRequest = function (e, t, n) { if (n < 3) return e.error(e, { message: "Invalid CertificateRequest. Message too short.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.illegal_parameter } }); var r = t.fragment, i = { certificate_types: o(r, 1), certificate_authorities: o(r, 2) }; e.session.certificateRequest = i, e.expect = p, e.process() }, a.handleCertificateVerify = function (t, n, r) { if (r < 2) return t.error(t, { message: "Invalid CertificateVerify. Message too short.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.illegal_parameter } }); var i = n.fragment; i.read -= 4; var s = i.bytes(); i.read += 4; var u = { signature: o(i, 2).getBytes() }, f = e.util.createBuffer(); f.putBuffer(t.session.md5.digest()), f.putBuffer(t.session.sha1.digest()), f = f.getBytes(); try { var l = t.session.clientCertificate; if (!l.publicKey.verify(f, u.signature, "NONE")) throw new Error("CertificateVerify signature does not match."); t.session.md5.update(s), t.session.sha1.update(s) } catch (c) { return t.error(t, { message: "Bad signature in CertificateVerify.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.handshake_failure } }) } t.expect = S, t.process() }, a.handleServerHelloDone = function (t, n, r) { if (r > 0) return t.error(t, { message: "Invalid ServerHelloDone message. Invalid length.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.record_overflow } }); if (t.serverCertificate === null) { var i = { message: "No server certificate provided. Not enough security.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.insufficient_security } }, s = 0, o = t.verify(t, i.alert.description, s, []); if (o !== !0) { if (o || o === 0) typeof o == "object" && !e.util.isArray(o) ? (o.message && (i.message = o.message), o.alert && (i.alert.description = o.alert)) : typeof o == "number" && (i.alert.description = o); return t.error(t, i) } } t.session.certificateRequest !== null && (n = a.createRecord(t, { type: a.ContentType.handshake, data: a.createCertificate(t) }), a.queue(t, n)), n = a.createRecord(t, { type: a.ContentType.handshake, data: a.createClientKeyExchange(t) }), a.queue(t, n), t.expect = g; var u = function (e, t) { e.session.certificateRequest !== null && e.session.clientCertificate !== null && a.queue(e, a.createRecord(e, { type: a.ContentType.handshake, data: a.createCertificateVerify(e, t) })), a.queue(e, a.createRecord(e, { type: a.ContentType.change_cipher_spec, data: a.createChangeCipherSpec() })), e.state.pending = a.createConnectionState(e), e.state.current.write = e.state.pending.write, a.queue(e, a.createRecord(e, { type: a.ContentType.handshake, data: a.createFinished(e) })), e.expect = d, a.flush(e), e.process() }; if (t.session.certificateRequest === null || t.session.clientCertificate === null) return u(t, null); a.getClientSignature(t, u) }, a.handleChangeCipherSpec = function (e, t) { if (t.fragment.getByte() !== 1) return e.error(e, { message: "Invalid ChangeCipherSpec message received.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.illegal_parameter } }); var n = e.entity === a.ConnectionEnd.client; if (e.session.resuming && n || !e.session.resuming && !n) e.state.pending = a.createConnectionState(e); e.state.current.read = e.state.pending.read; if (!e.session.resuming && n || e.session.resuming && !n) e.state.pending = null; e.expect = n ? v : x, e.process() }, a.handleFinished = function (n, r, i) { var s = r.fragment; s.read -= 4; var o = s.bytes(); s.read += 4; var u = r.fragment.getBytes(); s = e.util.createBuffer(), s.putBuffer(n.session.md5.digest()), s.putBuffer(n.session.sha1.digest()); var f = n.entity === a.ConnectionEnd.client, l = f ? "server finished" : "client finished", c = n.session.sp, h = 12, p = t; s = p(c.master_secret, l, s.getBytes(), h); if (s.getBytes() !== u) return n.error(n, { message: "Invalid verify_data in Finished message.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.decrypt_error } }); n.session.md5.update(o), n.session.sha1.update(o); if (n.session.resuming && f || !n.session.resuming && !f) a.queue(n, a.createRecord(n, { type: a.ContentType.change_cipher_spec, data: a.createChangeCipherSpec() })), n.state.current.write = n.state.pending.write, n.state.pending = null, a.queue(n, a.createRecord(n, { type: a.ContentType.handshake, data: a.createFinished(n) })); n.expect = f ? m : T, n.handshaking = !1, ++n.handshakes, n.peerCertificate = f ? n.session.serverCertificate : n.session.clientCertificate, a.flush(n), n.isConnected = !0, n.connected(n), n.process() }, a.handleAlert = function (e, t) { var n = t.fragment, r = { level: n.getByte(), description: n.getByte() }, i; switch (r.description) { case a.Alert.Description.close_notify: i = "Connection closed."; break; case a.Alert.Description.unexpected_message: i = "Unexpected message."; break; case a.Alert.Description.bad_record_mac: i = "Bad record MAC."; break; case a.Alert.Description.decryption_failed: i = "Decryption failed."; break; case a.Alert.Description.record_overflow: i = "Record overflow."; break; case a.Alert.Description.decompression_failure: i = "Decompression failed."; break; case a.Alert.Description.handshake_failure: i = "Handshake failure."; break; case a.Alert.Description.bad_certificate: i = "Bad certificate."; break; case a.Alert.Description.unsupported_certificate: i = "Unsupported certificate."; break; case a.Alert.Description.certificate_revoked: i = "Certificate revoked."; break; case a.Alert.Description.certificate_expired: i = "Certificate expired."; break; case a.Alert.Description.certificate_unknown: i = "Certificate unknown."; break; case a.Alert.Description.illegal_parameter: i = "Illegal parameter."; break; case a.Alert.Description.unknown_ca: i = "Unknown certificate authority."; break; case a.Alert.Description.access_denied: i = "Access denied."; break; case a.Alert.Description.decode_error: i = "Decode error."; break; case a.Alert.Description.decrypt_error: i = "Decrypt error."; break; case a.Alert.Description.export_restriction: i = "Export restriction."; break; case a.Alert.Description.protocol_version: i = "Unsupported protocol version."; break; case a.Alert.Description.insufficient_security: i = "Insufficient security."; break; case a.Alert.Description.internal_error: i = "Internal error."; break; case a.Alert.Description.user_canceled: i = "User canceled."; break; case a.Alert.Description.no_renegotiation: i = "Renegotiation not supported."; break; default: i = "Unknown error." }if (r.description === a.Alert.Description.close_notify) return e.close(); e.error(e, { message: i, send: !1, origin: e.entity === a.ConnectionEnd.client ? "server" : "client", alert: r }), e.process() }, a.handleHandshake = function (t, n) { var r = n.fragment, i = r.getByte(), s = r.getInt24(); if (s > r.length()) return t.fragmented = n, n.fragment = e.util.createBuffer(), r.read -= 4, t.process(); t.fragmented = null, r.read -= 4; var o = r.bytes(s + 4); r.read += 4, i in q[t.entity][t.expect] ? (t.entity === a.ConnectionEnd.server && !t.open && !t.fail && (t.handshaking = !0, t.session = { version: null, extensions: { server_name: { serverNameList: [] } }, cipherSuite: null, compressionMethod: null, serverCertificate: null, clientCertificate: null, md5: e.md.md5.create(), sha1: e.md.sha1.create() }), i !== a.HandshakeType.hello_request && i !== a.HandshakeType.certificate_verify && i !== a.HandshakeType.finished && (t.session.md5.update(o), t.session.sha1.update(o)), q[t.entity][t.expect][i](t, n, s)) : a.handleUnexpected(t, n) }, a.handleApplicationData = function (e, t) { e.data.putBuffer(t.fragment), e.dataReady(e), e.process() }, a.handleHeartbeat = function (t, n) { var r = n.fragment, i = r.getByte(), s = r.getInt16(), o = r.getBytes(s); if (i === a.HeartbeatMessageType.heartbeat_request) { if (t.handshaking || s > o.length) return t.process(); a.queue(t, a.createRecord(t, { type: a.ContentType.heartbeat, data: a.createHeartbeat(a.HeartbeatMessageType.heartbeat_response, o) })), a.flush(t) } else if (i === a.HeartbeatMessageType.heartbeat_response) { if (o !== t.expectedHeartbeatPayload) return t.process(); t.heartbeatReceived && t.heartbeatReceived(t, e.util.createBuffer(o)) } t.process() }; var f = 0, l = 1, c = 2, h = 3, p = 4, d = 5, v = 6, m = 7, g = 8, y = 0, b = 1, w = 2, E = 3, S = 4, x = 5, T = 6, N = 7, C = a.handleUnexpected, k = a.handleChangeCipherSpec, L = a.handleAlert, A = a.handleHandshake, O = a.handleApplicationData, M = a.handleHeartbeat, _ = []; _[a.ConnectionEnd.client] = [[C, L, A, C, M], [C, L, A, C, M], [C, L, A, C, M], [C, L, A, C, M], [C, L, A, C, M], [k, L, C, C, M], [C, L, A, C, M], [C, L, A, O, M], [C, L, A, C, M]], _[a.ConnectionEnd.server] = [[C, L, A, C, M], [C, L, A, C, M], [C, L, A, C, M], [C, L, A, C, M], [k, L, C, C, M], [C, L, A, C, M], [C, L, A, O, M], [C, L, A, C, M]]; var D = a.handleHelloRequest, P = a.handleServerHello, H = a.handleCertificate, B = a.handleServerKeyExchange, j = a.handleCertificateRequest, F = a.handleServerHelloDone, I = a.handleFinished, q = []; q[a.ConnectionEnd.client] = [[C, C, P, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C], [D, C, C, C, C, C, C, C, C, C, C, H, B, j, F, C, C, C, C, C, C], [D, C, C, C, C, C, C, C, C, C, C, C, B, j, F, C, C, C, C, C, C], [D, C, C, C, C, C, C, C, C, C, C, C, C, j, F, C, C, C, C, C, C], [D, C, C, C, C, C, C, C, C, C, C, C, C, C, F, C, C, C, C, C, C], [D, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C], [D, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, I], [D, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C], [D, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C]]; var R = a.handleClientHello, U = a.handleClientKeyExchange, z = a.handleCertificateVerify; q[a.ConnectionEnd.server] = [[C, R, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C], [C, C, C, C, C, C, C, C, C, C, C, H, C, C, C, C, C, C, C, C, C], [C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, U, C, C, C, C], [C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, z, C, C, C, C, C], [C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C], [C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, I], [C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C], [C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C, C]], a.generateKeys = function (e, n) { var r = t, i = n.client_random + n.server_random; e.session.resuming || (n.master_secret = r(n.pre_master_secret, "master secret", i, 48).bytes(), n.pre_master_secret = null), i = n.server_random + n.client_random; var s = 2 * n.mac_key_length + 2 * n.enc_key_length, o = e.version.major === a.Versions.TLS_1_0.major && e.version.minor === a.Versions.TLS_1_0.minor; o && (s += 2 * n.fixed_iv_length); var u = r(n.master_secret, "key expansion", i, s), f = { client_write_MAC_key: u.getBytes(n.mac_key_length), server_write_MAC_key: u.getBytes(n.mac_key_length), client_write_key: u.getBytes(n.enc_key_length), server_write_key: u.getBytes(n.enc_key_length) }; return o && (f.client_write_IV = u.getBytes(n.fixed_iv_length), f.server_write_IV = u.getBytes(n.fixed_iv_length)), f }, a.createConnectionState = function (e) { var t = e.entity === a.ConnectionEnd.client, n = function () { var e = { sequenceNumber: [0, 0], macKey: null, macLength: 0, macFunction: null, cipherState: null, cipherFunction: function (e) { return !0 }, compressionState: null, compressFunction: function (e) { return !0 }, updateSequenceNumber: function () { e.sequenceNumber[1] === 4294967295 ? (e.sequenceNumber[1] = 0, ++e.sequenceNumber[0]) : ++e.sequenceNumber[1] } }; return e }, r = { read: n(), write: n() }; r.read.update = function (e, t) { return r.read.cipherFunction(t, r.read) ? r.read.compressFunction(e, t, r.read) || e.error(e, { message: "Could not decompress record.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.decompression_failure } }) : e.error(e, { message: "Could not decrypt record or bad MAC.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.bad_record_mac } }), !e.fail }, r.write.update = function (e, t) { return r.write.compressFunction(e, t, r.write) ? r.write.cipherFunction(t, r.write) || e.error(e, { message: "Could not encrypt record.", send: !1, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.internal_error } }) : e.error(e, { message: "Could not compress record.", send: !1, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.internal_error } }), !e.fail }; if (e.session) { var o = e.session.sp; e.session.cipherSuite.initSecurityParameters(o), o.keys = a.generateKeys(e, o), r.read.macKey = t ? o.keys.server_write_MAC_key : o.keys.client_write_MAC_key, r.write.macKey = t ? o.keys.client_write_MAC_key : o.keys.server_write_MAC_key, e.session.cipherSuite.initConnectionState(r, e, o); switch (o.compression_algorithm) { case a.CompressionMethod.none: break; case a.CompressionMethod.deflate: r.read.compressFunction = s, r.write.compressFunction = i; break; default: throw new Error("Unsupported compression algorithm.") } } return r }, a.createRandom = function () { var t = new Date, n = +t + t.getTimezoneOffset() * 6e4, r = e.util.createBuffer(); return r.putInt32(n), r.putBytes(e.random.getBytes(28)), r }, a.createRecord = function (e, t) { if (!t.data) return null; var n = { type: t.type, version: { major: e.version.major, minor: e.version.minor }, length: t.data.length(), fragment: t.data }; return n }, a.createAlert = function (t, n) { var r = e.util.createBuffer(); return r.putByte(n.level), r.putByte(n.description), a.createRecord(t, { type: a.ContentType.alert, data: r }) }, a.createClientHello = function (t) { t.session.clientHelloVersion = { major: t.version.major, minor: t.version.minor }; var n = e.util.createBuffer(); for (var r = 0; r < t.cipherSuites.length; ++r) { var i = t.cipherSuites[r]; n.putByte(i.id[0]), n.putByte(i.id[1]) } var s = n.length(), o = e.util.createBuffer(); o.putByte(a.CompressionMethod.none); var f = o.length(), l = e.util.createBuffer(); if (t.virtualHost) { var c = e.util.createBuffer(); c.putByte(0), c.putByte(0); var h = e.util.createBuffer(); h.putByte(0), u(h, 2, e.util.createBuffer(t.virtualHost)); var p = e.util.createBuffer(); u(p, 2, h), u(c, 2, p), l.putBuffer(c) } var d = l.length(); d > 0 && (d += 2); var v = t.session.id, m = v.length + 1 + 2 + 4 + 28 + 2 + s + 1 + f + d, g = e.util.createBuffer(); return g.putByte(a.HandshakeType.client_hello), g.putInt24(m), g.putByte(t.version.major), g.putByte(t.version.minor), g.putBytes(t.session.sp.client_random), u(g, 1, e.util.createBuffer(v)), u(g, 2, n), u(g, 1, o), d > 0 && u(g, 2, l), g }, a.createServerHello = function (t) { var n = t.session.id, r = n.length + 1 + 2 + 4 + 28 + 2 + 1, i = e.util.createBuffer(); return i.putByte(a.HandshakeType.server_hello), i.putInt24(r), i.putByte(t.version.major), i.putByte(t.version.minor), i.putBytes(t.session.sp.server_random), u(i, 1, e.util.createBuffer(n)), i.putByte(t.session.cipherSuite.id[0]), i.putByte(t.session.cipherSuite.id[1]), i.putByte(t.session.compressionMethod), i }, a.createCertificate = function (t) { var n = t.entity === a.ConnectionEnd.client, r = null; if (t.getCertificate) { var i; n ? i = t.session.certificateRequest : i = t.session.extensions.server_name.serverNameList, r = t.getCertificate(t, i) } var s = e.util.createBuffer(); if (r !== null) try { e.util.isArray(r) || (r = [r]); var o = null; for (var f = 0; f < r.length; ++f) { var l = e.pem.decode(r[f])[0]; if (l.type !== "CERTIFICATE" && l.type !== "X509 CERTIFICATE" && l.type !== "TRUSTED CERTIFICATE") { var c = new Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".'); throw c.headerType = l.type, c } if (l.procType && l.procType.type === "ENCRYPTED") throw new Error("Could not convert certificate from PEM; PEM is encrypted."); var h = e.util.createBuffer(l.body); o === null && (o = e.asn1.fromDer(h.bytes(), !1)); var p = e.util.createBuffer(); u(p, 3, h), s.putBuffer(p) } r = e.pki.certificateFromAsn1(o), n ? t.session.clientCertificate = r : t.session.serverCertificate = r } catch (d) { return t.error(t, { message: "Could not send certificate list.", cause: d, send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.bad_certificate } }) } var v = 3 + s.length(), m = e.util.createBuffer(); return m.putByte(a.HandshakeType.certificate), m.putInt24(v), u(m, 3, s), m }, a.createClientKeyExchange = function (t) { var n = e.util.createBuffer(); n.putByte(t.session.clientHelloVersion.major), n.putByte(t.session.clientHelloVersion.minor), n.putBytes(e.random.getBytes(46)); var r = t.session.sp; r.pre_master_secret = n.getBytes(); var i = t.session.serverCertificate.publicKey; n = i.encrypt(r.pre_master_secret); var s = n.length + 2, o = e.util.createBuffer(); return o.putByte(a.HandshakeType.client_key_exchange), o.putInt24(s), o.putInt16(n.length), o.putBytes(n), o }, a.createServerKeyExchange = function (t) { var n = 0, r = e.util.createBuffer(); return n > 0 && (r.putByte(a.HandshakeType.server_key_exchange), r.putInt24(n)), r }, a.getClientSignature = function (t, n) { var r = e.util.createBuffer(); r.putBuffer(t.session.md5.digest()), r.putBuffer(t.session.sha1.digest()), r = r.getBytes(), t.getSignature = t.getSignature || function (t, n, r) { var i = null; if (t.getPrivateKey) try { i = t.getPrivateKey(t, t.session.clientCertificate), i = e.pki.privateKeyFromPem(i) } catch (s) { t.error(t, { message: "Could not get private key.", cause: s, send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.internal_error } }) } i === null ? t.error(t, { message: "No private key set.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.internal_error } }) : n = i.sign(n, null), r(t, n) }, t.getSignature(t, r, n) }, a.createCertificateVerify = function (t, n) { var r = n.length + 2, i = e.util.createBuffer(); return i.putByte(a.HandshakeType.certificate_verify), i.putInt24(r), i.putInt16(n.length), i.putBytes(n), i }, a.createCertificateRequest = function (t) { var n = e.util.createBuffer(); n.putByte(1); var r = e.util.createBuffer(); for (var i in t.caStore.certs) { var s = t.caStore.certs[i], o = e.pki.distinguishedNameToAsn1(s.subject), f = e.asn1.toDer(o); r.putInt16(f.length()), r.putBuffer(f) } var l = 1 + n.length() + 2 + r.length(), c = e.util.createBuffer(); return c.putByte(a.HandshakeType.certificate_request), c.putInt24(l), u(c, 1, n), u(c, 2, r), c }, a.createServerHelloDone = function (t) { var n = e.util.createBuffer(); return n.putByte(a.HandshakeType.server_hello_done), n.putInt24(0), n }, a.createChangeCipherSpec = function () { var t = e.util.createBuffer(); return t.putByte(1), t }, a.createFinished = function (n) { var r = e.util.createBuffer(); r.putBuffer(n.session.md5.digest()), r.putBuffer(n.session.sha1.digest()); var i = n.entity === a.ConnectionEnd.client, s = n.session.sp, o = 12, u = t, f = i ? "client finished" : "server finished"; r = u(s.master_secret, f, r.getBytes(), o); var l = e.util.createBuffer(); return l.putByte(a.HandshakeType.finished), l.putInt24(r.length()), l.putBuffer(r), l }, a.createHeartbeat = function (t, n, r) { typeof r == "undefined" && (r = n.length); var i = e.util.createBuffer(); i.putByte(t), i.putInt16(r), i.putBytes(n); var s = i.length(), o = Math.max(16, s - r - 3); return i.putBytes(e.random.getBytes(o)), i }, a.queue = function (t, n) { if (!n) return; if (n.type === a.ContentType.handshake) { var r = n.fragment.bytes(); t.session.md5.update(r), t.session.sha1.update(r), r = null } var i; if (n.fragment.length() <= a.MaxFragment) i = [n]; else { i = []; var s = n.fragment.bytes(); while (s.length > a.MaxFragment) i.push(a.createRecord(t, { type: n.type, data: e.util.createBuffer(s.slice(0, a.MaxFragment)) })), s = s.slice(a.MaxFragment); s.length > 0 && i.push(a.createRecord(t, { type: n.type, data: e.util.createBuffer(s) })) } for (var o = 0; o < i.length && !t.fail; ++o) { var u = i[o], f = t.state.current.write; f.update(t, u) && t.records.push(u) } }, a.flush = function (e) { for (var t = 0; t < e.records.length; ++t) { var n = e.records[t]; e.tlsData.putByte(n.type), e.tlsData.putByte(n.version.major), e.tlsData.putByte(n.version.minor), e.tlsData.putInt16(n.fragment.length()), e.tlsData.putBuffer(e.records[t].fragment) } return e.records = [], e.tlsDataReady(e) }; var W = function (t) { switch (t) { case !0: return !0; case e.pki.certificateError.bad_certificate: return a.Alert.Description.bad_certificate; case e.pki.certificateError.unsupported_certificate: return a.Alert.Description.unsupported_certificate; case e.pki.certificateError.certificate_revoked: return a.Alert.Description.certificate_revoked; case e.pki.certificateError.certificate_expired: return a.Alert.Description.certificate_expired; case e.pki.certificateError.certificate_unknown: return a.Alert.Description.certificate_unknown; case e.pki.certificateError.unknown_ca: return a.Alert.Description.unknown_ca; default: return a.Alert.Description.bad_certificate } }, X = function (t) { switch (t) { case !0: return !0; case a.Alert.Description.bad_certificate: return e.pki.certificateError.bad_certificate; case a.Alert.Description.unsupported_certificate: return e.pki.certificateError.unsupported_certificate; case a.Alert.Description.certificate_revoked: return e.pki.certificateError.certificate_revoked; case a.Alert.Description.certificate_expired: return e.pki.certificateError.certificate_expired; case a.Alert.Description.certificate_unknown: return e.pki.certificateError.certificate_unknown; case a.Alert.Description.unknown_ca: return e.pki.certificateError.unknown_ca; default: return e.pki.certificateError.bad_certificate } }; a.verifyCertificateChain = function (t, n) { try { e.pki.verifyCertificateChain(t.caStore, n, function (r, i, s) { var o = W(r), u = t.verify(t, r, i, s); if (u !== !0) { if (typeof u == "object" && !e.util.isArray(u)) { var f = new Error("The application rejected the certificate."); throw f.send = !0, f.alert = { level: a.Alert.Level.fatal, description: a.Alert.Description.bad_certificate }, u.message && (f.message = u.message), u.alert && (f.alert.description = u.alert), f } u !== r && (u = X(u)) } return u }) } catch (r) { var i = r; if (typeof i != "object" || e.util.isArray(i)) i = { send: !0, alert: { level: a.Alert.Level.fatal, description: W(r) } }; "send" in i || (i.send = !0), "alert" in i || (i.alert = { level: a.Alert.Level.fatal, description: W(i.error) }), t.error(t, i) } return !t.fail }, a.createSessionCache = function (t, n) { var r = null; if (t && t.getSession && t.setSession && t.order) r = t; else { r = {}, r.cache = t || {}, r.capacity = Math.max(n || 100, 1), r.order = []; for (var i in t) r.order.length <= n ? r.order.push(i) : delete t[i]; r.getSession = function (t) { var n = null, i = null; t ? i = e.util.bytesToHex(t) : r.order.length > 0 && (i = r.order[0]); if (i !== null && i in r.cache) { n = r.cache[i], delete r.cache[i]; for (var s in r.order) if (r.order[s] === i) { r.order.splice(s, 1); break } } return n }, r.setSession = function (t, n) { if (r.order.length === r.capacity) { var i = r.order.shift(); delete r.cache[i] } var i = e.util.bytesToHex(t); r.order.push(i), r.cache[i] = n } } return r }, a.createConnection = function (t) { var n = null; t.caStore ? e.util.isArray(t.caStore) ? n = e.pki.createCaStore(t.caStore) : n = t.caStore : n = e.pki.createCaStore(); var r = t.cipherSuites || null; if (r === null) { r = []; for (var i in a.CipherSuites) r.push(a.CipherSuites[i]) } var s = t.server || !1 ? a.ConnectionEnd.server : a.ConnectionEnd.client, o = t.sessionCache ? a.createSessionCache(t.sessionCache) : null, u = { version: { major: a.Version.major, minor: a.Version.minor }, entity: s, sessionId: t.sessionId, caStore: n, sessionCache: o, cipherSuites: r, connected: t.connected, virtualHost: t.virtualHost || null, verifyClient: t.verifyClient || !1, verify: t.verify || function (e, t, n, r) { return t }, getCertificate: t.getCertificate || null, getPrivateKey: t.getPrivateKey || null, getSignature: t.getSignature || null, input: e.util.createBuffer(), tlsData: e.util.createBuffer(), data: e.util.createBuffer(), tlsDataReady: t.tlsDataReady, dataReady: t.dataReady, heartbeatReceived: t.heartbeatReceived, closed: t.closed, error: function (e, n) { n.origin = n.origin || (e.entity === a.ConnectionEnd.client ? "client" : "server"), n.send && (a.queue(e, a.createAlert(e, n.alert)), a.flush(e)); var r = n.fatal !== !1; r && (e.fail = !0), t.error(e, n), r && e.close(!1) }, deflate: t.deflate || null, inflate: t.inflate || null }; u.reset = function (e) { u.version = { major: a.Version.major, minor: a.Version.minor }, u.record = null, u.session = null, u.peerCertificate = null, u.state = { pending: null, current: null }, u.expect = u.entity === a.ConnectionEnd.client ? f : y, u.fragmented = null, u.records = [], u.open = !1, u.handshakes = 0, u.handshaking = !1, u.isConnected = !1, u.fail = !e && typeof e != "undefined", u.input.clear(), u.tlsData.clear(), u.data.clear(), u.state.current = a.createConnectionState(u) }, u.reset(); var l = function (e, t) { var n = t.type - a.ContentType.change_cipher_spec, r = _[e.entity][e.expect]; n in r ? r[n](e, t) : a.handleUnexpected(e, t) }, c = function (t) { var n = 0, r = t.input, i = r.length(); if (i < 5) n = 5 - i; else { t.record = { type: r.getByte(), version: { major: r.getByte(), minor: r.getByte() }, length: r.getInt16(), fragment: e.util.createBuffer(), ready: !1 }; var s = t.record.version.major === t.version.major; s && t.session && t.session.version && (s = t.record.version.minor === t.version.minor), s || t.error(t, { message: "Incompatible TLS version.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.protocol_version } }) } return n }, h = function (e) { var t = 0, n = e.input, r = n.length(); if (r < e.record.length) t = e.record.length - r; else { e.record.fragment.putBytes(n.getBytes(e.record.length)), n.compact(); var i = e.state.current.read; i.update(e, e.record) && (e.fragmented !== null && (e.fragmented.type === e.record.type ? (e.fragmented.fragment.putBuffer(e.record.fragment), e.record = e.fragmented) : e.error(e, { message: "Invalid fragmented record.", send: !0, alert: { level: a.Alert.Level.fatal, description: a.Alert.Description.unexpected_message } })), e.record.ready = !0) } return t }; return u.handshake = function (t) { if (u.entity !== a.ConnectionEnd.client) u.error(u, { message: "Cannot initiate handshake as a server.", fatal: !1 }); else if (u.handshaking) u.error(u, { message: "Handshake already in progress.", fatal: !1 }); else { u.fail && !u.open && u.handshakes === 0 && (u.fail = !1), u.handshaking = !0, t = t || ""; var n = null; t.length > 0 && (u.sessionCache && (n = u.sessionCache.getSession(t)), n === null && (t = "")), t.length === 0 && u.sessionCache && (n = u.sessionCache.getSession(), n !== null && (t = n.id)), u.session = { id: t, version: null, cipherSuite: null, compressionMethod: null, serverCertificate: null, certificateRequest: null, clientCertificate: null, sp: {}, md5: e.md.md5.create(), sha1: e.md.sha1.create() }, n && (u.version = n.version, u.session.sp = n.sp), u.session.sp.client_random = a.createRandom().getBytes(), u.open = !0, a.queue(u, a.createRecord(u, { type: a.ContentType.handshake, data: a.createClientHello(u) })), a.flush(u) } }, u.process = function (e) { var t = 0; return e && u.input.putBytes(e), u.fail || (u.record !== null && u.record.ready && u.record.fragment.isEmpty() && (u.record = null), u.record === null && (t = c(u)), !u.fail && u.record !== null && !u.record.ready && (t = h(u)), !u.fail && u.record !== null && u.record.ready && l(u, u.record)), t }, u.prepare = function (t) { return a.queue(u, a.createRecord(u, { type: a.ContentType.application_data, data: e.util.createBuffer(t) })), a.flush(u) }, u.prepareHeartbeatRequest = function (t, n) { return t instanceof e.util.ByteBuffer && (t = t.bytes()), typeof n == "undefined" && (n = t.length), u.expectedHeartbeatPayload = t, a.queue(u, a.createRecord(u, { type: a.ContentType.heartbeat, data: a.createHeartbeat(a.HeartbeatMessageType.heartbeat_request, t, n) })), a.flush(u) }, u.close = function (e) { if (!u.fail && u.sessionCache && u.session) { var t = { id: u.session.id, version: u.session.version, sp: u.session.sp }; t.sp.keys = null, u.sessionCache.setSession(t.id, t) } if (u.open) { u.open = !1, u.input.clear(); if (u.isConnected || u.handshaking) u.isConnected = u.handshaking = !1, a.queue(u, a.createAlert(u, { level: a.Alert.Level.warning, description: a.Alert.Description.close_notify })), a.flush(u); u.closed(u) } u.reset(e) }, u }, e.tls = e.tls || {}; for (var V in a) typeof a[V] != "function" && (e.tls[V] = a[V]); e.tls.prf_tls1 = t, e.tls.hmac_sha1 = r, e.tls.createSessionCache = a.createSessionCache, e.tls.createConnection = a.createConnection } var r = "tls"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/tls", ["require", "module", "./asn1", "./hmac", "./md", "./pem", "./pki", "./random", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function n(n, i, s) { var o = i.entity === e.tls.ConnectionEnd.client; n.read.cipherState = { init: !1, cipher: e.cipher.createDecipher("AES-CBC", o ? s.keys.server_write_key : s.keys.client_write_key), iv: o ? s.keys.server_write_IV : s.keys.client_write_IV }, n.write.cipherState = { init: !1, cipher: e.cipher.createCipher("AES-CBC", o ? s.keys.client_write_key : s.keys.server_write_key), iv: o ? s.keys.client_write_IV : s.keys.server_write_IV }, n.read.cipherFunction = u, n.write.cipherFunction = r, n.read.macLength = n.write.macLength = s.mac_length, n.read.macFunction = n.write.macFunction = t.hmac_sha1 } function r(n, r) { var s = !1, o = r.macFunction(r.macKey, r.sequenceNumber, n); n.fragment.putBytes(o), r.updateSequenceNumber(); var u; n.version.minor === t.Versions.TLS_1_0.minor ? u = r.cipherState.init ? null : r.cipherState.iv : u = e.random.getBytesSync(16), r.cipherState.init = !0; var a = r.cipherState.cipher; return a.start({ iv: u }), n.version.minor >= t.Versions.TLS_1_1.minor && a.output.putBytes(u), a.update(n.fragment), a.finish(i) && (n.fragment = a.output, n.length = n.fragment.length(), s = !0), s } function i(e, t, n) { if (!n) { var r = e - t.length() % e; t.fillWithByte(r - 1, r) } return !0 } function s(e, t, n) { var r = !0; if (n) { var i = t.length(), s = t.last(); for (var o = i - 1 - s; o < i - 1; ++o)r = r && t.at(o) == s; r && t.truncate(s + 1) } return r } function u(n, r) { var i = !1; ++o; var u; n.version.minor === t.Versions.TLS_1_0.minor ? u = r.cipherState.init ? null : r.cipherState.iv : u = n.fragment.getBytes(16), r.cipherState.init = !0; var f = r.cipherState.cipher; f.start({ iv: u }), f.update(n.fragment), i = f.finish(s); var l = r.macLength, c = e.random.getBytesSync(l), h = f.output.length(); h >= l ? (n.fragment = f.output.getBytes(h - l), c = f.output.getBytes(l)) : n.fragment = f.output.getBytes(), n.fragment = e.util.createBuffer(n.fragment), n.length = n.fragment.length(); var p = r.macFunction(r.macKey, r.sequenceNumber, n); return r.updateSequenceNumber(), i = a(r.macKey, c, p) && i, i } function a(t, n, r) { var i = e.hmac.create(); return i.start("SHA1", t), i.update(n), n = i.digest().getBytes(), i.start(null, null), i.update(r), r = i.digest().getBytes(), n === r } var t = e.tls; t.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA = { id: [0, 47], name: "TLS_RSA_WITH_AES_128_CBC_SHA", initSecurityParameters: function (e) { e.bulk_cipher_algorithm = t.BulkCipherAlgorithm.aes, e.cipher_type = t.CipherType.block, e.enc_key_length = 16, e.block_length = 16, e.fixed_iv_length = 16, e.record_iv_length = 16, e.mac_algorithm = t.MACAlgorithm.hmac_sha1, e.mac_length = 20, e.mac_key_length = 20 }, initConnectionState: n }, t.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA = { id: [0, 53], name: "TLS_RSA_WITH_AES_256_CBC_SHA", initSecurityParameters: function (e) { e.bulk_cipher_algorithm = t.BulkCipherAlgorithm.aes, e.cipher_type = t.CipherType.block, e.enc_key_length = 32, e.block_length = 16, e.fixed_iv_length = 16, e.record_iv_length = 16, e.mac_algorithm = t.MACAlgorithm.hmac_sha1, e.mac_length = 20, e.mac_key_length = 20 }, initConnectionState: n }; var o = 0 } var r = "aesCipherSuites"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/aesCipherSuites", ["require", "module", "./aes", "./tls"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { e.debug = e.debug || {}, e.debug.storage = {}, e.debug.get = function (t, n) { var r; return typeof t == "undefined" ? r = e.debug.storage : t in e.debug.storage && (typeof n == "undefined" ? r = e.debug.storage[t] : r = e.debug.storage[t][n]), r }, e.debug.set = function (t, n, r) { t in e.debug.storage || (e.debug.storage[t] = {}), e.debug.storage[t][n] = r }, e.debug.clear = function (t, n) { typeof t == "undefined" ? e.debug.storage = {} : t in e.debug.storage && (typeof n == "undefined" ? delete e.debug.storage[t] : delete e.debug.storage[t][n]) } } var r = "debug"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/debug", ["require", "module"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function n(t, n, r, i) { t.generate = function (t, s) { var o = new e.util.ByteBuffer, u = Math.ceil(s / i) + r, a = new e.util.ByteBuffer; for (var f = r; f < u; ++f) { a.putInt32(f), n.start(), n.update(t + a.getBytes()); var l = n.digest(); o.putBytes(l.getBytes(i)) } return o.truncate(o.length() - s), o.getBytes() } } e.kem = e.kem || {}; var t = e.jsbn.BigInteger; e.kem.rsa = {}, e.kem.rsa.create = function (n, r) { r = r || {}; var i = r.prng || e.random, s = {}; return s.encrypt = function (r, s) { var o = Math.ceil(r.n.bitLength() / 8), u; do u = (new t(e.util.bytesToHex(i.getBytesSync(o)), 16)).mod(r.n); while (u.equals(t.ZERO)); u = e.util.hexToBytes(u.toString(16)); var a = o - u.length; a > 0 && (u = e.util.fillString(String.fromCharCode(0), a) + u); var f = r.encrypt(u, "NONE"), l = n.generate(u, s); return { encapsulation: f, key: l } }, s.decrypt = function (e, t, r) { var i = e.decrypt(t, "NONE"); return n.generate(i, r) }, s }, e.kem.kdf1 = function (e, t) { n(this, e, 0, t || e.digestLength) }, e.kem.kdf2 = function (e, t) { n(this, e, 1, t || e.digestLength) } } var r = "kem"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/kem", ["require", "module", "./util", "./random", "./jsbn"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { e.log = e.log || {}, e.log.levels = ["none", "error", "warning", "info", "debug", "verbose", "max"]; var t = {}, n = [], r = null; e.log.LEVEL_LOCKED = 2, e.log.NO_LEVEL_CHECK = 4, e.log.INTERPOLATE = 8; for (var i = 0; i < e.log.levels.length; ++i) { var s = e.log.levels[i]; t[s] = { index: i, name: s.toUpperCase() } } e.log.logMessage = function (r) { var i = t[r.level].index; for (var s = 0; s < n.length; ++s) { var o = n[s]; if (o.flags & e.log.NO_LEVEL_CHECK) o.f(r); else { var u = t[o.level].index; i <= u && o.f(o, r) } } }, e.log.prepareStandard = function (e) { "standard" in e || (e.standard = t[e.level].name + " [" + e.category + "] " + e.message) }, e.log.prepareFull = function (t) { if (!("full" in t)) { var n = [t.message]; n = n.concat([] || t.arguments), t.full = e.util.format.apply(this, n) } }, e.log.prepareStandardFull = function (t) { "standardFull" in t || (e.log.prepareStandard(t), t.standardFull = t.standard) }; var o = ["error", "warning", "info", "debug", "verbose"]; for (var i = 0; i < o.length; ++i)(function (t) { e.log[t] = function (n, r) { var i = Array.prototype.slice.call(arguments).slice(2), s = { timestamp: new Date, level: t, category: n, message: r, arguments: i }; e.log.logMessage(s) } })(o[i]); e.log.makeLogger = function (t) { var n = { flags: 0, f: t }; return e.log.setLevel(n, "none"), n }, e.log.setLevel = function (t, n) { var r = !1; if (t && !(t.flags & e.log.LEVEL_LOCKED)) for (var i = 0; i < e.log.levels.length; ++i) { var s = e.log.levels[i]; if (n == s) { t.level = n, r = !0; break } } return r }, e.log.lock = function (t, n) { typeof n == "undefined" || n ? t.flags |= e.log.LEVEL_LOCKED : t.flags &= ~e.log.LEVEL_LOCKED }, e.log.addLogger = function (e) { n.push(e) }; if (typeof console != "undefined" && "log" in console) { var u; if (console.error && console.warn && console.info && console.debug) { var a = { error: console.error, warning: console.warn, info: console.info, debug: console.debug, verbose: console.debug }, f = function (t, n) { e.log.prepareStandard(n); var r = a[n.level], i = [n.standard]; i = i.concat(n.arguments.slice()), r.apply(console, i) }; u = e.log.makeLogger(f) } else { var f = function (t, n) { e.log.prepareStandardFull(n), console.log(n.standardFull) }; u = e.log.makeLogger(f) } e.log.setLevel(u, "debug"), e.log.addLogger(u), r = u } else console = { log: function () { } }; if (r !== null) { var l = e.util.getQueryVariables(); "console.level" in l && e.log.setLevel(r, l["console.level"].slice(-1)[0]); if ("console.lock" in l) { var c = l["console.lock"].slice(-1)[0]; c == "true" && e.log.lock(r) } } e.log.consoleLogger = r } var r = "log"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/log", ["require", "module", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function r(r) { var i = {}, s = []; if (!t.validate(r, n.asn1.recipientInfoValidator, i, s)) { var o = new Error("Cannot read PKCS#7 RecipientInfo. ASN.1 object is not an PKCS#7 RecipientInfo."); throw o.errors = s, o } return { version: i.version.charCodeAt(0), issuer: e.pki.RDNAttributesAsArray(i.issuer), serialNumber: e.util.createBuffer(i.serial).toHex(), encryptedContent: { algorithm: t.derToOid(i.encAlgorithm), parameter: i.encParameter.value, content: i.encKey } } } function i(n) { return t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.INTEGER, !1, t.integerToDer(n.version).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [e.pki.distinguishedNameToAsn1({ attributes: n.issuer }), t.create(t.Class.UNIVERSAL, t.Type.INTEGER, !1, e.util.hexToBytes(n.serialNumber))]), t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.encryptedContent.algorithm).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.NULL, !1, "")]), t.create(t.Class.UNIVERSAL, t.Type.OCTETSTRING, !1, n.encryptedContent.content)]) } function s(e) { var t = []; for (var n = 0; n < e.length; ++n)t.push(r(e[n])); return t } function o(e) { var t = []; for (var n = 0; n < e.length; ++n)t.push(i(e[n])); return t } function u(r) { var i = {}, s = []; if (!t.validate(r, n.asn1.signerInfoValidator, i, s)) { var o = new Error("Cannot read PKCS#7 SignerInfo. ASN.1 object is not an PKCS#7 SignerInfo."); throw o.errors = s, o } var u = { version: i.version.charCodeAt(0), issuer: e.pki.RDNAttributesAsArray(i.issuer), serialNumber: e.util.createBuffer(i.serial).toHex(), digestAlgorithm: t.derToOid(i.digestAlgorithm), signatureAlgorithm: t.derToOid(i.signatureAlgorithm), signature: i.signature, authenticatedAttributes: [], unauthenticatedAttributes: [] }, a = i.authenticatedAttributes || [], f = i.unauthenticatedAttributes || []; return u } function a(n) { var r = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.INTEGER, !1, t.integerToDer(n.version).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [e.pki.distinguishedNameToAsn1({ attributes: n.issuer }), t.create(t.Class.UNIVERSAL, t.Type.INTEGER, !1, e.util.hexToBytes(n.serialNumber))]), t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.digestAlgorithm).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.NULL, !1, "")])]); n.authenticatedAttributesAsn1 && r.value.push(n.authenticatedAttributesAsn1), r.value.push(t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.signatureAlgorithm).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.NULL, !1, "")])), r.value.push(t.create(t.Class.UNIVERSAL, t.Type.OCTETSTRING, !1, n.signature)); if (n.unauthenticatedAttributes.length > 0) { var i = t.create(t.Class.CONTEXT_SPECIFIC, 1, !0, []); for (var s = 0; s < n.unauthenticatedAttributes.length; ++s) { var o = n.unauthenticatedAttributes[s]; i.values.push(c(o)) } r.value.push(i) } return r } function f(e) { var t = []; for (var n = 0; n < e.length; ++n)t.push(u(e[n])); return t } function l(e) { var t = []; for (var n = 0; n < e.length; ++n)t.push(a(e[n])); return t } function c(n) { var r; if (n.type === e.pki.oids.contentType) r = t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.value).getBytes()); else if (n.type === e.pki.oids.messageDigest) r = t.create(t.Class.UNIVERSAL, t.Type.OCTETSTRING, !1, n.value.bytes()); else if (n.type === e.pki.oids.signingTime) { var i = new Date("Jan 1, 1950 00:00:00Z"), s = new Date("Jan 1, 2050 00:00:00Z"), o = n.value; if (typeof o == "string") { var u = Date.parse(o); isNaN(u) ? o.length === 13 ? o = t.utcTimeToDate(o) : o = t.generalizedTimeToDate(o) : o = new Date(u) } o >= i && o < s ? r = t.create(t.Class.UNIVERSAL, t.Type.UTCTIME, !1, t.dateToUtcTime(o)) : r = t.create(t.Class.UNIVERSAL, t.Type.GENERALIZEDTIME, !1, t.dateToGeneralizedTime(o)) } return t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.type).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.SET, !0, [r])]) } function h(n) { return [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(e.pki.oids.data).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(n.algorithm).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.OCTETSTRING, !1, n.parameter.getBytes())]), t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, [t.create(t.Class.UNIVERSAL, t.Type.OCTETSTRING, !1, n.content.getBytes())])] } function p(n, r, i) { var s = {}, o = []; if (!t.validate(r, i, s, o)) { var u = new Error("Cannot read PKCS#7 message. ASN.1 object is not a supported PKCS#7 message."); throw u.errors = u, u } var a = t.derToOid(s.contentType); if (a !== e.pki.oids.data) throw new Error("Unsupported PKCS#7 message. Only wrapped ContentType Data supported."); if (s.encryptedContent) { var f = ""; if (e.util.isArray(s.encryptedContent)) for (var l = 0; l < s.encryptedContent.length; ++l) { if (s.encryptedContent[l].type !== t.Type.OCTETSTRING) throw new Error("Malformed PKCS#7 message, expecting encrypted content constructed of only OCTET STRING objects."); f += s.encryptedContent[l].value } else f = s.encryptedContent; n.encryptedContent = { algorithm: t.derToOid(s.encAlgorithm), parameter: e.util.createBuffer(s.encParameter.value), content: e.util.createBuffer(f) } } if (s.content) { var f = ""; if (e.util.isArray(s.content)) for (var l = 0; l < s.content.length; ++l) { if (s.content[l].type !== t.Type.OCTETSTRING) throw new Error("Malformed PKCS#7 message, expecting content constructed of only OCTET STRING objects."); f += s.content[l].value } else f = s.content; n.content = e.util.createBuffer(f) } return n.version = s.version.charCodeAt(0), n.rawCapture = s, s } function d(t) { if (t.encryptedContent.key === undefined) throw new Error("Symmetric key not available."); if (t.content === undefined) { var n; switch (t.encryptedContent.algorithm) { case e.pki.oids["aes128-CBC"]: case e.pki.oids["aes192-CBC"]: case e.pki.oids["aes256-CBC"]: n = e.aes.createDecryptionCipher(t.encryptedContent.key); break; case e.pki.oids.desCBC: case e.pki.oids["des-EDE3-CBC"]: n = e.des.createDecryptionCipher(t.encryptedContent.key); break; default: throw new Error("Unsupported symmetric cipher, OID " + t.encryptedContent.algorithm) }n.start(t.encryptedContent.parameter), n.update(t.encryptedContent.content); if (!n.finish()) throw new Error("Symmetric decryption failed."); t.content = n.output } } var t = e.asn1, n = e.pkcs7 = e.pkcs7 || {}; n.messageFromPem = function (r) { var i = e.pem.decode(r)[0]; if (i.type !== "PKCS7") { var s = new Error('Could not convert PKCS#7 message from PEM; PEM header type is not "PKCS#7".'); throw s.headerType = i.type, s } if (i.procType && i.procType.type === "ENCRYPTED") throw new Error("Could not convert PKCS#7 message from PEM; PEM is encrypted."); var o = t.fromDer(i.body); return n.messageFromAsn1(o) }, n.messageToPem = function (n, r) { var i = { type: "PKCS7", body: t.toDer(n.toAsn1()).getBytes() }; return e.pem.encode(i, { maxline: r }) }, n.messageFromAsn1 = function (r) { var i = {}, s = []; if (!t.validate(r, n.asn1.contentInfoValidator, i, s)) { var o = new Error("Cannot read PKCS#7 message. ASN.1 object is not an PKCS#7 ContentInfo."); throw o.errors = s, o } var u = t.derToOid(i.contentType), a; switch (u) { case e.pki.oids.envelopedData: a = n.createEnvelopedData(); break; case e.pki.oids.encryptedData: a = n.createEncryptedData(); break; case e.pki.oids.signedData: a = n.createSignedData(); break; default: throw new Error("Cannot read PKCS#7 message. ContentType with OID " + u + " is not (yet) supported.") }return a.fromAsn1(i.content.value[0]), a }, n.createSignedData = function () { function i() { var n = {}; for (var i = 0; i < r.signers.length; ++i) { var s = r.signers[i], o = s.digestAlgorithm; o in n || (n[o] = e.md[e.pki.oids[o]].create()), s.authenticatedAttributes.length === 0 ? s.md = n[o] : s.md = e.md[e.pki.oids[o]].create() } r.digestAlgorithmIdentifiers = []; for (var o in n) r.digestAlgorithmIdentifiers.push(t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(o).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.NULL, !1, "")])); return n } function s(n) { if (r.contentInfo.value.length < 2) throw new Error("Could not sign PKCS#7 message; there is no content to sign."); var i = t.derToOid(r.contentInfo.value[0].value), s = r.contentInfo.value[1]; s = s.value[0]; var o = t.toDer(s); o.getByte(), t.getBerValueLength(o), o = o.getBytes(); for (var u in n) n[u].start().update(o); var a = new Date; for (var f = 0; f < r.signers.length; ++f) { var h = r.signers[f]; if (h.authenticatedAttributes.length === 0) { if (i !== e.pki.oids.data) throw new Error("Invalid signer; authenticatedAttributes must be present when the ContentInfo content type is not PKCS#7 Data.") } else { h.authenticatedAttributesAsn1 = t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, []); var p = t.create(t.Class.UNIVERSAL, t.Type.SET, !0, []); for (var d = 0; d < h.authenticatedAttributes.length; ++d) { var v = h.authenticatedAttributes[d]; v.type === e.pki.oids.messageDigest ? v.value = n[h.digestAlgorithm].digest() : v.type === e.pki.oids.signingTime && (v.value || (v.value = a)), p.value.push(c(v)), h.authenticatedAttributesAsn1.value.push(c(v)) } o = t.toDer(p).getBytes(), h.md.start().update(o) } h.signature = h.key.sign(h.md, "RSASSA-PKCS1-V1_5") } r.signerInfos = l(r.signers) } var r = null; return r = { type: e.pki.oids.signedData, version: 1, certificates: [], crls: [], signers: [], digestAlgorithmIdentifiers: [], contentInfo: null, signerInfos: [], fromAsn1: function (t) { p(r, t, n.asn1.signedDataValidator), r.certificates = [], r.crls = [], r.digestAlgorithmIdentifiers = [], r.contentInfo = null, r.signerInfos = []; var i = r.rawCapture.certificates.value; for (var s = 0; s < i.length; ++s)r.certificates.push(e.pki.certificateFromAsn1(i[s])) }, toAsn1: function () { r.contentInfo || r.sign(); var n = []; for (var i = 0; i < r.certificates.length; ++i)n.push(e.pki.certificateToAsn1(r.certificates[i])); var s = [], o = t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, [t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.INTEGER, !1, t.integerToDer(r.version).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.SET, !0, r.digestAlgorithmIdentifiers), r.contentInfo])]); return n.length > 0 && o.value[0].value.push(t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, n)), s.length > 0 && o.value[0].value.push(t.create(t.Class.CONTEXT_SPECIFIC, 1, !0, s)), o.value[0].value.push(t.create(t.Class.UNIVERSAL, t.Type.SET, !0, r.signerInfos)), t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(r.type).getBytes()), o]) }, addSigner: function (t) { var n = t.issuer, i = t.serialNumber; if (t.certificate) { var s = t.certificate; typeof s == "string" && (s = e.pki.certificateFromPem(s)), n = s.issuer.attributes, i = s.serialNumber } var o = t.key; if (!o) throw new Error("Could not add PKCS#7 signer; no private key specified."); typeof o == "string" && (o = e.pki.privateKeyFromPem(o)); var u = t.digestAlgorithm || e.pki.oids.sha1; switch (u) { case e.pki.oids.sha1: case e.pki.oids.sha256: case e.pki.oids.sha384: case e.pki.oids.sha512: case e.pki.oids.md5: break; default: throw new Error("Could not add PKCS#7 signer; unknown message digest algorithm: " + u) }var a = t.authenticatedAttributes || []; if (a.length > 0) { var f = !1, l = !1; for (var c = 0; c < a.length; ++c) { var h = a[c]; if (!f && h.type === e.pki.oids.contentType) { f = !0; if (l) break; continue } if (!l && h.type === e.pki.oids.messageDigest) { l = !0; if (f) break; continue } } if (!f || !l) throw new Error("Invalid signer.authenticatedAttributes. If signer.authenticatedAttributes is specified, then it must contain at least two attributes, PKCS #9 content-type and PKCS #9 message-digest.") } r.signers.push({ key: o, version: 1, issuer: n, serialNumber: i, digestAlgorithm: u, signatureAlgorithm: e.pki.oids.rsaEncryption, signature: null, authenticatedAttributes: a, unauthenticatedAttributes: [] }) }, sign: function () { if (typeof r.content != "object" || r.contentInfo === null) { r.contentInfo = t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(e.pki.oids.data).getBytes())]); if ("content" in r) { var n; r.content instanceof e.util.ByteBuffer ? n = r.content.bytes() : typeof r.content == "string" && (n = e.util.encodeUtf8(r.content)), r.contentInfo.value.push(t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, [t.create(t.Class.UNIVERSAL, t.Type.OCTETSTRING, !1, n)])) } } if (r.signers.length === 0) return; var o = i(); s(o) }, verify: function () { throw new Error("PKCS#7 signature verification not yet implemented.") }, addCertificate: function (t) { typeof t == "string" && (t = e.pki.certificateFromPem(t)), r.certificates.push(t) }, addCertificateRevokationList: function (e) { throw new Error("PKCS#7 CRL support not yet implemented.") } }, r }, n.createEncryptedData = function () { var t = null; return t = { type: e.pki.oids.encryptedData, version: 0, encryptedContent: { algorithm: e.pki.oids["aes256-CBC"] }, fromAsn1: function (e) { p(t, e, n.asn1.encryptedDataValidator) }, decrypt: function (e) { e !== undefined && (t.encryptedContent.key = e), d(t) } }, t }, n.createEnvelopedData = function () { var r = null; return r = { type: e.pki.oids.envelopedData, version: 0, recipients: [], encryptedContent: { algorithm: e.pki.oids["aes256-CBC"] }, fromAsn1: function (e) { var t = p(r, e, n.asn1.envelopedDataValidator); r.recipients = s(t.recipientInfos.value) }, toAsn1: function () { return t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.OID, !1, t.oidToDer(r.type).getBytes()), t.create(t.Class.CONTEXT_SPECIFIC, 0, !0, [t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, [t.create(t.Class.UNIVERSAL, t.Type.INTEGER, !1, t.integerToDer(r.version).getBytes()), t.create(t.Class.UNIVERSAL, t.Type.SET, !0, o(r.recipients)), t.create(t.Class.UNIVERSAL, t.Type.SEQUENCE, !0, h(r.encryptedContent))])])]) }, findRecipient: function (e) { var t = e.issuer.attributes; for (var n = 0; n < r.recipients.length; ++n) { var i = r.recipients[n], s = i.issuer; if (i.serialNumber !== e.serialNumber) continue; if (s.length !== t.length) continue; var o = !0; for (var u = 0; u < t.length; ++u)if (s[u].type !== t[u].type || s[u].value !== t[u].value) { o = !1; break } if (o) return i } return null }, decrypt: function (t, n) { if (r.encryptedContent.key === undefined && t !== undefined && n !== undefined) switch (t.encryptedContent.algorithm) { case e.pki.oids.rsaEncryption: case e.pki.oids.desCBC: var i = n.decrypt(t.encryptedContent.content); r.encryptedContent.key = e.util.createBuffer(i); break; default: throw new Error("Unsupported asymmetric cipher, OID " + t.encryptedContent.algorithm) }d(r) }, addRecipient: function (t) { r.recipients.push({ version: 0, issuer: t.issuer.attributes, serialNumber: t.serialNumber, encryptedContent: { algorithm: e.pki.oids.rsaEncryption, key: t.publicKey } }) }, encrypt: function (t, n) { if (r.encryptedContent.content === undefined) { n = n || r.encryptedContent.algorithm, t = t || r.encryptedContent.key; var i, s, o; switch (n) { case e.pki.oids["aes128-CBC"]: i = 16, s = 16, o = e.aes.createEncryptionCipher; break; case e.pki.oids["aes192-CBC"]: i = 24, s = 16, o = e.aes.createEncryptionCipher; break; case e.pki.oids["aes256-CBC"]: i = 32, s = 16, o = e.aes.createEncryptionCipher; break; case e.pki.oids["des-EDE3-CBC"]: i = 24, s = 8, o = e.des.createEncryptionCipher; break; default: throw new Error("Unsupported symmetric cipher, OID " + n) }if (t === undefined) t = e.util.createBuffer(e.random.getBytes(i)); else if (t.length() != i) throw new Error("Symmetric key has wrong length; got " + t.length() + " bytes, expected " + i + "."); r.encryptedContent.algorithm = n, r.encryptedContent.key = t, r.encryptedContent.parameter = e.util.createBuffer(e.random.getBytes(s)); var u = o(t); u.start(r.encryptedContent.parameter.copy()), u.update(r.content); if (!u.finish()) throw new Error("Symmetric encryption failed."); r.encryptedContent.content = u.output } for (var a = 0; a < r.recipients.length; ++a) { var f = r.recipients[a]; if (f.encryptedContent.content !== undefined) continue; switch (f.encryptedContent.algorithm) { case e.pki.oids.rsaEncryption: f.encryptedContent.content = f.encryptedContent.key.encrypt(r.encryptedContent.key.data); break; default: throw new Error("Unsupported asymmetric cipher, OID " + f.encryptedContent.algorithm) } } } }, r } } var r = "pkcs7"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/pkcs7", ["require", "module", "./aes", "./asn1", "./des", "./oids", "./pem", "./pkcs7asn1", "./random", "./util", "./x509"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { function n(t, n) { var r = n.toString(16); r[0] >= "8" && (r = "00" + r); var i = e.util.hexToBytes(r); t.putInt32(i.length), t.putBytes(i) } function r(e, t) { e.putInt32(t.length), e.putString(t) } function i() { var t = e.md.sha1.create(), n = arguments.length; for (var r = 0; r < n; ++r)t.update(arguments[r]); return t.digest() } var t = e.ssh = e.ssh || {}; t.privateKeyToPutty = function (t, s, o) { o = o || "", s = s || ""; var u = "ssh-rsa", a = s === "" ? "none" : "aes256-cbc", f = "PuTTY-User-Key-File-2: " + u + "\r\n"; f += "Encryption: " + a + "\r\n", f += "Comment: " + o + "\r\n"; var l = e.util.createBuffer(); r(l, u), n(l, t.e), n(l, t.n); var c = e.util.encode64(l.bytes(), 64), h = Math.floor(c.length / 66) + 1; f += "Public-Lines: " + h + "\r\n", f += c; var p = e.util.createBuffer(); n(p, t.d), n(p, t.p), n(p, t.q), n(p, t.qInv); var d; if (!s) d = e.util.encode64(p.bytes(), 64); else { var v = p.length() + 16 - 1; v -= v % 16; var m = i(p.bytes()); m.truncate(m.length() - v + p.length()), p.putBuffer(m); var g = e.util.createBuffer(); g.putBuffer(i("\0\0\0\0", s)), g.putBuffer(i("\0\0\0", s)); var y = e.aes.createEncryptionCipher(g.truncate(8), "CBC"); y.start(e.util.createBuffer().fillWithByte(0, 16)), y.update(p.copy()), y.finish(); var b = y.output; b.truncate(16), d = e.util.encode64(b.bytes(), 64) } h = Math.floor(d.length / 66) + 1, f += "\r\nPrivate-Lines: " + h + "\r\n", f += d; var w = i("putty-private-key-file-mac-key", s), E = e.util.createBuffer(); r(E, u), r(E, a), r(E, o), E.putInt32(l.length()), E.putBuffer(l), E.putInt32(p.length()), E.putBuffer(p); var S = e.hmac.create(); return S.start("sha1", w), S.update(E.bytes()), f += "\r\nPrivate-MAC: " + S.digest().toHex() + "\r\n", f }, t.publicKeyToOpenSSH = function (t, i) { var s = "ssh-rsa"; i = i || ""; var o = e.util.createBuffer(); return r(o, s), n(o, t.e), n(o, t.n), s + " " + e.util.encode64(o.bytes()) + " " + i }, t.privateKeyToOpenSSH = function (t, n) { return n ? e.pki.encryptRsaPrivateKey(t, n, { legacy: !0, algorithm: "aes128" }) : e.pki.privateKeyToPem(t) }, t.getPublicKeyFingerprint = function (t, i) { i = i || {}; var s = i.md || e.md.md5.create(), o = "ssh-rsa", u = e.util.createBuffer(); r(u, o), n(u, t.e), n(u, t.n), s.start(), s.update(u.getBytes()); var a = s.digest(); if (i.encoding === "hex") { var f = a.toHex(); return i.delimiter ? f.match(/.{2}/g).join(i.delimiter) : f } if (i.encoding === "binary") return a.getBytes(); if (i.encoding) throw new Error('Unknown encoding "' + i.encoding + '".'); return a } } var r = "ssh"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/ssh", ["require", "module", "./aes", "./hmac", "./md5", "./sha1", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { function e(e) { var t = "forge.task", n = 0, r = {}, i = 0; e.debug.set(t, "tasks", r); var s = {}; e.debug.set(t, "queues", s); var o = "?", u = 30, a = 20, f = "ready", l = "running", c = "blocked", h = "sleeping", p = "done", d = "error", v = "stop", m = "start", g = "block", y = "unblock", b = "sleep", w = "wakeup", E = "cancel", S = "fail", x = {}; x[f] = {}, x[f][v] = f, x[f][m] = l, x[f][E] = p, x[f][S] = d, x[l] = {}, x[l][v] = f, x[l][m] = l, x[l][g] = c, x[l][y] = l, x[l][b] = h, x[l][w] = l, x[l][E] = p, x[l][S] = d, x[c] = {}, x[c][v] = c, x[c][m] = c, x[c][g] = c, x[c][y] = c, x[c][b] = c, x[c][w] = c, x[c][E] = p, x[c][S] = d, x[h] = {}, x[h][v] = h, x[h][m] = h, x[h][g] = h, x[h][y] = h, x[h][b] = h, x[h][w] = h, x[h][E] = p, x[h][S] = d, x[p] = {}, x[p][v] = p, x[p][m] = p, x[p][g] = p, x[p][y] = p, x[p][b] = p, x[p][w] = p, x[p][E] = p, x[p][S] = d, x[d] = {}, x[d][v] = d, x[d][m] = d, x[d][g] = d, x[d][y] = d, x[d][b] = d, x[d][w] = d, x[d][E] = d, x[d][S] = d; var T = function (s) { this.id = -1, this.name = s.name || o, this.parent = s.parent || null, this.run = s.run, this.subtasks = [], this.error = !1, this.state = f, this.blocks = 0, this.timeoutId = null, this.swapTime = null, this.userData = null, this.id = i++ , r[this.id] = this, n >= 1 && e.log.verbose(t, "[%s][%s] init", this.id, this.name, this) }; T.prototype.debug = function (n) { n = n || "", e.log.debug(t, n, "[%s][%s] task:", this.id, this.name, this, "subtasks:", this.subtasks.length, "queue:", s) }, T.prototype.next = function (e, t) { typeof e == "function" && (t = e, e = this.name); var n = new T({ run: t, name: e, parent: this }); return n.state = l, n.type = this.type, n.successCallback = this.successCallback || null, n.failureCallback = this.failureCallback || null, this.subtasks.push(n), this }, T.prototype.parallel = function (t, n) { return e.util.isArray(t) && (n = t, t = this.name), this.next(t, function (r) { var i = r; i.block(n.length); var s = function (t, r) { e.task.start({ type: t, run: function (e) { n[r](e) }, success: function (e) { i.unblock() }, failure: function (e) { i.unblock() } }) }; for (var o = 0; o < n.length; o++) { var u = t + "__parallel-" + r.id + "-" + o, a = o; s(u, a) } }) }, T.prototype.stop = function () { this.state = x[this.state][v] }, T.prototype.start = function () { this.error = !1, this.state = x[this.state][m], this.state === l && (this.start = new Date, this.run(this), C(this, 0)) }, T.prototype.block = function (e) { e = typeof e == "undefined" ? 1 : e, this.blocks += e, this.blocks > 0 && (this.state = x[this.state][g]) }, T.prototype.unblock = function (e) { return e = typeof e == "undefined" ? 1 : e, this.blocks -= e, this.blocks === 0 && this.state !== p && (this.state = l, C(this, 0)), this.blocks }, T.prototype.sleep = function (e) { e = typeof e == "undefined" ? 0 : e, this.state = x[this.state][b]; var t = this; this.timeoutId = setTimeout(function () { t.timeoutId = null, t.state = l, C(t, 0) }, e) }, T.prototype.wait = function (e) { e.wait(this) }, T.prototype.wakeup = function () { this.state === h && (cancelTimeout(this.timeoutId), this.timeoutId = null, this.state = l, C(this, 0)) }, T.prototype.cancel = function () { this.state = x[this.state][E], this.permitsNeeded = 0, this.timeoutId !== null && (cancelTimeout(this.timeoutId), this.timeoutId = null), this.subtasks = [] }, T.prototype.fail = function (e) { this.error = !0, k(this, !0); if (e) e.error = this.error, e.swapTime = this.swapTime, e.userData = this.userData, C(e, 0); else { if (this.parent !== null) { var t = this.parent; while (t.parent !== null) t.error = this.error, t.swapTime = this.swapTime, t.userData = this.userData, t = t.parent; k(t, !0) } this.failureCallback && this.failureCallback(this) } }; var N = function (e) { e.error = !1, e.state = x[e.state][m], setTimeout(function () { e.state === l && (e.swapTime = +(new Date), e.run(e), C(e, 0)) }, 0) }, C = function (e, t) { var n = t > u || +(new Date) - e.swapTime > a, r = function (t) { t++; if (e.state === l) { n && (e.swapTime = +(new Date)); if (e.subtasks.length > 0) { var r = e.subtasks.shift(); r.error = e.error, r.swapTime = e.swapTime, r.userData = e.userData, r.run(r), r.error || C(r, t) } else k(e), e.error || e.parent !== null && (e.parent.error = e.error, e.parent.swapTime = e.swapTime, e.parent.userData = e.userData, C(e.parent, t)) } }; n ? setTimeout(r, 0) : r(t) }, k = function (i, o) { i.state = p, delete r[i.id], n >= 1 && e.log.verbose(t, "[%s][%s] finish", i.id, i.name, i), i.parent === null && (i.type in s ? s[i.type].length === 0 ? e.log.error(t, "[%s][%s] task queue empty [%s]", i.id, i.name, i.type) : s[i.type][0] !== i ? e.log.error(t, "[%s][%s] task not first in queue [%s]", i.id, i.name, i.type) : (s[i.type].shift(), s[i.type].length === 0 ? (n >= 1 && e.log.verbose(t, "[%s][%s] delete queue [%s]", i.id, i.name, i.type), delete s[i.type]) : (n >= 1 && e.log.verbose(t, "[%s][%s] queue start next [%s] remain:%s", i.id, i.name, i.type, s[i.type].length), s[i.type][0].start())) : e.log.error(t, "[%s][%s] task queue missing [%s]", i.id, i.name, i.type), o || (i.error && i.failureCallback ? i.failureCallback(i) : !i.error && i.successCallback && i.successCallback(i))) }; e.task = e.task || {}, e.task.start = function (r) { var i = new T({ run: r.run, name: r.name || o }); i.type = r.type, i.successCallback = r.success || null, i.failureCallback = r.failure || null, i.type in s ? s[r.type].push(i) : (n >= 1 && e.log.verbose(t, "[%s][%s] create queue [%s]", i.id, i.name, i.type), s[i.type] = [i], N(i)) }, e.task.cancel = function (e) { e in s && (s[e] = [s[e][0]]) }, e.task.createCondition = function () { var e = { tasks: {} }; return e.wait = function (t) { t.id in e.tasks || (t.block(), e.tasks[t.id] = t) }, e.notify = function () { var t = e.tasks; e.tasks = {}; for (var n in t) t[n].unblock() }, e } } var r = "task"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) return typeof forge == "undefined" && (forge = {}), e(forge); var i = !0; n = function (e, n) { n(t, module) } } var s, o = function (t, n) { n.exports = function (n) { var i = s.map(function (e) { return t(e) }).concat(e); n = n || {}, n.defined = n.defined || {}; if (n.defined[r]) return n[r]; n.defined[r] = !0; for (var o = 0; o < i.length; ++o)i[o](n); return n[r] } }, u = n; n = function (e, t) { return s = typeof e == "string" ? t.slice(2) : e.slice(2), i ? (delete n, u.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = u, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/task", ["require", "module", "./debug", "./log", "./util"], function () { o.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), function () { var e = "forge"; if (typeof n != "function") { if (typeof module != "object" || !module.exports) { typeof forge == "undefined" && (forge = { disableNativeCode: !1 }); return } var r = !0; n = function (e, n) { n(t, module) } } var i, s = function (t, n) { n.exports = function (n) { var r = i.map(function (e) { return t(e) }); n = n || {}, n.defined = n.defined || {}; if (n.defined[e]) return n[e]; n.defined[e] = !0; for (var s = 0; s < r.length; ++s)r[s](n); return n }, n.exports.disableNativeCode = !1, n.exports(n.exports) }, o = n; n = function (e, t) { return i = typeof e == "string" ? t.slice(2) : e.slice(2), r ? (delete n, o.apply(null, Array.prototype.slice.call(arguments, 0))) : (n = o, n.apply(null, Array.prototype.slice.call(arguments, 0))) }, n("js/forge", ["require", "module", "./aes", "./aesCipherSuites", "./asn1", "./cipher", "./cipherModes", "./debug", "./des", "./hmac", "./kem", "./log", "./md", "./mgf1", "./pbkdf2", "./pem", "./pkcs7", "./pkcs1", "./pkcs12", "./pki", "./prime", "./prng", "./pss", "./random", "./rc2", "./ssh", "./task", "./tls", "./util"], function () { s.apply(null, Array.prototype.slice.call(arguments, 0)) }) }(), t("js/forge") });
var GlobalPush;

var GetAndSetApplicationBadgeNumber = function () {
    GlobalPush.getApplicationIconBadgeNumber(
        function (badgeNumber) {
            SetApplicationBadgeNumber(badgeNumber++);
        },
        function (errorElement) {
            console.log(JSON.stringify(errorElement));
        }
    )
}

var SetApplicationBadgeNumber = function (number) {
    GlobalPush.setApplicationIconBadgeNumber(
        function (successElement) {
            console.log(JSON.stringify(successElement));
        },
        function (errorElement) {
            console.log(JSON.stringify(errorElement));
        },
        number)
}


var keyRAW = new Uint8Array([245, 87, 124, 4, 123, 198, 122, 12, 71, 15, 134, 220, 59, 62, 131, 187, 76, 243, 65, 156, 191, 171, 114, 189]);
var ivRAW = new Uint8Array([62, 81, 92, 156, 178, 142, 221, 199]);
var keySize = 24;
var ivSize = 8;
var salt = null
var password = null;
var derivedBytes = forge.pbe.opensslDeriveBytes(password, salt, keySize + ivSize);

function encrypt3DES(input) {
    var cipher = forge.cipher.createCipher('3DES-ECB', keyRAW);
    cipher.start({ iv: ab2str(ivRAW.buffer) });
    cipher.update(forge.util.createBuffer(input, 'binary'));
    cipher.finish();
    var output = forge.util.createBuffer();
    if (salt !== null) {
        output.putBytes('Salted__');
        output.putBytes(salt);
    }
    output.putBuffer(cipher.output);
    encrypted = forge.util.encode64(output.getBytes());
    return encrypted;
}

function decrypt(input, isCompression) {
    var decipher = forge.cipher.createDecipher('3DES-ECB', keyRAW);
    decipher.start({ iv: ab2str(ivRAW.buffer) });
    decipher.update(forge.util.createBuffer(forge.util.decode64(input), 'binary'));
    var result = decipher.finish();
    if (isCompression) {
        return decipher.output.data;
    }
    else {
        return decodeUTF8(str2ab_2(decipher.output.data));
    }
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}


function str2ab_2(str) {
    var buf = new ArrayBuffer(str.length * Uint8Array.BYTES_PER_ELEMENT);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return bufView;
}


function encodeUTF8(s) {
    var i = 0;
    var bytes = new Uint8Array(s.length * 4);
    for (var ci = 0; ci != s.length; ci++) {
        var c = s.charCodeAt(ci);
        if (c < 128) {
            bytes[i++] = c;
            continue;
        }
        if (c < 2048) {
            bytes[i++] = c >> 6 | 192;
        } else {
            if (c > 0xd7ff && c < 0xdc00) {
                if (++ci == s.length) throw 'UTF-8 encode: incomplete surrogate pair';
                var c2 = s.charCodeAt(ci);
                if (c2 < 0xdc00 || c2 > 0xdfff) throw 'UTF-8 encode: second char code 0x' + c2.toString(16) + ' at index ' + ci + ' in surrogate pair out of range';
                c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
                bytes[i++] = c >> 18 | 240;
                bytes[i++] = c >> 12 & 63 | 128;
            } else { // c <= 0xffff
                bytes[i++] = c >> 12 | 224;
            }
            bytes[i++] = c >> 6 & 63 | 128;
        }
        bytes[i++] = c & 63 | 128;
    }
    return bytes.subarray(0, i);
}

function decodeUTF8(bytes) {
    var s = '';
    var i = 0;
    while (i < bytes.length) {
        var c = bytes[i++];
        if (c > 127) {
            if (c > 191 && c < 224) {
                if (i >= bytes.length) throw 'UTF-8 decode: incomplete 2-byte sequence';
                c = (c & 31) << 6 | bytes[i] & 63;
            } else if (c > 223 && c < 240) {
                if (i + 1 >= bytes.length) throw 'UTF-8 decode: incomplete 3-byte sequence';
                c = (c & 15) << 12 | (bytes[i] & 63) << 6 | bytes[++i] & 63;
            } else if (c > 239 && c < 248) {
                if (i + 2 >= bytes.length) throw 'UTF-8 decode: incomplete 4-byte sequence';
                c = (c & 7) << 18 | (bytes[i] & 63) << 12 | (bytes[++i] & 63) << 6 | bytes[++i] & 63;
            } else throw 'UTF-8 decode: unknown multibyte start 0x' + c.toString(16) + ' at index ' + (i - 1);
            ++i;
        }

        if (c <= 0xffff) s += String.fromCharCode(c);
        else if (c <= 0x10ffff) {
            c -= 0x10000;
            s += String.fromCharCode(c >> 10 | 0xd800)
            s += String.fromCharCode(c & 0x3FF | 0xdc00)
        } else throw 'UTF-8 decode: code point 0x' + c.toString(16) + ' exceeds UTF-16 reach';
    }
    return s;
}

function uint8ToBase64(buffer) {
    var binary = '';
    var len = buffer.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(buffer[i]);
    }
    return window.btoa(binary);
}
/*{ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };*/
var watchIDGeoLocalizacion = "";

var PermanentPositionWatcher = "";

var currentPosition = {
    Latitud: -0.1693638,
    Longitud: -78.4865797,
    PosicionInsertar: "[" + String(-0.1693638) + "," + String(-78.4865797) + "]",
    DummyPosition: true
}

function onSuccessGeoposition(position, action) {
    currentPosition = {
        Latitud: position.coords.latitude,
        Longitud: position.coords.longitude,
        PosicionInsertar: "[" + String(position.coords.latitude) + "," + String(position.coords.longitude) + "]",
        DummyPosition: false
    }
    if (action)
        action(currentPosition);
    stopLookPositions();
    stopProcess();
}

function downLoadCurrentPositionSync(enableHighAccuracy, action) {
    initProcess('Obteniendo Posici??n Actual');
    watchIDGeoLocalizacion = navigator.geolocation.getCurrentPosition(function (pos) { onSuccessGeoposition(pos, action) }, onErrorGeoposition, { timeout: 30000, enableHighAccuracy: false });
}

function onErrorGeoposition(error) {
    stopProcess();
    showNotificationError(CORE_MESSAGE('NoGPS'))
    currentPosition = {
        Latitud: -0.1693638,
        Longitud: -78.4865797,
        PosicionInsertar: "[" + String(-0.1693638) + "," + String(-78.4865797) + "]",
        DummyPosition: true
    }
}

function downLoadCurrentPosition(action) {
    initProcess('Obteniendo Posici??n');
    watchIDGeoLocalizacion = navigator.geolocation.getCurrentPosition(onSuccessGeoposition, onErrorGeoposition, { timeout: 30000, enableHighAccuracy: false });
    if (action)
        action(currentPosition);
    stopProcess();
}

function lookPositions() {
    watchIDGeoLocalizacion = navigator.geolocation.watchPosition(onSuccessGeoposition, onErrorGeoposition, { maximumAge: 3000, timeout: 30000, enableHighAccuracy: false });
}

var startPositionWatcher = function (age, time, highAccuracy, action) {
    PermanentPositionWatcher = navigator.geolocation.watchPosition(action, onErrorGeoposition, { maximumAge: age, timeout: time, enableHighAccuracy: highAccuracy });
}

function stopLookPositions() {
    navigator.geolocation.clearWatch(watchIDGeoLocalizacion);
}


function calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination) {
    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
var Vibrate = function (timeMS) {
    navigator.vibrate(timeMS)
}


/*Pattern = [1000, 1000, 3000, 1000, 5000]*/
var VibratePattern = function (Pattern) {
    navigator.vibrate(Pattern);
}

var VibrateWithPattern = function (Pattern) {
    navigator.notification.vibrateWithPattern(Pattern);
}
var intentosConexion = 0;
var Request;
function SendPostRequestToService(WebRequest, addFunction, LoadScreen, platForm) {
    WebRequest.DeviceId = DeviceInfo.DeviceUUID;
    var netInfo, netInfo1, netInfo2, netInfo3, netInfo4 = "";
    if (navigator.connection) {
        netInfo1 = (navigator.connection.type) ? navigator.connection.type : "Simulador";
        netInfo2 = (navigator.connection.effectiveType) ? navigator.connection.effectiveType : "N/A";
        netInfo3 = (navigator.connection.downlink) ? String(navigator.connection.downlink) : "N/A";
        netInfo4 = (navigator.connection.rtt) ? String(navigator.connection.rtt) : "0";
    }
    WebRequest.NetInfo = netInfo1 + "_" + netInfo2 + "_" + netInfo3 + "_" + netInfo4;;
    if (Parameters.ComMode) {
        WebRequest.ComMode = Parameters.ComMode;
    } else {
        WebRequest.ComMode = "2"//DEFECTO
    }
    switch (WebRequest.ComMode) {
        case "0"://Parametros viaja enclaro y sin compresion
            WebRequest.Parameters = JSON.stringify(WebRequest.Parameters)
            break;
        case "1"://Parametros viaja Comprimida
            var jsonstr = JSON.stringify(WebRequest.Parameters);
            var bytesCompressed = CompressData(jsonstr);
            WebRequest.Parameters = uint8ToBase64(bytesCompressed);
            break;
        case "2"://Respuesta viaja cifrada
            WebRequest.Parameters = encrypt3DES(encodeUTF8(JSON.stringify(WebRequest.Parameters)));
            break;
        case "3"://respuesta viaja comprimida y cifrada
            WebRequest.Parameters = CompressData(JSON.stringify(WebRequest.Parameters));
            WebRequest.Parameters = encrypt3DES(WebRequest.Parameters);
            break;
    }
    Request = WebRequest;
    if (WebRequest.AppVersion != undefined && Parameters)
        WebRequest.AppVersion = Parameters.AppVersion;
    var isAsync = true;
    if (LoadScreen)
        LoadScreen(WebRequest.TransactionCode);
    $.extend(WebRequest, { Session: sessionServer });
    if (deviceType === undefined || deviceType === "null") {
        if (!platForm || platForm == 'Web') {
            return AjaxPostService(WebRequest, addFunction, isAsync);
        }
        else
            return AjaxPostServiceMobile(WebRequest, addFunction, isAsync);
    } else {
        return SSLPinningPost(WebRequest, addFunction, isAsync);
    }
}

function SuccessServiceCall(data, CoreRequest, addFunction) {
    switch (data.ComMode) {
        case "0"://Respuesta viaja enclaro y sin compresion
            break;
        case "1"://Respuesta viaja Comprimida
            data.ResponseElements = decodeUTF8(DecompressData(forge.util.decode64(data.ResponseElements)));
            data.ResponseElements = JSON.parse(data.ResponseElements);
            break;
        case "2"://Respuesta viaja cifrada
            data.ResponseElements = decrypt(data.ResponseElements);
            data.ResponseElements = JSON.parse(data.ResponseElements);
            break;
        case "3"://respuesta viaja comprimida y cifrada
            data.ResponseElements = decrypt(data.ResponseElements, true);
            data.ResponseElements = DecompressData(data.ResponseElements);
            data.ResponseElements = JSON.parse(decodeUTF8(data.ResponseElements));
            break;
        default:
            try {
                var result = JSON.parse(decrypt(data));
            } catch (e) {
                var result = {
                    ResponseElements: decrypt(data),
                    TransactionResponseCode: "9999",
                    AditionalCoreMessage: "No se pudo Transformar la respuesta. Error de comunicaci??n se debe analizar la propiedad ResponseElements",
                    TransactionCode: CoreRequest.TransactionCode,
                    TransactionState: false
                };
            }
            data = result;
            break;
    }
    if (Parameters.ComMode != data.ComMode) {
        if (DeviceInfo.DeviceName === undefined || DeviceInfo.DeviceName != 'NombreSimulador') {
            updateUsersComModde(data.ComMode, function () {
                console.log('Updated ComMode = ---> data.ComMode')
            });
        } else {
            Parameters.ComMode = data.ComMode;
        }
    }
    if (Parameters.ComMode) {
        switch (CoreRequest.ComMode) {
            case "0"://Parametros viaja enclaro y sin compresion
                break;
            case "1"://Parametros viaja Comprimida
                CoreRequest.Parameters = JSON.parse(decodeUTF8(DecompressData(forge.util.decode64(CoreRequest.Parameters))));
                break;
            case "2"://Respuesta viaja cifrada
                CoreRequest.Parameters = JSON.parse(decrypt(CoreRequest.Parameters));
                break;
            case "3"://respuesta viaja comprimida y cifrada
                CoreRequest.Parameters = decrypt(CoreRequest.Parameters, true);
                CoreRequest.Parameters = DecompressData(CoreRequest.Parameters);
                CoreRequest.Parameters = JSON.parse(decodeUTF8(CoreRequest.Parameters));
                break;
        }

        CoreRequest.ComMode = Parameters.ComMode;

    } else {
        CoreRequest.Parameters = JSON.parse(decrypt(CoreRequest.Parameters));
    }
    debugger;
    if (addFunction) {
        $.extend(data, { esRegistro: CoreRequest.Parameters.esRegistro });
        var isOk = addFunction.handlerError(data, CoreRequest.Parameters);
        if (isOk)
            addFunction(data.ResponseElements);
    }
    stopProcess();
}


function AnalizeServerResponse(result) {
    try {
        if (result.TransactionResponseCode != '00') {
            throw result;
        }
        return result.ResponseElements;
    } catch (e) {
        throw e;
    }
}

function ServiceFailed(result, WebRequest, addFunction, isAsync) {
    intentosConexion++;
    var status = "Not recieved"
    var statusText = "Not recieved";
    if (result) {
        status = result.status;
        statusText = (result.statusText != undefined) ? result.statusText : result.error;
    }
    if (+status === 401) {
        addFunction.handlerError({ TransactionResponseCode: "UnAuthorized_401", AditionalCoreMessage: "La sesi??n ha caducado, debes iniciarla nuevamente." }, undefined);
    }
    else {
        if (+status === 500 && statusText.contains("handshake failed")) {
            SSLPinningEnableSSLPinning(false);
            SSLPinningAcceptAllCerts(true);
            SSLPinningValidateDomainName(false);
        }
        if (intentosConexion < 2) {
            switch (WebRequest.ComMode) {
                case "0"://Parametros viaja enclaro y sin compresion
                    WebRequest.Parameters = JSON.parse(WebRequest.Parameters);
                    break;
                case "1"://Parametros viaja Comprimida
                    WebRequest.Parameters = JSON.parse(decodeUTF8(DecompressData(forge.util.decode64(WebRequest.Parameters))));
                    break;
                case "2"://Respuesta viaja cifrada
                    WebRequest.Parameters = JSON.parse(decrypt(WebRequest.Parameters));
                    break;
                case "3"://respuesta viaja comprimida y cifrada
                    WebRequest.Parameters = decrypt(WebRequest.Parameters, true);
                    WebRequest.Parameters = DecompressData(WebRequest.Parameters);
                    WebRequest.Parameters = JSON.parse(decodeUTF8(WebRequest.Parameters));
                    break;
                default:
                    WebRequest = JSON.parse(decrypt(WebRequest));
                    break;
            }
            stopProcess();
            SendPostRequestToService(WebRequest, addFunction, function () {
                LoadScreen(Request, true);
            });
        } else {
            intentosConexion = 0;
            stopProcess();
            showErrorMessage('Error de Conexi??n', 'Error de conexi??n, por favor REVISA que estes conectado a una red de datos y/o que tengas conexi??n con tu proveedor de internet e intenta m??s tarde. Estado: ' + String(status) + ' Estado Texto: ' + statusText,
                function () {
                    addFunction.handlerError({ TransactionResponseCode: "CONERR_REP", AditionalCoreMessage: "" }, undefined);
                }
            );
        }
    }
}



function AjaxPostService(WebRequest, addFunction, isAsync, esReconexion) {
    try {
        var ResponseAjaxCall = $.ajax({
            type: "POST",
            dataType: "json",
            scriptCharset: "utf-8",
            url: WebRequest.URL + '/api/' + WebRequest.Controller,
            data: WebRequest,
            headers: {
                "Authorization": "Bearer " + Parameters.JWT
            },
            success: function (data) {
                SuccessServiceCall(data, WebRequest, addFunction);
            },
            error: function (result) {
                ServiceFailed(result, WebRequest, addFunction, isAsync);
            },
            async: isAsync
        });
        if (isAsync == false) {
            var responseClaro = decrypt(ResponseAjaxCall.responseJSON);
            var ObjetoRespuesta = AnalizeServerResponse(JSON.parse(decodeURIComponent(escape(responseClaro))));
            return ObjetoRespuesta;
        }
    } catch (e) {
        throw e;
    }
}

function AjaxPostServiceMobile(MovilRequest, addFunction, isAsync, esReconexion) {
    try {
        var ResponseAjaxCall = $.ajax({
            type: "POST",
            dataType: "json",
            scriptCharset: "utf-8",
            url: Parameters.ServiceUri,
            data: MovilRequest,
            headers: {
                "Authorization": "Bearer " + Parameters.JWT
            },
            success: function (data) {
                SuccessServiceCall(data, MovilRequest, addFunction);
            },
            error: function (result) {
                ServiceFailed(result, MovilRequest, addFunction, isAsync);
            },
            async: isAsync
        });
    } catch (e) {
        throw e;
    }
}

function SSLPinningEnableSSLPinning(value) {
    cordovaHTTP.enableSSLPinning(value, function () {
    }, function () {
        alert('error :(');
    });
}

function SSLPinningAcceptAllCerts(value) {
    cordovaHTTP.acceptAllCerts(value, function () {
    }, function () {
        alert('error :(');
    });
}

function SSLPinningPost(MovilRequest, addFunction, isAsync) {
    try {
        var MovilRequestCopyStepByStep = {
            ComMode: MovilRequest.ComMode,
            DeviceId: MovilRequest.DeviceId,
            AppVersion: MovilRequest.AppVersion,
            AppID: MovilRequest.AppID,
            Controller: MovilRequest.Controller,
            TransactionDescription: MovilRequest.TransactionDescription,
            TransactionCode: MovilRequest.TransactionCode,
            Parameters: MovilRequest.Parameters,
            Session: MovilRequest.Session,
            NetInfo: MovilRequest.NetInfo
        }
        cordovaHTTP.post(
            Parameters.ServiceUri,
            MovilRequestCopyStepByStep,
            { Authorization: "Bearer " + Parameters.JWT },
            function (data) {
                SuccessServiceCall(JSON.parse(data.data), MovilRequestCopyStepByStep, addFunction);
            },
            function (result) {
                ServiceFailed(result.data, MovilRequestCopyStepByStep, addFunction, isAsync);
            });
        if (isAsync == false) {
            var responseClaro = decrypt(ResponsePinningCall.responseJSON);
            var ObjetoRespuesta = AnalizeServerResponse(JSON.parse(decodeURIComponent(escape(responseClaro))));
            return ObjetoRespuesta;
        }
    } catch (e) {
        throw e;
    }
}

function SSLPinningGet(MovilRequest) {
    try {
        cordovaHTTP.get(Parameters.ServiceUri, MovilRequest, { Authorization: "Bearer " + Parameters.JWT }, SSLPinningSuccessCallBack, SSLPinningErrorCallBack);
    } catch (e) {
        throw e;
    }
}

function SSLPinningUploadFile(MovilRequest, filePath, type) {
    try {
        //ejemplo= type = "picture"
        cordovaHTTP.uploadFile(Parameters.ServiceUri, MovilRequest, { Authorization: "Bearer " + Parameters.JWT }, filePath, type, SSLPinningSuccessCallBack, SSLPinningErrorCallBack);
    } catch (e) {
        throw e;
    }
}

function SSLPinningDownloadFile(MovilRequest, filePath) {
    try {
        cordovaHTTP.downloadFile(Parameters.ServiceUri,
            MovilRequest,
            { Authorization: "Bearer " + Parameters.JWT },
            filePath,
            SSLPinningSuccessCallBack,
            SSLPinningErrorCallBack);
    } catch (e) {
        throw e;
    }
}

function SSLPinningErrorCallBack(error) {
    console.error(error.status);
    console.error(error.error);
}

function SSLPinningSuccessCallBack(response) {
    console.log(response.status);
    try {
        response.data = JSON.parse(response.data);
        console.log(response.data.message);
    } catch (e) {
        console.error("JSON parsing error");
    }
}

