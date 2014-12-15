React = require 'react/addons'
TweenState = require 'react-tween-state'
assign = require 'object-assign'
effects = require './effects'

onlyChild = React.Children.only
cloneWithProps = React.addons.cloneWithProps

SkitterBoxClone = React.createClass(
  displayName: 'SkitterBoxClone'
  
  mixins: [TweenState.Mixin]
  
  propTypes:
    outerStyle: React.PropTypes.object.isRequired
    innerStyle: React.PropTypes.object.isRequired
    tweenings: React.PropTypes.object
  
  getDefaultProps: ->
    tweenings: {}
  
  componentDidMount: ->
    for tweenKey, tweenConfig of @props.tweenings
      if typeof(tweenConfig.easing) == 'string'
        tweenConfig.easing = TweenState.easingTypes[tweenConfig.easing]
      @tweenState(tweenKey, tweenConfig)
      
  parseStyle: (style) ->
    # is it ok for performance?
    # it's possible to replace style props with styleGetters props
    # but the getBoxClone syntax will not be as nice and
    # it will require a (do (var1, var2) ->) to access loop variables
    result = {}
    for prop, value of style
      result[prop] = value
      if value? && value.tweeningValue?
        result[prop] = @getTweeningValue(value.tweeningValue)
    return result
    
  render: ->
    outerStyle = assign(
      position: 'absolute'
      overflow: 'hidden'
    , @parseStyle(@props.outerStyle))
    
    innerStyle = assign(
      position: 'absolute'
    , @parseStyle(@props.innerStyle))
    
    return (
      <div style={outerStyle}>
        <div style={position: 'relative'}>
          <div style={innerStyle}>
            {@props.children}
          </div>
        </div>
      </div>
    )
)

SkitterBoxCloneFactory = React.createFactory(SkitterBoxClone)

SkitterTransitionGroupChild = React.createClass(
  displayName: 'SkitterTransitionGroupChild'
  
  propTypes:
    getTransitionElements: React.PropTypes.func.isRequired
  
  getInitialState: ->
    isAnimating: false
    animElements: null

  transition: (animationType, finishCallback) ->
    # must be async to ensure @setState order
    # and let TweenState finish transitions
    handleAnimationEnd = =>
      setTimeout(=>
        @setState(isAnimating: false, animElements: null)
        finishCallback()
      , 0)
      
    animElements = @props.getTransitionElements(
      animationType,
      @getBoxClone,
      handleAnimationEnd)
      
    @setState(
      isAnimating: true
      animElements: animElements
    )

  componentWillMount: ->
    @_uniqueKey = 1

  componentWillUnmount: ->

  componentWillAppear: (done) ->
    @transition('appear', done)

  componentWillEnter: (done) ->
    @transition('enter', done)

  componentWillLeave: (done) ->
    @transition('leave', done)
      
  getBoxClone: (props) ->
    props = assign({}, props, {key: @_uniqueKey++})
    
    # should I use cloneWithProps?
    # React do not warn when not using it
    
    SkitterBoxCloneFactory(
      props,
      cloneWithProps(onlyChild(@props.children))
    )

  render: ->
    if @state.isAnimating && @state.animElements
      return (
        <div style={position: 'absolute'}>
          {@state.animElements}
        </div>
      )
    else
      return onlyChild(@props.children)
)

module.exports = SkitterTransitionGroupChild
