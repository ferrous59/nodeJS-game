define(['canvas'], function(Canvas){
  var system = {
    //---------------
    // SYSTEM VALUES
    //---------------
    TILESIZE: 16,
    STAGE_W : Math.max(document.documentElement.clientWidth, window.innerWidth || 600),
    STAGE_H : Math.max(document.documentElement.clientHeight, window.innerHeight || 400),
    SCALE   : 5,
    PHYSICS : 15, //ms
    UPDATE  : 45, //ms
    GAME_FONT : "bold 20px sans-serif", // will need to be replaced by custom font
    STAGE : null, //document.getElementById("gameCanvas"),
    CANVAS : null,//document.getElementById("gameCanvas").getContext("2d"),

    //---------------
    // RENDERING
    //---------------
    SETUP_CANVAS : function() {
      this.STAGE = document.getElementById("gameCanvas");;

      this.STAGE.width = this.STAGE_W;
      this.STAGE.height = this.STAGE_H;

      this.CANVAS = new Canvas(this.STAGE);

      this.CANVAS.scale(this.SCALE,this.SCALE);

      this.CANVAS.fillStyle = "#ffffff";
      this.CANVAS.fillRect(0,0, this.STAGE_W, this.STAGE_H);

      // loading screen
      this.CANVAS.fillStyle = "#000000";
      this.CANVAS.font = this.GAME_FONT;
      this.CANVAS.fillText("loading...", this.STAGE_W/2-50, this.STAGE_H/2);
    }
  }
  return system;
});
