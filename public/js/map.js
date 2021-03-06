// Used to load map files that are exported by 'tilemapper'
define(['renderer', 'collision', 'sprite', 'entity',
        'text!JSON/maps/tavern.json'], function() {

  function SpriteMap (name = 'unknown')
  {
    this.name = name;
  }

  SpriteMap.prototype.loadMap = function(url, renderer = null) {
    // load JSON
    var data = JSON.parse(require('text!JSON/maps/' + url + ".json"));

    this.customTiles = data.custom;
    this.spriteWidth = data.tilewidth;
    this.spriteHeight = data.tileheight;

    this.renderer = (renderer == null) ? new Renderer( {"position":{"x":0,"y":0}} ) : renderer;
    this.renderer.mapWidth = data.width*data.tilewidth;
    this.renderer.mapHeight = data.height*data.tileheight;

    // for(var i = 0; i < data.layers.length; i++) {
    for(var i = (data.layers.length-1); i > -1; i-- ) {
        var layer = data.layers[i];
        if(layer.name.includes('collision'))
        {
          this.loadColliders(layer);
        }
        else {
          this.loadTiles(layer, layer.name);
        }
    }
  }
  // this looks pretty odd because it is converting from an exported json from a tile program
  SpriteMap.prototype.loadColliders = function (layer) {
    for(var i = 0; i < layer.objects.length; i++) {
      var Collision = require('collision'),
          current = layer.objects[i],
          collider = null,
          position = {"x": current.x, "y":current.y},
          offset = {"x": current.width/2, "y":current.height/2},
          width = current.width,
          height = current.height;

      if(current.type = 'box') {
        collider = Collision.rawBoxCollider(position, offset, width, height);
      }
      else if (current.type = 'disc') {
        collider = Collision.rawDiscCollider(position, offset, width);
      }

      if(collider != null) { Collision.add(collider); }
    }
  }

  SpriteMap.prototype.loadTiles = function (layer, destination) {
    if(this.renderer == null) { console.log("MAP: error: no renderer"); return; }

    // looping through the array backwards puts entities roughly in z-index order
    for (var i = layer.height*layer.width; i > 0; i-- ) {
      var tile = layer.data[i] -1;

      if( tile > -1 ) {
        var Entity = require('entity');
        var Sprite = require('sprite');

        // this one line business is a bit indulgent, but I just learned about ternarys!
        var name = this.customTiles != null && this.customTiles.hasOwnProperty(tile) ? this.customTiles[tile] : 'tile';
        if(name == '0') { continue; }

        var sprite = new Entity(name);
        if(sprite.collider == null) { sprite = new Sprite(name); }

        var x = i % layer.width,
            y = (i-x) / layer.width,
            sx = tile % sprite.width,
            sy = (tile-sx) / sprite.width;



        x  *= this.spriteWidth;
        sx *= this.spriteWidth;
        y  *= this.spriteHeight;
        sy *= this.spriteHeight;
        // custom sprites may already be offset
        sprite.setPos(x,y,true);
        sprite.setPos(layer.offsetx,layer.offsety,true);
        if(name == 'tile') { sprite.setSource(sx,sy); }

        // send the final tile to the place it goes
        if(destination == 'floor') { this.renderer.addFloorTile(sprite); }
        else if(destination == 'ceiling') { this.renderer.addCeilingTile(sprite); }
        else { this.renderer.addStatic(sprite); }
      }
      // ideally, tile arrays will not use collision and must be spaced correctly
      // else {
      //   if(destination == 'floor') { this.renderer.addFloorTile(null); }
      //   else if(destination == 'ceiling') { this.renderer.addCeilingTile(null); }
      // }
    }
  }

  return SpriteMap;
});
