// Define Skeleton Model & List
let TodoModel = Skeleton.Model({
	defaults: {
		text: '',
		isCompleted: false
	}
});

let TodosList = Skeleton.List({
	model: TodoModel,
	element: 'todo-list',
	template: {templateId: 'todo-template'}
});

// Remove Todo
window.removeTodo = (index) => {
	TodosList.remove(index);
}

// Edit Todo
window.editTodo = (index) => {
	return;
}

// Toggle Todo
window.toggleTodo = (index) => {
	let isCompleted = !TodosList.get(index).isCompleted;
	TodosList.edit(index, { isCompleted });
}

// Filter Todos
window.filterTodos = (type) => {
	if(type === 'all') {
		TodosList.filter(todo => true);
	}
	else if(type === 'active') {
		TodosList.filter(todo => !todo.isCompleted);
	}
	else { // type = 'completed'
		TodosList.filter(todo => todo.isCompleted);
	}
}

// Remove All Todos
window.removeAll = () => {
	TodosList.removeAll();
}

// Todo Form
Skeleton.form({
	name: 'todo-form',
	inputs: {
		text: 'todo-input'
	},
	submit: {
		input: 'text',
		keyCode: 13 // Enter Key Code
	},
	onSubmit(e) {
		let text = this.text.value;
		if(!text) {
			return;
		}
		TodosList.push({ text }); // push and render todo
		Skeleton.form.clear(this.name); // clear form input
	}
});

// Update Size
var todosSize = document.getElementById('todos-size');
const updateSize = () => {
	todosSize.textContent = TodosList.size();
} 

// Subscriptions
TodosList.subscribe('filter', (filteredModels) => {
	let filter;
	if(TodosList.size() === filteredModels.length) {
		filter = 'all';
	}
	else {
		if(filteredModels.length) {
			filter = filteredModels[0].isCompleted ? 'completed' : 'active';
		}
		else {
			filter = TodosList.models()[0].isCompleted ? 'active' : 'completed';
		}
	}
	Skeleton.storage.save({ filter });
});

TodosList.subscribe(['push','edit'], () => {
	let filter = Skeleton.storage.fetch('filter');
	if(filter)
		window.filterTodos(filter);
});

TodosList.subscribe(['push','remove','pushAll','removeAll'], updateSize);

TodosList.subscribe(['push','remove','edit','removeAll'], () => {
	Skeleton.storage.save({ 
		models: TodosList.models() 
	});
});