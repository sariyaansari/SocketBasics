var socket = io();

socket.on('connect', function() {
  console.log('Client side socket connect callback');
});
