// creature.js
// a creature is an entity that can perform actions- such as moving or sneezing
define(['entity', 'sprites'], function(Entity, sprites) {
  'use strict';

  Creature.prototype = new Entity;
  Creature.prototype.constructor = Creature;
  function Creature (name) {
    // inherit from entity
    Entity.apply(this, arguments);

    this.speed = 0;
    this.speed = 2;
    this.reflexes = 200;

    if(sprites.hasOwnProperty(name) ) {
      var s   = sprites[name],
          has = function(x) { return s.hasOwnProperty(x); };

      this.speed = has('speed') ? s.speed : 4;
      this.direction = has('speed') ? s.speed : 2;  // point S by default
      this.reflexes = has('reflexes') ? s.reflexes : 2;
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

  Creature.prototype.walk = function (dir, time = 0) {

    this.direction = dir;

    var x = this.speed,
        y = this.speed;

    switch (dir) {
      case 0: x = 0;  y = -y; break;
      case 1: x = x;  y = 0;  break;
      case 2: x = 0;  y = y;  break;
      case 3: x = -x; y = 0;  break;
      default:
        x = y = 0;
    }

    if( Math.abs(Date.now() - this.lastTick) > this.reflexes*0) { this.move(x,y); }
    else {console.log(this.lastTick);}
    this.setAnim('walk_' + direction(dir));

  }

  Creature.prototype.idle = function () {
    this.setAnim('idle_' + direction(this.direction));
  }

  return Creature;
});
