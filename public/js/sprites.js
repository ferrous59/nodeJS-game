// basic concept taken from browserquest
// list all JSON, push each into a struct called sprites, which we can use to load JSON by name
define(['text!JSON/sprites/default.json',
        // sprites
        'text!JSON/sprites/bard.json',
        'text!JSON/sprites/cheeseDwarf.json',
        'text!JSON/sprites/dragonKnight.json',
        'text!JSON/sprites/druid.json',
        'text!JSON/sprites/pyromancer.json',
        'text!JSON/sprites/ranger.json',
        'text!JSON/sprites/rogue.json',
        // tiles
        'text!JSON/tiles/barrel.json',
        'text!JSON/tiles/barrel1.json',
        'text!JSON/tiles/box.json',
        'text!JSON/tiles/box1.json',
        'text!JSON/tiles/chest.json',
        'text!JSON/tiles/door.json',
        'text!JSON/tiles/door1.json',
        'text!JSON/tiles/doorway.json',
        'text!JSON/tiles/doorway1.json',
        'text!JSON/tiles/sconce.json',
        'text!JSON/tiles/table.json',
        'text!JSON/tiles/table1.json',
        'text!JSON/tiles/table2.json',
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
