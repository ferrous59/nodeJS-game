//define(['constants', 'game', 'entity'], function(c,g,e) {
define(function(require) {
  /*automatic: var socket = io.connect('http://localhost:3000');*/
  "use strict";

  var c = require('constants');
  c.SETUP_CANVAS();

  var camera = {"position":{"x":0,"y":0}};

  var Renderer = require('renderer');
  var renderer = new Renderer(camera);

//<TMP>
  var Sprite = require('sprite');
  var Entity = require('entity');

  var a = new Sprite('floorboarads');
  a.setPos(32,0);
  renderer.addCeilingTile(a);

  for(var i = 0; i < 100; i++) {
    var x = i%10,
        y = (i-x)/10,
        _a = new Sprite('floorboards');

    _a.setPos(x*32,y*32);
    renderer.addFloorTile(_a);
  }

  var b = new Entity('druid');
  b.setAnim("walk_E");
  console.log(b.animation);

  var b2 = new Entity('druids');
  b.setPosition(22,20);

  b2.setPos(20,18);
  b2.setAnim("walk_S");

  renderer.addEntity(b);
  renderer.addStatic(b2);
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

  return 'aaa';
  return {
    Renderer : 'carl'
  };

/*
  //<TMP>
  var _stage = document.createElement('canvas');
  _stage.width = 50;
  _stage.height = 50;
  var _canvas = _stage.getContext('2d');
  _canvas.mozImageSmoothingEnabled = false;
  _canvas.webkitImageSmoothingEnabled = false; // may be depreciated (replaced by imageSmoothingEnabled?)
  _canvas.msImageSmoothingEnabled = false;
  _canvas.imageSmoothingEnabled = false;
  //_canvas.fillStyle = "#aaa";
  //_canvas.fillRect(0,0,50,50);
  var _img = new Image();
  _img.src = "/img/druid.png";
  _img.onload = function() {
    _canvas.drawImage(_img,0,0,16,16,0,0,50,50);

    c.CANVAS.drawImage(_stage,20,20);
    console.log("image loda");
  };

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

  //</TMP>*/
});
