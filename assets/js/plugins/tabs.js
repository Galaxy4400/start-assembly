/*
 * tabs.js
 *
 * Copyright (c) 2023 Moiseev Evgeny
 * Organization: WebisGroup
 *
 * Tabs - простой но очень гибкий класс для создания панелей с закладками
 *
 * Требуется подключение стилей: assets/scss/_tabs.scss
 */


class Tabs {
	constructor(selector, options) {
		const defaultOptions = {
			blinkSpeed: 300,
			startTabIndex: 0,
			ajax: false,
			test: false,
		}

		this.classes = {
			active: "_active",
			loading: "_loading",
			animate: '_animate',
			init: '_init',
			tabs: '_tabs',
			tabsControls: '_tabs-controls',
			tabsButton: '_tabs-button',
			tabsContainer: '_tabs-container',
			tabsPanel: '_tabs-panel',
		};

		this.elements = {};

		this.options = Object.assign(defaultOptions, options);
		this.elements.tabs = typeof selector === 'object' ? selector : document.querySelector(`[data-tabs="${selector}"]`);
		this.selector = this.elements.tabs.dataset.tabs;

		if (!this.elements.tabs) return;

		this.elements.controls = this.elements.tabs.querySelector('[data-tabs-controls]');
		this.elements.buttons = Array.from(this.elements.controls.querySelectorAll('button'));

		if (!this.elements.buttons.length) { console.error('Элементы закладок должны определяться тегом button'); return; }

		this.elements.containers = this.#getContainers();

		if (this.options.startTabIndex >= this.elements.buttons.length) this.options.startTabIndex = this.elements.buttons.length - 1;
		if (this.options.startTabIndex < 0) this.options.startTabIndex = 0;

		this.#check();
		this.#init();
		this.#events();
	}


