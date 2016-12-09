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

    function has( property ) {
      return (sprites.hasOwnProperty(name)) ? sprites[name].hasOwnProperty(property) : false;
    }
    this.collider = has('collider') ? sprites[name].collider : "none";
    this.noclip = has('noclip') ? sprites[name].noclip : false;

  };

  Entity.prototype.move = function(x, y) {
    var tries = 0,
        dirX = x-this.position.x,
        dirY = y-this.position.y;
    while(tries < 10)
    {
      if( !this.collision(x,y) ) {
        this.position.x += x;
        this.position.y += y;
        return;
      }
      else {
        x -= dirX/10;
        y -= dirY/10;
        tries++;
      }
    }
    // BASIC
    // this.position.x += x;
    // this.position.y += y;
  }

  Entity.prototype.setPosition = function(x,y) {
    if(!this.collsion) {
      this.position.x = x;
      this.position.y = y;
    }
  }

  Entity.prototype.collision = function(x,y) {
    if(this.noclip != true) { return false; }

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
