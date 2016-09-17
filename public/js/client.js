var stage = document.getElementById("gameCanvas");
stage.width = STAGE_W;
stage.height = STAGE_H;

var canvas = stage.getContext("2d");

canvas.fillStyle = "#ffffff";
canvas.fillRect(0,0, stage.width,stage.height);

// loading screen
canvas.fillStyle = "#000000";
canvas.font = GAME_FONT;
canvas.fillText("loading...", STAGE_W/2-50, STAGE_H/2);

// enable jazzy pixel art stylings
canvas.mozImageSmoothingEnabled = false;
canvas.webkitImageSmoothingEnabled = false; // may be depreciated (replaced by imageSmoothingEnabled?)
canvas.msImageSmoothingEnabled = false;
canvas.imageSmoothingEnabled = false;
