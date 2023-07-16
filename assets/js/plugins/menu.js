/*
 * menu.js
 *
 * Copyright (c) 2023 Moiseev Evgeny
 * Organization: WebisGroup
 *
 * Menu - класс организации функционала простых и многоуровневых меню для разных устройств.
 */

class Menu {
	constructor (selector, options) {
		const defaultOptions = {
			lockOnOpen: true,
			closeOnSelect: false,
			closeOnOutside: true,
			isOpen: false,
		};

		this.options = Object.assign(defaultOptions, options);

		this.classes = {
			lock: '_lock',
			hover: '_hover',
			visible: '_visible',
			active: '_active',
			toright: '_toright',
			toleft: '_toleft',
		};

		this.selector = selector;
		this.menuSelector = `[data-menu="${selector}"]`;
		this.isOpen = false;

		this.elements = {};
		this.elements.menu = document.querySelector(this.menuSelector);

		if (!this.elements.menu) return;

		this.elements.icon = document.querySelector(`[data-menu-icon="${selector}"]`);
		this.elements.container = document.querySelector(`[data-menu-container="${selector}"]`);
		this.elements.items = this.elements.menu.querySelectorAll('[data-menu-item]');
		this.elements.controls = this.elements.menu.querySelectorAll('[data-menu-control]');
		this.elements.submenus = this.elements.menu.querySelectorAll('[data-menu-submenu]');
		this.elements.close = this.elements.menu.querySelector('[data-menu-close]');
		this.elements.backControls = this.elements.menu.querySelectorAll('[data-menu-back]');

		this.#itemsActions();
		this.#controlsActions();
		this.#iconActions();
		this.#backsActions();
		this.#closeActions();
		this.#outsideActions();
		this.#insideActions();
		
		this.#init();
	}


	/**
	* Инициализация начального состояния меню
	*/
	#init() {
		const isMenuOpen = this.options.isOpen;

		if (isMenuOpen) this.#openMenu();

		this.elements.submenus.forEach(submenu => this.#setSubemenuOpenSideClass(submenu));
	}

	
	/**
	* Обработка событий пунктов меню
	*/
	#itemsActions() {
		// Действие при наведении курсора мыши на пункт меню
		const onItemMouseenterAction = (item) => {
			if (this.#isTouchScreen()) return;
			if (this.#isLastLevel(item)) return;

			item.querySelector('[data-menu-control]').classList.add(this.classes.hover);
			item.querySelector('[data-menu-submenu]').classList.add(this.classes.visible);
		};

		// Действие на увод курсора мыши с пункта меню
		const onItemMouseleaveAction = (item) => {
			if (this.#isTouchScreen()) return;
			if (this.#isLastLevel(item)) return;
			
			item.querySelector('[data-menu-control]').classList.remove(this.classes.hover);
			item.querySelector('[data-menu-submenu]').classList.remove(this.classes.visible);
		};
		
		// Инициализация событий пунктов меню
		this.elements.items.forEach(item => {
			item.addEventListener('mouseenter', () => onItemMouseenterAction(item));
			item.addEventListener('mouseleave', () => onItemMouseleaveAction(item));
		});
	}


	/**
	* Обработка событий элементов управления подпунктами меню
	*/
	#controlsActions() {
		// Действие при клике по элементу управления подпунктом меню
		const onControlClick = (control) => {
			if (!this.#isTouchScreen()) return;

			const item = control.closest('[data-menu-item]');

			this.#isItemActive(item) ? this.#closeItem(item) : this.#openItem(item);
		};

		// Инициализация событий элементов управления подпунктов меню
		this.elements.controls.forEach(control => {
			control.addEventListener('click', () => onControlClick(control))
		});
	}


	/**
	* Обработка событий иконки меню
	*/
	#iconActions() {
		if (!this.elements.icon) return;

		// Действие при клике по иконке меню
		const onIconClick = () => {
			this.#isMenuOpen() ? this.#closeMenu() : this.#openMenu();
		}

		// Инициализация события иконки меню
		this.elements.icon.addEventListener('click', () => onIconClick());
	}
	

	/**
	* Обработка кнопок возврата к предыдущему уровню меню на мобильной версии
	*/
	#backsActions() {
		// Действие при клике по иконке возврата
		const onBackClick = (backControl) => {
			const menuItem = backControl.closest('[data-menu-item]');
			
			this.#closeItem(menuItem);
		};

		// Инициализация событий кнопок возврата к предыдущему уровню меню
		this.elements.backControls.forEach(backControl => {
			backControl.addEventListener('click', () => onBackClick(backControl));
		});
	}


	/**
	* Обработка кнопки закрытия меню
	*/
	#closeActions() {
		if (!this.elements.close) return;

		this.elements.close.addEventListener('click', () => this.#closeMenu.call(this));
	}


	/**
	* Обработка событий вне области меню или связанных с ним элементов
	*/
	#outsideActions() {
		// Действие при клике вне области меню
		const onOutsideClick = (event) => {
			const isCloseOnOutside = this.options.closeOnOutside;
			if (!isCloseOnOutside) return;

			const target = event.target;

			const isTargetOfMenuElement = this.#isMenuElement(target);
			if (isTargetOfMenuElement) return;

			this.#closeMenu();
			this.#closeItems();
		};

		// Инициализация события клика вне области меню
		document.addEventListener('click', onOutsideClick);
	}


