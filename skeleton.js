var Skeleton=function(){function t(e){function n(t){var n=Object.assign({},e.defaults)||{};this.get=function(t){return n[t]||null},this.set=function(){if(2===arguments.length)n[arguments[0]]=arguments[1];else{if(1!==arguments.length)throw Error("Error on setting a value");var t=arguments[0];for(var e in t)n[e]=t[e]}},this.toJSON=function(){return n};for(var r in t)this.set(r,t[r]);e&&e.init&&e.init.call(this)}if(!(this instanceof t))return new t(e);for(var r in e)"init"!==r&&"defaults"!==r&&(n.prototype[r]=e[r]);return n}function e(t){function n(){function e(t){"number"==typeof t?n.splice(t,1):n=n.filter(function(e){return e!==t})}var n=[],r=t&&t.model;this.add=function(t){if(!(t instanceof r))throw Error("A collection must consist of models of same instance");n.push(t)},this.removeByFields=function(t){n=n.filter(function(e){for(var n in t)if(e.get(n)!==t[n])return!0;return!1})},this.remove=function(){if(1===arguments.length)e(arguments[0]);else for(var t=0;t<arguments.length;t++)e(arguments[t])},this.removeAll=function(){n=[]},this.models=function(){return n},this.filterToJSON=function(t){var e=this.toJSON();for(var n in t)e=e.filter(function(e){return e[n]===t[n]});return e},this.toJSON=function(){return n.map(function(t){return t.toJSON()})},t&&t.init&&t.init.call(this)}return this instanceof e?n:new e(t)}function n(t){function r(t){h.innerHTML=i(t)}function i(t){var e=t||d.toJSON();e.forEach(function(t){t.index=u()});var n="";return e.forEach(function(t){n+=o(t)}),n}function o(t){var e=f;return e=e.replace(a,function(e,n){if(-1!==n.indexOf("|")){var r=n.split("|"),i=r[0].trim(),o=r[1].trim(),u=s(t,i);if(!u)throw Error('Please check the expression "'+i+'" you passed in the template');if("upper"===o)return u.toUpperCase();if("lower"===o)return u.toLowerCase();if("capitalize"===o)return u.charAt(0).toUpperCase()+u.slice(1).toLowerCase();if("currency"===o)return"$"+u;if("json"===o){try{u=JSON.stringify(u)}catch(f){throw Error("The argument passed can not be stringified to a json string")}return u}throw Error("The filter you are using is not supported. Please write to guypeer8@gmail.com to get support to what you need")}return s(t,n)})}function s(t,e){var n=e.split(".");if(1===n.length)return t[e];for(var r=t[n[0].trim()],i=1;i<n.length;i++)r=r[n[i].trim()];return r}function u(){return l++}if(!(this instanceof n))return new n(t);var f,a=/{{\s*((\w+\.\w+)*\s*\|?\s*\w+)\s*}}/g,l=-1,c=t&&t.model,h=document.getElementById(t&&t.element),m=t&&t.template;if("string"==typeof m)f=m;else if("object"==typeof m){if(!m.templateId)throw Error('Template must be a string, or an object with "templateId" field');f=document.getElementById(m.templateId).innerHTML}if(!c)throw Error("A model must be supplied");if(!h)throw Error("An element must be supplied, provided by its id");if(!f)throw Error("A template must be supplied");var d=new new e({model:c});this.getCollection=function(){return d},this.models=function(){return d.toJSON()},this.updateView=r,this.renderAll=function(){r()},this.pushAll=function(t){t.forEach(function(t){d.add(new c(t))}),r()},this.push=function(t){d.add(t instanceof c?t:new c(t)),r()},this.removeByFields=function(t){d.removeByFields(t),r()},this.remove=function(t){for(var e=this.models(),n=0;n<e.length;n++){var i=e[n];if(i.index===t){d.remove(n);break}}return r(),e[n]},this.removeAll=function(){d.removeAll(),r()},this.get=function(t){for(var e=this.models(),n=0;n<e.length;n++){var r=e[n];if(r.index===t)return r}},this.size=function(){return this.models().length},this.filter=function(t){var e=d.filterToJSON(t);r(e)}}return{Model:t,List:n}}();