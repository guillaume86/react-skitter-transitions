React = require 'react/addons'
assign = require 'object-assign'
effects = require './effects'

ReactTransitionGroup = React.createFactory(
  React.addons.TransitionGroup
)
SkitterTransitionGroupChild = React.createFactory(
  require('./SkitterTransitionGroupChild.react')
)

SkitterTransitionGroup = React.createClass(
  displayName: 'SkitterTransitionGroup'

  propTypes:
    transitionName: React.PropTypes.string.isRequired
    transitionDuration: React.PropTypes.number
    width: React.PropTypes.number
    height: React.PropTypes.number
    
  getDefaultProps: ->
    transitionDuration: 1000
    width: 300
    height: 300

  componentDidMount: ->
    @_pendingLeaveCallback = null
    
  _getTransitionElements: (animationType, getBoxClone, finishCallback) ->
    if animationType in ['enter', 'appear']
      onFinishEntering = =>
        if @_pendingLeaveCallback
          @_pendingLeaveCallback()
          @_pendingLeaveCallback = null
        finishCallback()
        
      return effects[@props.transitionName](
        @props.width,
        @props.height,
        getBoxClone,
        @props.transitionDuration,
        onFinishEntering)
        
    if animationType == 'leave'
      if @_pendingLeaveCallback
        @_pendingLeaveCallback()
      @_pendingLeaveCallback = finishCallback
      return null
    
  _wrapChild: (child) ->
    SkitterTransitionGroupChild(
      getTransitionElements: @_getTransitionElements
    ,
      child
    )

  render: ->
    style = assign({}, @props.style,
      position: 'relative'
      overflow: 'hidden'
      width: @props.width
      height: @props.height
    )
    props = assign({}, @props, {style})
    
    return (
      ReactTransitionGroup(
        assign({component: 'div'}, props, {childFactory: @_wrapChild})
      )
    )
)

module.exports = SkitterTransitionGroup
