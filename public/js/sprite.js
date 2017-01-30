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

    this.width = data.width;
    this.height = data.height;
    this.z_index = data.z_index || 0;
    this.centre = data.centre;

    // image loading
    this.isLoaded = false;
    this.image = new Image();
    this.image.src = data.src;

    this.image.onload = this.onLoad();

    // these will be accessed with anim["name"]
    this.anim = (data.animations != null) ? data.animations : {};

    // non-static
    var d = data.hasOwnProperty('position') ? data.position : {"x":0, "y":0},
        s = data.hasOwnProperty('sPosition') ? data.sPosition : {"x":0, "y":0};

    this.position =  {"x":d.x, "y":d.y};
    this.sPosition = {"x":s.x, "y":s.y};

    // for animation
    this.lastTick = 0;
    this.frame = 0;
    this.delay = 0; // how long till next frame?
    this.animation = null;
    this.setAnim("idle_S"); // this will always be default
  }

  Sprite.prototype.onLoad = function() {
     this.isLoaded = true;
  }

  Sprite.prototype.setPos = function(x,y, offset = false)
  {
    if(typeof(x) != 'number') { x = 0; }
    if(typeof(y) != 'number') { y = 0; }

    if(offset) {
      this.position.x += x;
      this.position.y += y;
    }
    else {
      this.position.x = x;
      this.position.y = y;
    }
  }

  Sprite.prototype.setSource = function(x,y)
  {
    if(typeof(x) != 'number') { x = 0; }
    if(typeof(y) != 'number') { y = 0; }

    this.sPosition.x = x;
    this.sPosition.y = y;
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
