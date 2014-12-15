var React, SkitterBoxClone, SkitterBoxCloneFactory, SkitterTransitionGroupChild, TweenState, assign, cloneWithProps, effects, onlyChild;

React = require('react/addons');

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
