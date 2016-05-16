(function() {
	TodosList.pushAll(Skeleton.storage.fetch('models') || []);
	window.filterTodos(Skeleton.storage.fetch('filter') || 'all');
})();