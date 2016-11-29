//define(['constants', 'game', 'entity'], function(c,g,e) {

define(['constants', 'renderer', 'map', 'sprite', 'entity', 'creature'], function() {
  /*automatic: var socket = io.connect('http://localhost:3000');*/
  "use strict";

  // SETUP
  var c = require('constants');
  c.SETUP_CANVAS();

  var Renderer = require('renderer');
  var renderer = new Renderer();

  var SpriteMap = require('map');
  var map = new SpriteMap('map' );
  map.loadMap('tavern', renderer);

//<TMP>
  var Creature = require('creature');
  var player = new Creature('bard');

  renderer.camera = player.position;

  var fps = 60,
      spf = 1000 / fps;


  function gameLoop (time) {
    // continue the loop
    window.requestAnimationFrame(gameLoop);

    if(keys.idle())         { player.idle(); }
    else if(keys.down('walk_N')) { player.walk('N'); }
    else if(keys.down('walk_E')) { player.walk('E'); }
    else if(keys.down('walk_S')) { player.walk('S'); }
    else if(keys.down('walk_W')) { player.walk('W'); }


  }

  var keys = {
    _idle: 0,
    _down: {},

    idle: function () {
      return (this._idle > 0) ? false : true;
    },
    down: function (name) {
      return this._down[name];
    },
    press: function (code) {
      if (inuputHandler(code, this._down, true)) { this._idle++; }
    },
    release: function (code) {
      if (inuputHandler(code, this._down, false)) { this._idle--; }
    }
  };

  window.addEventListener('keydown', function(e) {
    keys.press(e.keyCode);
  });

  window.addEventListener('keyup', function(e) {
    keys.release(e.keyCode);
  });

  renderer.addEntity(player);
  player.setPos(6*16,18*16);

//</TMP>

  function inuputHandler(key, out, set) {

    function change (name) {
      if(out[name] != set) { out[name] = set; return true; }
      return false;
    }

    switch(key) {
      case 38: case 87: case 104: return change('walk_N'); break;
      case 39: case 68: case 102: return change('walk_E'); break;
      case 40: case 83: case 98:  return change('walk_S'); break;
      case 37: case 65: case 100: return change('walk_W'); break;

      default: return false;
    }
  }

  // NETWORK
  socket.on('connect', function() {
    console.log('client connected');
  });

  socket.on('update', function(text) {
    console.log(text);
  });

  socket.on('message', function(message) {
    console.log(message);
  });

  gameLoop(0);
});
