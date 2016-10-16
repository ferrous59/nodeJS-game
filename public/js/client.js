/*automatic: var socket = io.connect('http://localhost:3000');*/
socket.on('connect', function() {
  console.log('client connected');
});

socket.on('update', function(text) {
  console.log(text);
});

socket.on('message', function(message) {
  console.log(message);
});
