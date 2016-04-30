## skeleton.js
#### Skeleton makes rendering static lists (add/remove model) very easy.

---

###### First, create a model:
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
RecordsList.addFilter('helloFirst', function(txt) {
    return 'Hello! ' + txt;
});
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
RecordsList.push({ artist: 'prince', song: 'purple Rain', album: 'Purple Rain', year: 1984, sold: '22 million' });
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
<button onClick="remove({{ index }})">x</button>
```
###### Now, you need to define a 'remove' function, and use the built-in functionallity of a skeleton list:
```js
window.remove = function(index) {
  let modelToRemove = RecordsList.remove(index); // This will remove the model from the list and rerender, and it will return the model removed
  
  // Now, you can make an ajax call to remove the model from the db-server if you have one,
  // or use it for any other reason.
}
```

###### If you want to get the model before removing it, you can do it by using 'get':
```js
window.remove = function(index) {
  let modelToRemove = RecordsList.get(index); // This will return the model object
  
  // Now, you can make an ajax call to remove the model from the db-server if you have one,
  // and only after you make sure it succeeds, remove it from the eyes of the user.

  RecordsList.remove(index);
}
```

---
###### Let's say now, that we want some function to run each time something is pushed to the list or removed from it.
###### To acheive this, use the 'subscribe' function. You can pass one or two arguments:
###### A callback function to run on both push and remove events, or both the event and its callback. For example:
```js
RecordsList.subscribe(() => alert(`Right now there are ${RecordsList.size()} records in the list!`)); // This will run on both push or remove
RecordsList.subscribe('push', () => console.log('A push occured! Ahhhahaha')); // This will only run on push
RecordsList.subscribe('remove', () => console.log('A remove occured! Whahaahha')); // This will only run on remove
```

---
###### And what if I want to filter my list? Just use the 'filter' function that comes with Skeleton.List!
```js
let filteredRecords = RecordsList.filter((model,i) => Number(model.year) > 1966); // Returns records that were released after 1966

// Now, the view is automatically updated, and you can use the filtered list returned to updated other parts of your app,
// or simply use the 'subscribe' method to listen to whenever the list is filtered like shown underneath
RecordsList.subscribe('filter', (filteredRecords) => alert(`After filtering, there are ${filteredRecords.length} records in the list!`));

// Notice that the filtered list is passed to the listener and you can use it
```

---
###### Now, let's say that after a while we want to unsubscribe from any of our "events". Very easy:
```js
let unsub = RecordsList.subscribe('push', () => console.log('A push occured! Ahhhahaha')); 
// When we subscribe to an event, an unsubscribe function is returned so we can apply it in later

// To unsubscribe, just invoke the unsubscription function
unsub(); 
// Now, we are no longer subscribed to logging 'A push occured! Ahhhahaha' when a push occures
```

---
###### Please check out the examples folder and the source code to see more.
###### Skeleton on npm: https://www.npmjs.com/package/js-skeleton

---
![skeleton.js](http://bestanimations.com/Humans/Skeletons/skeleton-animated-gif-3.gif "Skeleton")
