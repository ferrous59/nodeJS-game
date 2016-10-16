//define(['constants', 'game', 'entity'], function(c,g,e) {
define(function(require) {
  /*automatic: var socket = io.connect('http://localhost:3000');*/
  "use strict";

  var c = require('constants');
  c.SETUP_CANVAS();

  socket.on('connect', function() {
    console.log('client connected');
  });

  socket.on('update', function(text) {
    console.log(text);
  });

  socket.on('message', function(message) {
    console.log(message);
  });

  //TMP
  var Sprite = new require('entity');
  var entity = new Sprite("img/favicon.ico");
  console.log(entity);
  entity.skin("img/favicon.ico");
  entity.moveTo(5,5);

  window.addEventListener('keydown', function(event) {
    console.log(entity.position.x + ":" + entity.position.y);
    socket.emit('moveChar', -10);
  }, false);

  socket.on('moveChar', function(x) {
    //console.log('move');
    //c.CANVAS.clearRect(0,0, c.STAGE_W, c.STAGE_H);
    //c.CANVAS.width = c.CANVAS.width;

    entity.move(x,0);
    entity.draw();
  });
  socket.on('moveCharTo', function(x){
    entity.moveTo(x,5);
    c.CANVAS.fillStyle = "#ffffff";
    c.CANVAS.fillRect(0,0, c.STAGE_W, c.STAGE_H);
    entity.draw();
  });
});
