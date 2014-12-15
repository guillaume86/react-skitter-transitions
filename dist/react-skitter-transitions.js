!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.ReactSkitterTransitions=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React, ReactTransitionGroup, SkitterTransitionGroup, SkitterTransitionGroupChild, assign, effects;

React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

assign = require('object-assign');

effects = require('./effects');

ReactTransitionGroup = React.createFactory(React.addons.TransitionGroup);

SkitterTransitionGroupChild = React.createFactory(require('./SkitterTransitionGroupChild.react'));

SkitterTransitionGroup = React.createClass({
  displayName: 'SkitterTransitionGroup',
  propTypes: {
    transitionName: React.PropTypes.string.isRequired,
    transitionDuration: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  },
  getDefaultProps: function() {
    return {
      transitionDuration: 1000,
      width: 300,
      height: 300
    };
  },
  componentDidMount: function() {
    return this._pendingLeaveCallback = null;
  },
  _getTransitionElements: function(animationType, getBoxClone, finishCallback) {
    var onFinishEntering;
    if (animationType === 'enter' || animationType === 'appear') {
      onFinishEntering = (function(_this) {
        return function() {
          if (_this._pendingLeaveCallback) {
            _this._pendingLeaveCallback();
            _this._pendingLeaveCallback = null;
          }
          return finishCallback();
        };
      })(this);
      return effects[this.props.transitionName](this.props.width, this.props.height, getBoxClone, this.props.transitionDuration, onFinishEntering);
    }
    if (animationType === 'leave') {
      if (this._pendingLeaveCallback) {
        this._pendingLeaveCallback();
      }
      this._pendingLeaveCallback = finishCallback;
      return null;
    }
  },
  _wrapChild: function(child) {
    return SkitterTransitionGroupChild({
      getTransitionElements: this._getTransitionElements
    }, child);
  },
  render: function() {
    var props, style;
    style = assign({}, this.props.style, {
      position: 'relative',
      overflow: 'hidden',
      width: this.props.width,
      height: this.props.height
    });
    props = assign({}, this.props, {
      style: style
    });
    return ReactTransitionGroup(assign({
      component: 'div'
    }, props, {
      childFactory: this._wrapChild
    }));
  }
});

