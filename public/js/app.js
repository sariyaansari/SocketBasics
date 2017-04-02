var name   = getQueryVariable('name') || 'Anonymous';
var room   = getQueryVariable('room');
var socket = io();

jQuery('.room-title').text(room);

//It will be called when client connects to server
socket.on('connect', function() {
  console.log('Client side socket connect callback');
});

socket.on('messageIdServer', function(msg){
  var momentTimeStamp = moment.utc(msg.timeStamp);
  var $messages = jQuery('.messages');

  console.log('New message arrived:');
  console.log(msg.text);

  $messages.append('<p><strong>' + msg.name + ' ' + momentTimeStamp.local().format('h:mm a') + '</strong></p>');
  $messages.append('<p>' + msg.text + '</p>');
});

//extract form components from index.html
var $form = jQuery('#message-form');
//On clicking submit button perform below task
$form.on('submit', function(event) {
  event.preventDefault();
  //read text data from form representing textbox
  var $message = $form.find('input[name=message]');
  //send message to server to broadcast to all connected clients
  socket.emit('messageIdClient', {
    name: name,
    text: $message.val()
  });
  //clear text box after sending message
  $message.val('');
});
