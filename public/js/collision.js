// require all our colliders
define('collision',['constants'], function(){
  var colliders = [];

  function internalCheck(a,b) {
    function squareDistance (from, to) {
      var x2 = Math.pow(from.X() - to.X(), 2),
          y2 = Math.pow(from.Y() - to.Y(), 2);
      return x2+y2;
    }

    // 2 discs - check distance against summed radii
    if(a.type == 'disc' && b.type == 'disc') {
      if( squareDistance(a,b) < Math.pow(b.radius+a.radius,2) ) { return true; }
    }
    // 2 boxes - check x and y distances between centres are more than half widths
    else if(a.type == 'box' && b.type == 'box') {
      if(a.X() - b.X() < a.width/2 + b.width/2) { return true; }
      if(a.Y() - b.Y() < a.height/2 + b.height/2) { return true; }
    }
    // 1 disc 1 box
    else {
      function discobox(disc, box) {
        // centre of disc is within box
        if( box(disc.X(), box.X(), box.width, box.height) ) { return true; }
        // check centre of disc is with width/2 or height/2 of x,y
        // if(disc.X())
      }
      if(a.type == 'disc' && b.type == 'box') { discobox(a,b); }
      else { discobox(b,a); }
    }
    return false;
  }

  return {
    boxCollider : function(_position = {y:0,x:0}, _width = 0,_height = 0, _offset = {y:0,x:0}) {
      var _box = {};
      _box.position = _position;
      _box.width = _width;
      _box.height = _height;
      return _box;
    },
    discCollider : function(entity) {
      var _position = (entity.position != null) ? entity.position : {y:0,x:0},
          hasDisc   = (entity.collider != null),
          _radius   = (hasDisc && entity.collider.radius != null) ? entity.collider.radius : 0,
          _offset   = (entity.center != null) ? entity.center : {y:0,x:0},
          ID = -1;

      var _disc = {};
      _disc.type = 'disc';
      _disc.position = _position;
      _disc.offset   = _offset;
      _disc.radius   = _radius;
      _disc.X = function() { return _disc.position.x + _disc.offset.x; }
      _disc.Y = function() { return _disc.position.y + _disc.offset.y; }
      return _disc;
    },

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
    },
    add : function(collider) {
      // add the collider to our list, and use ID to tell whoever called it where it went
      colliders.push(collider);
      collider.ID = colliders.length-1;
    },
    remove : function(id) {
      colliders.splice(id, 1);
      for(var i = id; i < colliders.length; i++) { colliders[i].ID = i; }
    },
    check : function(a,b) {
      internalCheck(a,b);
    },
    checkAll : function(_collider) {
      for(var i = 0; i < colliders.length; i++) {
        // ignore the collider if it is our own
        if(_collider.ID == i) { continue; }
        else if(internalCheck(colliders[i], _collider)) {
          return true; }
      }
      return false;
    },
    collidersList : colliders
  }
});
