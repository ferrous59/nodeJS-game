// entity.js
// entities must be able to move, respecting collision
// entities must be able to spawn/despawn
define(['sprite','sprites'], function (Sprite,sprites) {
  'use strict';

  var ID = 0;

  Entity.prototype = new Sprite('default');
  Entity.prototype.constructor = Entity;
  function Entity (name) {
    // inherit from sprite
    Sprite.apply(this, arguments);

    this.id = ID;
    ID++;
    // console.log(ID+":"+this.name);

    if(sprites.hasOwnProperty(name) && sprites[name].hasOwnProperty('collider')) {
      this.collider = sprites[name].collider;
    }
    else { this.collider = "none"; }
  };

  Entity.prototype.move = function(x, y) {
    // var tries = 0;
    // while(tries < 10)
    // {
    //   if( !this.collision(x,y) ) {
    //     this.position.x += x;
    //     this.position.y += y;
    //     return;
    //   }
    //   else {
    //     x -= (x-this.position.x)/tries;
    //     y -= (y-this.position.y)/tries;
    //     tries++;
    //   }
    // }
    this.position.x += x;
    this.position.y += y;
  }

  Entity.prototype.setPosition = function(x,y) {
    if(!this.collsion) {
      this.position.x = x;
      this.position.y = y;
    }
  }

  Entity.prototype.collision = function(x,y) {
    // search for nearby colliders
    return false;
  };

  Entity.prototype.emit = function() {
    var id = this.id,
        pos = this.position,
        anim = this.anim;

    return {
      'id':id,
      'pos':pos,
      'anim':anim
    }
  };

  Entity.prototype.on = function(data) {
    if(data != null) { console.log(this.id+": Entity recieved null data"); return; } // this should be impossible
    this.setAnim(data.anim);
    this.setPos(data.pos);
  };

  return Entity;
});
