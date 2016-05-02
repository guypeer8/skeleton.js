"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},Skeleton=function(){function e(t){function n(e){var n=Object.assign({},t.defaults)||{};this.get=function(e){return n[e]||null},this.set=function(){if(2===arguments.length)n[arguments[0]]=arguments[1];else{if(1!==arguments.length)throw new Error("Error on setting a value");var e=arguments[0];for(var t in e)n[t]=e[t]}},this.toJSON=function(){return n};for(var r in e)this.set(r,e[r]);t&&t.init&&t.init.call(this)}if(!(this instanceof e))return new e(t);if(!t||!t.defaults)throw new Error('A "defaults" field must be passed');for(var r in t)"init"!==r&&"defaults"!==r&&(n.prototype[r]=t[r]);return n}function t(e){function n(t){function n(e){"number"==typeof e?r.splice(e,1):r=r.filter(function(t){return t!==e})}var r=[],i=e&&e.model;this.add=function(e){if(!(e instanceof i))throw new Error("A collection must consist of models of same instance");r.push(e)},this.removeByFields=function(e){r=r.filter(function(t){for(var n in e)if(t.get(n)!==e[n])return!0;return!1})},this.remove=function(){if(1===arguments.length)n(arguments[0]);else for(var e=0;e<arguments.length;e++)n(arguments[e])},this.removeAll=function(){r=[]},this.models=function(){return r},this.filterToJSON=function(e){return this.toJSON().filter(e)},this.toJSON=function(){return r.map(function(e){return e.toJSON()})},this.size=function(){return r.length},e&&e.init&&e.init.call(this)}return this instanceof t?n:new t(e)}function n(e){function r(e,t){if(e)if("push"===e)v.push.forEach(function(e){return e()});else if("remove"===e)v.remove.forEach(function(e){return e()});else{if("filter"!==e)throw new Error("The type passed is not a possible type");v.filter.forEach(function(e){return e(t)})}else v.push.forEach(function(e){return e()}),v.remove.forEach(function(e){return e()})}function i(e){y.innerHTML=o(e)}function o(e){var t=e||S.toJSON();t.forEach(function(e){return e.index=c()});var n="";return t.forEach(function(e){n+=u(f(e),e)}),n}function u(e,t){var n=h(e),r=n.cloneNode(!0),i=r.querySelectorAll("[data-loop]");return i&&i.length?(Array.prototype.slice.call(i).forEach(function(e,r){var i=e.getAttribute("data-loop").trim();if(!t[i])throw new Error(i+" attribute does not appear in model");if(!Array.isArray(t[i]))throw new Error(i+"'s value must be an array");var o="";t[i].forEach(function(t){o+=l(e).replace(d,function(e,n){return-1!==n.indexOf("|")?s(t,n):a(t,n)})}),n.querySelector("[data-loop="+i+"]").innerHTML=o}),l(n)):e}function f(e){var t=b;return t=t.replace(m,function(t,n){return-1!==n.indexOf("|")?s(e,n):a(e,n)})}function s(e,t){var n=t.split("|"),r=n[0].trim(),i=n[1].trim(),o=a(e,r);if(!o)throw new Error('Please check the expression "'+r+'" you passed in the template');if(w[i])return w[i](o);throw new Error('The filter you are using does not exist. Please use "addFilter" function to create it.')}function a(e,t){if("this"===t)return e;var n=t.split(".");if(1===n.length)return e[t];for(var r=e[n[0].trim()],i=1;i<n.length;i++)r=r[n[i].trim()];return r}function c(){return p++}function l(e){var t=document.createElement("div");return t.appendChild(e),t.innerHTML}function h(e){var t=document.createElement("div");return t.innerHTML=e,t.firstElementChild}if(!(this instanceof n))return new n(e);var m=/{{\s*((\w+\.?\w+?)*\s*\|?\s*\w+)\s*}}/g,d=/{{\s*#((\w+\.?\w+?)*\s*\|?\s*\w+)\s*}}/g,p=0,v={push:[],remove:[],filter:[]},w={upper:function(e){return e.toUpperCase()},lower:function(e){return e.toLowerCase()},capitalize:function(e){return e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()},currency:function(e){return"$"+e},json:function(e){try{e=JSON.stringify(e)}catch(t){throw new Error("The argument passed can not be stringified to a json string")}return e}},g=e&&e.model,y=document.getElementById(e&&e.element),b=void 0,E=e&&e.template;if("string"==typeof E)b=E;else if("object"===("undefined"==typeof E?"undefined":_typeof(E))){if(!E.templateId)throw new Error('Template must be a string, or an object with "templateId" field');b=document.getElementById(E.templateId).innerHTML}if(!g)throw new Error("A model must be supplied");if(!y)throw new Error("An element must be supplied, provided by its id");if(!b)throw new Error("A template id or string must be supplied");var S=new new t({model:g});this.getCollection=function(){return S},this.models=function(){return S.toJSON()},this.updateView=i,this.pushAll=function(e){e.forEach(function(e){return S.add(new g(e))}),i(),r("push")},this.push=function(e){e instanceof g?S.add(e):S.add(new g(e)),i(),r("push")},this.remove=function(e){for(var t=this.models(),n=0;n<t.length;n++){var o=t[n];if(o.index===e){S.remove(n);break}}return i(),r("remove"),t[n]},this.removeByFields=function(e){S.removeByFields(e),i(),r("remove")},this.removeAll=function(){S.removeAll(),i(),r("remove")},this.get=function(e){for(var t=this.models(),n=0;n<t.length;n++){var r=t[n];if(r.index===e)return r}},this.size=function(){return S.size()},this.filter=function(e){var t=S.filterToJSON(e);return i(t),r("filter",t),t},this.addFilter=function(e,t){if("string"!=typeof e)throw new Error("Filter name must be a string");if("function"!=typeof t)throw new Error("Filter callback must be a function");w[e]=t},this.subscribe=function(){function e(e,t){for(var n=0;n<v[e].length;n++)if(v[e][n]===t){v[e].splice(n,1);break}}var t=arguments;if(1===arguments.length&&"function"==typeof arguments[0]){var n=function(){var n=t[0];return v.push.push(n),v.remove.push(n),{v:function(){e("push",n),e("remove",n)}}}();if("object"===("undefined"==typeof n?"undefined":_typeof(n)))return n.v}else{if(2!==arguments.length)throw new Error('You should pass a callback function or a type "push" or "remove" and a callback to subscribe');var r=function(){var n=t[0],r=t[1];if(v[n])return v[n].push(r),{v:function(){return e(n,r)}};throw new Error('type of listener must be "push", "remove" or "filter"')}();if("object"===("undefined"==typeof r?"undefined":_typeof(r)))return r.v}}}return{Model:e,List:n}}();