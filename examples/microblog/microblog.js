(function() {

// Define Post Model
var PostModel = Skeleton.Model({
	defaults: {
		title: '',
		posted_by: '',
		content: '',
		date: new Date().toDateString()
	},
	init: function() {
		console.log(`A new post by ${this.get('posted_by')}`);
	}
});

// Define Post List
var PostsList = Skeleton.List({
	model: PostModel, // Post Model
 	element: 'posts-list', // List container element id
 	template: {templateId: 'post-template'} // Post template id
 });


// Get DOM Nodes
var title = document.getElementById('title');
var posted_by = document.getElementById('posted_by');
var content = document.getElementById('content');
var postButton = document.getElementById('post-button');
var postsCount = document.getElementById('posts-count');
var filterPosts = document.getElementById('filter-posts');

// Attach Post Button Click Listener
postButton.addEventListener('click', function(e) {
	e.preventDefault();
	let [t, p, c] = [title.value, posted_by.value, content.value];
	if(!t || !p || !c)
		return;
	PostsList.push({ title: t, posted_by: p, content: c }); // Push a new post to render
	setCount(PostsList.size()); // Set List Size
	cleanInputs();
});
 
// Atach Keyup Listener To Filter Input
filterPosts.addEventListener('keyup', function(e) {
	let value = e.target.value;
	// Filter List By Search Query, Update View Explicitly
	let filtered = PostsList.models().filter(model => {
		return model.posted_by.toLowerCase().indexOf(value.toLowerCase()) !== -1;
	});
	setCount(filtered.length);
	PostsList.updateView(filtered);
});

// Clean Post Inputs
function cleanInputs() {
	[title.value, posted_by.value, content.value, filterPosts.value] = ['', '', '', ''];
}

// Set Posts Count
function setCount(count) {
	postsCount.textContent = count;
}

function removePost(index) {
	setCount(PostsList.size());
}

window.removePost = removePost;

})();