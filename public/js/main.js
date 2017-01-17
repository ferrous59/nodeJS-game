// main.js
require.config({
  baseurl:"js/lib", // external libraries
  paths: {          // extra paths I guess?

  }
});

var client = require(['client'], function(){
  console.log('game loaded');
});

function debugMode(bool) {
  if(client.renderer != null) {
    client.canvas.clearRect();
    client.renderer.debug = bool;
    return 'success';
  }
  return 'failed';
}
