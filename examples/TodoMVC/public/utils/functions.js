{

// Remove Todo
window.removeTodo = (index) => {
	TodosList.remove(index);
}

// Toggle Todo
window.toggleTodo = (index) => {
	let isCompleted = !TodosList.get(index).isCompleted;
	TodosList.edit(index, { isCompleted }); // Edit todo
}

// Edit Todo
window.editTodo = (index) => {
	if(TodosList.get(index).isCompleted) {
		return;
	}
	TodosList.edit(index, { isEditing: true });
}

// Set Edited Todo
window.setEditedTodo = (event, index) => {
	if(event.keyCode === 13) { // enter key code
		let text = event.target.value;
		if(!text || !text.trim())	{
			return;
		}
		TodosList.edit(index, { text , isEditing: false });
		event.target.value = '';
	}
	else if(event.keyCode === 27) { // escape key code
		TodosList.edit(index, { isEditing: false });
	}
}

// Filter Todos
window.filterTodos = (type) => {
	if(type === 'all') {
		TodosList.filter(todo => true);
		styleFilter('all');
	}
	else if(type === 'active') {
		TodosList.filter(todo => !todo.isCompleted);
		styleFilter('active');
	}
	else { // type = 'completed'
		TodosList.filter(todo => todo.isCompleted);
		styleFilter('completed');
	}
	Skeleton.storage.save({ filter: type });
}

// Clear Completed
window.clearCompleted = () => {
	TodosList.forEach(todo => {
		if(todo.isCompleted) {
			window.removeTodo(todo.index);
		}
	});
}

// Remove All Todos
window.removeAll = () => {
	TodosList.removeAll();
}

// Update Size
const todosSize = document.getElementById('todos-size');
window.updateSize = () => {
	todosSize.textContent = TodosList.models().filter(todo => !todo.isCompleted).length;
} 

// Style on choosing filter
const filters = {
	all: document.getElementById('filter-all'),
	active: document.getElementById('filter-active'),
	completed: document.getElementById('filter-completed')
}

function styleFilter(filter) {
	Object.keys(filters).forEach(fltr => {
		if(fltr === filter) {
			return filters[fltr].style.fontStyle = 'italic';
		}
		return filters[fltr].style.fontStyle = 'normal';
	});
}

}