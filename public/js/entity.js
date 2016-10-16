// entity.js
define(['constants'], function (c) {
  "use strict";

  function Entity (aiu) {
    this.position = {
      x:0,
      y:0
    };
    this.size = {
      x:16,
      y:16
    };
    this.dimensions = {
      x:16,
      y:16
    }
    this._skin = new Image();
  };

  Entity.prototype = {
    skin: function (url) {
        //this._skin = new Image()
        this._skin.src = url;
    },
    draw: function() {
      // canvas is defined in client.js
      var _sX = this.size.x,
          _sY = this.size.y,
          _sW = this.dimensions.x,
          _sH = this.dimensions.y,
          _dX = _sX * c.SCALE,
          _dY = _sY * c.SCALE,
          _dW = this.position.x,
          _dH = this.position.y;

      c.CANVAS.drawImage(this._skin, _sX,_sY, _sW,_sH, _dX,_dY, _dW,_dH);
    },
    move: function(x,y) {
      x *= c.SCALE;
      y *= c.SCALE;
      this.position.x += x;
      this.position.y += y;
    },
    moveTo: function(x,y) {
      this.position = {x:0,y:0};
      this.move(x,y);
    }
  }

  Entity.load = function() {

  };

  return Entity;
});
