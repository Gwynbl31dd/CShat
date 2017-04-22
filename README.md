# CShat
Real time chat using NodeJS

This chat is easy to integrate to your server.

Since 0.4.0 I added a rooms functionality You can add multiples rooms 
directly in app.js (server script)

Since 0.5.0, pictures upload is available. The pictures are not saved in the server, but sent 
through the sockets.

You can see a demo here :

	http://clone-soft.com:8000

1) Install nodeJS

	https://nodejs.org/en/download/package-manager/
	
2) Dowload the app package and send it to your server (Or personal computer).
	
	git clone https://github.com/Gwynbl31dd/CShat.git
	
3) Type (in the project folder): 

	npm install
	
4) Modify app.js with your domaine name/ip, port number.

	var portNumber = 8080,
	url = '127.0.0.1;

5) Start the server (in the project folder) using :

	node app.js

6) Enjoy !