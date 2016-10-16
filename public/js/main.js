// main.js
require.config({
  baseurl:"js/lib", // external libraries
  paths: {          // extra paths I guess?

  }
});

require(['client','constants'], function(){
  console.log('game loaded');
});
