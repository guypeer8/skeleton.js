{

// Define 'includes'
String.prototype.includes = String.prototype.includes || function(str) { return this.indexOf(str) !== -1; }

// Define Post Model
let PostModel = Skeleton.Model({
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
let PostsList = Skeleton.List({
	model: PostModel, // Post Model
 	element: 'posts-list', // List container element id
 	template: {templateId: 'post-template'} // Post template id
 });

// Add custom pipe filter called 'decorate' to use in the template
PostsList.addFilter('decorate', (name) => '@' + name);

// Take care of submiting post-form
Skeleton.form({
	name: 'post-form',
	inputs: {
		title: 'post-title',
		posted_by: 'post-posted_by',
		content: 'post-content'
	},
	submit: 'post-button',
	onSubmit(e) {
		let [title, posted_by, content] = [this.title.value, this.posted_by.value, this.content.value];
		if(!title || !posted_by || !content)
			return;
		PostsList.push({ title, posted_by, content }); // Push a new post to render
		Skeleton.form.clear(this.name); // built in function
		Skeleton.input.clear('filter-posts');
	}
});

// Take care of filtering posts
Skeleton.input('filter-posts', (e) => PostsList.filter(model => model.posted_by.toLowerCase().includes(e.target.value.toLowerCase())));

// Subscribe to events
PostsList.subscribe(['push', 'remove', 'pushAll', 'removeAll'], model => setCount(PostsList.size())); // Subscribe To Push and Remove- Means, Run this function when either there is a push to the list or remove from it
PostsList.subscribe('filter', (filteredList) => setCount(filteredList.length)); // Subscribe To Filtering the Collection- Means, Run this function when 'filter' is called on PostsList

// Helper functions
var postsCount = document.getElementById('posts-count');
const setCount = (count) => postsCount.textContent = count // Set Posts Count
const removePost = (index) => PostsList.remove(index) // Remove Post

window.removePost = removePost;

}