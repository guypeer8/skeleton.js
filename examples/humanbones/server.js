var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req,res) {

	if(req.url === '/') {
		res.writeHead(200, {'Content-Type':' text/html'});
		res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
	}

	else if(req.url === '/style.css') {
		res.writeHead(200, {'Content-Type':'text/css'});
		res.end(fs.readFileSync(__dirname + '/style.css', 'utf-8'));
	}

	else if(req.url === '/humanbones.js') {
		res.writeHead(200, {'Content-Type':'text/javascript'});
		res.end(fs.readFileSync(__dirname + '/humanbones.js'), 'utf-8');
	}

	else
		res.end();

});

server.listen(8000, function(err) {
	if(err)
		return err;
	console.log('listeninig on port: 8000!');
});