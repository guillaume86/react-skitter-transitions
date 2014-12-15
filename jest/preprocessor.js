var coffee = require('coffee-script');
var cjsx = require('coffee-react');

module.exports = {
  process: function(src, path) {
    if (path.match(/\.coffee$/)) {
      return coffee.compile(src, {'bare': true});
    }
    if (path.match(/\.cjsx$/)) {
      return cjsx.compile(src, {'bare': true});
    }
    return src;
  }
};
