(function() {

// Create Bones List
var BonesList = Skeleton.List({
	model: Skeleton.Model({ defaults: {name: '', area: '', count: ''} }), // Bone Model
	element: 'human-bones-list', // List container element id
	template: {templateId: 'bone-template'} // Bone template id
});

function ajaxGet(url, callback, data) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.status === 200 && xhr.readyState === 4) {
            callback(JSON.parse(xhr.responseText));
        }
    }
    xhr.open('GET', url, true);
    xhr.send(data || null);
}

ajaxGet('http://mysafeinfo.com/api/data?list=humanbones&format=json', function(data) {
	let bones = data.map(bone => {
		let {bn, ar, cnt} = bone;
		let [name, area, count] = [bn, ar, cnt];
		return {name, area, count};
	});
	BonesList.pushAll(bones); // Push all to list to render
});

})();