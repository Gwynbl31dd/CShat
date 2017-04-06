/**
 * http://usejsdoc.org/
 */
// Connection to socketIO
var socket = null;
var d, h, m;
var $messages = $('.messages-content');
	
//Get the focus of the windows (for the little "ding" song)
$(window).focus(function() {
    window_focus = true;
}).blur(function() {
    window_focus = false;
});

$(window).load(function() {
	$messages.mCustomScrollbar();
});

function cshat(url){
	//Initialise the connection
	socket = io(url);
	socket.emit('new_client', login);

	// Quand on recoit un message, on l'insère dans la page
	socket.on('message', function(data) {
	//If the windows doesn't have the focus, play a song
		if(!window_focus){
			new Audio('/sound/ding.wav').play();
		}
		$('<div class="message new"><figure class="avatar"><img src="/picture/default.png" /></figure>' + data.message + '</div>').appendTo($('.mCSB_container')).addClass('new');
		updateScrollbar();
	});

	// When a new client is connected, send it (TODO)
	socket.on('nouveau_client', function(login) {
		$('#zone_chat').prepend('<p><em>' + login + ' a rejoint le Chat !</em></p>');
	});

	// When we send the form, tranfer it and send it to the view
	$('#formulaire_chat').submit(function () {
		var message = $('#message').val();
		socket.emit('message', message); // Send the message to others
		$('<div class="message message-personal">' + message + '</div>').appendTo($('.mCSB_container')).addClass('new');
		setDate();
		$('#message').val(null);
		updateScrollbar();
		return false; // Don't send the "classical" form
	});
	//Set the date for the message
	function setDate(){
		d = new Date()
		if (m != d.getMinutes()){
			m = d.getMinutes();
			$('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
		}
	};
	//Update the scrollbar.
	function updateScrollbar() {
		$messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
			scrollInertia: 10,
			timeout: 0
		});
	};
};
