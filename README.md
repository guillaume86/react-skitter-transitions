# React Skitter Transitions

React component port of [skitter slideshow transitions](https://github.com/thiagosf/SkitterSlideshow)

# Installation

    npm install react-skitter-transitions
    
or import `dist/react-skitter-transitions.js` in a script tag.

# Import

    // note: browser bundle exports to ReactSkitterTransitions on the window
    ReactSkitterTransitions = require('react-skitter-transitions');
    SkitterTransitionGroup = ReactSkitterTransitions.SkitterTransitionGroup;

# Usage

Check out [examples/index.html](http://rawgit.com/guillaume86/react-skitter-transitions/master/examples/index.html) for a simple usage example.

# Effects

Only 'cube' and 'cubeShow' animations are implemented at the moment.
Translation from the Skitter code is straightforward, pull requests are welcome.

# Dev

    npm run build
    npm run watch
