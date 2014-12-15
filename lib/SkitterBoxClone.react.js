var React, SkitterBoxClone, TweenState, assign;

React = require('react');

TweenState = require('react-tween-state');

assign = require('object-assign');

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

module.exports = SkitterBoxClone;
