const fs = require('fs');
const tag = '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/js-skeleton/(version)/skeleton.js"></script>';
const scriptRE = /<script type="text\/javascript" src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/js-skeleton\/(\d\.\d\.\d)*\/skeleton\.js"><\/script>/gim;
const files = [
	'./examples/humanbones/index.html', 
	'./examples/microblog/index.html',
	'./examples/TodoMVC/public/index.html',
	'./examples/TodoMVC/public/AllScriptsTogether.html'
]

const setVersion = () => {
	const version = JSON.parse(fs.readFileSync('./package.json', 'utf-8')).version;
	const updatedScript = tag.replace('(version)', version);
	files.forEach(file => {
		let content = fs.readFileSync(file, 'utf-8');
		let reWrittenContent = content.replace(scriptRE, (str, match) => updatedScript);
		fs.writeFileSync(file, reWrittenContent, 'utf-8');
	});
}

module.exports = setVersion;