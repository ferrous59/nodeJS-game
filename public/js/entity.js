// entity.js
// entities must be able to move, respecting collision
// entities must be able to spawn/despawn
define(['sprite','sprites','collision'], function (Sprite, sprites, Collision) {
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

    if(has('collider')) {
      var Collision = require('collision'),
          collider = sprites[name].collider;

      if(typeof collider.length != 'undefined')
      {
        this.collider = null; // bit of a hack. nothing with more than one collider can be dynamic
        for(var i = 0; i < collider.length; i++)
        {
          this.collider = collider;
          if(collider[i].type == "disc") { Collision.add(Collision.discCollider(this, collider[i])); }
          else if(collider[i].type == 'box') { Collision.add(Collision.boxCollider(this, collider[i])); }
        }
      }
      else
      {
        this.collider = collider;
        if(collider.type == "disc") { this.collider = Collision.discCollider(this); }
        else if(collider.type == 'box') { this.collider = Collision.boxCollider(this); }
        Collision.add(this.collider);
      }
    }
    else { this.collider = null; }

    this.noclip = has('noclip') ? sprites[name].noclip : false;
  };

  Entity.prototype.safe = function(x,y) {
    if( !this.collision(x,y) ) {
      this.position.x += x;
      this.position.y += y;
      return true;
    }
    return false;
  }
  // just sends you backwards - useful for when x != 0 && y != 0
  Entity.prototype.basicMove = function(x,y) {
    var tries = 0,
        max = 10,
        _x = x,
        _y = y;
    while(tries < max) {
      if(this.safe(x,y)){ return; }
      else {
        _x = x/(max-tries);
        _y = y/(max-tries);
        tries++;
      }
    }
  }

  Entity.prototype.move = function(x, y) {
    // clumsy but simple - if entity is stuck in something, move freely
    if(this.collision(0, 0)) {
      this.position.x += x;
      this.position.y += y;
      console.log(this.name + ' was stuck in a collider');
      return;
    }
    if(this.safe(x,y)) { return; }

    if(x*y != 0) { basicMove(x,y); return; }

    var tries = 0,
        max = 10,
        _x = x,
        _y = y;

    while(tries < max) {
      if(this.safe(_x,_y)) { return; }
      else {
        var sign = (tries % 2 == 0) ? 1 : -1,
            angle = Math.PI*2/20*(tries+1)*sign;
        _x = x*Math.cos(angle) - y*Math.sin(angle);
        _y = x*Math.sin(angle) + y*Math.cos(angle);
        if(x == 0) { _y = y/(tries+1); }
        else       { _x = x/(tries+1); }
        // if(x == 0) { _x = y/(max-tries)*sign; _y = y/(tries+1); }
        // else       { _y = x/(max-tries)*sign; _x = x/(tries+1); }
        tries++;
      }
    }
  }

  Entity.prototype.setPosition = function(x,y) {
    if(!this.collsion) {
      this.position.x = x;
      this.position.y = y;
    }
  }

  Entity.prototype.collision = function(x,y) {
    if(this.noclip == true || this.collider == null) { return false; }

    // search for nearby colliders by asking collision.js to do it.
    var dest = this.collider,
        tmp = dest.position;
    dest.position = {x:tmp.x+x, y:tmp.y+y};

    var result = Collision.checkAll(dest);
    dest.position = tmp;
    return result;
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
