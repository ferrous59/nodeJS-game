// entity.js
// entities must be able to move, respecting collision
// entities must be able to despawn
define(['sprite','sprites'], function (Sprite,sprites) {

  Entity.prototype = new Sprite('default');
  Entity.prototype.constructor = Entity;
  function Entity (name) {
    // inherit from sprite
    Sprite.apply(this, arguments);

    if(sprites.hasOwnProperty(name) && sprites[name].hasOwnProperty('collider')) {
      this.collider = sprites[name].collider;
    }
    else { this.collider = "none"; }
  };

  Entity.prototype.move = function(x, y) {
    var tries = 0;
    while(tries < 10)
    {
      if( !collision(x,y) ) {
        this.position.x = x;
        this.position.y = y;
      }
      else {

      }
    }
  }

  Entity.prototype.setPosition = function(x,y) {
    this.position.x = x;
    this.position.y = y;
  }

  Entity.prototype.collision = function() {
    // search for nearby colliders
    return false;
  };

  return Entity;
});
//   "use strict";
//
//   var Entity = {
//         x:0,
//         y:0
//       };
//       this.dimensions = {
//         x:16,
//         y:16
//       }
//     };
//
//     Entity.prototype = {
//       skin: function (url) {
//           this._skin = new Image()
//           this._skin.src = url;
//       },
//       loadJSON: function(data) {
//           this.name = data.name,
//           this.position = data.position, // position = {x:0,y:0}
//           this.spritePos = {
//       },
//       draw: function() {
//         // canvas is defined in client.js
//         var _sX = this.spritePos.x,
//             _sY = this.spritePos.y,
//             _sW = this.dimensions.x,
//             _sH = this.dimensions.y,
//
//             _dX = this.position.x * c.SCALE,
//             _dY = this.position.y * c.SCALE,
//             _dW = _sW * c.SCALE,
//             _dH = _sH * c.SCALE,
//
//         c.CANVAS.drawImage(this._skin, _sX,_sY, _sW,_sH, _dX,_dY, _dW,_dH);
//       },
//       move: function(x,y) {
//         this.position.x += x;
//         this.position.y += y;
//       },
//       moveTo: function(x,y) {
//         this.position = {x:0,y:0};
//         this.move(x,y);
//       }
//     }
//   };
//
//   return Entity;
// });