	/**
	* Обработка событий внутри области меню
	*/
	#insideActions() {
		// Действие при клике внутри области меню
		const onContainerClick = (event) => {
			const target = event.target;

			const isTargetMenuItem = this.#isMenuItem(target);
			if (!isTargetMenuItem) return;
			
			const isCloseOnSelect = this.options.closeOnSelect;
			if (!isCloseOnSelect) return;

			this.#closeMenu();
		};

		// Инициализация события клика внутри области меню
		this.elements.container.addEventListener('click', onContainerClick)
	}


	/**
	 * Открыть меню
	 */
	#openMenu() {
		if (this.isOpen) return;

		this.elements.icon.classList.add(this.classes.active);
		this.elements.container.classList.add(this.classes.active);

		this.isOpen = true;

		const isLockOnOpen = this.options.lockOnOpen;

		if (isLockOnOpen) this.#disableScroll();
	}


	/**
	 * Закрыть меню
	 */
	#closeMenu() {
		if (!this.isOpen) return;
		
		this.elements.icon.classList.remove(this.classes.active);
		this.elements.container.classList.remove(this.classes.active);

		this.isOpen = false;

		const isLockOnOpen = this.options.lockOnOpen;

		if (isLockOnOpen) this.#enableScroll();
	}
	

	/**
	 * Открыть подменю
	 */
	#openItem(item) {
		const { control, submenu } = this.#getItemSubElements(item);

		item.classList.add(this.classes.active);
		control.classList.add(this.classes.hover);
		submenu.classList.add(this.classes.visible);

		this.#closeOtherItems(item);
	}


	/**
	 * Закрыть подменю
	 */
	#closeItem(item) {
		const { controls, submenus, items } = this.#getItemSubElementsAll(item);

		item.classList.remove(this.classes.active);
		items.forEach(item => item.classList.remove(this.classes.active));
		controls.forEach(control => control.classList.remove(this.classes.hover));
		submenus.forEach(submenu => submenu.classList.remove(this.classes.visible));
	}


	/**
	 * Закрыть все подменю
	 */
	#closeItems() {
		const rootItems = this.#getRootItems();

		rootItems.forEach(item => this.#closeItem(item));
	}


	/**
	 * Закрыть все элементы меню кроме текущего
	 */
	#closeOtherItems(item) {
		const rootItem = this.#getRootItem(item);
		const rootItems = this.#getRootItems();

		rootItems.forEach(item => {
			if (!item.isSameNode(rootItem)) this.#closeItem(item);
		});
	}


	/**
	 * Получить пункт меню первого уровня относительно текущего элемента
	 */
	#getRootItem(item) {
		const parentItem = item.parentElement.closest('[data-menu-item]');

		if (!parentItem) return item;

		return this.#getRootItem(parentItem);
	}


	/**
	 * Получить все пункты меню первого уровня
	 */
	#getRootItems() {
		return Object.values(this.elements.items).filter(item => {
			return !item.parentElement.closest('[data-menu-item]');
		});
	}

	
	/**
	 * Получить объект элементов, связанных с подменю текущего пункта меню
	 */
	#getItemSubElements(item) {
		const control = item.querySelector('[data-menu-control]');
		const submenu = item.querySelector('[data-menu-submenu]');

		return { control, submenu };
	}
	

	/**
	 * Получить объект элементов, связанных со всеми подменю текущего пункта меню на всю глубину
	 */
	#getItemSubElementsAll(item) {
		const controls = item.querySelectorAll('[data-menu-control]');
		const submenus = item.querySelectorAll('[data-menu-submenu]');
		const items = item.querySelectorAll('[data-menu-item]');

		return { controls, submenus, items };
	}


	/**
	 * Зафиксировать пролистывание страницы
	 */
	#disableScroll() {
		this.#lock();
		document.body.classList.add(this.classes.lock);
	}


	/**
	 * Отменить фиксацию страницы
	 */
	#enableScroll() {
		this.#unlock();
		document.body.classList.remove(this.classes.lock);
	}


	/**
	* Фиксация абсолютно-позиционизируемых элементов содержащих соответствующий атрибут: data-fix, data-fix-m
	*/
	#lock() {
		const fixBlocks = document.querySelectorAll(`[data-fix]`);
		const fixBlocksM = document.querySelectorAll(`[data-fix-m]`);
		const offset = window.innerWidth - document.body.offsetWidth + 'px';
		fixBlocks.forEach((el) => {
			el.style.paddingRight = offset;
		});
		fixBlocksM.forEach((el) => {
			el.style.marginRight = offset;
		});
		document.body.style.paddingRight = offset;
	}

	
	/**
		* Отмена Фиксации абсолютно-позиционизируемых элементов содержащих соответствующий атрибут: data-fix, data-fix-m
		*/
	#unlock() {
		const fixBlocks = document.querySelectorAll(`[data-fix]`);
		const fixBlocksM = document.querySelectorAll(`[data-fix-m]`);
		fixBlocks.forEach((el) => {
			el.style.paddingRight = '0px';
		});
		fixBlocksM.forEach((el) => {
			el.style.marginRight = '0px';
		});
		document.body.style.paddingRight = '0px';
	}


	/**
	 * Является ли пункт меню активным
	 */
	#isItemActive(item) {
		return item.classList.contains(this.classes.active) ? true : false;
	}


	/**
	 * Является ли нажатый элемент частю меню
	 */
	#isMenuElement(target) {
		const icon = target.closest('[data-menu-icon]');
		const container = target.closest('[data-menu-container]');
		
		if (icon?.isSameNode(this.elements.icon)) return true;
		if (container?.isSameNode(this.elements.container)) return true;

		return false;
	}


	/**
	 * Является ли нажатый элемент пунксом меню
	 */
	#isMenuItem(target) {
		const item = target.closest('[data-menu-item]');

		return item ? true : false;
	}


	/**
	 * Является ли контейнер меню активным
	 */
	#isMenuOpen() {
		return this.isOpen;
	}


	/**
	 * Является ли пункт меню последним по глубине
	 */
	#isLastLevel(item) {
		const control = item.querySelector('[data-menu-control]');
		const submenu = item.querySelector('[data-menu-submenu]');

		return (control && submenu) ? false : true;
	}
	

	/**
	 * Является ли устройство тачскриновым
	 */
	#isTouchScreen() {
		return (window.matchMedia("(pointer: coarse)").matches) ? true : false;
	}


	/**
	 * Установка элементу подменю класса, соответствущего тому, в какую сторону он будет открываться.
	 */
	#setSubemenuOpenSideClass(submenu) {
		if (this.#isElementOutsideToRight(submenu)) {
			submenu.classList.add(this.classes.toleft);
		} else {
			submenu.classList.add(this.classes.toright);
		}
	}


	/**
	 * Выходит ли правый край елемента за пределы экрана
	 */
	#isElementOutsideToRight(element) {
		const elementRectangle = element.getBoundingClientRect();
		
		return elementRectangle.right >= document.documentElement.clientWidth ? true : false;
	}

}