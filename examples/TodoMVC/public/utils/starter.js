(function() {
	TodosList.pushAll(Skeleton.storage.fetch('todos') || []);
	let filter = Skeleton.storage.fetch('filter') || 'all';
	router.visit(`/${filter}`);
})();