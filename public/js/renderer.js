define(['sprite', 'entity', 'collision', 'constants'], function (Sprite, Entity, Collision, canvas) {

  // ctx is defined by constants.js and contains info on the canvas
  // camera is a sprite - this will eventually be the player
  function Renderer (camera) {
    this.debug = false;
    this.errors = 0;

    this.tilesFloor = [];
    this.tilesCeiling = [];
    this.static = [];
    this.entities = [];

    this.camera = camera;
    this.canvas = canvas.CANVAS;
    this.width = Math.round(canvas.STAGE_W/canvas.TILESIZE +0.5); // +0.5 to always round up
    this.height = Math.round(canvas.STAGE_H/canvas.TILESIZE +0.5);

    this.start = null;
    this.time = null;

    console.log("RENDERER: loaded");
    window.requestAnimationFrame(this.draw.bind(this));
  }

  Renderer.prototype.debug = function(bool) {
    this.debug = bool;
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
        sw = sprite.dimensions.x,
        sh = sprite.dimensions.y,
        dx = Math.round(sprite.position.x),
        dy = Math.round(sprite.position.y),
        dw = sw,
        dh = sh;

    // animation
    if(sprite.animation != null) {
      sx += sprite.frame * sprite.dimensions.x;
      sy += sprite.animation.row * sprite.dimensions.y;
    }

    if(sprite.isLoaded && !this.debug) {
      var img = sprite.image;
      this.canvas.drawImage(img, sx,sy,sw,sh, dx,dy,dw,dh);
    }

    if(this.debug) {
      this.canvas.beginPath();

      var colour = "green";

      if(!sprite.isLoaded) colour = "red";

      this.canvas.strokeStyle = colour;
      this.canvas.lineWidth = 0.1;

      this.canvas.fillStyle = "black";
      this.canvas.fillRect(dx,dy, dw,5);

      if(sprite.hasOwnProperty('collider')) {
        if(sprite.isLoaded) colour = "blue";
        this.canvas.strokeStyle = colour;

        this.canvas.moveTo(dx,dy);
        this.canvas.lineTo(dx+dw,dy+dh);
        this.canvas.moveTo(dx,dy+dh);
        this.canvas.lineTo(dx+dw,dy);
      }

      this.canvas.fillStyle = colour;
      this.canvas.rect(dx,dy,dw,dh);

      this.canvas.font = "2px lucida console";
      this.canvas.fillText(sprite.name+" "+dx+":"+dy,dx+2,dy+3);
      this.canvas.stroke();

      this.canvas.stroke();
    }
  }

  Renderer.prototype.drawTiles = function(tiles) {
    // uses tilespace coords
    var x = this.camera.position.x,
        y = this.camera.position.y,
        xA = x - this.width/2,
        yA = y - this.height/2;

    // the location of a tile is simply y*width+x
    for(var i = 0; i < this.width*this.height; i++)
    {
      var _x = i % this.width    + xA,
          _y = (i-_x)/this.width + yA,
          index = _y*this.width  + _x;

      if(tiles[index] != null) {this.stamp(tiles[index]);}
    }
  }

  Renderer.prototype.findEntities = function(visible, unknown) {
    // checks collision of non-tiles - then order them by z-index (binary insert)
    //for(var j = 0; j < this.static.length + this.entities.length; j++)
    unknown.forEach(function(current) {
      var x = current.position.x,
          y = current.position.y,
          dim = current.dimensions,
          xA = x - this.width/2 - dim.x,
          xB = x + this.width/2 + dim.x,
          yA = y - this.height/2 - dim.y,
          yB = y + this.height/2 - dim.y;

      var insert = function(min, current) {
        visible.splice(min,0,current);
      }

      if(Collision.box(x,y, xA,xB, yA,yB) == true)
      {
        if(visible.length > 0) {
          var max = visible.length,
              min = 0,
              mid = 0,
              z_mid = 0;

          for(var k = 0; k < 200; k ++) {
            mid = Math.round((max-min)/2 - 0.5); // must round down
            if(visible[mid] != null) { z_mid = visible[mid].position.y; }
            else { _zmid = 0; }

            if(max == min || z_mid == y) { insert(min,current); k = 200; }

            if(z_mid > y )
            {
              if(mid > 0) { max = mid-1; }
              else { max = 0; }
            }
            if(z_mid < y && min < max) { min = mid+1; }
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
    // setup time measurements
    if(!this.start)
    {
      this.start = timestamp;
    }
    this.time = timestamp;

    // DEBUG BROADCAST
    // broadcast errors every two seconds
    if(this.debug != externalDebug) {
      this.debug = externalDebug;
      this.canvas.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
    if(this.debug && Math.round((this.start-this.time)/10)%200 == 0) {
      console.log("RENDERER: (" + this.time + ") error count: " + this.errors);
    }

    // more efficient than drawEntities
    this.drawTiles(this.tilesFloor);

    var visible = [];
    this.findEntities(visible, this.static);
    this.findEntities(visible, this.entities);
    this.drawEntities(visible);

    this.drawTiles(this.tilesCeiling);

    // continue the loop
    window.requestAnimationFrame(this.draw.bind(this));
  }

  Renderer.prototype.addFloorTile = function(tile) { this.tilesFloor.push(tile); }
  Renderer.prototype.addCeilingTile = function(tile) { this.tilesCeiling.push(tile); }

  Renderer.prototype.addStatic = function(entity) { this.static.push(entity); }
  Renderer.prototype.addEntity = function(entity) { this.entities.push(entity); }

  return Renderer;
});

var externalDebug = false;
function debug(bool) { externalDebug = bool; };
