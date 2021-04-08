/**
 * Vutur 0.1 - By ProgramistaZpolski
 * @license MIT
 */
"use strict";

/**
 * A variable to keep information about the state of the application
 */
let Vutur__state = {
	dom: [],
	lengths: {}
};

/**
 * The master function. It's reponsible for all reactivity;
 */
function Vutur() {
	/**
	 * @constant {Array} attributes List of avalible attributes, for data-v-once to remove
	 */
	const attributes = ["show", "if", "text", "html", "cloak", "on", "once"];

	/**
	 * A safer version of eval
	 * @param {String} str String of code to execute
	 */
	function safeEval(str) {
		return new Function(str)();
	};

	/**
	 * A shortcut for document.querySelectorAll
	 * @param {String} selector A CSS selector string
	 */
	function $(selector) {
		return document.querySelectorAll(selector);
	};

	$("input[data-v-model], textarea[data-v-model]").forEach(el => {
		if (!el.dataset.vModelHandled) {
			/**
			 * If the event handler is not yet added, add it now.
			 * After that, add an attribute that will inform Vutur that the handler has been added
			 */
			// eslint-disable-next-line no-use-before-define
			define(el.dataset.vModel, el.value);
			el.addEventListener("input", Vutur);
			el.setAttribute("data-v-model-handled", el.dataset.vModel);
		} else {
			// Only update the variable if the values are not the same
			if (window[el.dataset.vModel] !== el.value) {
				window[el.dataset.vModel] = el.value;
			};
		};
	});

	$("[data-v-show]").forEach(el => {
		if (!el.dataset.vShowDisplayMode) {
			/** 
			 * save the current CSS display value to an attribute
			 * We're using getComputedStyle, in order to save the display value in case the style.display value is undefined.
			*/
			el.setAttribute("data-v-show-display-mode", getComputedStyle(el).getPropertyValue("display"));
		};

		// Update the display values accordingly
		if (safeEval(`return ${el.dataset.vShow}`)) {
			el.style.display = el.dataset.vShowDisplayMode;
		} else {
			el.style.display = "none";
		};
	});

	$("[data-v-if]").forEach(el => {
		// check if the element that we fetched is still in the DOM; If it is in the DOM, save it to the Vutur__state variable.
		if (!el.dataset.vIfStateId && !el.dataset.vCollapsed) {
			el.setAttribute("data-v-if-state-id", Vutur__state.dom.length);
			Vutur__state.dom.push({
				html: el.outerHTML
			});
		};
		if (!safeEval(`return ${el.dataset.vIf}`)) {
			// remove the element from DOM, instead place a <div> that carries all the information needed to reconstruct the element
			el.outerHTML = `<div data-v-if="${el.dataset.vIf}" data-v-if-state-id="${el.dataset.vIfStateId}" data-v-collapsed="yes"></div>`;
		} else if (el.dataset.vCollapsed) {
			// restore the element from the Vutur__state variable
			el.outerHTML = Vutur__state.dom[el.dataset.vIfStateId].html;
		};
	});

	$("[data-v-if]+[data-v-else]").forEach(el => {
		// simillar to data-v-if, just removed ! from the if
		if (!el.dataset.vElseStateId && !el.dataset.vCollapsed) {
			el.setAttribute("data-v-else-state-id", Vutur__state.dom.length);
			Vutur__state.dom.push({
				html: el.outerHTML
			});
		};
		if (safeEval(`return ${el.dataset.vElse}`)) {
			el.outerHTML = `<div data-v-else="${el.dataset.vElse}" data-v-else-state-id="${el.dataset.vElseStateId}" data-v-collapsed="yes"></div>`;
		} else if (el.dataset.vCollapsed) {
			el.outerHTML = Vutur__state.dom[el.dataset.vElseStateId].html;
		};
	});

	$("[data-v-text]").forEach(el => {
		el.innerText = safeEval(`return ${el.dataset.vText}`);
	});

	$("[data-v-html]").forEach(el => {
		el.innerHTML = safeEval(`return ${el.dataset.vHtml}`);
	});

	$("[data-v-cloak]").forEach(el => {
		el.removeAttribute("data-v-cloak");
	});

	$("[data-v-on]").forEach(el => {
		/**
		 * @constant {Array} params The arguments for the handler;
		 * First element will be the event name,
		 * the second one will be the code.
		 */
		const params = el.dataset.vOn.split(":", 2);
		if (!el.dataset.vOnSet) {
			// If the handler is not already added, add it.
			el.setAttribute("data-v-on-set", params[0]);
			el.addEventListener(params[0], new Function(params[1]));
		};
	});

	$("[data-v-for]").forEach(el => {
		for (let i = 0; i < window[el.dataset.vFor].length; i++) {
			// replace the {{ el }} with an element from the array
			let content = el.innerHTML.replaceAll("{{ el }}", window[el.dataset.vFor][i]);
			let tempEl = el.cloneNode(true);
			// associate the new cloned element with the original element, so that we can later on delete it when we need to.
			tempEl.setAttribute("data-v-for-associate", el.dataset.vFor);
			// remove the data-v-for attribute, or else every time the DOM refreshes, all the elements that were cloned will be doubled
			tempEl.removeAttribute("data-v-for");
			tempEl.innerHTML = content;
			el.parentNode.insertBefore(tempEl, el);
		};
		Vutur__state.lengths[el.dataset.vFor] = window[el.dataset.vFor].length;
		// add all the information needed to reconstruct the original element
		el.setAttribute("data-v-for-source", el.dataset.vFor);
		el.setAttribute("data-v-for-display-mode", getComputedStyle(el).getPropertyValue("display"));
		el.removeAttribute("data-v-for");
		// hide the original element
		el.style.display = "none";
	});

	$("[data-v-for-source]").forEach(el => {
		// check if any of the data changed
		if (window[el.dataset.vForSource].length !== Vutur__state.lengths[el.dataset.vForSource]) {
			// remove all the elements associated with the original
			document.querySelectorAll(`[data-v-for-associate="${el.dataset.vForSource}"]`).forEach(oldEl => oldEl.remove());
			for (let i = 0; i < window[el.dataset.vForSource].length; i++) {
				// recreate all elements with the new data
				let content = el.innerHTML.replaceAll("{{ el }}", window[el.dataset.vForSource][i]);
				let tempEl = el.cloneNode(true);
				tempEl.innerHTML = content;
				tempEl.style.display = el.dataset.vForDisplayMode;
				el.parentNode.insertBefore(tempEl, el);
			};
			Vutur__state.lengths[el.dataset.vForSource] = window[el.dataset.vForSource].length;
		};
	});

	$("[data-v-once] *").forEach(el => {
		// remove all attributes after running them
		attributes.forEach(element => {
			el.removeAttribute(`data-v-${element}`);
		});
	});

	$("[data-v-once]").forEach(el => {
		el.removeAttribute("data-v-once");
	});
};

/**
 * Define a new Reactive Variable
 * @param {String} varName name of the new variable
 * @param {*} value Value that the new variable should be set to
 */
function define(varName, value) {
	// Hide the actual variable under the {variable}__internal name
	window[`${varName}__internal`] = value;
	// register the getters and setters
	Object.defineProperty(window, varName, {
		get: function () {
			return window[`${varName}__internal`];
		},

		set: function (val) {
			window[`${varName}__internal`] = val;
			Vutur();
		}
	});
};

/**
 * A function for adding multiple variables at once, uses define at it's core.
 * @param {Object} obj Information to add
 */
Vutur.extend = function (obj) {
	// eslint gets depressed if i put a semicolon in an if
	// eslint-disable-next-line guard-for-in
	for (let key in obj.data) {
		if (Object.prototype.hasOwnProperty.call(obj.data, key)) {
			define(key, obj.data[key]);
		};
	};
}; 

Vutur.version = {
	version: "0.1",
	fullName: "0.1 - Granite Peak",
	releaseName: "Granite Peak"
};