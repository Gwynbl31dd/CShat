/**
 * @autor Paulin Anthony
 * @since 06/04/2017
 */
const express = require('express'),
	  app = express(),
	  server = require('http').createServer(app),
	  io = require('socket.io').listen(server),
	  ent = require('ent'), // Avoid HTML entities
	  path = require('path'),
	  ejs = require('ejs');//Template engine

var portNumber = 8080;

//rooms which are currently available in chat
var rooms = ['room1','room2','room3'];

//Load statics files
app.use(express.static(path.join(__dirname, 'public')));

// Load index.html
app.get('/', function (req, res) {
	res.render('index.ejs',{port:portNumber,rooms:rooms});
});

// Redirect to an error 404 if no page found
app.use(function(req,res){
	res.render('404.ejs');
});

io.sockets.on('connection', function (socket, login) {
    // while we get a login, save and send it
    socket.on('new_client', function(login){
        login = ent.encode(login);
        // store the login in the socket session for this client
        socket.login = login;
        // store the room name in the socket session for this client
		socket.room = 'room1';
		socket.join(socket.room);
		socket.broadcast.to(socket.room).emit('new_client', socket.login + ' is connected to this room');
        //socket.broadcast.emit('new_client', login);
        console.log('new user:'+login+'\n in room :'+socket.room);
    });
    
    // When get a message, get the login and send it
    socket.on('message', function (message) {
        message = ent.encode(message);
        //Replace caractere &#10; by a <br />
        message = message.replace(/&#10;/g, '<br/>');
        //Send the message to the room
        socket.broadcast.in(socket.room).emit('message', {login: socket.login, message: message});
        console.log('message '+message+'\n in room :'+socket.room);
    }); 
    
    socket.on('disconnect', function(){
		// echo globally that this client has left
		socket.broadcast.in(socket.room).emit('new_client', login + ' left this room');
		socket.leave(socket.room);
	});
    
    socket.on('switch', function(newroom){
    	//Send a message to the older room to say the client left
		socket.broadcast.in(socket.room).emit('new_client', socket.login + ' left this room');
		// leave the current room (stored in session)
		socket.leave(socket.room);
		// update socket session room title
		socket.room = newroom;
		// join new room, received as function parameter
		socket.join(socket.room);
		socket.broadcast.to(socket.room).emit('new_client', socket.login + ' is connected to this room');
	});
});

server.listen(portNumber);