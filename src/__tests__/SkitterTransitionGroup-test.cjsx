React = null
SkitterTransitionGroup = null
mocks = null

# Most of the real functionality is covered in other unit tests, this just
# makes sure we're wired up correctly.
describe('SkitterTransitionGroup', ->
  container = null

  beforeEach(->
    # polyfill requestAnimationFrame for react-tween-state
    window.requestAnimationFrame = require('raf')
    React = require('react')
    SkitterTransitionGroup = require('../../lib/SkitterTransitionGroup.react')
    mocks = require('mocks')
    
    container = document.createElement('div')
  )

  it('should keep both sets of DOM nodes around', ->
    a = React.render(
      <SkitterTransitionGroup transitionName="cubeShow">
        <span key="one" id="one" />
      </SkitterTransitionGroup>,
      container
    )
    expect(a.getDOMNode().childNodes.length).toBe(1)
    React.render(
      <SkitterTransitionGroup transitionName="cubeShow">
        <span key="two" id="two" />
      </SkitterTransitionGroup>,
      container
    )
    expect(a.getDOMNode().childNodes.length).toBe(2)
    expect(a.getDOMNode().childNodes[1].id).toBe('one')
    # TODO: add cssClass on animated boxes container and test it
    # expect(a.getDOMNode().childNodes[0].id).toBe('two')
  )

  it('should work with no children', ->
    React.render(
      <SkitterTransitionGroup transitionName="cubeShow">
      </SkitterTransitionGroup>,
      container
    )
  )

  it('should work with a null child', ->
    React.render(
      <SkitterTransitionGroup transitionName="cubeShow">
        {[null]}
      </SkitterTransitionGroup>,
      container
    )
  )

  it('should transition from one to null', ->
    a = React.render(
      <SkitterTransitionGroup transitionName="cubeShow">
        <span key="one" id="one" />
      </SkitterTransitionGroup>,
      container
    )
    expect(a.getDOMNode().childNodes.length).toBe(1)
    React.render(
      <SkitterTransitionGroup transitionName="cubeShow">
        {null}
      </SkitterTransitionGroup>,
      container
    )
    # (Here, we expect the original child to stick around but test that no
    # exception is thrown)
    expect(a.getDOMNode().childNodes.length).toBe(1)
    expect(a.getDOMNode().childNodes[0].id).toBe('one')
  )

  it('should transition from false to one', ->
    a = React.render(
      <SkitterTransitionGroup transitionName="cubeShow">
        {false}
      </SkitterTransitionGroup>,
      container
    )
    expect(a.getDOMNode().childNodes.length).toBe(0)
    React.render(
      <SkitterTransitionGroup transitionName="cubeShow">
        <span key="one" id="one" />
      </SkitterTransitionGroup>,
      container
    )
    expect(a.getDOMNode().childNodes.length).toBe(1)
    # expect(a.getDOMNode().childNodes[0].id).toBe('one')
  )

)
