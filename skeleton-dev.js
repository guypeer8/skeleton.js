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
		throw new Error('A "defaults" field must be passed');
	}

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

		this.toJSON = function() {
			return _attrs;
		}

		// Set attributes
		for(let opt in options) {
			this.set(opt, options[opt]);
		}

		// Call init
		if(attributes && attributes.init) {
			attributes.init.call(this);
		}

	}

	// Set additional methods to model
	for(let attr in attributes) {
		if(attr !== 'init' && attr !== 'defaults') {
			model.prototype[attr] = attributes[attr];
		}
	}

	return model;
}


/************
  Collection
 ************/
function Collection(attributes) {

	// Make sure initialized
	if(!(this instanceof Collection)) {
		return new Collection(attributes);
	}

	function collection(options) {

		let _collection = [];

		let _collectionModel = attributes && attributes.model;

		this.add = function(model) {
			if(!(model instanceof _collectionModel)) {
				throw new Error('A collection must consist of models of same instance');
			}
			_collection.push(model);
		}

		this.removeByFields = function(options) {
			_collection = _collection.filter(model => {
				for(let opt in options) {
					if(model.get(opt) !== options[opt])
						return true;
				}
				return false;
			});
		}

		this.remove = function() {
			if(arguments.length === 1) {
				removeOne(arguments[0]);
			}
			else {
				for(let i=0; i<arguments.length; i++) {
					removeOne(arguments[i]);
				}
			}
		}

		this.removeAll = function() {
			_collection = [];
		}

		this.models = function() {
			return _collection;
		}

		this.filterToJSON = function(cbk) {
			return this.toJSON().filter(cbk);		
		}

		this.toJSON = function() {
			return _collection.map(model => model.toJSON());
		}

		this.size = function() {
			return _collection.length;
		}

		if(attributes && attributes.init) {
			attributes.init.call(this);
		}

		function removeOne(arg) {
			if(typeof(arg) === 'number') {
				_collection.splice(arg,1);
			}
			else {
				_collection = _collection.filter(model => model !== arg);
			}
		}

	}

	return collection;

}


