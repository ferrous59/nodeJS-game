//define(['constants', 'game', 'entity'], function(c,g,e) {
define(['constants', 'renderer', 'map', 'sprite', 'entity'], function() {
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
  // var Sprite = require('sprite');
  // var Entity = require('entity');
  //
  // var b = new Entity('druid');
  // b.setAnim("walk_E");
  //
  // var b2 = new Entity('druid');
  // b.setPosition(22,20);
  //
  // b2.setPos(20,18);
  // b2.setAnim("walk_S");
  //
  // renderer.addEntity(b);
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
