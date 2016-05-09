![skeleton](https://cloud.githubusercontent.com/assets/13187428/15070947/ab961d1a-1390-11e6-93ae-36b56482e673.png)
#### Skeleton makes rendering lists (add/remove/edit model) very easy.

---
###### Let's start. First, create a model:
```js

let RecordModel = Skeleton.Model({
    defaults: {
      artist: '',
      song: '',
      album: '',
      year: '',
      sold: 0
    },
    init() {
      console.log(`The song ${this.get('song')} by ${this.get('artist')} sold ${this.get('sold')} records.`);
    }
});
```

##### Required fields:
##### **defaults:** field to specify the default values of the model fields.
##### Optional fields:
##### **init:** function to be called everytime the model is initialized.
##### You can use 'set' passing an object or 2 arguments of key and value,
##### and 'get', to get values of fields.
##### You can extend the functionality of a model by defining your own functions.

--- 
###### Next, create a list:
```js
let RecordsList = Skeleton.List({
    model: RecordModel,
    element: 'records',
    template: {templateId: 'record-template'} 
});
```

##### Required fields:
##### **model:** field to specify the model of each element in the list.
##### **element:** field that specifies the id of the DOM element that each list item should be rendered into.
##### **template:** field that is either a string that represents the template or an object with a 
##### 'templateId' field that specifies the id of the template in the html document.

---
###### Now, lets define a template:
```html
<template id="record-template">
    <div class="record" data-id="{{ index }}">
        <div class="record-head">
            <span class="float-left">Album: {{ album }}</span>
            <span class="float-right">Year: {{ year }}</span>
            <div class="clear"></div>
        </div>
        <div class="record-body">
            '{{ song | upper }}' is a song by {{ artist | capitalize }} from the album {{ album }} that sold {{ sold }} records.
        </div>
        <div class="record-footer">
            <button onClick="remove({{ index }})">x</button>
        </div>
    </div>
</template>
```

###### Notice that you can use different filters, by pipe (|) -
###### * upper 
###### * lower 
###### * capitalize 
###### * currency
###### * json  


###### Moreover, everytime a new model is rendered, it gets an index parameter generated for free.
###### Each model rendered has its unique index, and that is very usefull, especially when you
###### want to remove a model from the list, which I show how to do as we continue.

---
###### And what about adding your own filters? Yeah, piece of cake:
```js
RecordsList.addFilter('helloFirst', (txt) => `Hello ${txt}`);
```
###### Now you can use it as a filter in the template:
```html
<div>{{ artist | helloFirst }}</div>
```

---
###### You can also use nested objects in the template, for example if you have the object:
```js
{
    location: {
        country: "Spain",
        city: "Madrid",
        friends_addresses: {
            Jose: "Gran Villa 3",
            Antonio: "La kukaracha 67"
        }
    }
}
```

###### You can resolve it like this in the template:
```html
<template id="abroad-friends-template">
    <div data-id="{{ index }}">
        <div class="head">
            <span class="float-left">{{ location.country | capitalize }}</span>
            <span class="float-right">{{ location.city | capitalize }}</span>
            <div class="clear"></div>
        </div>
        <div class="body">
            <span>Jose: {{ location.friends_addresses.Jose | upper }}</span>
            <span>Antonio: {{ location.friends_addresses.Antonio | upper }}</span>
        </div>
        <div class="json">
            <span>Whole json object: {{ location | json }}</span>
        </div>
    </div>
</template>
```

---

###### Now all you need to do is push an object with the default fields to 'RecordsList',
###### and it will render the record to the list.

```js
RecordsList.push({ artist: 'prince', song: 'purple Rain', album: 'Purple Rain', year: 1984, sold: 22000000 });
```

###### And if you want the model to appear first in the list, just use 'unshift' and it will render automatically
###### at the begining of the list.

```js
RecordsList.unshift({ artist: 'prince', song: 'purple Rain', album: 'Purple Rain', year: 1984, sold: 22000000 });
```

###### And maybe you want to push a whole array of objects that came back from an api or db-server:
```js
$.getJSON('/artists-records-api-path', (data) => {
    RecordsList.pushAll(data); // The data is pushed and immediately renders   
});
```         

---
###### To remove all models from the list just type:
```js
RecordsList.removeAll(); // The data is removed and immediately empties the list container   
``` 

---
###### Now, what if you want to have the ability to remove a single model on a button click ?
###### Well, pretty simple as well. notice the following in the template:
```html
<div data-id="{{ index }}">
    <button onClick="remove({{ index }})">x</button>
</div>
```
###### Please notice that giving the wrapper element of the model a 'data-id' attribute this way is a must, if you
###### want to have the ability to remove/edit a model of the list.
###### Now, you need to define a 'remove'/'edit' function, and use the built-in functionallity of a skeleton list:
```js
window.remove = function(index) {
    let modelToRemove = RecordsList.remove(index); // This will remove the model from the list and rerender, and it will return the model removed
    
    // Now, you can make an ajax call to remove the model from the db-server if you have one,
    // or use it for any other reason.
}
```

###### If you want to get the model before removing it, you can do it by using 'get':
```js
window.remove = (index) => {
    let modelToRemove = RecordsList.get(index); // This will return the model object
    
    // Now, you can make an ajax call to remove the model from the db-server if you have one,
    // and only after you make sure it succeeds, remove it from the eyes of the user.

    RecordsList.remove(index);
}
```
---
###### Similarly you can edit a model:
```js
window.edit = (index, options) => { // function exposed to window object for user interaction
    RecordsList.edit(index, options); // built in functionallity of skeleton
}

// example usage
edit(2, { year: 1980, sold: 23000000 }); // edit 3rd model in the list, change and render specified fields
```

---
###### You can also iterate over the models like this:
```js
// If record sold less than 5 million, remove it from the list
RecordsList.forEach((record,idx) => {
    if(record.sold < 5000000) {
        remove(record.index); // The record is removed from the view
    }
});
```

---
###### Let's say now, that we want some function to run each time something is pushed to the list or removed from it.
###### To acheive this, use the 'subscribe' function. You can pass one or two arguments:
###### A callback function to run on both push and remove events, or both the event and its callback. For example:
```js
// This will run on both push or remove
RecordsList.subscribe(() => {
    alert(`Right now there are ${RecordsList.size()} records in the list!`);
}); 

// This will only run on push
RecordsList.subscribe('push', (model) => {
    console.log(`The model ${JSON.stringify(model)} was pushed!`); 
}); 

// This will only run on remove
RecordsList.subscribe('remove', (model) => {
    console.log(`The model ${JSON.stringify(model)} was removed!`); 
}); 
```
###### * You can also listen to 'pushAll', 'removeAll', 'push', 'remove', 'filter', 'edit' and 'sort' events.
###### * Be aware that 'push' listener also listens to when you call 'unshift'.
###### * If you only pass a callback function, the affected events will be 'push' and 'remove'.
###### * You can pass array of events if you have a function to run on all of them.
```js
/* A common use case when you would want to subscribe to an event would be I/O, for example: */

// add model to db
RecordsList.subscribe('push', (model) => {
    $.ajax({
        type: 'post',
        dataType: 'json',
        data: model,
        url: '/add-model-api',
        success() {
          console.log('success');
        },
        error() {
          console.log('error');
        }
    });
});

// edit model on db
RecordsList.subscribe('edit', (model) => {
    $.ajax({
        type: 'post',
        dataType: 'json',
        data: model,
        url: '/edit-model-api',
        success() {
          console.log('success');
        },
        error() {
          console.log('error');
        }
    });
});

// An example of many events subscribing to the same function
RecordsList.subscribe(['push','pushAll','remove','filter','sort','edit'], () => {
    console.log('I work hard since many events are subscribed to me!');
});
```

---
###### How do I subscribe to filtering the list? Easy!
```js
let filteredRecords = RecordsList.filter(model => model.year > 1966); // Returns records that were released after 1966

// Now, the view is automatically updated, and you can use the filtered list returned to updated other parts of your app,
// or simply use the 'subscribe' method to listen to whenever the list is filtered like shown underneath
RecordsList.subscribe('filter', (filteredRecords) => {
    alert(`After filtering, there are ${filteredRecords.length} records in the list!`);
});
```
###### Notice that the filtered list is passed to the listener and you can use it

---
###### Now, let's say that after a while we want to unsubscribe from any of our "events". Very easy:
```js
// When we subscribe to an event, an unsubscribe function is returned so we can apply it later on.
// Let's say that after we have 100 records we want to unsubscribe.
let unsub = RecordsList.subscribe('push', () => {
    RecordsList.size() === 100 ? unsub() : console.log('A push occured! Ahhhahaha'); 
    // 'size' is a function you should call to determine how many models you have in the list
}); 

// And that's all there is to it! :)
```
---
###### Back to templates- How do we use loops inside the template?
```html
<template id="record-template">
    <div class="record" data-id="{{ index }}">
        <div class="record-head">
            <span class="float-left">Album: {{ album }}</span>
            <span class="float-right">Year: {{ year }}</span>
            <div class="clear"></div>
        </div>
        <div class="record-body">
            '{{ song | upper }}' is a song by {{ artist | capitalize }} from the album {{ album }} that sold {{ sold }} records.
        </div>
        <div class="record-footer">
            <button onClick="remove({{ index }})">x</button>
        </div>
        <div class="selling-shops">
          <!-- Here the loop declaration begins -->
          <div class="shop" data-loop="shops">
              <span>{{ #name }}</span>
              <span>{{ #address }}</span>
              <span>{{ #this | json }}</span>
          </div>
          <!-- Here it ends -->
        </div>
    </div>
</template>
```

###### As you can see, you just need to set 'data-loop' attribute to the part you want to loop over.
###### 'shops' is an array of objects. To resolve the object, use the field name with '#' before the name.
###### You can use '#this' if you want to resolve what's in the array and not its fields. This is usefull if
###### your array consists of strings, or if you want to stringify json objects and show them to the user.
###### Now the records model should look like this:
```js
let RecordModel = Skeleton.Model({
    defaults: {
        artist: '',
        song: '',
        album: '',
        year: '',
        sold: 0,
        shops: [] // Array of objects or strings
    },
    init() {
        console.log(`The song ${this.get('song')} by ${this.get('artist')} sold ${this.get('sold')} records.`);
    }
});
```
###### And pushing to render the template looks like this:
```js
RecordsList.push({ 
    artist: 'queen', 
    song: 'Bohemian Rhapsody', 
    album: 'A night at the opera', 
    year: 1975,
    sold: 26000000,
    shops: [
      {name: 'Disc', address: 'Washington 3'},
      {name: 'Musik', address: 'Barbara 5'},
      {name: 'Flow', address: 'Franklin 8'}
    ]
});
```
###### You can use nested objects in a loop like this:
```html
<div data-loop="people">
    <p>{{ #name | capitalize }}</p>
    <h2>Best Friend:</h2>
    <div>
        <p>{{ #friends.best.name | upper }}</p>
        <p>{{ #friends.best.age }}</p>
    </div>
    <h3>Good Friend:</h3>
    <div>
        <p>{{ #friends.good.name | lower }}</p>
        <p>{{ #friends.good.age }}</p>
    </div>
</div>
```
```js
// The 'people' array is an array of objects that looks something like this:
{
    people: [
        {
            name: '',
            friends: {
                best: {
                    name: '',
                    age: ''
                },
                good: {
                    name: '',
                    age: ''
                }
            }
        }
    ]
}
```

---
###### Another thing built-in is an easy support for usage of browser localStorage:
```js
// Save complex objects to localStorage
Skeleton.storage.save({
    models: RecordsList.models(),
    size: RecordsList.size()
}); 

// Fetch complex objects from localStorage
let models = Skeleton.storage.fetch('models');
let size = Skeleton.storage.fetch('size');

// Clear storage
Skeleton.storage.clear();
```
###### If you use 'save', please use 'fetch' to get back the data, and not 'localStorage.getItem',
###### since 'save' and 'fetch' take care of stringifying and parsing json.

---
###### Another very conveninet built-in is form and input cache support. You never have to use it,
###### but you should when you need it, since it gives the code a better structure and makes it
###### faster and easier to understand.
```html
<!-- This is a form to submit a record to the list -->
<form name="record-form">
    <input type="text" placeholder="album name" id="record-album" />
    <input type="text" placeholder="artist name" id="record-artist" />
    <input type="text" placeholder="song name" id="record-song" />
    <input type="number" min="1920" max="2017" id="record-year" />
    <input type="number" min="0" id="record-sold" />
    <button type="submit" id="record-submit">Add Record</button>
</form>
```
###### Now, instead of taking the DOM elements, you can use 'Skeleton.form' to do it for you,
###### cache the elements and give your form a readable structure.
```js
Skeleton.form({
    name: 'record-form',
    inputs: {
        album: 'record-album',
        artist: 'record-artist',
        song: 'record-song',
        year: 'record-year',
        sold: 'record-sold'
    },
    submit: 'record-submit',
    onSubmit(e) {
        RecordsList.push({
            album: this.album.value,
            artist: this.artist.value,
            song: this.song.value,
            year: Number(this.year.value),
            sold: Number(this.sold.value)
        });
        Skeleton.form.clear(this.name); // clear form's input and textarea fields
    }
});
```
###### 'name', 'submit' and 'onSubmit' fields are required. 'e.preventDefault()' is called automatically,
###### to prevent the default browser behavior and let you use an ajax call instead which is the standart today.

---
###### Now what if you just need an easy input element support?
```html
<input type="text" placeholder="Search Artist" id="search-artist" />
```
```js
// Just type this, and the input element will be cached
Skeleton.input('search-artist');

// If you want to get the input value:
let value = Skeleton.input.get('search-artist');

// If you want to set a value:
Skeleton.input.set('search-artist', 'I am a new input value!');

// If you want to clear the input:
Skeleton.input.clear('search-artist');

// If you want to clear all input values you have cached:
Skeleton.input.clear(); // call without parameters
```
###### You can also define a listener function like you would with 'addEventListener',
###### and an event to listen to. By default, the event is 'keyup'.
```js
Skeleton.input('search-artist', (evt) => {
    console.log(evt.target.value === Skeleton.input.get('search-artist')); // true 
});

// If you want to listen to other event, for example change, just pass it as a third parameter:
Skeleton.input('search-artist', (evt) => console.log('I log on change!'), 'change');
```
---
###### You can also bind a DOM node to an input or text area element, so the node will
###### be automatically updated by the input value.
```html
<input type="text" id="my-input" />
<p id="my-text"></p>
```
###### Now let's use the 'Skeleton.bind' function:
```js
Skeleton.bind('my-text').to('my-input').exec(value => `My text is updated whenever ${value} updates!`);

// By default, the event is 'keyup'. You can change it by passing your desired event to 'exec':
Skeleton.bind('my-text').to('my-input').exec((value => `My text is updated whenever ${value} changes!`), 'change');
```
###### And you can also bind a node to several input elements:
```html
<input type="text" id="first-name" />
<input type="text" id="last-name" />
<p id="full-name"></p>
```
###### And using 'Skeleton.bind':
```js
Skeleton.bind('full-name')
        .to('first-name', 'last-name')
        .exec((firstName, lastName) => {
            return `Your name is ${firstName} ${lastName}!!`;
        });
```

---
###### Please check out the examples folder and the source code to see more.
###### Skeleton on npm: https://www.npmjs.com/package/js-skeleton
###### If you are using Skeleton.js in production, I'll be glad if you let me
###### know on guypeer8@gmail.com, with or without a review. Have fun! :)

---
![skeleton.js](http://bestanimations.com/Humans/Skeletons/skeleton-animated-gif-3.gif "Skeleton")
