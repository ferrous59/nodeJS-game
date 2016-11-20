// sprites are dynamic, tiles are static
// sprites are loaded from a json

// s for source, d for draw
// vector2s are simply JSON structs with x and y values
// url is local to 'img' folder
// animation example: { name: "idle_S", row: 0, length:2, timing: [200,200]}

// sprite usage: Get JSON, create new Sprite(parsedJSON), sprite.setAnim("name")

define(['sprites'], function (Sprites) {

  function Sprite (name)
  {
    var data = {};

    if(Sprites.hasOwnProperty(name)) {
      data = Object.assign({},Sprites[name]);
    }
    else {
      console.log("SPRITE: invalid sprite reference: " + name);
      data = Object.assign({},Sprites['default']);
    }

    this.name = data.name;

    this.sPosition = data.sPosition;
    this.dimensions = data.dimensions;
    this.center = data.center;

    // image loading
    this.isLoaded = false;
    this.image = new Image();
    this.image.src = data.src;

    this.image.onload = this.onLoad();

    // these will be accessed with anim["name"]
    if(data.animations != null) { this.anim = data.animations; }
    else { this.anim = {};}

    // non-static
    this.position = {"x":0, "y":0};
    // for animation
    this.lastTick = 0;
    this.frame = 0;
    this.delay = 0; // how long till next frame?
    this.animation = null;
    this.setAnim("idle_S");
  }

  Sprite.prototype.onLoad = function() {
     this.isLoaded = true;
  }

  Sprite.prototype.setPos = function(x,y)
  {
    this.position.x = x;
    this.position.y = y;
  }

  // set animation
  Sprite.prototype.setAnim = function(name, frame = 0)
  {
    if(this.anim.hasOwnProperty(name) && this.animation !== this.anim[name])
    {
      this.animation = this.anim[name];
      this.delay = this.anim[name].timing[0] || 200;
      this.redraw();
    }
  }

  // ideally, will only be called for animated sprites
  Sprite.prototype.tick = function(time)
  {
    if(this.delay > 0 && time - this.lastTick >= this.delay) {
      this.lastTick = time;
      this.redraw();
    }
  }

  Sprite.prototype.redraw = function()
  {
    if(this.animation != null) {

      var anim = this.animation;
      this.frame = (this.frame + 1) % anim.length;

      if(anim.timing != null && anim.timing.hasOwnProperty(this.frame))
      {
        this.delay = anim.timing[this.frame];
      }
    }
  }

  return Sprite;
});

// define(['canvas'], function (Canvas) {
//   // handles animations.
//   // outputs a 'canvas' that we entity/other can draw at a position with drawImage
//   var sprite ="";
//   //var initSprite = {
//     //init: function(data) {
//     function init (data) {
//       this.stage = document.createElement('canvas');
//       this.stage.width = data.sW;
//       this.stage.height = data.sH;
//
//       this.canvas = new Canvas(this.stage);
//       this.img = new Image();
//       this.img.src = data.src;
//     /*},
//     draw: function(dX,dY)
//     {*/
//       this.canvas.drawImage(this.img,
//         dX, dY, data.sW, data.sH,
//         0,  0,  data.sW*c.SCALE, data.sH*c.SCALE
//       );
//
//       sprite = this.canvas;
//     //}
//   }
//   return sprite;
// });
