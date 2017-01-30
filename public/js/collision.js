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
        var halfW = box.width/2,
            halfH = box.height/2;
        // centre of disc is within box \ overlaps sides
        if( Math.abs(disc.X()-box.X()) < halfW
            && Math.abs(disc.Y()-box.Y()) < halfH+disc.radius) { return true; }
        if( Math.abs(disc.Y()-box.Y()) < halfH
            && Math.abs(disc.X()-box.X()) < halfW+disc.radius) { return true; }
        // check centre of disc is radius away from nearest corner
        var halfWidth = box.width/2;
            x = Math.min(Math.abs(disc.X()-(box.X()+halfW)), Math.abs(disc.X()-(box.X()-halfW))), // optimise?
            y = Math.min(Math.abs(disc.Y()-(box.Y()+halfH)), Math.abs(disc.Y()-(box.Y()-halfH))); // optimise?
        if( Math.pow(x,2)+Math.pow(y,2) < Math.pow(disc.radius,2) ) { return true; }
      }
      if(a.type == 'disc' && b.type == 'box') { return discobox(a,b); }
      else { return discobox(b,a); }
    }
    return false;
  }

  function _rawBoxCollider (_position, _offset, _width, _height) {
    var _box = {};
    _box.type = 'box';
    _box.position = _position;
    _box.offset   = _offset;
    _box.width    = _width;
    _box.height   = _height;
    _box.X = function() { return _box.position.x + _box.offset.x; }
    _box.Y = function() { return _box.position.y + _box.offset.y; }
    _box.ID = -1;
    return _box;
  }

  function _rawDiscCollider (_position, _offset, _radius) {
    var _disc = {};
    _disc.type = 'disc';
    _disc.position = _position;
    _disc.offset   = _offset;
    _disc.radius   = _radius;
    _disc.X = function() { return _disc.position.x + _disc.offset.x; }
    _disc.Y = function() { return _disc.position.y + _disc.offset.y; }
    _disc.ID = -1;
    return _disc;
  }

  return {
    boxCollider : function(entity, collider) {
      if(collider == null) { collider = entity.collider; }

      var _position = (entity.position != null) ? entity.position : {y:0,x:0},
          hasBox    = (entity.collider != null),
          _width    = (hasBox && collider.width != null) ? collider.width : 0,
          _height   = (hasBox && collider.height != null) ? collider.height : 0,
          _offset   = (hasBox && collider.centre != null) ? collider.centre : {y:0,x:0};
      return _rawBoxCollider(_position, _offset, _width, _height);
    },
    rawBoxCollider : function (_position, _offset, _width, _height) {
      return _rawBoxCollider(_position, _offset, _width, _height);
    },
    discCollider : function(entity, collider) {
      if(collider == null) { collider = entity.collider; }

      var _position = (entity.position != null) ? entity.position : {y:0,x:0},
          hasDisc   = (collider != null),
          _radius   = (hasDisc && collider.radius != null) ? collider.radius : 0,
          _offset   = (hasDisc && collider.centre != null) ? collider.centre : {y:0,x:0};
      return _rawDiscCollider(_position, _offset, _radius);
    },
    rawDiscCollider : function (_position, _offset, _radius) {
      return _rawDiscCollider(_position, _offset, _radius);
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
      if(collider == null) { return; }
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
