"use strict";

let Vutur__state = {
	dom: [],
	lengths: {}
};

function Vutur() {
	const attributes = ["show", "if", "text", "html", "cloak", "on", "once"];
	function safeEval(str) {
		return new Function(str)();
	};

	function $(selector) {
		return document.querySelectorAll(selector);
	};

	$("input[data-v-model], textarea[data-v-model]").forEach(el => {
		if (!el.dataset.vModelHandled) {
			// eslint-disable-next-line no-use-before-define
			define(el.dataset.vModel, el.value);
			el.addEventListener("input", Vutur);
			el.setAttribute("data-v-model-handled", el.dataset.vModel);
		} else {
			if (window[el.dataset.vModel] !== el.value) {
				window[el.dataset.vModel] = el.value;
			};
		};
	});

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
			el.setAttribute("data-v-if-state-id", Vutur__state.dom.length);
			Vutur__state.dom.push({
				html: el.outerHTML
			});
		};
		if (!safeEval(`return ${el.dataset.vIf}`)) {
			el.outerHTML = `<div data-v-if="${el.dataset.vIf}" data-v-if-state-id="${el.dataset.vIfStateId}" data-v-collapsed="yes"></div>`;
		} else if (el.dataset.vCollapsed) {
			el.outerHTML = Vutur__state.dom[el.dataset.vIfStateId].html;
		};
	});

	$("[data-v-if]+[data-v-else]").forEach(el => {
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
		const params = el.dataset.vOn.split(":", 2);
		if (!el.dataset.vOnSet) {
			el.setAttribute("data-v-on-set", params[0]);
			el.addEventListener(params[0], new Function(params[1]));
		};
	});

	$("[data-v-for]").forEach(el => {
		for (let i = 0; i < window[el.dataset.vFor].length; i++) {
			let content = el.innerHTML.replaceAll("{{ el }}", window[el.dataset.vFor][i]);
			let tempEl = el.cloneNode(true);
			tempEl.setAttribute("data-v-for-associate", el.dataset.vFor);
			tempEl.removeAttribute("data-v-for");
			tempEl.innerHTML = content;
			el.parentNode.insertBefore(tempEl, el);
		};
		Vutur__state.lengths[el.dataset.vFor] = window[el.dataset.vFor].length;
		el.setAttribute("data-v-for-source", el.dataset.vFor);
		el.setAttribute("data-v-for-display-mode", getComputedStyle(el).getPropertyValue("display"));
		el.removeAttribute("data-v-for");
		el.style.display = "none";
	});

	$("[data-v-for-source]").forEach(el => {
		if (window[el.dataset.vForSource].length !== Vutur__state.lengths[el.dataset.vForSource]) {
			document.querySelectorAll(`[data-v-for-associate="${el.dataset.vForSource}"]`).forEach(oldEl => oldEl.remove());
			for (let i = 0; i < window[el.dataset.vForSource].length; i++) {
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
		attributes.forEach(element => {
			el.removeAttribute(`data-v-${element}`);
		});
	});

	$("[data-v-once]").forEach(el => {
		el.removeAttribute("data-v-once");
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

Vutur.extend = function (obj) {
	// eslint ma depresje jak dam ; w ifie
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