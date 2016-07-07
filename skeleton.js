/*!
 * Skeleton JavaScript library v3.6.3
 * (c) Guy Peer
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

var Skeleton = (function() {

/*********
   Model
 *********/
function Model(attributes) {

	// Make sure initialized
	if(!(this instanceof Model)) {
		return new Model(attributes);
	}

	if(!(attributes && attributes.defaults)) {
		throw new Error('A "defaults" field must be passed') ;
	}

	// model class
	function model(options) {

		let _attrs = Object.assign({}, attributes.defaults) || {};

		this.get = function(attr) {
			return _attrs[attr] || null;
		}

		this.set = function() {
			if(arguments.length === 2) {
				_attrs[arguments[0]] = arguments[1];
			}
			else if(arguments.length === 1) {
				let obj = arguments[0];
				for(let key in obj) {
					_attrs[key] = obj[key];
				}
			}
			else {
				throw new Error('Error on setting a value');
			}
		}

		// get json representation of the model
		this.toJSON = function() {
			return _attrs;
		}

		// set attributes
		for(let opt in options) {
			this.set(opt, options[opt]);
		}

		// call init
		if(attributes && attributes.init) {
			attributes.init.call(this);
		}

	}

	// set additional methods to model
	for(let attr in attributes) {
		if(attr !== 'init' && attr !== 'defaults') {
			model.prototype[attr] = attributes[attr];
		}
	}

	return model;
}


