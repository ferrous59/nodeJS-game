// main.js
require.config({
  baseurl:"js/lib", // external libraries
  paths: {          // extra paths I guess?

  }
});

var client = require(['client'], function(){
  console.log('game loaded');
  console.log(client);
  
});

function debugMode(bool) {
  console.log(client);
  console.log(client.Renderer);
  if(client.renderer != null) {
    client.renderer.debug = bool;
    return 'success';
  }
  return 'failed';
}
