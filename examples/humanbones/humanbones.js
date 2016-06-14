{

const API_URL = 'http://mysafeinfo.com/api/data?list=humanbones&format=json';

// Create Bones List
const BonesList = Skeleton.List({
	model: Skeleton.Model( { defaults: { name: '', area: '', count: '' } } ), // Bone Model
	element: 'human-bones-list', // List container element id
	template: {templateId: 'bone-template'} // Bone template id
});

const ajaxGet = (url, callback, data=null) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if(xhr.status === 200 && xhr.readyState === 4) {
            callback(JSON.parse(xhr.responseText));
        }
    }
    xhr.open('GET', url, true);
    xhr.send(data);
}

ajaxGet(API_URL, (data) => {
	const bones = data.map(bone => {
		let { bn, ar, cnt } = bone;
		let [name, area, count] = [bn, ar, cnt];
		return { name, area, count };
	});
	BonesList.pushAll(bones); // Push all to list to render
});

BonesList.subscribe('pushAll', (models) => {
	Skeleton.storage.save({ models }); // Save models to localStorage
	console.log(`Models pushed and saved to localStorage: ${JSON.stringify(models)}`);
});

}