var PORT    = process.env.PORT || 3000;
var moment  = require('moment');
var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers(socket) {
  var info = clientInfo[socket.id];
  var users = [];

  if (info === undefined) {
    return;
  }

  Object.keys(clientInfo).forEach(function(socketId) {
    var userInfo = clientInfo[socketId];
    if (info.room === userInfo.room) {
      users.push(userInfo.name);
    }
  });

  socket.emit('messageIdServer', {
    name: 'System',
    text: 'Current Users ' + users.join(', '),
    timestamp: moment().valueOf()
  });
}

//Socket on connection event
io.on('connection', function(socket){
  console.log('User connected via socket io');

  socket.on('disconnect', function() {
    var userData = clientInfo[socket.id];
    if (typeof userData !== 'undefined') {
      socket.leave(userData.room);
      io.to(userData.room).emit('messageIdServer', {
        name: 'System',
        text: userData.name + ' has left!',
        timestamp: moment().valueOf()
      });
      delete clientInfo[socket.id];
    }
  });

  socket.on('joinRoom', function(req) {
    clientInfo[socket.id] = req;
    socket.join(req.room);
    socket.broadcast.to(req.room).emit('messageIdServer', {
      name: 'System',
      text: req.name + ' has joined!',
      timestamp: moment().valueOf()
    });
  });

  socket.on('messageIdClient', function(message){
    console.log('Client request to broadcast msg:' + message.text);

    if (message.text === '@currentUsers') {
      sendCurrentUsers(socket);
    } else {
      /** broadcasting messages including sender */
      message.timeStamp = moment().valueOf();
      io.to(clientInfo[socket.id].room).emit('messageIdServer', message);
    }
  });

  //Send message to client when connected
  socket.emit('messageIdServer', {
    name: 'System',
    text: 'Welcome to the chat application',
    timestamp: moment.valueOf()
  });
});

http.listen(PORT, function(){
  console.log('Server listen on PORT:' + PORT);
});
