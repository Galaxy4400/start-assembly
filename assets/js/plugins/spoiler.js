/*
 * spoiler.js
 *
 * Copyright (c) 2023 Moiseev Evgeny
 * Organization: WebisGroup
 *
 * Spoiler - простой но очень гибкий класс для создания спойлеров
 *
 * Требуется подключение стилей: assets/scss/_spoiler.scss
 */

class Spoiler {
	constructor(selector, options) {	
		const defaultOptions = {
			speed: 300,
			single: false,
			open: false,
			mediaMin: null,
			mediaMax: null,
		};

		this.options = Object.assign(defaultOptions, options);

		this.classes = {
			init: '_init',
			active: '_active',
			spoiler: '_spoiler',
			spoilerItem: '_spoiler-item',
			spoilerControl: '_spoiler-control',
			spoilerContainer: '_spoiler-container',
			spoilerWrapper: '_spoiler-wrapper',
		};

		this.elements = {};
		
		this.elements.spoiler = typeof selector === 'object' ? selector : document.querySelector(`[data-spoiler="${selector}"]`);

		if (!this.elements.spoiler) return;

		this.elements.items = this.elements.spoiler.querySelectorAll('[data-spoiler-item]');
		this.elements.controls = this.elements.spoiler.querySelectorAll('[data-spoiler-control]');
		this.elements.containers = this.elements.spoiler.querySelectorAll('[data-spoiler-container]');

		this.#check();
		this.#build();
		this.#initByMedia();
	}


	/**
	 * Проверка на корректность
	 */
	#check() {
		if (!this.elements.items.length) {
			console.error('В спойлере нет элементов');
			return;
		}
		if (this.elements.controls.length !== this.elements.containers.length) {
			console.error("Количество управляющих элементов и блоков должно совпадать");
			return;
		}
	}


	/**
	 * Обработка инициализации в соответсвии с разрешением экрана
	 */
	#initByMedia() {
		let mediaQueries = [];

		if (this.options.mediaMin) mediaQueries.push(`(min-width: ${this.options.mediaMin}px)`);
		if (this.options.mediaMax) mediaQueries.push(`(max-width: ${this.options.mediaMax}px)`);

		this.mediaQuery = mediaQueries.length ? window.matchMedia(mediaQueries.join(' and ', mediaQueries)) : null;

		if (this.mediaQuery) {
			this.mediaQuery.addEventListener('change', () => this.mediaQuery.matches ? this.#init() : this.#destroy());
			this.mediaQuery.dispatchEvent(new Event('change'));
		} else {
			this.#init();
		}
	}


	/**
	 * Построение дополнительной HTML структуры спойлера
	 */
	#build() {
		this.elements.spoiler.classList.add(this.classes.spoiler);
		this.elements.items.forEach(item => item.classList.add(this.classes.spoilerItem));
		this.elements.controls.forEach(control => control.classList.add(this.classes.spoilerControl));
		this.elements.containers.forEach(container => container.classList.add(this.classes.spoilerContainer));

		this.elements.spoiler.style.setProperty('--spoiler-time', `${this.options.speed / 1000}s`);

		const createContainerContentWrapper = (container) => {
			const wraper = document.createElement('div');
			const containerChildrens = container.children;
			wraper.classList.add(this.classes.spoilerWrapper);
			Array.from(containerChildrens).forEach(element => wraper.append(element));
			container.append(wraper);
		};

		this.elements.containers.forEach(container => createContainerContentWrapper(container));
	}


	/**
	 * Инициализация спойлера
	 */
	#init() {
		this.#initActions();

		this.elements.items.forEach(item => { 
			const isOpen = this.options.open || item.dataset.spoilerOpen !== undefined;
			isOpen ? this.#open(item) : this.#close(item);
		});

		this.elements.spoiler.classList.add(this.classes.init);
	}


	/**
	 * Удаление функционала спойлера
	 */
	#destroy() {
		this.#destroyActions();

		this.elements.containers.forEach(container => {
			container.style.maxHeight = null;
		});

		this.elements.spoiler.classList.remove(this.classes.init);
	}


	/**
	 * Инициализация событий спойлера
	 */
	#initActions() {
		this.elements.controls.forEach(control => control.onclick = () => {
			const spoilerItem = control.closest('[data-spoiler-item]');

			const isOpen = this.#isItemOpen(spoilerItem);
			const isSingle = this.options.single;

			if (isOpen) {
				this.#close(spoilerItem);
			} else {
				if (isSingle) this.#closeOther(spoilerItem);
				this.#open(spoilerItem);
			}
		});
	}


	/**
	 * Удаление событий спойлера
	 */
	#destroyActions() {
		this.elements.controls.forEach(control => control.onclick = null);
	}


	/**
	 * Открытие элемента спойлера
	 */
	#open(item) {
		item.classList.add(this.classes.active);
		
		const itemControl = item.querySelector('[data-spoiler-control]');
		const itemContainer = item.querySelector('[data-spoiler-container]');

		if (!itemControl || !itemContainer) { console.warn('В элементе слайдера нет кнопки или разворачивающегося контента'); return; }

		itemControl.classList.add(this.classes.active);
		itemContainer.classList.add(this.classes.active);

		this.activeItem = item;
	}
	
	
	/**
	 * Закрытие элемента спойлера
	 */
	#close(item) {
		if (!item) return;

		item.classList.remove(this.classes.active);

		const itemControl = item.querySelector('[data-spoiler-control]');
		const itemContainer = item.querySelector('[data-spoiler-container]');

		if (!itemControl || !itemContainer) { console.warn('В элементе слайдера нет кнопки или разворачивающегося контента'); return; }

		itemControl.classList.remove(this.classes.active);
		itemContainer.classList.remove(this.classes.active);
	}


	/**
	 * Закрытие активного элемента при одиночном спойлере (акордион)
	 */
	#closeOther(clickedItem) {
		if (clickedItem.isSameNode(this.activeItem)) return;

		this.#close(this.activeItem);
	}


	/**
	 * Является ли элемент спойлера открытым
	 */
	#isItemOpen(item) {
		return item.classList.contains(this.classes.active) ? true : false;
	}
}