/**********
    View
 **********/
 function List(attributes) {

 	// Make sure initialized
	if(!(this instanceof List)) {
		return new List(attributes);
	}

 	const re = /{{\s*((\w+\.?\w+?)*\s*\|?\s*\w+)\s*}}/g; 
 	const re_loop = /{{\s*#\s*((\w+\.?\w+?)*\s*\|?\s*\w+)\s*}}/g;

 	let _index = 0;
 	
 	let _listeners = { // Each array contains functions to run
 		push: [],
 		remove: [],
 		filter: [],
 		sort: [],
 		pushAll: [],
 		removeAll: [],
 		edit: []
 	};

 	let _customFilters = {
 		upper(txt) {
 			return txt.toUpperCase();
 		},
 		lower(txt) {
 			return txt.toLowerCase();
 		},
 		capitalize(txt) {
 			return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
 		},
 		currency(txt) {
 			return '$' + txt;
 		},
 		json(txt) {
 			try {
				txt = JSON.stringify(txt);
			}
			catch(e) {
				throw new Error('The argument passed can not be stringified to a json string');
			}
			return txt;		
 		}
 	}; 

 	let _model = attributes && attributes.model;
 	let _element = document.getElementById(attributes && attributes.element);
 	let _template;

 	if(attributes && attributes.template && attributes.templateId) {
 		throw new Error('Only "template" or "templateId" attribute should be supplied, not both');
 	}

 	if(!(attributes.template || attributes.templateId)) {
 		throw new Error('You must pass a template string, or a templateId of a template element');
 	}

 	if(attributes.template) { // Make it backward compatible
 		if(typeof(attributes.template) === 'string') {
 			_template = attributes.template;
 		}
 		else {
 			if(attributes.template.templateId) {
 				let el = document.getElementById(attributes.template.templateId);
 				if(!el) {
 					throw new Error('Please provide "templateId" attribute');
 				}
 				_template = el.innerHTML;
 			}
 		}
 	}

 	if(attributes.templateId) {
		let el = document.getElementById(attributes.templateId);
		if(!el) {
			throw new Error('Please provide "templateId" attribute');
		}
 		_template = el.innerHTML;
 	}

 	if(!_model) {
 		throw new Error('A model must be supplied');
 	}
 	if(!_element) {
 		throw new Error('An element must be supplied, provided by its id');
 	}
 	if(!_template) {
 		throw new Error('A template id or string must be supplied');
 	}

 	let self = this;

 	let _collection = {}; // {index: model}

 	// get collection of model types
 	this.getCollection = function() {
 		return Object.keys(_collection).map(index => _collection[index]);
 	}

 	// get collection of objects
 	this.models = function() {
 		return Object.keys(_collection).map(index => _collection[index].toJSON());
 	}

 	// append array of objects that
 	// represent models to the list
 	this.pushAll = function(models) {
 		if(!models || !Array.isArray(models)) {
 			throw new Error('pushAll method must receive an array as an argument');
 		}
 		models.forEach(model => {
 			model.index = _generateIndex();
 			_collection[model.index] = new _model(model);
 		});
 		_element.innerHTML += _renderTemplate();
 		_notifyListeners('pushAll', this.models());
 	}

 	// push to end of the list
 	this.push = function(model) {
 		if(!model) {
 			throw new Error('push method must receive a model as an argument');
 		}
		_addModel(model, 'push');
 	}

 	// push to begining of the list
 	this.unshift = function(model) {
 		if(!model) {
 			throw new Error('unshift method must receive a model as an argument');
 		}
 		_addModel(model, 'unshift');
 	}

 	// remove single model and return it
 	this.remove = function(index) {
 		if(!_collection[index]) {
 			return;
 		}
 		let model = _collection[index];
 		delete _collection[index];
 		_removeModelAndRender(index);
 		_notifyListeners('remove', model);
 		return model;
 	}

 	// get max index
 	this.lastIndex = function() {
 		if(this.size() === 0) {
 			return -1;
 		}
 		return _index-1;
 	}

 	// get min index
 	this.firstIndex = function() {
 		const indexes = Object.keys(_collection);
 		if(!indexes.length) {
 			return -1;
 		}
 		return Math.min.apply(null, indexes);
 	}

 	// clear list and notify listeners
 	this.removeAll = function() {
 		_collection = {};
 		_element.innerHTML = '';
 		_notifyListeners('removeAll');
 	}

 	// get model object by index
 	this.get = function(index) {
  		if(!_collection[index]) {
  			return null;
  		}
  		return _collection[index].toJSON();
 	}

 	// get model
 	this.getModel = function(index) {
  		if(!_collection[index]) {
  			return null;
  		}
  		return _collection[index];		
 	}

 	// get number of models in the list
 	this.size = function() {
 		return Object.keys(_collection).length;
 	}

 	// filter models and render
 	this.filter = function(cbk) {
 		let coll = this.models().filter(cbk);
 		_element.innerHTML = _renderTemplate(coll);
 		_notifyListeners('filter', coll);
 		return coll;
 	}

 	// sort models and render
 	this.sort = function(sorter) {
 		sorter = sorter || function(a,b){return a.index - b.index;};
 		let sorted = this.models().sort(sorter);
 		let sortedCollection = {};
 		sorted.forEach(model => {
 			sortedCollection[model.index] = _collection[model.index];
 		});
 		_collection = sortedCollection;
 		_element.innerHTML = _renderTemplate(sorted); // render
 		_notifyListeners('sort', sorted);
 		return sorted;
 	}

 	// go over models
 	this.forEach = function(cbk) {
 		this.models().forEach(cbk);
 	}

 	// edit a field in the model and replace it in the list
 	this.edit = function(index, options) {
 		if(!options) {
 			return;
 		}
 		let model = _collection[index];
 		for(let key in options) {
 			model.set(key, options[key]);
 		}
 		let modelJSON = model.toJSON();
 		let html = _renderLoop(_renderModel(modelJSON), modelJSON);
 		let newEl = _htmlToElement(html);
 		_replaceModel(index, newEl); // render
 		_notifyListeners('edit', modelJSON);
 	}

 	// add filter to be used by pipe in the template
 	this.addFilter = function(filterName, filterCbk) {
 		if(typeof(filterName) !== 'string') {
 			throw new Error('Filter name must be a string');
 		}
 		if(typeof(filterCbk) !== 'function') {
 			throw new Error('Filter callback must be a function');
 		}
 		_customFilters[filterName] = filterCbk;
 	}

 	// subscribe to event
 	this.subscribe = function() {
 		if(arguments.length === 1 && typeof(arguments[0]) === 'function') {
 			let listener = arguments[0];
 			_listeners['push'].push(listener);
 			_listeners['remove'].push(listener);
 			return () => { // unsubscription
 				unsubscribe('push', listener);
 				unsubscribe('remove', listener);
 			}
 		}
 		else if(arguments.length === 2) {
 			let type = arguments[0];
 			let listener = arguments[1];
 			if(Array.isArray(type)) {
 				type.forEach(t => {
	 	 			if(_listeners[t]) {
	 					_listeners[t].push(listener);		
	 				}	
	 				else {
	 					throw new Error('type ' + t + ' is not a possible type. possible types: "push", "remove", "filter", "sort", "edit", "pushAll", "removeAll"');
	 				}	
 				});
 				return () => type.forEach(t => unsubscribe(t, listener)) // unsubscription
 			}
 			else {
	 			if(_listeners[type]) {
	 				_listeners[type].push(listener);
		 			return () => unsubscribe(type, listener) // unsubscription
	 			}
 				throw new Error('type ' + type + ' is not a possible type. possible types: "push", "remove", "filter", "sort", "edit", "pushAll", "removeAll"');	
 			}
 		}
 		else {
 			throw new Error('You should pass a callback function or a type "push" or "remove" and a callback to subscribe');
 		}
 		// Give a way to unsubscribe
 		function unsubscribe(type, listener) {
			for(let i=0; i<_listeners[type].length; i++) {
				if(_listeners[type][i] === listener) {
					_listeners[type].splice(i,1);
					break;
				}
			}
		}
 	}

 	/****************************
 	    List Private Functions
 	 ***************************/
 	function _notifyListeners(type, param) {
 		if(!type) {
 			_listeners.push.forEach(listener => listener(param));
 			_listeners.remove.forEach(listener => listener(param));
 		}
 		else if(_listeners[type]) {
 			_listeners[type].forEach(listener => listener(param));
 		}
 		else {
 			throw new Error('The type passed is not a possible type');
 		}
 	}

 	function _addModel(model, method) {
  		if(!(model instanceof _model)) {
 			model = new _model(model);
 		}
 		let index = _generateIndex();
 		model.set('index', index);
 		let modelJSON = model.toJSON();
 		_collection[index] = model;
 		_updateSingleModelView(modelJSON, method);
 		_notifyListeners('push', modelJSON);
 	}

 	function _replaceModel(index, newEl) {
 		let attr = '[data-id="' + index + '"]';
 		let el = _element.querySelector(attr);
 		if(!el) {
 			throw new Error('Make sure your you set a "data-id" attribute to each model');
 		}
 		_element.replaceChild(newEl, el);
 	}

 	function _updateSingleModelView(model, method) {
 		let el = _htmlToElement(_renderLoop(_renderModel(model), model));
 		if(method === 'push') {
 			_element.appendChild(el);
 		}
 		else if(method === 'unshift') {
 			_element.insertBefore(el, _element.childNodes[0]);
 		}
 		else {
 			throw new Error('unknown method passed to "_updateSingleModelView"');
 		}
 	}

 	function _removeModelAndRender(index) {
 		let attr = '[data-id="' + index + '"]';
 		let el = _element.querySelector(attr);
 		if(!el) {
 			return;
 		}
 		el.remove();
 	}

 	function _renderTemplate(coll) {
 		let collection = coll || self.models();
 		let templateString = '';
 		collection.forEach(model => {
 			templateString += _renderLoop(_renderModel(model), model);
 		});
 		return templateString;
 	}

 	function _renderLoop(template, model) {
 		let el;
 		if(typeof(template) === 'string') {
 			el = _htmlToElement(template);
 		}
 		let domElements = el.querySelectorAll('[data-loop]');
 		if(!domElements || !domElements.length) // no data-loop
 			return template;
 		Array.prototype.slice.call(domElements).forEach((dElement,i) => {
	 		let attr = dElement.getAttribute('data-loop').trim();
	 		let arr = model[attr];
	 		if(!arr) { // no attribute in model
	 			throw new Error(attr + ' attribute does not appear in model');
	 		}
	 		if(!Array.isArray(arr)) {
	 			throw new Error(attr + '\'s value must be an array');
	 		}
	 		let dElementHtml = _elementToHtml(dElement);
	 		let temp = '';
	 		arr.forEach(obj => {
		 		temp += dElementHtml.replace(re_loop, (str,g) => {
		 			if(g.indexOf('|') !== -1) {
		 				return _filterize(obj, g);
		 			}
		 			return _resolveNestedObject(obj, g);
		 		});
	 		});
	 		template = template.replace(dElementHtml, temp);
	 	});
 		return template;
 	}

 	function _renderModel(model) {
 		let temp = _template;
 		temp = temp.replace(re, (str,g) => {
 			if(g.indexOf('|') !== -1) {
 				return _filterize(model, g);
 			}
 			return _resolveNestedObject(model, g);
 		});
 		temp = _evaluateChecked(model, temp);
 		temp = _evaluateHide(model, temp);
 		temp = _evaluateShow(model, temp);
 		temp = _evaluateStyle(model, temp);
 		temp = _evaluateClass(model, temp);
 		return temp;
 	}

 	function _filterize(model, g) {
		let parts = g.split('|');
		let txt = parts[0].trim();
		let filter = parts[1].trim();
		let txtToRender = _resolveNestedObject(model, txt); // resolve nested object
		if(!txtToRender) {
			throw new Error('Please check the expression "' + txt + '" you passed in the template');
		}
		if(_customFilters[filter]) {
			return _customFilters[filter](txtToRender);
		}
		throw new Error('The filter you are using does not exist. Please use "addFilter" function to create it.');
 	}

 	function _evaluateChecked(model, template) {
 		let element = _htmlToElement(template);
 		let checked = element.querySelectorAll('[data-checked]');
 		if(!checked || !checked.length) {
 			return template;
 		}
 		Array.prototype.slice.call(checked).forEach(el => {
 			let expression = el.getAttribute('data-checked').trim();
 			let isChecked = model[expression] ? true : false;
 			if(isChecked) {
 				el.setAttribute('checked', 'checked');
 			}
 			else {
 				if(el.getAttribute('checked')) {
 					el.removeAttribute('checked');
 				}
 			}
 		});
 		return _elementToHtml(element);
 	}

 	function _evaluateHide(model, template) {
 		let element = _htmlToElement(template);
 		let hidden = element.querySelectorAll('[data-hide]');
 		if(!hidden || !hidden.length) {
 			return template;
 		}
 		Array.prototype.slice.call(hidden).forEach(el => {
 			let expression = el.getAttribute('data-hide').trim();
 			let shouldHide = model[expression] ? true : false;
 			if(shouldHide) {
 				el.style.display = 'none';
 			}
 			else {
 				el.style.display = '';
 			}
 		});
 		return _elementToHtml(element);
 	}

 	function _evaluateShow(model, template) {
 		let element = _htmlToElement(template);
 		let shown = element.querySelectorAll('[data-show]');
 		if(!shown || !shown.length) {
 			return template;
 		}
 		Array.prototype.slice.call(shown).forEach(el => {
 			let expression = el.getAttribute('data-show').trim();
 			let shouldShow = model[expression] ? true : false;
 			if(shouldShow) {
 				el.style.display = '';
 			}
 			else {
 				el.style.display = 'none';
 			}
 		});
 		return _elementToHtml(element);
 	}

 	function _evaluateStyle(model, template) {
  		let element = _htmlToElement(template);
 		let styles = element.querySelectorAll('[data-style]');
 		if(!styles || !styles.length) {
 			return template;
 		}
 		Array.prototype.slice.call(styles).forEach(el => {
 			let styleString = el.getAttribute('data-style').trim();
 			let styleObj;
 			try {
 				styleObj = JSON.parse(styleString);
 			}
 			catch(e) {
 				throw new Error('data-style attribute must be passed as a stringified json object');
 			}
 			Object.keys(styleObj).forEach(style => {
	 			let parts = styleObj[style].split('?');
	 			if(parts.length !== 2) {
	 				throw new Error('data-style needs an expression to evaluate');
	 			}
	 			let expression = parts[0].trim();
	 			let evals = parts[1].split(':');
	 			if(evals.length !== 2) {
	 				throw new Error('Error on data-style attribute');
	 			}
	 			let styleToSet = model[expression] ? evals[0] : evals[1];
	 			el.style[style] = styleToSet;
	 		});
 		});
 		return _elementToHtml(element);		
 	}

 	function _evaluateClass(model, template) {
  		let element = _htmlToElement(template);
 		let classes = element.querySelectorAll('[data-class]');
 		if(!classes || !classes.length) {
 			return template;
 		}
 		Array.prototype.slice.call(classes).forEach(el => {
 			let classString = el.getAttribute('data-class').trim();
 			let classObj;
 			try {
 				classObj = JSON.parse(classString);
 			}
 			catch(e) {
 				throw new Error('data-class attribute must be passed as a stringified json object');
 			}
 			Object.keys(classObj).forEach(cls => {
 				let key = classObj[cls].trim();
 				let bool;
 				if(key.charAt(0) === '!') {
 					bool = !model[key.substring(1).trim()];
 				}
 				else {
 					bool = model[key];
 				}
 				if(bool) {
 					el.classList.add(cls);
 				}
 				else {
 					el.classList.remove(cls);
 				}
 			});
 		});
 		return _elementToHtml(element);		
 	}

 	function _resolveNestedObject(model, input) {
 		if(input === 'this') {
 			return model;
 		}
		let nestedObjectArray = input.split('.');
		if(nestedObjectArray.length === 1) {
			return model[input];
		}
		else {
			let txtToRender = model[nestedObjectArray[0].trim()];
			for(let i=1; i<nestedObjectArray.length; i++) {
				txtToRender = txtToRender[nestedObjectArray[i].trim()];
			}
			return txtToRender;
		}
 	}

 	function _generateIndex() {
 		return _index++;
 	}
}

function _elementToHtml(el) {
	let div = document.createElement('div');
	div.appendChild(el);
	return div.innerHTML;
}

function _htmlToElement(html) {
	let div = document.createElement('div');
	div.innerHTML = html;
	return div.firstElementChild;
}

/*******************
   Skeleton Router
 *******************/
function Router() {

	// Make sure initialized
	if(!(this instanceof Router)) {
		return new Router();
	}

	if(!window) {
		throw new Error('I only run on the browser!');
	}

	window.onpopstate = () => {
		return pathUpdated();
	}

	let params = {};
	let handlers = {};	

	const pathUpdated = () => {
		let handler;
		let match = 0;
		let path = location.pathname;
		let parts = path.split('/').slice(1); // get array of pathname parts

		for(let route in handlers) {
			if(match === 1) {
				break;
			}
			handler = handlers[route];
			route = route.split(',');
			if(route.length !== parts.length) {
				continue;
			}
			for(let i=0; i<route.length; i++) {
				let r = route[i];
				if(r.charAt(0) == ':') {
					match = 1;
					params[r.slice(1)] = parts[i];
				}
				else {
					if(r === parts[i]) {
						match = 1;
						continue;
					}
					else {
						match = 0;
						params = {};
						handler = null;
						break;
					}
				}
			}
		}

		if(!handler) {
			throw new Error('No handler set for this route!');
		}

		handler.call(null, params);
		params = {};
	}

	this.path = function(destination, handler) {
		handlers[destination.split('/').slice(1)] = handler;
	}

	this.visit = function(destination) {
		history.pushState(null,null,destination);
		return pathUpdated();
	}

}

/***************************************
    Skeleton Storage Helper Functions
 ***************************************/
function _stringifyValue(value) {
	try {
		value = JSON.stringify(value);
		return value;	
	}
	catch(e) {
		return value;
	}	
}

function _parseValue(value) {
	try {
		value = JSON.parse(value);
		return value;	
	}
	catch(e) {
		return value;
	}	
}

/***********************
    Skeleton Storage
 ***********************/
let storage = {
	save() {
	 	if(window.localStorage) {
	 		if(arguments.length === 2) {
	 			let key = arguments[0];
	 			let value = arguments[1];
	 			if(typeof(key) !== 'string') {
	 				throw new Error('First item must be a string');
	 			}
	 			value = _stringifyValue(value);
	 			window.localStorage.setItem(key, value);
	 		}
	 		else if(arguments.length === 1 && typeof(arguments[0]) === 'object') {
	 			let pairs = arguments[0];
	 			for(let key in pairs) {
	 				let value = pairs[key];
	 				value = _stringifyValue(value);
	 				window.localStorage.setItem(key, value);
	 			}
	 		}
	 		else {
	 			throw new Error('Method save must get key an value, or an object of keys and values');
	 		}
	 	}
	 },

	fetch(key) {
	 	if(window.localStorage) {
	 		let value = window.localStorage.getItem(key);
	 		if(!value) {
	 			return null;
	 		}
	 		return _parseValue(value);
	 	}
	 },

	clear() {
	 	if(window.localStorage) {
	 		window.localStorage.clear();
	 	}
	}
}

/*************************
    Skeleton Form/Input
 ************************/
let inputObservables = {}; // {id: element}
let formObservables = {}; // {name: observablesObject}

function input(id, cbk, evt='keyup') {
	let el = document.getElementById(id);
	if(!el) {
		throw new Error(`The id '${id}' does not match any dom element`);
	}
	if(el.nodeName !== 'INPUT' && el.nodeName !== 'TEXTAREA') {
		throw new Error(`The id '${id}' must match an input or textarea element`);
	}
	inputObservables[id] = el;
	if(cbk) {
		el.addEventListener(evt, cbk);
	}
}
input.get = (id) => {
	let el = inputObservables[id];
	if(!el) {
		throw new Error(`The id '${id}' was not set to be cached. Please use the 'input' function first`);
	}
	return el.value;
}

input.set = (id, val) => {
	let el = inputObservables[id];
	if(!el) {
		throw new Error(`The id '${id}' was not set to be cached. Please use the 'input' function first`);
	}
	el.value = val;
}

input.clear = (id) => {
	if(id) {
		inputObservables[id].value = '';
	}
	else {
		Object.keys(inputObservables).forEach(id => input.set(id, ''));
	}
}

function form(options) {
	if(!options.name) {
		throw new Error('Skeleton.form must recieve a "name" field with the form\'s name');
	}
	let name = options.name;
	let form = document.querySelector(`form[name='${name}']`);
	if(!form) {
		throw new Error('No form element with name ' + name);
	}
	let formObj = {};
	formObj.name = options.name;
	let inputs = options.inputs;
	if(inputs) {
		for(let key in inputs) {
			let id = inputs[key];
			let el = form.querySelector(`#${id}`);
			if(!el) {
				throw new Error('No element with id ' + id);
			}
			if(el.nodeName !== 'INPUT' && el.nodeName !== 'TEXTAREA') {
				throw new Error(`The id '${id}' must match an input or textarea element`);
			}
			formObj[key] = el;
		}
	}
	if(!options.submit) {
		throw new Error('"submit" button id or event key code and input field must be supplied');
	}
	if(!options.onSubmit) {
		throw new Error('"onSubmit" method must be supplied');
	}
	formObservables[name] = formObj; // set form to form observables
	if(options.submit.input && options.submit.keyCode) {
		let inputField = options.submit.input;
		let keyCode = options.submit.keyCode;
		if(!inputField) {
			throw new Error('Please supply input element to trigger submit event on by its field');
		}
		if(!keyCode) {
			throw new Error('Please supply keyCode to fire event on');
		}
		formObservables[name][inputField].addEventListener('keydown', (e) => {
			if(e.keyCode === keyCode) {
				e.preventDefault();
				options.onSubmit.call(formObservables[name], e);
			}
		});
	}
	else {
		let submitButton = document.getElementById(options.submit);
		if(!submitButton) {
			throw new Error('Id passed as submit button id does not exist');
		}
		submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			options.onSubmit.call(formObservables[name], e);
		});
	}
}

