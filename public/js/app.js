var socket = io();

socket.on('connect', function() {
  console.log('Client side socket connect callback');
});

socket.on('messageIdServer', function(msg){
  console.log('New message arrived:');
  console.log(msg.text);
});

//extract form components from index.html
var $form = jQuery('#message-form');

//On clicking submit button perform below task
$form.on('submit', function(event) {
  event.preventDefault();
  //read text data from form representing textbox
  var $message = $form.find('input[name=message]');
  //send message to server to broadcast to all connected clients
  socket.emit('messageIdClient', {text: $message.val()});
  //clear text box after sending message
  $message.val('');
});
