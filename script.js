"use strict";

let Vutur__state = [];

function Vutur() {
	const attributes = ["show", "if", "text", "html", "cloak", "on"];
	function safeEval(str) {
		return new Function(str)();
	};

	function $(selector) {
		return document.querySelectorAll(selector);
	};

	$("[data-v-show]").forEach(el => {
		if (!el.dataset.vShowDisplayMode) {
			el.setAttribute("data-v-show-display-mode", getComputedStyle(el).getPropertyValue("display"));
		};

		if (safeEval(`return ${el.dataset.vShow}`)) {
			el.style.display = el.dataset.vShowDisplayMode;
		} else {
			el.style.display = "none";
		};
	});

	$("[data-v-if]").forEach(el => {
		if (!el.dataset.vIfStateId && !el.dataset.vCollapsed) {
			el.setAttribute("data-v-if-state-id", Vutur__state.length);
			Vutur__state.push({
				html: el.outerHTML
			});
		};
		if (!safeEval(`return ${el.dataset.vIf}`)) {
			el.outerHTML = `<div data-v-if="${el.dataset.vIf}" data-v-if-state-id="${el.dataset.vIfStateId}" data-v-collapsed="yes"></div>`;
		} else if (el.dataset.vCollapsed) {
			el.outerHTML = Vutur__state[el.dataset.vIfStateId].html;
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
		const params = el.dataset.vOn.split(":", 2);
		if (!el.dataset.vOnSet) {
			el.setAttribute("data-v-on-set", params[0]);
			el.addEventListener(params[0], new Function(params[1]));
		};
	});

	$("[data-v-once] *").forEach(el => {
		attributes.forEach(element => {
			el.removeAttribute(`data-v-${element}`);
		});
	});
};

function define(varName, value) {
	window[`${varName}__internal`] = value;
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

Vutur.define = function (obj) {
	// eslint ma depresje jak dam ; w ifie
	// eslint-disable-next-line guard-for-in
	for (let key in obj.data) {
		if (Object.prototype.hasOwnProperty.call(obj.data, key)) {
			define(key, obj.data[key]);
		};
	};
};