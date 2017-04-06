# CShat
Real time chat using NodeJS

This chat is easy to integrate to your server.
This is a project in dev. At the moment only message and login are available.

1) Install nodeJS

	https://nodejs.org/en/download/package-manager/

2) Dowload the app package and send it to your server (Or personal computer).
	
	git clone https://github.com/Gwynbl31dd/CShat.git

3) Type (in the project folder): 

	node install

4) Modify views/index.ejs and app.js with your domaine name,ip, port number.

For views/index.ejs :

	cshat('http://localhost:<%= port %>');
	
For app.js :

	var portNumber = 8080;
	
5) Start the server (in the project folder) using :

	node app.js
	
6) Enjoy !