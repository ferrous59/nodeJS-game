var express = require('express');
var app = express();
var path = require('path');

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, '/../public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../publc/index.html'));
});

// FUTURE stuff - the system isn't going to check for no clipping hackers as of yet...
// not true entities - mererly structs with data
var entities = [];
io.on('connection', function(socket){
  console.log('a user has connected:\t\t'+socket.id);

  // a bit clumsy
  socket.on('requestID', function() {
    // emits to ONLY the new socket
    id = entities.length;
    for(var i = entities.length-1; i > -1; i--) {
      // will go from length to 0
      if(entities[i] == null) { id = i; } // exit for loop
    }

    entities[id] = socket.id;
    socket.emit('assignID', id);
    socket.broadcast.emit('changeEntity', id, 'unknown');
    console.log('user ' + socket.id + ' has been given id: ' + id);
  });

  socket.on('message', function(message) {
    console.log(message);
  });

  socket.on('updateEntity', function(id, pos, anim) {
    socket.broadcast.emit('updateEntity', id, pos, anim);
  });

  socket.on('changeEntity', function(id, name) {
    socket.broadcast.emit('changeEntity', id, name);
  });

  socket.on('nullEntity', function(id, name) {
    socket.broadcast.emit('nullEntity', id, name);
  });

  socket.on('forceUpdate', function() {
    socket.broadcast.emit('forceUpdate');
  });

  socket.on('disconnect', function() {
    // remove the disconnected player's entity
    for(var j = 0; j < entities.length; j++ ) {
      if(entities[j] === socket.id) {
        entities[j] = null;
        io.emit('nullEntity', j);
      }
    }
    console.log('a user has disconnected:\t'+socket.id);
  });
});

//app.listen ...
http.listen(process.env.PORT || 3000, function() {
  console.log(process.env.PORT);
  console.log("DON'T PANIC");
});
