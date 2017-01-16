var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var msgs = [];
var chatApp = {
  "users": [],
  "typing": []
};

app.use('/static', express.static(__dirname + '/node_modules'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

  console.log('a user connected');

  io.emit('load history', msgs);

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
    msgs.push(msg);
  });

  socket.on('is typing', function(user) {
    var index = chatApp.typing.indexOf(user.user);

    if (index == -1 && user.on) {
      chatApp.typing.push(user.user);
    }

    if (index != -1 && !user.on) {
      chatApp.typing.splice(index, 1);
    }
    
    io.emit('is typing', chatApp.typing);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
