![Vutur](vutur_transparent_tagline.png)
# Vutur - A liteweight rewrite of Vue.js
***Warning: This framework is still in the Alpha phase. It will be unstable, and a lot of things will change.***  
Vutur is a liteweight reactive framework, that is a rewrite of Vue.js. It's syntax is similar to Vue.js, but it has some improvements. Here's an example of initializing a new Vue App:
```js
// Code for Vue 2.6
"use strict";
let app = new Vue({
	el: '#app'
});
```
And here's Vutur:
```js
// Code for Vutur 0.1
```
That's right - you don't need to initialize Vutur!  
Now, you might be asking yourself - how do I pass data?!  
It's simple:
```js
Vutur.extend({
	data: {
		msg: "Hello Vutur!"
	}
});
```
Vutur will make the variable avalible globally, so you can use it just like any other variable!  
Vutur fixes another problem with Vue - you can't really define variables later on. Vutur fixes that; You can call Vutur.extend at any moment, but if you want to define only one variable, you can use the `define` method:
```js
define("myVariable", "myValue");
```
Ok, that's a lot of variables.
Let's move on to something else - Directives!  
They allow you to sprinkle in some JavaScript behaviour into your HTML.  
Here's a list of them:

| Name         | Description                                                                                          |
|--------------|------------------------------------------------------------------------------------------------------|
| data-v-text  | Sets the innerText of an element to a result of a expression                                         |
| data-v-html  | Sets the innerHTML of an element to a result of a expression                                         |
| data-v-show  | Hides the element, if the result of a expression is equal to false                                   |
| data-v-if    | Removes the element from DOM, if the result of a expression is equal to false                        |
| data-v-else  | Shows an element, if the expression of data-v-if is equal to false                                   |
| data-v-model | Sets the value of variable to value of a input - Adds two-way binding to the element                 |
| data-v-cloak | This attribute is removed when Vutur initialized, useful for hiding DOM that has not yet been loaded |
| data-v-on    | Attaches a handler to the specified element                                                          |
| data-v-for   | Duplicates a element and fills in the data based on an array                                         |
| data-v-once  | Marks, that the directives in there should only be run once                                          |
*(More directives will of course come in the future)*

## Directives

### `data-v-text`

**Example**:
```html
<p data-v-text="lorem"></p>
```
`data-v-text` will set the innerText of an element to the specified variable/expression.

### `data-v-html`

**Example**:
```html
<p data-v-html="lorem"></p>
```
`data-v-html` will set the innerHTML of an element to the specified variable/expression. Works very similarly to `data-v-text`

### `data-v-show`
**Example**:
```html
<h1 data-v-show="trains">I like trains</h1>
```
Toggles the visiblity of the element, based on the variable/expression.

### `data-v-if`
**Example**:
```html
<h1 data-v-if="trains">I like trains</h1>
```
Removes the element from DOM, based on the variable/expression. The element is saved onto a variable, so that it can be restored once the variable/expression gets changes to evaluate to true.

### `data-v-else`
**Example**:
```html
<h1 data-v-else="trains">I like trains</h1>
```
Will show an element, if the previous data-v-if was evaluated to false. Note that, in order for this to work the data-v-else attribute must be set to the same value as the data-v-if attribute.

### `data-v-model`
**Example**:
```html
<label for="myInput">Enter your name:</label>
<input type="text" name="myInput" data-v-model="myName">
<p>Hello, <span data-v-text="myName"></span>!</p>
```
This adds two-way binding to the element. When a user inputs anything into an input field, a variable specified will be updated. Works only on `<input>` and `<textarea>` elements.

### `data-v-cloak`
**Example**:
```html
<style>
	[data-v-cloak] {
		display: none;
	}
</style>

<div data-v-cloak>
	content here
</div>
```
This attribute gets removed when Vutur initializes. Can be used to hide some DOM.

### `data-v-on`
**Example**:
```html
<button data-v-on="click:alert('cement!');">Click me</button>
<button data-v-on="mouseover:alert('cement!');">Hover over me</button>
```
Attaches an event handler to the element. Syntax: `data-v-on="handlerName:javascriptToRun"`


### `data-v-for`
**Example**:
```html
<ul>
	<li data-v-for="points">{{ el }}</li>
</ul>
```
This will repeat the element based on how much elements in the array are there; {{ el }} will be replaced with a element from the specified array.

### `data-v-once`
**Example**:
```html
<div data-v-once>
	<p data-v-text="title"></p>
</div>
```
The directives inside will be run only once.

## Sizes
Vutur is very liteweight. It's only 3.59KB when minified, 1155 bytes when gzipped and only 994 bytes with brotli! Vue on the other hand, weights 22.9
kB gzipped and 63.7 kB minified.

## v1 Roadmap
- Implement all of Vue.js directives
- Add basic component support
- Make the `data-v-for` attribute work more like Vue's and Apline's `v-for` and `x-for`

## License
This software is licensed under MIT, you can use it any way you want if you just credit me.