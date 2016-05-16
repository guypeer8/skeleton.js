(function() {

// Remove Todo
window.removeTodo = (index) => {
	TodosList.remove(index);
}

// Toggle Todo
window.toggleTodo = (index) => {
	let isCompleted = !TodosList.get(index).isCompleted;
	TodosList.edit(index, { isCompleted }); // Edit todo
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
		styleFilter('completed')
	}
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
var todosSize = document.getElementById('todos-size');
window.updateSize = () => {
	todosSize.textContent = TodosList.models().filter(todo => !todo.isCompleted).length;
} 

// Style on choosing filter
var filterAll = document.getElementById('filter-all');
var filterActive = document.getElementById('filter-active');
var filterCompleted = document.getElementById('filter-completed');
function styleFilter(filter) {
	[filterAll, filterActive, filterCompleted].forEach(el => el.style.fontStyle = 'normal');
	if(filter === 'all') {
		filterAll.style.fontStyle = 'italic';
	}
	else if(filter === 'active') {
		filterActive.style.fontStyle = 'italic';
	}
	else {
		filterCompleted.style.fontStyle = 'italic';
	}
}

})();