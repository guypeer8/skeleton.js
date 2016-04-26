## skeleton.js
#### Skeleton makes rendering static lists (add/remove model) very easy.

---

###### First, create a model:
```js
let recordId = 0; // Maybe you want to keep track of the record by its id 

let RecordModel = Skeleton.Model({
  defaults: {
    artist: '',
    song: '',
    album: '',
    year: '',
    sold: 0
  },
  init() {
    this.set('id', recordId++); // Set unique recordId when initialized
    console.log(`The song ${this.get('song')} by ${this.get('artist')} sold ${this.get('sold')} records.`);
  }
});
```

##### Required fields:
##### 'defaults': field to specify the default values of the model fields.
##### Optional fields:
##### 'init': function to be called everytime the model is initialized.
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
##### 'model': field to specify the model of each element in the list.
##### 'element': field that specifies the id of the DOM element that each list item should be rendered into.
##### 'template': field that is either a string that represents the template or an object with a 
##### 'templateId' field that specifies the id of the template in the html document.

---

###### Now, lets define a tempalte:
```html
<template id="record-template">
  <div class="record" data-id="{{ id }}">
    <div class="record-head">
      <span class="float-left">Album: {{ album }}</span>
      <span class="float-right">Year: {{ year }}</span>
      <div class="clear"></div>
    </div>
    <div class="record-body">
      '{{ song | upper }}' is a song by {{ artist | capitalize }} from the album {{ album }} that sold {{ sold }} records.
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

###### Check out the examples folder and the source code to see more.
###### On npm: https://www.npmjs.com/package/js-skeleton

---
![skeleton.js](http://bestanimations.com/Humans/Skeletons/skeleton-animated-gif-3.gif "Skeleton")
