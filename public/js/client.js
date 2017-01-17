//define(['constants', 'game', 'entity'], function(c,g,e) {

define(['constants', 'collision', 'renderer', 'map', 'sprite', 'sprites', 'entity', 'creature'], function() {
  /*automatic: var socket = io.connect('http://localhost:3000');*/
  "use strict";

  // SETUP
  var c = require('constants');
  c.SETUP_CANVAS();
  socket.emit('requestID');
  socket.emit('forceUpdate');

  var Collision = require('collision');

  var Renderer = require('renderer');
  var renderer = new Renderer();
  var entities = renderer.entities;

  var SpriteMap = require('map');
  var map = new SpriteMap('map' );
  map.loadMap('tavern', renderer);

//<TMP>
  var Creature = require('creature');
  var player = -1;  // mererly an index of the player
  var player_name = 'unknown';

  // BUG: changing entity increases your speed somehow. It is weird.
  function setEntity (id, name) {
    var pos = (entities[id] != null) ? entities[id].position : {'x':0, 'y':0};

    // cleanup
    renderer.nullEntity(id);

    // create a player
    entities[id] = new Creature(name);

    var entity = entities[id];
    entity.position.x = pos.x;
    entity.position.y = pos.y;

    if(id == player) { renderer.camera = entities[id].position }
  }

  var fps = 60,
      spf = 1000 / fps;

  // 'update' loop is seperate - and is used to talk to the server
  var lastUpdate = 0;
  var id = -1;

  // hand the user control once they pick a sprite
  var spriteList = require('sprites');

  // set behaviour for text input
  var login = document.getElementById('login_text');
  login.oninput = function () {
    name = login.value;

    if(spriteList.hasOwnProperty(name)) {
      console.log(name);
      login.parentElement.remove();

      setEntity(player, name);
      player_name = name;
      socket.emit('changeEntity', player, name);
      gameLoop(0);
    }
  }

  var anim = 'idle_S';
  var oldPos = {"x":-1,"y":-1};
  function gameLoop (time) {
    // continue the loop
    window.requestAnimationFrame(gameLoop);

    var newAnim;
    if(player != -1) {
      var a = entities[player];
      if(keys.idle())              { a.idle();    newAnim = 'idle';}
      else if(keys.down('walk_N')) { a.walk('N'); newAnim = 'walk_N';}
      else if(keys.down('walk_E')) { a.walk('E'); newAnim = 'walk_E';}
      else if(keys.down('walk_S')) { a.walk('S'); newAnim = 'walk_S';}
      else if(keys.down('walk_W')) { a.walk('W'); newAnim = 'walk_W';}
    }

    if(time - lastUpdate > c.UPDATE) {
      lastUpdate = time;

      if(newAnim != anim || entities[player].position != oldPos) {
        anim = newAnim;
        oldPos.x = entities[player].position.x;
        oldPos.y = entities[player].position.y;
        socket.emit('updateEntity', player, entities[player].position, anim);
      }
    }
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
  socket.on('connection', function() {
    console.log('client connected');
  });

  socket.on('assignID', function(_id) {
    player = _id;
    // entities.splice(_id, 0, null);
console.log(_id+'k'+entities.length);
    entities.splice(_id, 0, null);
    console.log(entities.length);
    setEntity(player, 'unknown');

    var scale = require('constants').TILESIZE,
        _x = (6+Math.random()*4-1)*scale,
        _y = (18.5+Math.random()*2-1)*scale;

    entities[player].setPos(_x,_y);
    socket.emit('updateEntity', player, entities[player].position, 'idle');
  });

  socket.on('updateEntity', function(id, pos, anim) {
    if(entities[id] == null) { return; }

    // clamp incoming entities to nearest integer (prevents wobble effect)
    pos.x = Math.round(pos.x);
    pos.y = Math.round(pos.y);
    entities[id].position.x = pos.x;
    entities[id].position.y = pos.y;
    // entities[id].moveTo(pos.x, pos.y);

    if(anim != 'idle') {
      entities[id].setAnim(anim);

      var dir = anim.charAt(anim.length-1);
      if(dir == 'N' || dir == 'E' || dir == 'S' || dir == 'W') entities[id].direction = dir;
    }
    else { entities[id].idle(); }
  });

  socket.on('changeEntity', function(id, name) {
    console.log('changeEntity:'+id);
    setEntity(id, name); // in future this may need to be more general
  });

  socket.on('nullEntity', function(id) {
    renderer.nullEntity(id);
  });

  socket.on('message', function(message) {
    console.log(message);
  });

  socket.on('forceUpdate', function() {
    console.log('NETWORK: forced update');
    if(player != -1) {
      socket.emit('changeEntity', player, player_name);
      socket.emit('updateEntity', player, entities[player].position, anim);
    }
  });

  noclip = function internalNoclip(id = player) {
    if(id == null || entities[id] == null) { return 'error'; }
    else { entities[id].noclip = (entities[id].noclip == true) ? false : true; }
    console.log('NOCLIP:' + entities[id].name);
    return entities[id].noclip;
  };
});

function noclip () { }
