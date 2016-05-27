// Subscriptions
TodosList.subscribe(['push','edit'], () => {
	let filter = Skeleton.storage.fetch('filter') || 'all';
	window.filterTodos(filter);
});

TodosList.subscribe(['push','remove','edit','removeAll'], () => {
	updateSize();
	Skeleton.storage.save({ 
		todos: TodosList.models() 
	});
});

TodosList.subscribe('pushAll', updateSize);