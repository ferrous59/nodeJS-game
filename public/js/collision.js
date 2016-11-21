// require all our colliders
define('collision',['constants'], function(){
  return {
    box : function(x,y, xA,xB, yA,yB) {
      if(x < xA || x > xB || y < yA || y > yB)
      {
        return false;
      }
      return true;
    },

    disc : function(x,y, X,Y,radius) {
      var distSquared = Math.pow(x-X, 2) + Math.pow(y-Y, 2);
      if(distSquared > Math.pow(radius))
      {
        return false;
      }
      return true;
    }
  }
});
