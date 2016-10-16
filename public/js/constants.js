//---------------
// SYSTEM VALUES
//---------------

var SCALE   = 5,
    STAGE_W = Math.max(document.documentElement.clientWidth, window.innerWidth || 600),
    STAGE_H = Math.max(document.documentElement.clientHeight, window.innerHeight || 400),
    PHYSICS = 15,
    UPDATE  = 45,
    GAME_FONT = "bold 20px sans-serif";

//---------------
// RENDERING
//---------------

var STAGE = document.getElementById("gameCanvas");

STAGE.width = STAGE_W;
STAGE.height = STAGE_H;

var CANVAS = STAGE.getContext("2d");

CANVAS.fillStyle = "#ffffff";
CANVAS.fillRect(0,0, STAGE.width,STAGE.height);

// loading screen
CANVAS.fillStyle = "#000000";
CANVAS.font = GAME_FONT;
CANVAS.fillText("loading...", STAGE_W/2-50, STAGE_H/2);

// enable jazzy pixel art stylings
CANVAS.mozImageSmoothingEnabled = false;
CANVAS.webkitImageSmoothingEnabled = false; // may be depreciated (replaced by imageSmoothingEnabled?)
CANVAS.msImageSmoothingEnabled = false;
CANVAS.imageSmoothingEnabled = false;