	/**
	 * Проверка на корректность
	 */
	#check() {
		if (document.querySelectorAll(`[data-tabs="${this.selector}"]`).length > 1) {
			console.error('Количество элементов с одинаковым data-tabs больше одного!');
			return;
		}
	}


	/**
	 * Инициализация стартового состояния табов
	 */
	#init() {
		this.elements.tabs.classList.add(this.classes.tabs);
		this.elements.controls.classList.add(this.classes.tabsControls);
		this.elements.buttons.forEach(button => button.classList.add(this.classes.tabsButton));
		this.elements.containers.forEach(container => {
			container.element.classList.add(this.classes.tabsContainer);
			container.panels.forEach(panel => panel.classList.add(this.classes.tabsPanel));
		});
		
		this.elements.tabs.style.setProperty('--transition-time', `${this.options.blinkSpeed / 1000 / 2}s`);
		
		this.elements.controls.setAttribute('role', 'tablist');
		
		this.elements.buttons.forEach((button, index) => {
			button.setAttribute('role', 'tab');
			button.setAttribute('id', `${this.selector}${index + 1}`);
			button.setAttribute('tabindex', '-1');
			button.classList.remove(this.classes.active);
		});

		this.elements.buttons[this.options.startTabIndex].classList.add(this.classes.active);
		this.elements.buttons[this.options.startTabIndex].removeAttribute('tabindex');
		this.elements.buttons[this.options.startTabIndex].setAttribute('aria-selected', 'true');

		if (this.elements.buttons[this.options.startTabIndex].dataset.hash !== undefined && !location.hash) {
			location.hash = `#${this.elements.buttons[this.options.startTabIndex].dataset.hash}`;
		}

		this.activeButton = this.elements.buttons[this.options.startTabIndex];
		
		if (this.options.ajax) {
			this.#getContentByAJAX();
		} else {
			this.elements.containers.forEach(container => container.panels.forEach((panel, index) => {
				panel.setAttribute('role', 'tabpanel');
				panel.setAttribute('tabindex', '-1');
				panel.setAttribute('aria-labelledby', this.elements.buttons[index].id);
				panel.classList.remove(this.classes.active);
			}));

			this.elements.containers.forEach(container => container.panels[this.options.startTabIndex].classList.add(this.classes.active, this.classes.animate));
		}

		this.elements.tabs.classList.add(this.classes.init);
	}


	/**
	 * Инициализация событий табов
	 */
	#events() {
		const onButtonClick = (clickedButton) => {
			let currentButton = this.elements.controls.querySelector('[aria-selected]');

			if (clickedButton === currentButton) return;

			this.#switchTabs(clickedButton, currentButton);
		};

		// Инициализация события нажатия на кнопку закладки
		this.elements.buttons.forEach(button => button.addEventListener('click', () => onButtonClick(button)));
	}


	/**
	 * Переключение табов
	 */
	#switchTabs(newTab, oldTab = this.tabs.querySelector('[aria-selected]')) {
		oldTab.removeAttribute('aria-selected');
		oldTab.setAttribute('tabindex', '-1');
		
		newTab.focus();
		newTab.removeAttribute('tabindex');
		newTab.setAttribute('aria-selected', 'true');

		this.activeButton = newTab;

		const index = Array.prototype.indexOf.call(this.elements.buttons, newTab);
		const oldIndex = Array.prototype.indexOf.call(this.elements.buttons, oldTab);

		this.elements.buttons[oldIndex].classList.remove(this.classes.active);
		this.elements.buttons[index].classList.add(this.classes.active);

		if (!this.options.ajax) {
			this.elements.containers.forEach(container => container.panels[oldIndex].classList.remove(this.classes.animate));
			setTimeout(() => {
				this.elements.containers.forEach(container => container.panels[oldIndex].classList.remove(this.classes.active));
				this.elements.containers.forEach(container => container.panels[index].classList.add(this.classes.active));
				setTimeout(() => {
					this.elements.containers.forEach(container => container.panels[index].classList.add(this.classes.animate));
				}, 30);
			}, this.options.blinkSpeed / 2);
		} else {
			this.#getContentByAJAX();
		}

		if (newTab.dataset.hash !== undefined) {
			location.hash = `#${newTab.dataset.hash}`;
		}
	}


	/**
	 * Получение контента табов с сервера при AJAX режиме
	 */
	#getContentByAJAX() {
		if (this.options.test) return;

		const action = this.activeButton.dataset.action;

		this.#disableSwitch();

		fetch(action)
		.then(response => response.text())
		.then(html => {
			this.elements.containers[0].element.innerHTML = html;
		})
		.catch(error => console.log(error.message))
		.finally(() => this.#enableSwitch());
	}


	/**
	 * Запретить переключение
	 */
	#disableSwitch() {
		this.elements.tabs.classList.add(this.classes.loading);

		this.elements.buttons.forEach(button => button.setAttribute('disabled', 'disabled'));
	}


	/**
	 * Разрешить переключение
	 */
	#enableSwitch() {
		this.elements.tabs.classList.remove(this.classes.loading);

		this.elements.buttons.forEach(button => button.removeAttribute('disabled'));
	}


	/**
	 * Получение всех контейнеров табов
	 */
	#getContainers() {
		const containers = [];

		const tabsContainers = this.elements.tabs.querySelectorAll(`[data-tabs-container]`);

		tabsContainers.forEach(container => {
			if (this.#isContainerOfInnerTabs(container)) return;

			containers.push({
				element: container,
				panels: Array.from(container.children),
			});
		});

		return containers;
	}

	
	/**
	 * Принадлежит ли кнтейнер ко вложенному экземпляру табов
	 */
	#isContainerOfInnerTabs(container) {
		return container.closest('[data-tabs]').dataset.tabs !== this.selector;
	}


	/**
	 * Установить активную закладку по порядковому номеру
	 */
	setTabByIndex(tabIndex) {
		if (tabIndex >= this.tabsButtons.length) tabIndex = this.tabsButtons.length - 1;
		if (tabIndex < 0) tabIndex = 0;
		this.switchTabs(this.tabsButtons[tabIndex]);
	}
	

	/**
	 * Установить активную закладку по хешу
	 */
	setTabByHash(hash) {
		let tab = this.tabsControls.querySelector(`[data-hash="${hash}"]`);
		if (!tab) return;
		this.switchTabs(tab);
	}
}