module.exports = SkitterTransitionGroup;

},{"./SkitterTransitionGroupChild.react":2,"./effects":3,"object-assign":5}],2:[function(require,module,exports){
var React, SkitterBoxClone, SkitterBoxCloneFactory, SkitterTransitionGroupChild, TweenState, assign, cloneWithProps, effects, onlyChild;

React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);

TweenState = require('react-tween-state');

assign = require('object-assign');

effects = require('./effects');

onlyChild = React.Children.only;

cloneWithProps = React.addons.cloneWithProps;

SkitterBoxClone = React.createClass({
  displayName: 'SkitterBoxClone',
  mixins: [TweenState.Mixin],
  propTypes: {
    outerStyle: React.PropTypes.object.isRequired,
    innerStyle: React.PropTypes.object.isRequired,
    tweenings: React.PropTypes.object
  },
  getDefaultProps: function() {
    return {
      tweenings: {}
    };
  },
  componentDidMount: function() {
    var tweenConfig, tweenKey, _ref, _results;
    _ref = this.props.tweenings;
    _results = [];
    for (tweenKey in _ref) {
      tweenConfig = _ref[tweenKey];
      if (typeof tweenConfig.easing === 'string') {
        tweenConfig.easing = TweenState.easingTypes[tweenConfig.easing];
      }
      _results.push(this.tweenState(tweenKey, tweenConfig));
    }
    return _results;
  },
  parseStyle: function(style) {
    var prop, result, value;
    result = {};
    for (prop in style) {
      value = style[prop];
      result[prop] = value;
      if ((value != null) && (value.tweeningValue != null)) {
        result[prop] = this.getTweeningValue(value.tweeningValue);
      }
    }
    return result;
  },
  render: function() {
    var innerStyle, outerStyle;
    outerStyle = assign({
      position: 'absolute',
      overflow: 'hidden'
    }, this.parseStyle(this.props.outerStyle));
    innerStyle = assign({
      position: 'absolute'
    }, this.parseStyle(this.props.innerStyle));
    return React.createElement("div", {
      "style": outerStyle
    }, React.createElement("div", {
      "style": {
        position: 'relative'
      }
    }, React.createElement("div", {
      "style": innerStyle
    }, this.props.children)));
  }
});

SkitterBoxCloneFactory = React.createFactory(SkitterBoxClone);

SkitterTransitionGroupChild = React.createClass({
  displayName: 'SkitterTransitionGroupChild',
  propTypes: {
    getTransitionElements: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {
      isAnimating: false,
      animElements: null
    };
  },
  transition: function(animationType, finishCallback) {
    var animElements, handleAnimationEnd;
    handleAnimationEnd = (function(_this) {
      return function() {
        return setTimeout(function() {
          _this.setState({
            isAnimating: false,
            animElements: null
          });
          return finishCallback();
        }, 0);
      };
    })(this);
    animElements = this.props.getTransitionElements(animationType, this.getBoxClone, handleAnimationEnd);
    return this.setState({
      isAnimating: true,
      animElements: animElements
    });
  },
  componentWillMount: function() {
    return this._uniqueKey = 1;
  },
  componentWillUnmount: function() {},
  componentWillAppear: function(done) {
    return this.transition('appear', done);
  },
  componentWillEnter: function(done) {
    return this.transition('enter', done);
  },
  componentWillLeave: function(done) {
    return this.transition('leave', done);
  },
  getBoxClone: function(props) {
    props = assign({}, props, {
      key: this._uniqueKey++
    });
    return SkitterBoxCloneFactory(props, cloneWithProps(onlyChild(this.props.children)));
  },
  render: function() {
    if (this.state.isAnimating && this.state.animElements) {
      return React.createElement("div", {
        "style": {
          position: 'absolute'
        }
      }, this.state.animElements);
    } else {
      return onlyChild(this.props.children);
    }
  }
});

module.exports = SkitterTransitionGroupChild;

},{"./effects":3,"object-assign":5,"react-tween-state":7}],3:[function(require,module,exports){
module.exports = {
  cube: function(width, height, getBoxClone, duration, callback) {
    var box_clone, box_clones, col, col_t, delay_time, division_h, division_w, easing, height_box, i, init_left, init_top, onEnd, time_animate, total, width_box, _bleft, _btop, _i, _ref, _ref1, _vleft, _vleft_image, _vtop, _vtop_image;
    easing = 'easeOutQuad';
    time_animate = 700;
    division_w = Math.ceil(width / (width / 4));
    division_h = Math.ceil(height / (height / 4));
    total = division_w * division_h;
    width_box = Math.ceil(width / division_w);
    height_box = Math.ceil(height / division_h);
    init_top = height + 200;
    init_left = height + 200;
    col_t = 0;
    col = 0;
    box_clones = [];
    for (i = _i = 0; 0 <= total ? _i < total : _i > total; i = 0 <= total ? ++_i : --_i) {
      init_top = (_ref = i % 2 === 0) != null ? _ref : {
        init_top: -init_top
      };
      init_left = (_ref1 = i % 2 === 0) != null ? _ref1 : {
        init_left: -init_left
      };
      _vtop = init_top + (height_box * col_t) + (col_t * 150);
      _vleft = -width;
      _vtop_image = -(height_box * col_t);
      _vleft_image = -(width_box * col);
      _btop = height_box * col_t;
      _bleft = width_box * col;
      delay_time = 50 * i;
      time_animate = 500;
      onEnd = i === (total - 1) ? callback : null;
      box_clone = getBoxClone({
        outerStyle: {
          width: width_box,
          height: height_box,
          top: {
            tweeningValue: 'top'
          },
          left: {
            tweeningValue: 'left'
          },
          opacity: {
            tweeningValue: 'opacity'
          }
        },
        innerStyle: {
          top: _vtop_image,
          left: _vleft_image
        },
        tweenings: {
          top: {
            delay: delay_time,
            easing: easing,
            duration: time_animate,
            beginValue: height + (height_box * i),
            endValue: _btop
          },
          left: {
            delay: delay_time,
            easing: easing,
            duration: time_animate,
            beginValue: width + (width_box * i),
            endValue: _bleft
          },
          opacity: {
            delay: delay_time + (time_animate / 2),
            duration: 400,
            beginValue: 0,
            endValue: 1,
            onEnd: onEnd
          }
        }
      });
      box_clones.push(box_clone);
      col_t++;
      if (col_t === division_h) {
        col_t = 0;
        col++;
      }
    }
    return box_clones;
  },
  cubeShow: function(width, height, getBoxClone, duration, callback) {
    var box_clone, box_clones, col, delay_time, division_h, division_w, easing, height_box, i, line, onEnd, step_delay, time_animate, total, total_delay, width_box, _bleft, _btop, _i;
    easing = 'easeOutQuad';
    division_w = Math.ceil(width / (width / 4));
    division_h = Math.ceil(height / (height / 4));
    total = division_w * division_h;
    step_delay = 30;
    total_delay = (total - 1) * step_delay;
    time_animate = duration - total_delay;
    width_box = Math.ceil(width / division_w);
    height_box = Math.ceil(height / division_h);
    _btop = 0;
    _bleft = 0;
    line = 0;
    col = 0;
    box_clones = [];
    for (i = _i = 0; 0 <= total ? _i < total : _i > total; i = 0 <= total ? ++_i : --_i) {
      _btop = height_box * line;
      _bleft = width_box * col;
      delay_time = step_delay * i;
      onEnd = i === (total - 1) ? callback : null;
      box_clone = getBoxClone({
        outerStyle: {
          left: _bleft,
          top: _btop,
          width: {
            tweeningValue: 'width'
          },
          height: {
            tweeningValue: 'height'
          }
        },
        innerStyle: {
          left: -_bleft,
          top: -_btop
        },
        tweenings: {
          width: {
            delay: delay_time,
            easing: easing,
            duration: time_animate,
            beginValue: 0,
            endValue: width_box
          },
          height: {
            delay: delay_time,
            easing: easing,
            duration: time_animate,
            beginValue: 0,
            endValue: height_box,
            onEnd: onEnd
          }
        }
      });
      box_clones.push(box_clone);
      line++;
      if (line === division_h) {
        line = 0;
        col++;
      }
    }
    return box_clones;
  }
};

},{}],4:[function(require,module,exports){
module.exports = {
  effects: require('./effects'),
  SkitterTransitionGroup: require('./SkitterTransitionGroup.react')
};

},{"./SkitterTransitionGroup.react":1,"./effects":3}],5:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],6:[function(require,module,exports){
'use strict';

var easingTypes = {
  // t: current time, b: beginning value, c: change in value, d: duration

  // new note: I much prefer specifying the final value rather than the change
  // in value this is what the repo's interpolation plugin api will use. Here,
  // c will stand for final value

  linear: function(t, b, _c, d) {
    var c = _c - b;
    return t*c/d + b;
  },
  easeInQuad: function (t, b, _c, d) {
    var c = _c - b;
    return c*(t/=d)*t + b;
  },
  easeOutQuad: function (t, b, _c, d) {
    var c = _c - b;
    return -c *(t/=d)*(t-2) + b;
  },
  easeInOutQuad: function (t, b, _c, d) {
    var c = _c - b;
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  easeInElastic: function (t, b, _c, d) {
    var c = _c - b;
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
  },
  easeOutElastic: function (t, b, _c, d) {
    var c = _c - b;
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
  },
  easeInOutElastic: function (t, b, _c, d) {
    var c = _c - b;
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
  },
  easeInBack: function (t, b, _c, d, s) {
    var c = _c - b;
    if (s == undefined) s = 1.70158;
    return c*(t/=d)*t*((s+1)*t - s) + b;
  },
  easeOutBack: function (t, b, _c, d, s) {
    var c = _c - b;
    if (s == undefined) s = 1.70158;
    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
  },
  easeInOutBack: function (t, b, _c, d, s) {
    var c = _c - b;
    if (s == undefined) s = 1.70158;
    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
  },
  easeInBounce: function (t, b, _c, d) {
    var c = _c - b;
    return c - easingTypes.easeOutBounce (d-t, 0, c, d) + b;
  },
  easeOutBounce: function (t, b, _c, d) {
    var c = _c - b;
    if ((t/=d) < (1/2.75)) {
      return c*(7.5625*t*t) + b;
    } else if (t < (2/2.75)) {
      return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    } else if (t < (2.5/2.75)) {
      return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    } else {
      return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    }
  },
  easeInOutBounce: function (t, b, _c, d) {
    var c = _c - b;
    if (t < d/2) return easingTypes.easeInBounce (t*2, 0, c, d) * .5 + b;
    return easingTypes.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
  }
};

module.exports = easingTypes;

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

},{}],7:[function(require,module,exports){
'use strict';

var easingTypes = require('./easingTypes');

// additive is the new iOS 8 default. In most cases it simulates a physics-
// looking overshoot behavior (especially with easeInOut. You can test that in
// the example
var DEFAULT_STACK_BEHAVIOR = 'ADDITIVE';
var DEFAULT_EASING = easingTypes.easeInOutQuad;
var DEFAULT_DURATION = 300;
var DEFAULT_DELAY = 0;

function shallowClone(obj) {
  var ret = {};
  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = obj[key];
  }
  return ret;
}

// see usage below
function returnState(state) {
  return state;
}

var tweenState = {
  easingTypes: easingTypes,
  stackBehavior: {
    ADDITIVE: 'ADDITIVE',
    DESTRUCTIVE: 'DESTRUCTIVE',
  }
};

tweenState.Mixin = {
  getInitialState: function() {
    return {
      tweenQueue: [],
    };
  },

  tweenState: function(a, b, c) {
    // tweenState(stateNameString, config)
    // tweenState(stateRefFunc, stateNameString, config)

    // passing a state name string and retrieving it later from this.state
    // doesn't work for values in deeply nested collections (unless you design
    // the API to be able to parse 'this.state.my.nested[1]', meh). Passing a
    // direct, resolved reference wouldn't work either, since that reference
    // points to the old state rather than the subsequent new ones.
    if (typeof a === 'string') {
      c = b;
      b = a;
      a = returnState;
    }
    this._tweenState(a, b, c);
  },

  _tweenState: function(stateRefFunc, stateName, config) {
    config = shallowClone(config);

    var state = this._pendingState || this.state;
    var stateRef = stateRefFunc(state);

    // see the reasoning for these defaults at the top
    config.stackBehavior = config.stackBehavior || DEFAULT_STACK_BEHAVIOR;
    config.easing = config.easing || DEFAULT_EASING;
    config.duration = config.duration == null ? DEFAULT_DURATION : config.duration;
    config.beginValue = config.beginValue == null ? stateRef[stateName] : config.beginValue;
    config.delay = config.delay == null ? DEFAULT_DELAY : config.delay;

    var newTweenQueue = state.tweenQueue;
    if (config.stackBehavior === tweenState.stackBehavior.DESTRUCTIVE) {
      newTweenQueue = state.tweenQueue.filter(function(item) {
        return item.stateName !== stateName || item.stateRefFunc(state) !== stateRef;
      });
    }

    newTweenQueue.push({
      stateRefFunc: stateRefFunc,
      stateName: stateName,
      config: config,
      initTime: Date.now() + config.delay,
    });

    // tweenState calls setState
    // sorry for mutating. No idea where in the state the value is
    stateRef[stateName] = config.endValue;
    // this will also include the above update
    this.setState({tweenQueue: newTweenQueue});

    if (newTweenQueue.length === 1) {
      this.startRaf();
    }
  },

  getTweeningValue: function(a, b) {
    // see tweenState API
    if (typeof a === 'string') {
      b = a;
      a = returnState;
    }
    return this._getTweeningValue(a, b);
  },

  _getTweeningValue: function(stateRefFunc, stateName) {
    var state = this.state;
    var stateRef = stateRefFunc(state);
    var tweeningValue = stateRef[stateName];
    var now = Date.now();

    for (var i = 0; i < state.tweenQueue.length; i++) {
      var item = state.tweenQueue[i];
      var itemStateRef = item.stateRefFunc(state);
      if (item.stateName !== stateName || itemStateRef !== stateRef) {
        continue;
      }

      var progressTime = now - item.initTime > item.config.duration ?
        item.config.duration :
        Math.max(0, now - item.initTime);
      // `now - item.initTime` can be negative if initTime is scheduled in the
      // future by a delay. In this case we take 0

      var contrib = -item.config.endValue + item.config.easing(
        progressTime,
        item.config.beginValue,
        item.config.endValue,
        item.config.duration
        // TODO: some funcs accept a 5th param
      );
      tweeningValue += contrib;
    }

    return tweeningValue;
  },

  _rafCb: function() {
    if (!this.isMounted()) {
      return;
    }

    var state = this.state;
    if (state.tweenQueue.length === 0) {
      return;
    }

    var now = Date.now();
    state.tweenQueue.forEach(function(item) {
      if (now - item.initTime >= item.config.duration) {
        item.config.onEnd && item.config.onEnd();
      }
    });

    var newTweenQueue = state.tweenQueue.filter(function(item) {
      return now - item.initTime < item.config.duration;
    });

    this.setState({
      tweenQueue: newTweenQueue,
    });

    requestAnimationFrame(this._rafCb);
  },

  startRaf: function() {
    requestAnimationFrame(this._rafCb);
  },

};

module.exports = tweenState;

},{"./easingTypes":6}]},{},[4])(4)
});