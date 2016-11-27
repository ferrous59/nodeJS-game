//define(['constants', 'game', 'entity'], function(c,g,e) {

define(['constants', 'renderer', 'map', 'sprite', 'entity', 'creature'], function() {
  /*automatic: var socket = io.connect('http://localhost:3000');*/
  "use strict";

  var c = require('constants');
  c.SETUP_CANVAS();

  var Renderer = require('renderer');
  var renderer = new Renderer();

  var SpriteMap = require('map');
  var map = new SpriteMap('map' );
  map.loadMap('tavern', renderer);

//<TMP>
  // var b = new Entity('druid');
  // b.setAnim("walk_E");
  var Creature = require('creature');
  var pro = new Creature('bard');

  renderer.camera = pro.position;
  window.addEventListener('keydown', function(e) {
    var dir = -1;

    switch(e.keyCode) {
      // N
      case 38: case 87: case 104: dir = 0; break;
      // E
      case 39: case 68: case 102: dir = 1; break;
      // S
      case 40: case 83: case 98:  dir = 2; break;
      // W
      case 37: case 65: case 100: dir = 3; break;
      default:console.log(e.keyCode);
    }
    pro.walk(dir);
  });
  window.addEventListener('keyup', function() {
    pro.idle();
  });

  renderer.addEntity(pro);
  pro.setPos(4*16,5*16);
  //
  // var b2 = new Entity('druid');
  // b.setPosition(22,20);
  //
  // b2.setAnim("walk_S");
  //
  // renderer.addStatic(b2);
//</TMP>

  socket.on('connect', function() {
    console.log('client connected');
  });

  socket.on('update', function(text) {
    console.log(text);
  });

  socket.on('message', function(message) {
    console.log(message);
  });
});
