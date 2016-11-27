// basic concept taken from browserquest
// list all JSON, push each into a struct called sprites, which we can use to load JSON by name
define(['text!JSON/sprites/default.json',
        'text!JSON/sprites/druid.json',
        'text!JSON/tiles/sconce.json',
        'text!JSON/tiles/tile.json'], function () {

  var sprites = {};
  var dependencies = Array.prototype.slice.call(arguments);
  //
  // var loaded = 0;
  // var isLoaded = false;

  dependencies.forEach(function(arg) {
    var sprite = JSON.parse(arg);

    // sprite.image = new Image();
    sprite.src = "../img/" + sprite.src;

    // sprite.image.onload = onload;

    sprites[sprite.name] = sprite;
  });

  // var onload = function() {
  //   console.log("SPRITE:" + sprite.src + " loaded");
  //   loaded++;
  //
  //   if(loaded = dependencies.length) {
  //     // all images loaded
  //     isLoaded = true;
  //   }
  // };

  console.log("SPRITES: data loaded");
  return sprites;
});
