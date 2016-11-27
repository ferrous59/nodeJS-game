define(['sprite', 'entity', 'collision', 'constants'], function (Sprite, Entity, Collision, canvas) {

  // ctx is defined by constants.js and contains info on the canvas
  // camera is a sprite - this will eventually be the player
  function Renderer () {
    this.debug = "draw";
    this.errors = 0;

    this.tilesFloor = [];
    this.tilesCeiling = [];
    this.static = [];
    this.entities = [];

    this.camera = {"x":60, "y":50};

    this.canvas = canvas.CANVAS;
    this.width = Math.round(canvas.STAGE_W/canvas.TILESIZE +0.5); // +0.5 to always round up
    this.height = Math.round(canvas.STAGE_H/canvas.TILESIZE +0.5);

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
        dx = Math.round(sprite.position.x-this.camera.x),
        dy = Math.round(sprite.position.y-this.camera.y),
        dw = sw,
        dh = sh;

    // animation
    if(sprite.animation != null) {
      sx += sprite.frame * sprite.width;
      sy += sprite.animation.row * sprite.height;
    }

    if(sprite.isLoaded && (this.debug).includes("draw")) {
      var img = sprite.image;
      this.canvas.drawImage(img, sx,sy,sw,sh, dx,dy,dw,dh);
    }

    if((this.debug).includes("debug")) {
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
    var x = this.camera.x,
        y = this.camera.y,
        xA = Math.round(x - this.width/2),
        yA = Math.round(y - this.height/2);
        var once = true;
    // the location of a tile is simply y*width+x
    for(var i = 0; i < this.width*this.height; i++)
    {
      var _x = (i % this.width    + xA),
          _y = (i-i % this.width)/this.width + yA,
          index = (_x < this.width && _y < this.height) ? _y*this.width  + _x : null;
          if(i == 4 && once ) {once = false; console.log(index + ":" + this.width + ":" + _x +":"+_y+":"+tiles[index]);}

      if(tiles[index] != null) { this.stamp(tiles[index]); }
    }
  }

  Renderer.prototype.findEntities = function(visible, unknown) {
    // checks collision of non-tiles - then order them by z-index (binary insert)
    unknown.forEach(function(current) {
      var x = current.position.x,
          y = current.position.y,
          xA = x - this.width/2 - current.width,
          xB = x + this.width/2 + current.width,
          yA = y - this.height/2 - current.height,
          yB = y + this.height/2 - current.height;

      var insert = function(min, current) {
        visible.splice(min,0,current);
      }

      if(Collision.box(x,y, xA,xB, yA,yB) == true)
      {
        if(visible.length > 0) {
          y += current.height;

          var max = visible.length,
              min = 0,
              mid = 0,
              z_mid = 0,
              kMax = 500;

          for(var k = 0; k < kMax; k ++) {
            mid = Math.round((max+min)/2 - 0.5); // must round down

            if(visible[mid] != null) {
              z_mid = visible[mid].position.y + visible[mid].height;
            }

            if(max == min || z_mid == y || k == kMax-1) { insert(mid,current); k = kMax;}

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
      this.canvas.fillRect(0,0, canvas.STAGE_W, canvas.STAGE_H);
    }
    if((this.debug).includes("debug") && !(this.debug).includes("silent") && Math.round((this.start-this.time)/10)%200 == 0) {
      console.log("RENDERER: (" + this.time + ") error count: " + this.errors);
    }

    // more efficient than drawEntities
    this.drawTiles(this.tilesFloor);

    var visible = [];
    this.findEntities(visible, this.static);
    this.findEntities(visible, this.entities);
    this.drawEntities(visible);

    // <DEBUG BINARY SEARCH>
    //   var string = "\n \n";
    //   for (var jub = 0; jub < visible.length; jub++) {
    //     var y = visible[jub].position.y;
    //     if(y<10) {string += " "}
    //     if(y<100) {string += " "}
    //     string += " " + y;
    //   }
    //   console.log(visible.length+":"+string);
    // </DEBUG BINARY SEARCH>

    this.drawTiles(this.tilesCeiling);

    // continue the loop
    window.requestAnimationFrame(this.draw.bind(this));
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

  return Renderer;
});

var externalDebug = "draw";
function debug(foo) { externalDebug = foo; return foo; };
