var currentUser; 

$(document).ready(function() {
	//Get username
	$.ajaxSetup({ async: false });	
	$.get('/chat/getUsername', function(data) {
		currentUser = data.username;
	});
	$.ajaxSetup({ async: true });
	
	var socket = io.connect('http://projects-80400.use1.nitrousbox.com/');
	
	socket.emit('login', { username: currentUser });
	
	$('.send_message_chat').on('submit', function(e) {
		e.preventDefault();
		console.log(currentUser);
		if (!currentUser)
			return false;
		console.log("Entre");
		socket.emit('send message', { from: currentUser, msg: $('#new_message_chat').val(), to: $('#to_user_chat').val() });
		$('#to_user_chat').val('');
		$('#new_message_chat').val('');
		return false;
	});
	
	$('#button_send_new_message').on('click', function(e) {
		e.preventDefault();
		if (!currentUser)
			return false;
		
		socket.emit('send message', { from: currentUser, msg: $('#new_message_new_message').val(), to: $('#to_user_new_message').val() });
		$('#new_message_new_message').val('');
		$('#to_user_new_message').val('');
		$('#new_message_modal').modal('hide');
	});
	
	$('.conversation').on('click', function() {
		$('#all_conversations').hide('slow', function() {
			$('#specific_conversation').show('slow', function() {
				//Termino de mostrar una conversación específica
			});
		});
	});
	
	socket.on('my message', function(data) {
		$('.messages').append('<p>Yo: ' + data + '</p>');
	});
	
	socket.on('receive message', function(data) {
		$('.messages').append('<p>'+ data.username + " dice: " + data.msg + '</p>');
	});
});