define({
  //---------------
  // SYSTEM VALUES
  //---------------
  SCALE   : 5,
  STAGE_W : 600,//Math.max(document.documentElement.clientWidth, window.innerWidth || 600),
  STAGE_H : 400,//Math.max(document.documentElement.clientHeight, window.innerHeight || 400),
  PHYSICS : 15,
  UPDATE  : 45,
  GAME_FONT : "bold 20px sans-serif",
  STAGE :  document.getElementById("gameCanvas"),
  CANVAS : document.getElementById("gameCanvas").getContext("2d"),

  //---------------
  // RENDERING
  //---------------
  SETUP_CANVAS : function() {
    STAGE = document.getElementById("gameCanvas");

    STAGE.width = this.STAGE_W;
    STAGE.height = this.STAGE_H;

    CANVAS = STAGE.getContext("2d");

    CANVAS.fillStyle = "#ffffff";
    CANVAS.fillRect(0,0, this.STAGE_W, this.STAGE_H);

    // loading screen
    CANVAS.fillStyle = "#000000";
    CANVAS.font = this.GAME_FONT;
    CANVAS.fillText("loading...", this.STAGE_W/2-50, this.STAGE_H/2);

    // enable jazzy pixel art stylings
    CANVAS.mozImageSmoothingEnabled = false;
    CANVAS.webkitImageSmoothingEnabled = false; // may be depreciated (replaced by imageSmoothingEnabled?)
    CANVAS.msImageSmoothingEnabled = false;
    CANVAS.imageSmoothingEnabled = false;
  }
});
