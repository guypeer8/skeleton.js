"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},Skeleton=function(){function e(t){function n(e){var n=Object.assign({},t.defaults)||{};this.get=function(e){return n[e]||null},this.set=function(){if(2===arguments.length)n[arguments[0]]=arguments[1];else{if(1!==arguments.length)throw new Error("Error on setting a value");var e=arguments[0];for(var t in e)n[t]=e[t]}},this.toJSON=function(){return n};for(var r in e)this.set(r,e[r]);t&&t.init&&t.init.call(this)}if(!(this instanceof e))return new e(t);if(!t||!t.defaults)throw new Error('A "defaults" field must be passed');for(var r in t)"init"!==r&&"defaults"!==r&&(n.prototype[r]=t[r]);return n}function t(e){function n(e,t){if(e){if(!v[e])throw new Error("The type passed is not a possible type");v[e].forEach(function(e){return e(t)})}else v.push.forEach(function(e){return e(t)}),v.remove.forEach(function(e){return e(t)})}function r(e,t){e instanceof y||(e=new y(e));var r=l();e.set("index",r);var i=e.toJSON();O[r]=e,o(i,t),n("push",i)}function o(e,t){var n=d(s(a(e),e));if("push"===t)b.appendChild(n);else{if("unshift"!==t)throw new Error('unknown method passed to "_updateSingleModelView"');b.insertBefore(n,b.childNodes[0])}}function i(e){var t='[data-id="'+e+'"]';b.querySelector(t).remove()}function u(e){var t=e||A.models(),n="";return t.forEach(function(e){n+=s(a(e),e)}),n}function s(e,t){var n=d(e),r=n.querySelectorAll("[data-loop]");return r&&r.length?(Array.prototype.slice.call(r).forEach(function(n,r){var o=n.getAttribute("data-loop").trim(),i=t[o];if(!i)throw new Error(o+" attribute does not appear in model");if(!Array.isArray(i))throw new Error(o+"'s value must be an array");var u=h(n),s="";i.forEach(function(e){s+=u.replace(m,function(t,n){return-1!==n.indexOf("|")?f(e,n):c(e,n)})}),e=e.replace(u,s)}),e):e}function a(e){var t=E;return t=t.replace(p,function(t,n){return-1!==n.indexOf("|")?f(e,n):c(e,n)})}function f(e,t){var n=t.split("|"),r=n[0].trim(),o=n[1].trim(),i=c(e,r);if(!i)throw new Error('Please check the expression "'+r+'" you passed in the template');if(g[o])return g[o](i);throw new Error('The filter you are using does not exist. Please use "addFilter" function to create it.')}function c(e,t){if("this"===t)return e;var n=t.split(".");if(1===n.length)return e[t];for(var r=e[n[0].trim()],o=1;o<n.length;o++)r=r[n[o].trim()];return r}function l(){return w++}function h(e){var t=document.createElement("div");return t.appendChild(e),t.innerHTML}function d(e){var t=document.createElement("div");return t.innerHTML=e,t.firstElementChild}if(!(this instanceof t))return new t(e);var p=/{{\s*((\w+\.?\w+?)*\s*\|?\s*\w+)\s*}}/g,m=/{{\s*#\s*((\w+\.?\w+?)*\s*\|?\s*\w+)\s*}}/g,w=0,v={push:[],remove:[],filter:[],pushAll:[],removeAll:[]},g={upper:function(e){return e.toUpperCase()},lower:function(e){return e.toLowerCase()},capitalize:function(e){return e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()},currency:function(e){return"$"+e},json:function(e){try{e=JSON.stringify(e)}catch(t){throw new Error("The argument passed can not be stringified to a json string")}return e}},y=e&&e.model,b=document.getElementById(e&&e.element),E=void 0,S=e&&e.template;if("string"==typeof S)E=S;else if("object"===("undefined"==typeof S?"undefined":_typeof(S))){if(!S.templateId)throw new Error('Template must be a string, or an object with "templateId" field');E=document.getElementById(S.templateId).innerHTML}if(!y)throw new Error("A model must be supplied");if(!b)throw new Error("An element must be supplied, provided by its id");if(!E)throw new Error("A template id or string must be supplied");var A=this,O={};this.getCollection=function(){return Object.keys(O).map(function(e){return O[e]})},this.models=function(){return Object.keys(O).map(function(e){return O[e].toJSON()})},this.pushAll=function(e){e.forEach(function(e){e.index=l(),O[e.index]=new y(e)}),b.innerHTML+=u(),n("pushAll",this.models())},this.push=function(e){r(e,"push")},this.unshift=function(e){r(e,"unshift")},this.remove=function(e){if(O[e]){var t=O[e];return delete O[e],i(e),n("remove",t),t}},this.lastIndex=function(){return 0===this.size()?-1:w-1},this.firstIndex=function(){var e=Object.keys(O);if(e.length){var t=1/0;return e.forEach(function(e){t>e&&(t=e)}),t}},this.removeAll=function(){O={},b.innerHTML="",n("removeAll")},this.get=function(e){return O[e]?O[e].toJSON():null},this.size=function(){return Object.keys(O).length},this.filter=function(e){var t=this.models().filter(e);return b.innerHTML=u(t),n("filter",t),t},this.sort=function(e){e=e||function(e,t){return e.index-t.index};var t={};this.models().sort(e).forEach(function(e){t[e.index]=O[e.index]}),O=t,b.innerHTML=u()},this.addFilter=function(e,t){if("string"!=typeof e)throw new Error("Filter name must be a string");if("function"!=typeof t)throw new Error("Filter callback must be a function");g[e]=t},this.subscribe=function(){function e(e,t){for(var n=0;n<v[e].length;n++)if(v[e][n]===t){v[e].splice(n,1);break}}var t=arguments;if(1===arguments.length&&"function"==typeof arguments[0]){var n=function(){var n=t[0];return v.push.push(n),v.remove.push(n),{v:function(){e("push",n),e("remove",n)}}}();if("object"===("undefined"==typeof n?"undefined":_typeof(n)))return n.v}else{if(2!==arguments.length)throw new Error('You should pass a callback function or a type "push" or "remove" and a callback to subscribe');var r=function(){var n=t[0],r=t[1];if(v[n])return v[n].push(r),{v:function(){return e(n,r)}};throw new Error('type of listener must be "push", "remove" or "filter"')}();if("object"===("undefined"==typeof r?"undefined":_typeof(r)))return r.v}}}function n(e){try{return e=JSON.stringify(e)}catch(t){return e}}function r(e){try{return e=JSON.parse(e)}catch(t){return e}}var o={save:function(){if(window.localStorage)if(2===arguments.length){var e=arguments[0],t=arguments[1];if("string"!=typeof e)throw new Error("First item must be a string");t=n(t),window.localStorage.setItem(e,t)}else{if(1!==arguments.length||"object"!==_typeof(arguments[0]))throw new Error("Method save must get key an value, or an object of keys and values");var r=arguments[0];for(var o in r){var i=r[o];i=n(i),window.localStorage.setItem(o,i)}}},fetch:function(e){if(window.localStorage){var t=window.localStorage.getItem(e);return t?r(t):null}},clear:function(){window.localStorage&&window.localStorage.clear()}};return{Model:e,List:t,storage:o}}();