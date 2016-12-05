// require all our colliders
define('collision',['constants'], function(){
  return {
    bounds : function(x,y, xA,xB, yA,yB) {
      if(x < xA || x > xB || y < yA || y > yB)
      {
        return false;
      }
      return true;
    },
    box : function (x,y,X,Y,width,height) {
      var xA = X-width/2,
          xB = xA+width,
          yA = Y-height/2,
          yB = yA+height;

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
