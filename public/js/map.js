// Used to load map files that are exported by 'tilemapper'
define(['renderer', 'sprite',
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

    // for(var i = 0; i < data.layers.length; i++) {
    for(var i = (data.layers.length-1); i > -1; i-- ) {
        var layer = data.layers[i];
        this.loadTiles(layer, layer.name);
    }
  }

  SpriteMap.prototype.loadTiles = function (layer, destination) {
    if(this.renderer == null) { console.log("MAP: error: no renderer"); return; }

    // looping through the array backwards puts entities roughly in z-index order
    for (var i = layer.height*layer.width; i > 0; i-- ) {
      var tile = layer.data[i] -1;

      if( tile > -1 ) {
        var Sprite = require('sprite');

        // this one line business is a bit indulgent, but I just learned about ternarys!
        var name = this.customTiles != null && this.customTiles.hasOwnProperty(tile) ? this.customTiles[tile] : 'tile';

        var sprite = new Sprite(name),
            x = i % layer.width,
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

        // console.log(x +":"+y+"::"+tile+"::"+sx+"_"+sprite.sPosition+":"+sy);

        // send the final tile to the place it goes
        if(destination == 'floor') { this.renderer.addFloorTile(sprite); }
        else if(destination == 'ceiling') { this.renderer.addCeilingTile(sprite); }
        else { this.renderer.addStatic(sprite); }
      }
    }
  }

  return SpriteMap;
});
