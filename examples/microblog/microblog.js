(function() {

// Define 'includes'
String.prototype.includes = String.prototype.includes || function(str) { return this.indexOf(str) !== -1; }

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

// Define custom pipe filter called 'decorate' to use in the template
PostsList.addFilter('decorate', (name) => '@' + name);

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
	cleanInputs();
});
 
// Atach Keyup Listener To Filter Input
filterPosts.addEventListener('keyup', function(e) {
	let inputValue = e.target.value.toLowerCase();
	// Filter by filterer supplied, the filtered models are returned in case you need them
	PostsList.filter((model) => model.posted_by.toLowerCase().includes(inputValue));
});

// Subscribe To Push and Remove- Means, Run this function when either there is a push to the list or remove from it
PostsList.subscribe((model) => setCount(PostsList.size()));

// Subscribe To Filtering the Collection- Means, Run this function when 'filter' is called on PostsList
PostsList.subscribe('filter', (filteredList) => setCount(filteredList.length));

// Clean Post Inputs
function cleanInputs() {
	[title.value, posted_by.value, content.value, filterPosts.value] = ['', '', '', ''];
}

// Set Posts Count
function setCount(count) {
	postsCount.textContent = count;
}

// Remove Post
function removePost(index) {
	PostsList.remove(index);
}

window.removePost = removePost;

})();