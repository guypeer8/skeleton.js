const fs = require('fs');
const scriptRE = /<script type="text\/javascript" src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/js-skeleton\/(\d\.\d\.\d)*\/skeleton\.js"><\/script>/gim;
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
	files.forEach(file => {
		let content = fs.readFileSync(file, 'utf-8');
		let reWrittenContent = content
								.replace(scriptRE, (str, match) => str.replace(match, version))
								.replace(titleRE, (str, match) => str.replace(match, version));
		fs.writeFileSync(file, reWrittenContent, 'utf-8');
	});
}

module.exports = setVersion;