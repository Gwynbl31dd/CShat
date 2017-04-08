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

/**
 * Start the chat
 * @constructor
 * @param url - Url of the server
 */
function cshat(url){
	//Initialise the connection
	socket = io(url);
	socket.emit('new_client', login);

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

	// When a new client is connected, send it (TODO)
	socket.on('nouveau_client', function(login) {
		$('#zone_chat').prepend('<p><em>' + login + ' a rejoint le Chat !</em></p>');
	});

	// When we send the form, tranfer it and send it to the view
	$('#formulaire_chat').submit(function () {
		sendMessage();
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
