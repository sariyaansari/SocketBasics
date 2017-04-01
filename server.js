var PORT    = process.env.PORT || 3000;
var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

//Socket on connection event
io.on('connection', function(socket){
  console.log('User connected via socket io');

  socket.on('messageIdClient', function(message){
    console.log('Client request to broadcast msg  : ' + message.text);
    
    //broadcast message excluding sender
    // socket.broadcast.emit('messageIdServer', message);

    //broadcasting messages including sender
    io.emit('messageIdServer', message);
  });

  //Send message to client when connected
  socket.emit('messageIdServer', {text: 'Welcome to the chat application'});
});

http.listen(PORT, function(){
  console.log('Server listen on PORT:' + PORT);
});
