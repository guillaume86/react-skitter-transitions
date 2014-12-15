React = require 'react'
TweenState = require 'react-tween-state'
assign = require 'object-assign'

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

module.exports = SkitterBoxClone
