TodosList.subscribe(['push','edit'], () => {
	let filter = Skeleton.storage.fetch('filter') || 'all';
	window.filterTodos(filter);
});

TodosList.subscribe(['push','remove','edit','removeAll'], () => {
	updateSize();
	let todos = TodosList.models();
	Skeleton.storage.save({ todos });
});

TodosList.subscribe('pushAll', updateSize);