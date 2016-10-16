// entity.js
define({
    position:{
      x:0,
      y:0
    },
    size:{
      x:0,
      y:0,
    },
    dimensions:{
      x:16,
      y:16,
    },
    skin: new Image(),

    draw: function() {
      // canvas is defined in client.js
      var _sX = this.size.x,
          _sY = this.size.y,
          _sW = this.dimensions.x,
          _sH = this.dimensions.y,
          _dX = _sX * SCALE,
          _dY = _sY * SCALE,
          _dW = position.x,
          _dH = position.y;

      CANVAS.drawImage(this.skin, _sX,_sY, _sW,_sH, _dX,_dY, _dW,_dH);
    }
});
