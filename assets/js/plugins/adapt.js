/*
 * adapt.js
 *
 * Copyright (c) 2023 Moiseev Evgeny
 * Organization: WebisGroup
 *
 * Adapt - данный класс существенно облегчает адаптацию вёрстки.
 */

class Adapt {
	constructor() {
		this.objects = [];
		this.adaptClassName = "_adapt_";
		this.elems = document.querySelectorAll("[data-adapt]");

		this.#init();
	}

	#init() {
		this.elems.forEach(node => {
			const data = node.dataset.adapt.trim();
			const [destination, breakpoint, place] = data.split(/,\s*/);
			const object = {
				element: node,
				parent: node.parentNode,
				destination: document.querySelector(`.${destination}`),
				breakpoint: breakpoint ? breakpoint : "767",
				place: place ? place : "last",
				index: this.#indexInParent(node.parentNode, node),
			};
			object.place = parseInt(object.place) ? object.place - 1 : object.place;
			this.objects.push(object);
		});

		this.#elemsSort(this.objects);

		// массив уникальных медиа-запросов
		this.mediaQueries = [... new Set(this.objects.map(item => `(max-width: ${item.breakpoint}px),` + item.breakpoint))];

		// навешивание слушателя на медиа-запрос и вызов обработчика при первом запуске
		this.mediaQueries.forEach(media => {
			const [mediaQuery, mediaBreakpoint] = media.split(/,\s*/);
			const matchMediaObj = window.matchMedia(mediaQuery);

			// массив объектов с подходящим брейкпоинтом
			const breakpointElems = this.objects.filter(elem => elem.breakpoint === mediaBreakpoint);

			matchMediaObj.addEventListener('change', function() {
				this.#mediaHandler(matchMediaObj, breakpointElems);
			}.bind(this));
			this.#mediaHandler(matchMediaObj, breakpointElems);
		});
	}

	// Функция получения индекса внутри родителя
	#indexInParent(parent, element) {
		return Array.from(parent.children).indexOf(element);
	}

	// Функция сортировки массива по breakpoint и place
	#elemsSort(elems) {
		elems.sort((elemA, elemB) => {
			if (elemA.breakpoint === elemB.breakpoint) {
				if (elemA.place === elemB.place) return 0;
				if (elemA.place === "first" || elemB.place === "last") return 1;
				if (elemA.place === "last" || elemB.place === "first") return -1;
				return elemB.place - elemA.place;
			}
			return elemB.breakpoint - elemA.breakpoint;
		});
		return;
	}

	// Обработчик медиазапросов
	#mediaHandler(matchMediaObj, elems) {
		if (matchMediaObj.matches) {
			elems.forEach(elem => {
				elem.index = this.#indexInParent(elem.parent, elem.element);
				this.#moveTo(elem.place, elem.element, elem.destination);
			});
		} else {
			elems.slice().reverse().forEach(elem => {
				if (elem.element.classList.contains(this.adaptClassName)) {
					this.#moveBack(elem.parent, elem.element, elem.index);
				}
			});
		}
	};

	// Перемещение элемента
	#moveTo(place, element, destination) {
		element.classList.add(this.adaptClassName);
		if (place === 'last' || place >= destination.children.length) {
			destination.insertAdjacentElement('beforeend', element);
			return;
		}
		if (place === 'first') {
			destination.insertAdjacentElement('afterbegin', element);
			return;
		}
		destination.children[place].insertAdjacentElement('beforebegin', element);
	}

	// Возвращение элемента
	#moveBack(parent, element, index) {
		element.classList.remove(this.adaptClassName);
		if (parent.children[index] !== undefined) {
			parent.children[index].insertAdjacentElement('beforebegin', element);
		} else {
			parent.insertAdjacentElement('beforeend', element);
		}
	}
}