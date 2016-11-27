// entity.js
// entities must be able to move, respecting collision
// entities must be able to spawn/despawn
define(['sprite','sprites'], function (Sprite,sprites) {
  'use strict';

  Entity.prototype = new Sprite;
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
      if( !this.collision(x,y) ) {
        this.position.x += x;
        this.position.y += y;
        return;
      }
      else {
        x -= (x-this.position.x)/tries;
        y -= (y-this.position.y)/tries;
        tries++;
      }
    }
  }

  Entity.prototype.setPosition = function(x,y) {
    this.position.x = x;
    this.position.y = y;
  }

  Entity.prototype.collision = function(x,y) {
    // search for nearby colliders
    return false;
  };

  return Entity;
});
