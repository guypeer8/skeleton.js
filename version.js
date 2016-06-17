const fs = require('fs');
const script = '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/js-skeleton/(version)/skeleton.js"></script>';
const scriptRE = /<script type="text\/javascript" src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/js-skeleton\/(\d\.\d\.\d)*\/skeleton\.js"><\/script>/gim;
const title = 'Skeleton JavaScript library v(version)';
const titleRE = /Skeleton JavaScript library v(\d\.\d\.\d)*/gm;
const { version } = require('./package.json');
const files = [
	'./skeleton.js',
	'./examples/humanbones/index.html', 
	'./examples/microblog/index.html',
	'./examples/TodoMVC/public/index.html',
	'./examples/TodoMVC/public/AllScriptsTogether.html'
]

const setVersion = () => {
	const updatedScript = script.replace('(version)', version);
	const updatedTitle = title.replace('(version)', version);
	files.forEach(file => {
		let content = fs.readFileSync(file, 'utf-8');
		let reWrittenContent = content
								.replace(scriptRE, (str, match) => updatedScript)
								.replace(titleRE, (str, match) => updatedTitle);
		fs.writeFileSync(file, reWrittenContent, 'utf-8');
	});
}

module.exports = setVersion;