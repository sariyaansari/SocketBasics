var PORT    = process.env.PORT || 3000;
var moment  = require('moment');
var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

//Socket on connection event
io.on('connection', function(socket){
  console.log('User connected via socket io');

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
    /** broadcasting messages including sender */
    message.timeStamp = moment().valueOf();
    io.to(clientInfo[socket.id].room).emit('messageIdServer', message);
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
