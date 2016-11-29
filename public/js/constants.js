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
    BUFFERSTAGE : null,
    STAGE : null,
    BUFFER : null,
    CANVAS : null,

    //---------------
    // RENDERING
    //---------------
    SETUP_CANVAS : function() {
      this.STAGE = document.getElementById("gameCanvas");
      // this.BUFFERSTAGE = document.createElement('CANVAS');
      this.BUFFERSTAGE = document.getElementById('gameBuffer');

      this.STAGE.width = this.STAGE_W;
      this.STAGE.height = this.STAGE_H;
      this.CANVAS = new Canvas(this.STAGE);
      // this.CANVAS.scale(this.SCALE,this.SCALE);

      this.BUFFERSTAGE.width = this.STAGE_W;
      this.BUFFERSTAGE.height = this.STAGE_H;
      this.BUFFER = new Canvas(this.BUFFERSTAGE);
      this.BUFFER.scale(this.SCALE,this.SCALE);

      // loading screen
      this.CANVAS.fillStyle = "#ffffff";
      this.CANVAS.fillRect(0,0, this.STAGE_W, this.STAGE_H);
      this.CANVAS.fillStyle = "#000000";
      this.CANVAS.font = this.GAME_FONT;
      this.CANVAS.fillText("loading...", this.STAGE_W/2-50, this.STAGE_H/2);
    }
  }
  return system;
});