form.clear = (name) => {
	let obs = formObservables[name];
	if(!obs) {
		throw new Error(`The name ${name} is not recognized as a form name`);
	}
	for(let key in obs) {
		let el = obs[key];
		if(el.nodeName && (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA')) {
			el.value = '';
		}
	}
}

/********************
    Skeleton Bind
 ********************/
function bind(textNodeId) {
	let txtNode = document.getElementById(textNodeId);
	if(!txtNode) {
		throw new Error(textNodeId + ' id does not match any element');
	}
	return {
		to() {
			let ids = Array.prototype.slice.call(arguments);
			let inputElements = ids.map(inputElementId => {
				let inputNode = document.getElementById(inputElementId);
				if(!inputNode || !(inputNode.nodeName === 'INPUT' || inputNode.nodeName === 'TEXTAREA')) {
					throw new Error(inputElementId + ' id does not match any element or the element it matches is not input or textarea element');
				}	
				return inputNode;
			});
			return {
				exec(cbkFunc, evt='keyup') {
					for(let i=0; i<inputElements.length; i++) {
						let inputNode = inputElements[i];
						inputNode.addEventListener(evt, (e) => {
							let values = inputElements.map(el => {
								let value = el.value;
								if(!value) {
									return '';
								}
								return value;
							});
							txtNode.textContent = cbkFunc.apply(null, values);
						});
					}
				}
			}
		}
	}
}

/***************
  Skeleton Type
 ***************/
function Type() {

	// Make sure initialized
	if(!(this instanceof Type)) {
		return new Type();
	}

	this.arr = function(param) {
		return Array.isArray(param);
	}

	this.str = function(param) {
		return typeof(param) === 'string';
	}

	this.func = function(param) {
		return typeof(param) === 'function';
	}

	this.num = function(param) {
		return typeof(param) === 'number';
	}

	this.obj = function(param) {
		return Object.prototype.toString.call(param).indexOf('object') !== -1;
	}

	this.null = function(param) {
		return param === null;
	}

	this.undef = function(param) {
		return param === undefined;
	}

	this.none = function(param) {
		return this.null(param) || this.undef(param);
	}

	this.hex = function(param) {
		return /^#([0-9A-Z]{6}$|[0-9A-Z]{3}$)/i.test(param);
	}

	this.rgb = function(param) {
		return /^rgb\(\s*\w\s*\,\s*\w\s*\,\s*\w\s*\)/i.test(param);
	}

	this.rgba = function(param) {
		return /^rgba\(\s*\w\s*\,\s*\w\s*\,\s*\w\s*\)/i.test(param);
	}

	this.color = function(param) {
		return this.hex(param) || this.rgb(param) || this.rgba(param);
	}

	this.html = function(param) {
		return (param instanceof HTMLCollection) || (param instanceof NodeList);
	}
}

/****************
  Skeleton Popup
 ****************/
function Popup() {

	// Make sure initialized
	if(!(this instanceof Popup)) {
		return new Popup();
	}

	const self = this;

	let defaults = {
		overlay: {
			bgcolor:'black',
			opacity:'0.8'
		},
		popup: {
			width:'400',
			height:'400',
			bgcolor:'white'
		}
	};

	this.setDefaults = function(overrides) {
		let { overlay, popup } = overrides;
		if(overlay) {
			for(let key in overlay) {
				defaults.overlay[key] = overlay[key];
			}
		}
		if(popup) {
			for(let key in popup) {
				defaults.popup[key] = popup[key];
			}			
		}
	}

	this.open = function(template, model) {
		if(document.getElementById('skeleton-popup')) {
			this.close();
		}
		this.openOverlay();
		document.body.innerHTML += template;

		document.getElementById('skeleton-overlay').addEventListener('click', self.close);
		switch(model.type) {
			case 'confirm':
				document.getElementById('confirm-yes-label').addEventListener('click', model.approve);
				document.getElementById('confirm-no-label').addEventListener('click', model.regret);
				break;
			case 'message':	
				document.getElementById('close-message-popup').addEventListener('click', self.close);		
				break;
			default:	
				throw new Error('Only confirm and message popups are supported');
		}
	}

	this.close = function() {
		let popup = document.getElementById('skeleton-popup');
		if(!popup) {
			return;
		}
		if(document.getElementById('skeleton-overlay')) {
			self.closeOverlay();
		}
		popup.remove();
	}

	this.openOverlay = function() {
		let { bgcolor, opacity } = defaults.overlay;
		let template = `<div id='skeleton-overlay' style='background-color: ${bgcolor}; opacity: ${opacity}; height: 100%; width: 100%; position: fixed; top: 0; left: 0; bottom: 0; right: 0;'></div>`;
        document.body.innerHTML += template;
	}

	this.closeOverlay = function() {
		let overlay = document.getElementById('skeleton-overlay');
		if(!overlay) {
			return;
		}
		overlay.remove();
	}

	this.message = function(model) { // height,width,title,body,closeMessage
		let height = model.height || defaults.popup.height;
		let width = model.width || defaults.popup.width;
		let bgcolor = defaults.popup.bgcolor || 'white';
		let closeMsg = model.closeMessage || 'Close';
		let template = [
			`<div id="skeleton-popup" style="height: ${height}px; width: ${width}px; background-color: ${bgcolor}; z-index: 100; position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto;">`,
				`<h2>${model.title}</h2>`,
				`<p>${model.body}</p>`,
				`<button id="close-message-popup">${closeMsg}</button>`,
			`</div>`
		].join('');

		model.type = 'message';
		this.open(template, model);
	}

	this.confirm = function(model) { // height,width,hasClose,title,body,yesLabel,noLabel,approve,regret
		let height = model.height || defaults.popup.height;
		let width = model.width || defaults.popup.width;
		let bgcolor = defaults.popup.bgcolor || 'white';
		let yesLabel = model.yesLabel || 'Yes';
		let noLabel = model.noLabel || 'No';
		let template = [
			`<div id="skeleton-popup" style="height: ${height}px; width: ${width}px; background-color: ${bgcolor}; z-index: 100; position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto;">`,
				`<h2>${model.title}</h2>`,
				`<p>${model.body}</p>`,
				`<button id="confirm-yes-label">${yesLabel}</button>`,
				`<button id="confirm-no-label">${noLabel}</button>`,
			`</div>`
		].join('');

		model.type = 'confirm';
		this.open(template, model);
	}

}

/****************
  Skeleton Event
 ****************/
function Event() {

	// Make sure initialized
	if(!(this instanceof Event)) {
		return new Event();
	}

	let handlers = {};

	this.on = function(evt, handler) {
		if(handlers[evt]) {
			handlers[evt].push(handler);
		}
		else {
			handlers[evt] = [handler];
		}
	}

	this.dispose = function(evt) {
		if(!handlers[evt]) {
			return;
		}
		delete handlers[evt];
	}

	this.emit = function(evt) {
		if(!evt) {
			throw new Error('First argument must be an event');
		}
		if(!handlers[evt]) {
			throw new Error(`No handler for '${evt}' event!`);
		}
		let data = [];
		if(arguments.length > 1) {
			data = Array.prototype.slice.call(arguments, 1);
		}
		handlers[evt].forEach(handler => handler.apply(null, data));
	}

}

/*************************
  Skeleton Online/Offline
 *************************/
function network(onoff) {
	if(typeof(onoff) !== 'object') {
		throw new Error('The parameter provided to "Skeleton.network" must be an object');
	}
	let { online, offline } = onoff;
	if(!online) {
		online = {};
	}
	if(!offline) {
		offline = {};
	}

	const offLineElement = document.createElement('div');
	const messageOffline = document.createTextNode(offline.message || 'Lost Internet Connection...');
	offLineElement.appendChild(messageOffline);
	offLineElement.id = "skeleton-offline-popup";
	Object.assign(offLineElement.style, {
		position: 'fixed',
		zIndex: 1000,
		padding: '15px',
		left: 0,
		right: 0,
		opacity: 1,
		width: offline.width || '100%',
		height: offline.height || '60px',
		color: offline.color || 'black',
		textAlign: offline.textAlign || 'center',
		backgroundColor: offline.backgroundColor || '#c61313',
		fontSize: offline.fontSize || '20px',
		fontWeight: offline.fontWeight || '700',
		fontFamily: offline.fontFamily || 'Verdana, sans-serif',
		border: offline.border || 'none'
	});
	if(!offline.position || (offline.position && offline.position.trim() === 'top')) {
		offLineElement.style.top = 0;
	}
	else {
		if(offline.position === 'middle') {		
			Object.assign(offLineElement.style, {
				top: 0,
				bottom: 0,
				margin: 'auto'
			});		
		}
		else if(offline.position === 'bottom') {
			offLineElement.style.bottom = 0;					
		}
		else {
			throw new Error('position can be "top", "bottom" or "middle"');
		}
	}
	window.addEventListener('offline', () => {
		const onlinePopup = document.getElementById('skeleton-online-popup');
		if(onlinePopup) {
			onlinePopup.remove();
		}
		document.body.insertBefore(offLineElement, document.body.childNodes[0]);
	});

	const onLineElement = document.createElement('div');
	const messageOnline = document.createTextNode(online.message || 'Internet Connection is back');
	onLineElement.appendChild(messageOnline);
	onLineElement.id = "skeleton-online-popup";
	Object.assign(onLineElement.style, {
		position: 'fixed',
		zIndex: 1000,
		padding: '15px',
		left: 0,
		right: 0,
		opacity: 1,
		width: online.width || '100%',
		height: online.height || '60px',
		color: online.color || 'white',
		textAlign: online.textAlign || 'center',
		backgroundColor: online.backgroundColor || '#328134',
		fontSize: online.fontSize || '20px',
		fontWeight: online.fontWeight || '700',
		fontFamily: online.fontFamily || 'Verdana, sans-serif',
		border: online.border || 'none'
	});
	if(!online.position || (online.position && online.position.trim() === 'top')) {
		onLineElement.style.top = 0;
	}
	else {
		if(online.position === 'middle') {
			Object.assign(onLineElement.style, {
				top: 0,
				bottom: 0,
				margin: 'auto'
			});			
		}
		else if(online.position === 'bottom') {
			onLineElement.style.bottom = 0;;					
		}
		else {
			throw new Error('position can be "top", "bottom" or "middle"');
		}
	}
	window.addEventListener('online', () => {
		const offlinePopup = document.getElementById('skeleton-offline-popup');
		if(offlinePopup) {
			offlinePopup.remove();
		}
		let element = onLineElement.cloneNode(true);
		document.body.insertBefore(element, document.body.childNodes[0]);
		const el = document.getElementById('skeleton-online-popup');
		window.setTimeout(() => {
			const interval = window.setInterval(() => {
				if(el.style.opacity <= 0) {
					window.clearInterval(interval);
					el.remove();
				}
				el.style.opacity -= 0.15;
			}, 120);
		}, 2000);
	});
}

/******************
  Skeleton Cookies
 ******************/
function cookies() {
	const cookies = document.cookie;
	const keyValueArray = cookies.split(';');
	let cookiesObject = {};
	keyValueArray.forEach(pair => {
		let splited = pair.split('=');
		if(splited.length === 2) {
			cookiesObject[splited[0].trim()] = splited[1].trim();
		}
	});
	return cookiesObject;
}

cookies.get = function(cookieName) {
	let cookieObj = cookies();
	if(cookieObj[cookieName]) {
		return cookieObj[cookieName];
	}
	return null;
}

cookies.set = function(cookieName, cookieValue, expirationDays=1) {
	const d = new Date();
    d.setTime(d.getTime() + (expirationDays*24*60*60*1000));
    const expires = "expires="+ d.toUTCString();
    document.cookie = `${cookieName}=${cookieValue};${expires}`;
}

cookies.delete = function(cookieName) {
	document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
}

/********************
  Skeleton Component
 ********************/
// const re = /{{\s*((\w+\.?\w+?)*\s*\|?\s*\w+)\s*}}/g; 
// const re_event = /(\w+="\w+")/g;
// function Component(selector, { template, methods }) {
// 	if(!selector) {
// 		throw new Error('A component tag name must be provided as first parameter');
// 	}
// 	if(!template || typeof(template) !== 'string') {
// 		throw new Error('A template string must be provided');
// 	}
// 	const elements = document.querySelectorAll(selector);
// 	if(!elements) {
// 		return;
// 	}
// 	let componentObject = {};
// 	elements.forEach(el => {
// 		let _template = template;
// 		_template = _template.replace(re, (str, match) => {
// 			let prop = el.getAttribute(match);
// 			if(!prop) {
// 				return str;
// 			}
// 			componentObject[match] = prop;
// 			return prop;
// 		});
// 		el.innerHTML = _template;
// 	});
// }

// Skeleton.Component('person', {
// 	template: `<div>{{ name }}</div>
// 			   <div @click="log">{{ age }}</div>`,
// });

/************
    Return
 ************/
return {
	Model,
	List,
	Router,
	Event,
	Popup,
	Type,
	// Component,
	network,
	storage,
	cookies,
	form, 
	input,
	bind
}

})();