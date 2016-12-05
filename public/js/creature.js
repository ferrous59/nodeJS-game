// creature.js
// a creature is an entity that can perform actions- such as moving or sneezing
define(['entity', 'sprites', 'constants'], function(Entity, sprites, c) {
  'use strict';

  Creature.prototype = new Entity('default');
  Creature.prototype.constructor = Creature;
  function Creature (name) {
    // inherit from entity
    Entity.apply(this, arguments);

    this.speed = 0;
    this.reflexes = 200;
    this.deltaTime = 1/c.PHYSICS;

    if(sprites.hasOwnProperty(name) ) {
      var s   = sprites[name],
          has = function(x) { return s.hasOwnProperty(x); };

      this.speed = has('speed') ? s.speed : 16;
      this.direction = has('direction') ? s.direction : 2;  // point S (outh) by default
      this.reflexes = has('reflexes') ? s.reflexes : 200;
    }
    else { this.actions = "none"; }
  }

  var direction = function (dir) {
    switch(dir) {
      case 0:
        return 'N';
      case 1:
        return 'E';
      case 2:
        return 'S';
      case 3:
        return 'W';
      default:
        return '0';
    }
  }

  Creature.prototype.walk = function (dir) {
    // dir can be in the form 0,1,2,3 or N,E,S,W
    var _dir = (typeof(dir) == 'number') ? direction(dir) : dir;
    this.setAnim('walk_' + _dir);
    this.direction = dir;
    var x = this.speed,
        y = this.speed;

    switch (dir) {
      case 0: case 'N': x = 0;  y = -y; break;
      case 1: case 'E': x = x;  y = 0;  break;
      case 2: case 'S': x = 0;  y = y;  break;
      case 3: case 'W': x = -x; y = 0;  break;
      default:
        x = y = 0;
    }

    this.move(x*this.deltaTime,y*this.deltaTime);
  }

  Creature.prototype.idle = function () {
    var dir = (typeof(this.direction) == 'number') ? direction(this.direction) : this.direction;
    console.log(typeof(this.direction)+":"+this.direction+":"+dir);
    this.setAnim('idle_' + dir);
  }

  return Creature;
});
