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

//Load statics files
app.use(express.static(path.join(__dirname, 'public')));

// Load index.html
app.get('/', function (req, res) {
	res.render('index.ejs',{port:portNumber});
});

// Redirect to an error 404 if no page found
app.use(function(req,res){
	res.render('404.ejs');
});

io.sockets.on('connection', function (socket, login) {
    // while we get a login, save and send it
    socket.on('new_client', function(login){
        login = ent.encode(login);
        socket.login = login;
        socket.broadcast.emit('new_client', login);
        console.log('new user');
    });
    // When get a message, get the login and send it
    socket.on('message', function (message) {
        message = ent.encode(message);
        //Replace caractere &#10; by a <br />
        message = message.replace(/&#10;/g, '<br/>');
        socket.broadcast.emit('message', {login: socket.login, message: message});
        console.log('message '+message);
    }); 
});

server.listen(portNumber);