const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const main = (req,res) => res.sendFile(__dirname + '/public/index.html')

app.get('/', main);
app.get('/all', main);
app.get('/active', main);
app.get('/completed', main);

app.listen(8000, (err) => {
	if(err) {
		return 'An error has occured: ' + err.message;
	}
	console.log('Listening on port 8000!');
});