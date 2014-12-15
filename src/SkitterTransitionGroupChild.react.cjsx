React = require 'react/addons'
assign = require 'object-assign'

onlyChild = React.Children.only
cloneWithProps = React.addons.cloneWithProps

SkitterBoxClone = React.createFactory(
  require('./SkitterBoxClone.react')
)

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
    SkitterBoxClone(
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
