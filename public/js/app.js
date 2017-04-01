var socket = io();

socket.on('connect', function() {
  console.log('Client side socket connect callback');
});

socket.on('messageIdServer', function(msg){
  console.log('New message arrived:');
  console.log(msg.text);
});
