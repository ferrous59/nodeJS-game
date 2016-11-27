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

    this.canvas = canvas.CANVAS;
    this.width = Math.ceil(canvas.STAGE_W/canvas.SCALE);
    this.height = Math.ceil(canvas.STAGE_H/canvas.SCALE);

    // this.tile = function(number) { return Math.ceil(number/canvas.TILESIZE); }

    // set by map loader
    this.mapWidth =   10;
    this.mapHeight =  10;

    this.camera = {"x":100+3*16, "y":300-14*16};
    this.x = function() { return this.camera.x - this.width/2; }
    this.y = function() { return this.camera.y - this.height/2; }

    // console.log(this.tile(this.width)+":"+this.tile(this.height));
    //   console.log(this.width+":"+this.height);
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

    if(sprite.isLoaded && (this.debug).includes("draw")) {
      var img = sprite.image;
      this.canvas.drawImage(img, sx,sy,sw,sh, dx,dy,dw,dh);
    }

    if((this.debug).includes("debug")) {
      var tile = (sprite.name == 'tile' && !(this.debug).includes("all")) ? true : false;

      this.canvas.beginPath();

      var colour = "green";

      if(!sprite.isLoaded) colour = "red";

      this.canvas.strokeStyle = colour;
      this.canvas.lineWidth = 0.1;

      if(!tile){
        this.canvas.fillStyle = "black";
        this.canvas.fillRect(dx,dy, dw,5);
      }

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

      if(!tile){
        this.canvas.font = "2px lucida console";
        this.canvas.fillText(sprite.name+" "+dx+":"+dy,dx+2,dy+3);
      }
      this.canvas.stroke();
    }
  }

  Renderer.prototype.drawTiles = function(tiles) {
    // not merged with findEntities because I want to improve this. Using collision is clumsy.
    var self = this;

    tiles.forEach(function(current) {
      if(current == null) { return; }
      var x = self.camera.x,
          y = self.camera.y,
          xA = x - self.width/2 - current.width,
          xB = x + self.width/2 + current.width,
          yA = y - self.height/2 - current.height,
          yB = y + self.height/2 + current.height;

      if(Collision.box(current.position.x,current.position.y, xA,xB, yA,yB) == true)
      {
        self.stamp(current);
      }
    });
  }

  Renderer.prototype.findEntities = function(visible, unknown) {
    // checks collision of non-tiles - then orders them by z-index (binary insert)
    var self = this;

    unknown.forEach(function(current) {
      var x = self.camera.x,
          y = self.camera.y,
          xA = x - self.width/2 - current.width,
          xB = x + self.width/2 + current.width,
          yA = y - self.height/2 - current.height,
          yB = y + self.height/2 + current.height;

      if(Collision.box(current.position.x,current.position.y, xA,xB, yA,yB) == true)
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

    this.canvas.fillStyle = '#222034';
    this.canvas.fillRect(0,0,this.width,this.height);
    // this.canvas.stroke();

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