/********
   View
 ********/
 function List(attributes) {

 	// Make sure initialized
	if(!(this instanceof List)) {
		return new List(attributes);
	}

 	const re = /{{\s*((\w+\.?\w+?)*\s*\|?\s*\w+)\s*}}/g;
 	const re_loop = /{{\s*#((\w+\.?\w+?)*\s*\|?\s*\w+)\s*}}/g;

 	let _index = 0;
 	
 	let _listeners = { // Each array contains functions to run
 		push: [],
 		remove: [],
 		filter: []
 	};

 	let _customFilters = {
 		upper: function(txt) {
 			return txt.toUpperCase();
 		},
 		lower: function(txt) {
 			return txt.toLowerCase();
 		},
 		capitalize: function(txt) {
 			return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
 		},
 		currency: function(txt) {
 			return '$' + txt;
 		},
 		json: function(txt) {
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

 	let temp = attributes && attributes.template;
 	if(typeof(temp) === 'string') {
 		_template = temp;
 	}
 	else if(typeof(temp) === 'object') {
 		if(!temp.templateId) {
 			throw new Error('Template must be a string, or an object with "templateId" field');
 		}
 		else {
 			_template = document.getElementById(temp.templateId).innerHTML;
 		}
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

 	let _collection = new (new Collection({ model : _model }));

 	this.getCollection = function() {
 		return _collection;
 	}

 	this.models = function() {
 		return _collection.toJSON();
 	}

 	this.updateView = _updateView;

 	this.pushAll = function(models) {
 		models.forEach(model => _collection.add(new _model(model)));
 		_updateView();
 		_notifyListeners('push');
 	}

 	this.push = function(model) {
 		if(model instanceof _model)
 			_collection.add(model);
 		else
 			_collection.add(new _model(model));
 		_updateView();
 		_notifyListeners('push');
 	}

 	this.remove = function(index) {
 		let collection = this.models();
 		for(var i=0; i<collection.length; i++) {
 			let model = collection[i];
 			if(model.index === index) {
 				_collection.remove(i);
 				break;
 			}
 		}
 		_updateView();
 		_notifyListeners('remove');
 		return collection[i];
 	}

 	this.removeByFields = function(options) {
 		_collection.removeByFields(options);
 		_updateView();
 		_notifyListeners('remove');
 	}

 	this.removeAll = function() {
 		_collection.removeAll();
 		_updateView();
 		_notifyListeners('remove');
 	}

 	this.get = function(index) {
  		let collection = this.models();
 		for(let i=0; i<collection.length; i++) {
 			let model = collection[i];
 			if(model.index === index) 
 				return model;
 		}	
 	}

 	this.size = function() {
 		return _collection.size();
 	}

 	this.filter = function(cbk) {
 		let coll = _collection.filterToJSON(cbk);
 		_updateView(coll);
 		_notifyListeners('filter', coll);
 		return coll;
 	}

 	this.addFilter = function(filterName, filterCbk) {
 		if(typeof(filterName) !== 'string') {
 			throw new Error('Filter name must be a string');
 		}
 		if(typeof(filterCbk) !== 'function') {
 			throw new Error('Filter callback must be a function');
 		}
 		_customFilters[filterName] = filterCbk;
 	}

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
 			if(_listeners[type]) {
 				_listeners[type].push(listener);
	 			return () => unsubscribe(type, listener) // unsubscription
 			}
 			else {
 				throw new Error('type of listener must be "push", "remove" or "filter"');
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

 	function _notifyListeners(type, filteredCollection) {
 		if(!type) {
 			_listeners.push.forEach(listener => listener());
 			_listeners.remove.forEach(listener => listener());
 		}
 		else if(type === 'push') {
 			_listeners.push.forEach(listener => listener());
 		}
 		else if(type === 'remove') {
 			_listeners.remove.forEach(listener => listener());
 		}
 		else if(type === 'filter') {
 			_listeners.filter.forEach(listener => listener(filteredCollection));
 		}
 		else {
 			throw new Error('The type passed is not a possible type');
 		}
 	}

 	function _updateView(coll) {
 		_element.innerHTML = _renderTemplate(coll);
 	}

 	function _renderTemplate(coll) {
 		let collection = coll || _collection.toJSON();
 		collection.forEach(model => model.index = _generateIndex()); // generate unique index to each model
 		let templateString = '';
 		collection.forEach(model => {
 			templateString += _renderLoop(_renderModel(model), model);
 		});
 		return templateString;
 	}

 	function _renderLoop(template, model) {
 		let el = _htmlToElement(template);
 		let domElements = _getSiblingsElementsByAttr(el, 'data-loop');
 		if(!domElements || !domElements.length) // no data-loop
 			return template;
 		domElements.forEach((dElement,i) => {
	 		let attr = dElement.getAttribute('data-loop').trim();
	 		if(!model[attr]) { // no attribute in model
	 			throw new Error(attr + ' attribute does not appear in model');
	 		}
	 		if(!Array.isArray(model[attr])) {
	 			throw new Error(attr + '\'s value must be an array');
	 		}
	 		let temp = '';
	 		model[attr].forEach(obj => {
	 			let dElementHtml = _elementToHtml(dElement);
	 			// Check if there are nested loops and resolve them
	 			if(dElement.querySelector('[data-loop]')) {
	 				_renderLoop(dElementHtml, obj);
	 			}
		 		temp += dElementHtml.replace(re_loop, (str,g) => {
		 			if(g.indexOf('|') !== -1) {
		 				return _filterize(obj, g);
		 			}
		 			return _resolveNestedObject(obj, g);
		 		});
	 		});
	 		el.innerHTML += temp;
	 	});
 		return _elementToHtml(el);
 	}

 	function _renderModel(model) {
 		let temp = _template;
 		temp = temp.replace(re, (str,g) => {
 			if(g.indexOf('|') !== -1) {
 				return _filterize(model, g);
 			}
 			return _resolveNestedObject(model, g);
 		});
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

 	function _resolveNestedObject(model, input) {
 		if(input === 'this')
 			return model;
		let nestedObjectArray = input.split('.');
		if(nestedObjectArray.length === 1) {
			return model[input];
		}
		else {
			let txtToRender = model[nestedObjectArray[0].trim()];
			for(var i=1; i<nestedObjectArray.length; i++) {
				txtToRender = txtToRender[nestedObjectArray[i].trim()];
			}
			return txtToRender;
		}
 	}

 	function _generateIndex() {
 		return _index++;
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

	function _getSiblingsElementsByAttr(el, attr) {
		let queryAttr = '[' + attr + ']';
		let arr = [];
		let cloned = el.cloneNode(true);
		let elByAttr = cloned.querySelector(queryAttr);
		if(elByAttr) {
			arr.push(elByAttr);
			while(elByAttr.nextElementSibling) {
				elByAttr = elByAttr.nextElementSibling;
				if(elByAttr.hasAttribute(attr)) {
					arr.push(elByAttr);
				}
			}
		}
		return arr;
	}

 }

// Extend array
Array.prototype.extend = function(arr) {
	arr.forEach(item => this.push(item));
}

return {
	Model,
	List
}

})();
