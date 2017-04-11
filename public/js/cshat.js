// Connection to socketIO
var socket = null;
var d, h, m;
var $messages = $('.messages-content');
var room = 'room1';
//Get the focus of the windows (for the little "ding" song)
$(window).focus(function() {
    window_focus = true;
}).blur(function() {
    window_focus = false;
});

$(window).load(function() {
	$messages.mCustomScrollbar();
});

/**
 * Start the chat
 * @constructor
 * @param url - Url of the server
 */
function cshat(url){
	//Initialise the connection
	socket = io(url);
	socket.emit('new_client', login);
	$('#room_name').text(room);
	/**
	 * When we receive a message
	 */
	socket.on('message', function(data) {
	//If the windows doesn't have the focus, play a song
		if(!window_focus){
			new Audio('/sound/ding.wav').play();
		}
		$('<div class="message new"><figure class="avatar"><img src="/picture/default.png" /></figure>' + data.message + '</div>').appendTo($('.mCSB_container')).addClass('new');
		updateScrollbar();
	});

	// When a new client is connected, send it
	socket.on('new_client', function(login) {
		$('<div class="message new"><p><em>' + login + '</em></p></div>').appendTo($('.mCSB_container')).addClass('new');
	});

	// When we send the form, tranfer it and send it to the view
	$('#formulaire_chat').submit(function () {
		sendMessage();
		return false; // Don't send the "classical" form
	});
	
	// When we send the form, tranfer it and send it to the view
	$('#switch').submit(function () {
		room = $('#select').val();
		console.log('room selected :'+room);
		//Send the value to change the room
		socket.emit('switch', room);
		console.log('switch to room :'+room);
		$('#room_name').text(room);
		$('<div class="message message-personal">Go to room '+room+'</div>').appendTo($('.mCSB_container')).addClass('new');
		setDate();
		updateScrollbar();
		return false; // Don't send the "classical" form
	});
	
	//if keys pressed
	$('#message').bind("enterKey",function(e){
		sendMessage();
	});
	
	//Create custom event to get keys
	$('#message').keyup(function(e){
		//Check if shift key is not pressed at the same time
	    if(!e.shiftKey &&e.keyCode == 13)
	    {
	        $(this).trigger("enterKey");
	    }
	});
	
	/**
	 * Set the message date
	 */
	function setDate(){
		d = new Date()
		if (m != d.getMinutes()){
			m = d.getMinutes();
			$('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
		}
	};
	/**
	 * Update the scrollbar
	 */
	function updateScrollbar() {
		$messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
			scrollInertia: 5,
			timeout: 0
		});
	};
	/**
	 * Send the message
	 */
	function sendMessage(){
		//Check if textarea value is not just blank spaced
		if ($.trim($("#message").val())) {
			var message = $('#message').val();
			socket.emit('message', message); // Send the message to others
			//Add the message to the personnal message (And replace the \n by <br/>
			$('<div class="message message-personal">' + message.replace(/\n/g, '<br/>') + '</div>').appendTo($('.mCSB_container')).addClass('new');
			setDate();
			$('#message').val(null);
			updateScrollbar();
		}
	}
};
