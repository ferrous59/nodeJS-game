// canvas.js
// defines a canvas that remains pixel perfect.

define(function () {
    var Canvas = function(stage) {
      var _canvas = stage.getContext('2d');

      // enable jazzy pixel art stylings
      _canvas.mozImageSmoothingEnabled = false;
      //_canvas.webkitImageSmoothingEnabled = false; // may be depreciated (replaced by imageSmoothingEnabled?)
      _canvas.msImageSmoothingEnabled = false;
      _canvas.imageSmoothingEnabled = false;

      return _canvas;
    }
    return Canvas;
});
