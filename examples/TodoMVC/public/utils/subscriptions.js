// Subscriptions
TodosList.subscribe('filter', (filteredModels) => {
	let filter;
	if(filteredModels.length) {
		filter = filteredModels[0].isCompleted ? 'completed' : 'active';
	}
	else {
		filter = TodosList.models()[0].isCompleted ? 'active' : 'completed';
	}
	console.log(filter)
	Skeleton.storage.save({ filter });
});

TodosList.subscribe(['push','edit'], () => {
	let filter = Skeleton.storage.fetch('filter') || 'all';
	if(filter) {
		window.filterTodos(filter);
	}
});

TodosList.subscribe(['push','remove','edit','removeAll'], () => {
	updateSize();
	Skeleton.storage.save({ 
		models: TodosList.models() 
	});
});

TodosList.subscribe('pushAll', updateSize);