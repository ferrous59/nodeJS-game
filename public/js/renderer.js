define(['sprite', 'entity', 'collision', 'constants'], function (Sprite, Entity, Collision, canvas) {

  'use strict';
  // ctx is defined by constants.js and contains info on the canvas
  // camera is a sprite - this will eventually be the player
  function Renderer () {
    this.debug = "draw";
    this.errors = 0;

    this.tilesFloor = [];
    this.tilesCeiling = [];
    this.static = [];
    this.entities = [];

    this.bufferCanvas = canvas.BUFFERSTAGE;
    this.buffer = canvas.BUFFER; // buffer
    this.canvas = canvas.CANVAS; // canvas
    this.canvas.stroke();
    this.width = Math.ceil(canvas.STAGE_W/canvas.SCALE);
    this.height = Math.ceil(canvas.STAGE_H/canvas.SCALE);


    // set by map loader
    this.mapWidth =   10;
    this.mapHeight =  10;

    this.camera = {"x":100+3*16, "y":300-14*16};
    this.x = function() { return this.camera.x - this.width/2; }
    this.y = function() { return this.camera.y - this.height/2; }

    this.start = null;
    this.time = null;

    console.log("RENDERER: loaded");
    window.requestAnimationFrame(this.draw.bind(this));
  }

  Renderer.prototype.debug = function(foo) {
    this.debug = foo;
  }

  Renderer.prototype.stamp = function(sprite) {
    // later I may add something clever to sprite.tick so that animations don't appear to freeze once offscreen
    if(sprite == null) {
      this.errors++;
      return;
    }
    sprite.tick(this.time);

    var sx = sprite.sPosition.x,
        sy = sprite.sPosition.y,
        sw = sprite.width,
        sh = sprite.height,
        dx = Math.round(sprite.position.x-this.x()),
        dy = Math.round(sprite.position.y-this.y()),
        dw = sw,
        dh = sh;

    // animation
    if(sprite.animation != null) {
      sx += sprite.frame * sprite.width;
      sy += sprite.animation.row * sprite.height;
    }

    var buffer = this.buffer;

    if(sprite.isLoaded && (this.debug).includes("draw")) {
      var img = sprite.image;
      buffer.drawImage(img, sx,sy,sw,sh, dx,dy,dw,dh);
    }

    if((this.debug).includes("debug")) {
      var tile = (sprite.name == 'tile' && !(this.debug).includes("all")) ? true : false;

      buffer.beginPath();

      var colour = "green";

      if(!sprite.isLoaded) colour = "red";

      buffer.strokeStyle = colour;
      buffer.lineWidth = 0.2;

      if(!tile){
        buffer.fillStyle = "black";
        buffer.fillRect(dx,dy, dw,5);
      }
      if(sprite.hasOwnProperty('collider')) {
        if(sprite.isLoaded) colour = "blue";
        else colour = "purple";
        buffer.strokeStyle = colour;

        buffer.rect(dx,dy,dw,dh);
        buffer.moveTo(dx,dy);
        buffer.lineTo(dx+dw,dy+dh);
        buffer.moveTo(dx,dy+dh);
        buffer.lineTo(dx+dw,dy);
      }
      else { buffer.rect(dx,dy,dw,dh); }

      if(!tile){
        buffer.font = "2px lucida console";
        buffer.fillStyle = colour;
        buffer.fillText(sprite.name+" "+dx+":"+dy,dx+2,dy+3);
      }
      buffer.stroke();
    }
  }

  Renderer.prototype.drawTiles = function(tiles) {
    // not merged with findEntities because I want to improve this. Using collision is clumsy.
    var self = this;

    tiles.forEach(function(current) {
      if(current == null) { return; }
      var x = self.camera.x,
          y = self.camera.y,
          _width = self.width+current.width*2,
          _height = self.heigh+current.height;

      if(Collision.box(current.position.x,current.position.y, x,y, _width,_height) == true)
      {
        self.stamp(current);
      }
    });
  }

  Renderer.prototype.findEntities = function(visible, unknown) {
    // checks collision of non-tiles - then orders them by z-index (binary insert)
    var self = this;

    unknown.forEach(function(current) {
      if(current == null) { return; }
      var x = self.camera.x,
          y = self.camera.y,
          _width = self.width+current.width*2,
          _height = self.heigh+current.height;

      if(Collision.box(current.position.x,current.position.y, x,y, _width,_height) == true)
      {
        var insert = function(mid, current) {
          visible.splice(mid,0,current);
        }

        if(visible.length > 0) {

          var max = visible.length-1,
              min = 0,
              offset = 0,
              mid = 0,
              z = current.position.y + current.height,
              z_mid = 0,
              kMax = 100;

          for(var k = 0; k < kMax; k ++) {

            mid = min + Math.floor((max-min)/2); // must round down

            z_mid = visible[mid].position.y + visible[mid].height;

            // success
            if(max == min || z_mid == z || k == kMax-1) {
              var final = (z > z_mid) ? max+1 : (z == z_mid) ? mid : min;

              insert(final, current);
              k = kMax;
             }

            if(z_mid > z )
            {
              max = (mid > 0) ? mid-1 : 0;
            }
            if(z_mid < z)
            {
              min = mid+1;
            }
          }
        }
        else { insert(0, current); }
      }
    });
  }

  Renderer.prototype.drawEntities = function(entities) {
    if(entities != null) {
      for(var i = 0; i < entities.length; i++) {
        this.stamp(entities[i]);
      }
    }
  }

  // draw the game (thanks to mozilla.org for looping)
  // draws within box of width, height centered on x,y (we will get these from our 'camera')
  Renderer.prototype.draw = function(timestamp) {
    // continue the loop
    window.requestAnimationFrame(this.draw.bind(this));
    // setup time measurements
    if(!this.start)
    {
      this.start = timestamp;
    }
    if(timestamp - this.time < canvas.PHYSICS) { return; }
    this.time = timestamp;

    // DEBUG BROADCAST
    // broadcast errors every two seconds

    if(this.debug != externalDebug) {
      this.debug = externalDebug;

      // list active colliders - useful for manipulating values
      if(this.debug.includes('collider')) { console.log(Collision.collidersList); }

      this.buffer.fillRect(0,0, canvas.STAGE_W, canvas.STAGE_H);
    }
    if((this.debug).includes("debug") && !(this.debug).includes("silent") && Math.round((this.start-this.time)/10)%200 == 0) {
      console.log("RENDERER: (" + this.time + ") error count: " + this.errors);
    }

    this.buffer.fillStyle = '#222034';
    this.buffer.fillRect(0,0,this.width,this.height);
    // this.buffer.stroke();

    // more efficient than drawEntities
    this.drawTiles(this.tilesFloor);

    var visible = [];

    this.findEntities(visible, this.static);
    this.findEntities(visible, this.entities);
    this.drawEntities(visible);

    // <DEBUG BINARY SEARCH>
      // var string = "\n \n";
      // var string2 = "\n \n";
      // for (var jub = 0; jub < visible.length; jub++) {
      //   if(visible[Math.abs(jub-1)].position.y > visible[jub].position.y) { string += "\t \t \t"; }
      //
      //   var y = visible[jub].position.y + visible[jub].height;
      //   if(y<10) {string += " "}
      //   if(y<100) {string += " "}
      //   string += " " + y;
      // }
      // console.log(visible.length+":"+string);
      // console.log(visible.length+":"+string);
    // </DEBUG BINARY SEARCH>

    this.drawTiles(this.tilesCeiling);

    // draw colliders
    if((this.debug).includes("debug")) {
      var buffer = this.buffer;

      buffer.strokeStyle = 'yellow';
      for(var i = 0; i < Collision.collidersList.length; i++){
        // draw each collider
        var collider = Collision.collidersList[i];
        buffer.beginPath();
        if(collider.type == 'disc') {
          buffer.arc(collider.X()-this.x(), collider.Y()-this.y(), collider.radius, 0, 2*Math.PI);
        }
        if(collider.type == 'box') {
          buffer.arc(collider.X()-this.x()-collider.width/2, collider.Y()-this.y()-collider.height/2, collider.width, collider.height);
        }
        buffer.font = "2px lucida console";
        buffer.fillStyle = 'yellow';
        buffer.fillText(i, collider.X()-this.x()-1, collider.Y()-this.y()+1);
        buffer.stroke();
      }
    }

    this.canvas.drawImage(this.bufferCanvas,0,0);
  }

  Renderer.prototype.addFloorTile = function(tile, index = -1) {
    this.push(this.tilesFloor, tile, index);
  }
  Renderer.prototype.addCeilingTile = function(tile, index = -1) {
    this.push(this.tilesCeiling, tile, index);
  }
  Renderer.prototype.push = function(array, tile, index = -1) {
    if( index > -1 ) { array.slice(tile, 0, index); }
    else { array.push(tile); }
  }

  Renderer.prototype.addStatic = function(entity) { this.static.push(entity); }
  Renderer.prototype.addEntity = function(entity) { this.entities.push(entity); }
  Renderer.prototype.nullEntity = function(i) {
    if(this.entities[i] == null) { return; }
    if(this.entities[i].collider != null) { Collision.remove(this.entities[i].collider.ID); }
    this.entities[i] = null;
  }
  Renderer.prototype.removeEntity = function(entity) {
    var self = this;
    for(var i = 0; i < self.entities.length; i++) {
      if(self.entities[i] === entity) { self.entities.splice(i,1); return; }
    }
    console.log('RENDERER: Tried to remove an entity that did\'nee exist...');
  }

  return Renderer;
});

var externalDebug = "draw";
function debug(foo) {
  externalDebug = foo;
  return foo;
};
