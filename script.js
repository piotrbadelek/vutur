"use strict";

function Vutur() {
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
		if (!safeEval(`return ${el.dataset.vIf}`)) {
			el.remove();
		};
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

Vutur.new = function (obj) {
	// eslint ma depresje jak dam ; w ifie
	// eslint-disable-next-line guard-for-in
	for (let key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			define(key, obj[key]);
		};
	};
};