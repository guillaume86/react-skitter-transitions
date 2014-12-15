var React, ReactTransitionGroup, SkitterTransitionGroup, SkitterTransitionGroupChild, assign, effects;

React = require('react/addons');

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
