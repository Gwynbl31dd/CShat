var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Avoid HTML entities
    path = require('path');
//Load statics files
app.use(express.static(path.join(__dirname, 'public')));
// Load index.html
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/index.html');
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
        socket.broadcast.emit('message', {login: socket.login, message: message});
        console.log('message '+message);
    }); 
});

server.listen(8080);