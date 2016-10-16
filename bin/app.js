var express = require('express');
var app = express();
var path = require('path');

var http = require('http').Server(app);
var io = require('socket.io')(http);

var PLAYER_CLASSES = ["ranger","bard","cheesedwarf","rogue","dragonknight","pyromancer","druid"];

app.use(express.static(path.join(__dirname, '/../public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

io.on('connection', function(socket){
  console.log('a user has connected:\t\t'+socket.id);

  // send to all other sockets
  //count++;
  //socket.broadcast.emit('update', count);

  socket.on('disconnect', function(){
    console.log('a user has disconnected:\t'+socket.id);
  });
});

io.on('message', function(message) {
  console.log(message);
});

//app.listen ...
http.listen(process.env.PORT || 3000, function() {
  console.log(process.env.PORT);
  console.log("DON'T PANIC");
});
