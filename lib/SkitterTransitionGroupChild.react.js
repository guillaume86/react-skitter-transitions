var React, SkitterBoxClone, SkitterTransitionGroupChild, assign, cloneWithProps, onlyChild;

React = require('react/addons');

assign = require('object-assign');

onlyChild = React.Children.only;

cloneWithProps = React.addons.cloneWithProps;

SkitterBoxClone = React.createFactory(require('./SkitterBoxClone.react'));

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
    return SkitterBoxClone(props, cloneWithProps(onlyChild(this.props.children)));
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
