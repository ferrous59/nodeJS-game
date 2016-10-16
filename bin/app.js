var express = require('express');
var app = express();
var path = require('path');

var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(path.join(__dirname, '/../public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../publc/index.html'));
});

// temporary
var truePos = 0;
io.on('connection', function(socket){
  console.log('a user has connected:\t\t'+socket.id);

  //setInterval(function(){ io.emit('message', 'welcolme, newcomer'); }, 3000);
  setInterval(function() {
    if(truePos <= 50 ){
    truePos += 1;
    io.emit('moveCharTo', truePos);
  }
  },200);
  //temporaty
  socket.on('moveChar', function (x) {
    if(truePos >= 0) truePos += x;
    io.emit('moveCharTo', truePos);
  });

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
