// creature.js
define('creature',['entity', 'constants'], function(entity, c) {
  sprite:entity,
  health:100,
  armour:100,
  move: function (x, y) {
    sprite.position.x += x * c.SCALE;
    sprite.position.y += y * c.SCALE;
  }
});
