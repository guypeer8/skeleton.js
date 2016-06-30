![skeleton](https://cloud.githubusercontent.com/assets/13187428/15070947/ab961d1a-1390-11e6-93ae-36b56482e673.png)
#### Skeleton makes rendering lists (add/remove/edit model) very easy.

---
###### Let's start. First, create a model:
```js

const RecordModel = Skeleton.Model({
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
const RecordsList = Skeleton.List({
    model: RecordModel,
    element: 'records',
    templateId: 'record-template'
});
```

##### Required fields:
##### **model:** field to specify the model of each element in the list.
##### **element:** field that specifies the id of the DOM element that each list item should be rendered into.
##### **template** or **templateId**: field that is either a string that represents the template or an id that 
##### specifies the id of the template in the html document.

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

###### Notice that you can use different filters, by pipe | -
###### * upper 
###### * lower 
###### * capitalize 
###### * currency
###### * json  


###### Moreover, everytime a new model is rendered, it gets an index parameter generated for free.
###### Each model rendered has its unique index, and that is very usefull, especially when you
###### want to remove a model from the list, which I show how to do as we continue.

##### You can also pass a "template" attribute instead of the templateId attribute, if you
##### want to provide the template string directly, for example:
```js
const RecordsList = Skeleton.List({
    model: RecordModel,
    element: 'records',
    template:  `<div class="record" data-id="{{ index }}">
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
                </div>`
});
```

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
window.remove = (index) => {
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
const RecordModel = Skeleton.Model({
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
###### And sorting your list is also supported. The sorting works as it would work in plain
###### javascript. If you want to sort by the artist name for example:
```js
const comperator = (a,b) => {
    if(a.artist > b.artist)
        return 1;
    if(a.artist < b.artist)
        return -1;
    return 0; 
}

RecordsList.sort(comperator); // pass comperator function to 'sort' method
```
###### The view automagically rerenders, and the collection is returned as an array of objects.
###### And, you can subscribe to 'sort' event.
```js
RecordsList.subscribe('sort', (sorted) => {
    alert(`The sorted array is ${JSON.stringify(sorted)}`); 
});
```
---
###### If you want to check and uncheck a checkbox in a template, use 'data-checked' attribute.
###### Then you can edit the template when it changes, to rerender:
```html
<template id="food-template">
    <div data-id="{{ index }}">
        <input type="checkbox" data-checked="isLiked" onChange="toggleFood({{ index }})" />
        <span class="food">{{ food }}</span>
    </div>
</template>
```
###### And the list and model:
```js
// list
const FoodList = Skeleton.List({
    model: Skeleton.Model( { defaults: { food: '', isLiked: false } } ),
    element: 'food-list',
    templateId: 'food-template' 
});

// on checkbox change
window.toggleFood = function(index) {
    let isLiked = !FoodList.get(index).isLiked;
    FoodList.edit(index, { isLiked }); // rerenders the model
}
```
---
###### To hide and show parts of the template, simply use 'data-hide' and 'data-show' attributes.
###### Don't forget to define the property in the model:
```js
// model
const FruitModel = Skeleton.Model({
    defaults: {
        name: '',
        isYellow: false
    }
});
```
###### Fruit template:
```html
<template id="fruit-template">
    <div data-id="{{ index }}">
        <p class="fruit-name">{{ name }}</p>
        <p data-hide="isYellow">I am not yellow!</p>
        <p data-show="isYellow">I am yellow and I know it!</p>
    </div>
</template>
```
###### Please check the TodoMVC example in the examples folder to see a real life
###### scenario when it is used on editing a todo.
---
###### Now, how do I manipulate css styles as my model updates (usually when edited)?
###### You can use the 'data-style' or 'data-class' attribute:
##### CSS:
```css
.italic {
    font-style: italic;
}
.under {
    text-decoration: underline;
}
```
##### HTML:
```html
<p data-class='{"italic": "isChosen", "under": "!isChosen"}'>Wowwwwwww!</p>
<p data-style='{"fontStyle" : "isChosen ? italic : normal", "textDecoration": "isChosen ? none : underline"}'>Wowwwwwww!</p>
<!--
 ! Please notice that 'isChosen' is a boolean attribute of the model,
 ! and that in both cases you need to provide a stringified json object,
 ! since it gets parsed in the evaluation.
-->
```
###### Please check the TodoMVC example in the examples folder to see it in action.

---
###### Today in the world of single page applications, a client side router is a must. Skeleton provides
###### an efficient and easy-to-use router. Here is how you can use it, pretending we sell products online:
```js
const router = Skeleton.Router(); // initialize router
// set paths and handler functions
router.path('/music', () => renderTemplate('music'));
router.path('/books', () => renderTemplate('books'));
router.path('/clothes', () => renderTemplate('clothes'));
router.path('/plants', () => renderTemplate('plants'));
```
###### Now we need to tell when to visit each route:
```html
<ul class="menu">
    <li onClick="router.visit('/music')">Music</li>
    <li onClick="router.visit('/books')">Books</li>
    <li onClick="router.visit('/clothes')">Fashion</li>
    <li onClick="router.visit('/plants')">Garden</li>
</ul>
```
###### The 'renderTemplate' function should be defined as you want. Usually you would want to
###### show and hide templates.
##### If you want to pass parameters to the router, as in the server-side nodejs 'express' framework,
##### You can do it this way:
```js
router.path('/guy/:lastname/was/:where', (params) => renderTemplate(params.lastname, params.where));
router.visit('/guy/peer/was/here'); // params = {lastname:'peer',where:'here'}
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
##### The 'submit' field can be an id of a submit button, or an object with 'input' and 'keyCode' fields, if
##### you want the 'onSubmit' function to invoke on a specific key press like 'enter' key, which has the key code 13.
##### example:
```html
<form name="friends-form">
    <input type="text" placeholder="friend name" id="friend-field" />
</form>
```
###### Now, we want the name to be submmited when 'enter' is pressed:
```js
Skeleton.form({
    name: 'friends-form',
    inputs: {
        friend: 'friend-field'
    },
    submit: {
        input: 'friend',
        keyCode: 13 // 'enter' key code
    },
    onSubmit(e) {
        let friend = this.friend.value;
        if(!friend)
            return;
        FriendsList.push({ friend });
        Skeleton.form.clear(this.name); // clear form's input and textarea fields
    }
});
```

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
Skeleton.bind('my-text')
        .to('my-input')
        .exec(value => {
            return `My text is updated whenever ${value} updates!`
        });

// By default, the event is 'keyup'. You can change it by passing your desired event to 'exec':
Skeleton.bind('my-text')
        .to('my-input')
        .exec(value => {
            return `My text is updated whenever ${value} changes!`;
        }, 'change');
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
###### Skeleton also comes with built in confirm and message popups you can easily create.
```js
const popup = Skeleton.Popup(); // initialize popup
```
###### When the popup is initialized, it has a defaults object for the overlay and the popup itself:
```js
{
    overlay: {
        bgcolor:'black',
        opacity:'0.8'
    },
    popup: {
        width:'400',
        height:'400',
        bgcolor:'white'
    }
}
```
###### In order to set your own defaults, use 'popup.setDefaults' function:
```js
popup.setDefaults({
    overlay: {
        bgcolor:'blue',
        opacity:'0.6'
    },
    popup: {
        width:'500',
        height:'400',
        bgcolor:'green'
});
```
###### To create a message popup:
```js
popup.message({
    title:'I am the message popup!',
    body:'I am sending out a love message to the world!',
    closeMessage:'Click me, and I\'ll disappear'
}); 

// required fields are 'title', 'body'.
// optional fields are 'closeMessage', 'height', 'width'.
```
###### To create a confirm popup:
```js
popup.confirm({
    title:'I am the confirm popup!',
    body:'Would you like to confirm me?',
    yesLabel:'Awsome',
    noLabel:'Go Away!',
    approve() {
        alert('You clicked Awsome!');
    },
    regret() {
        alert('Bye Bye!');
        popup.close(); // close the popup and the overlay
    }
});

// required fields are 'title', 'body', 'approve' and 'regret'. 
// optional fields are 'yesLabel', 'noLabel', 'height', 'width'.
```
###### Here is how a stylesheet should look if you want to style the popup and the overlay, buttons, etc.:
```css
/* overlay */
#skeleton-overlay {}

/* popup */
#skeleton-popup {}

/* confirm buttons */
#skeleton-popup #confirm-yes-label {}
#skeleton-popup #confirm-no-label {}

/* message button */
#skeleton-popup #close-message-popup {}
```
---
###### One more thing shipped with Skeleton is a custom event system you can create:
```js
const emitter = Skeleton.Event(); // initialize event emitter
```
###### The 3 functions provided are: 'on', 'emit' and 'dispose'.
```js
// set events & listeners
emitter.on('calc', (a,b,c) => alert(a+b+c)); // set listener for 'calc' event
emitter.on('basketball', () => console.log('I love basketball!')); // set listener for 'basketball' event
emitter.on('calc', (a,b) => console.log(a*b)); // set another listener for 'calc' event

// emit events
emitter.emit('calc', 1, 2, 3); // alerts 6, logs 2
emitter.emit('basketball'); // logs 'I love basketball!'

// dispose event
emitter.dispose('calc'); // 'calc' event can not be called anymore
```
---
###### Online and Offline messages support is built into Skeleton. You should use it, to let your user know
###### when the application can not perform network tasks because of poor internet connection. It looks like
###### this by default:

<img src="https://cloud.githubusercontent.com/assets/13187428/16193039/825d5c28-36f5-11e6-95b0-82468c0ebddf.png" title="offline" />
<img src="https://cloud.githubusercontent.com/assets/13187428/16193063/964a57b8-36f5-11e6-9460-5c17160c342d.png" title="online" />

###### To apply the default behavior of the online/offline messages just type:

```js
Skeleton.network(); // Automatically invokes message when connection losts and stablizes
```
###### The online message fades away when the connection is stable. Now, this is the default view and messages,
###### but you can customize it:

```js
// All properties are optional, in case you
// do not provide one, the default is set
Skeleton.network({
    // customized online message properties
    online: {
            message,
            position,
            width,
            height,
            color,
            textAlign,
            backgroundColor,
            fontSize,
            fontWeight,
            fontFamily,
            border
    },
    // customized offline message properties
    offline: {
            message,
            position,
            width,
            height,
            color,
            textAlign,
            backgroundColor,
            fontSize,
            fontWeight,
            fontFamily,
            border
    } 
});
```
##### All style properties are regular css properties except 'position', which can be set to
##### 'top', 'bottom', or 'middle', according to where on the screen you want the message to pop.
##### The 'message' property is the message you want to show.

---
###### Cookie handling is also very easy with Skeleton:

```js
// get cookies as object of cookie name and its value
let cookiesObject = Skeleton.cookies();

// get a specific cookie value
let specificCookieValue = Skeleton.cookies.get('name');

// set a cookie, with (name, value, expiration days).
// If you do not specify it, expiration days default value is 1
Skeleton.cookies.set('cookieName', 'cookieValue', 3);

// delete a cookie by its name
Skeleton.cookies.delete('cookieName');
```

---
###### Checking types with Skeleton is much easier than it is with plain javascript:
```js
const is = Skeleton.Type(); // initialize type checker

is.arr([1, 2, 3]) // true
is.str('hello!') // true
is.num(3) // true
is.func(() => alert('function!')) // true
is.obj({ a: 1, b: 2 }) // true

var a;
is.undef(a) // true
a = null;
is.null(a) // true
is.none(a) // true- if a variable is null or undefined

is.html(document.getElementById('dom-element')) // true
is.hex('#452A55') // true
is.rgb('rgb(10, 45, 63)') // true
is.rgba('rgba(52, 26, 158)') // true
is.color('#af4523') // true- if hex, rgb or rgba
```

---
###### Skeleton.js resources:
* [Skeleton on npm](https://www.npmjs.com/package/js-skeleton)
* [Skeleton on cdnjs](https://cdnjs.com/libraries/js-skeleton)
* [Skeleton code examples](./examples)

---
![skeleton.js](http://bestanimations.com/Humans/Skeletons/skeleton-animated-gif-3.gif "Skeleton")
