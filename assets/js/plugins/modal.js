/*
 * modal.js
 *
 * Copyright (c) 2023 Moiseev Evgeny
 * Organization: WebisGroup
 *
 * Modal - простой но очень гибкий класс для создания модальных окон различных типов
 *
 * Требуется подключение стилей: assets/scss/_modal.scss
 */


class Modal {
	constructor(options) {
		const defaultOptions = {
			speed: 600,
			animation: 'fade', // fadeIn, fadeIn, fadeInUp, fadeInDown...
		}
		this.options = Object.assign(defaultOptions, options);
		this.focusElements = ['a[href]','input','button','select','textarea','[tabindex]'];
		this.isOpen = false;
		this.isClosing = false;
		this.frameInterval = false;
		this.previousActiveElement = false;
		this.classes = {
			lock: '_lock',
			load: '_load',
			active: '_active',
			animate: '_animate',
			btnCloseIcon: '_icon-close',
		}

		this.modalsContainer = document.getElementById('modal');

		if (!this.modalsContainer) return;

		this.#events();
	}
	

	/**
	 * Инициализация событий на основном контейнере модальных окон
	 */
	#events() {
		document.addEventListener('click', function(event) {
			if (this.isClosing) return;

			this.btnOpenModal = event.target.closest('[data-modal-opener]');
			if (this.btnOpenModal) {
				this.#close();
				setTimeout(() => {
					const name = this.btnOpenModal.dataset.modalOpener;
					const source = this.btnOpenModal.dataset.src !== undefined ? this.btnOpenModal.dataset.src : false; // В зависимости от типа контента модального окна, будет различаться и значения ресурса контента.
					this.#initModal(name, source);
					this.#open();
				}, this.isOpen ? this.speed + 1 : 0);
				return;
			}

			const btnCloseModal = event.target.closest('[data-close]');
			if (btnCloseModal) {
				this.#close();
				return;
			}
		}.bind(this));

		window.addEventListener('keydown', function(event) {
			if (event.keyCode == 27) {
				if (this.isOpen) {
					this.#close();
				}
			}

			if (event.keyCode == 9 && this.isOpen) {
				this.#focusCatch(e);
				return;
			}

		}.bind(this));

		this.modalsContainer.addEventListener('mousedown', function(event) {
			const offset = parseInt(getComputedStyle(document.body).paddingRight);

			if (event.x >= document.documentElement.clientWidth - offset) return;

			if (!event.target.classList.contains('[data-modal]') && !event.target.closest('[data-modal]') && this.isOpen) {
				this.#close();
			}
		}.bind(this));
	}

	
	/**
	 * Инициализация модального окна перед его открытием
	 */
	#initModal(name, source = false) {
		this.modalName = name;
		this.modal = document.querySelector(`[data-modal="${this.modalName}"]`);
		
		if (!this.modal) { console.error(`Модального окна с именем "${this.modalName}" не существует`); return; }

		this.contentType = this.modal.dataset.type !== undefined ? this.modal.dataset.type : false; // Варианты: dynamic, frame, ajax
		this.contentSource = source;
		
		this.modal.dataset.animation !== undefined ? this.animation = this.modal.dataset.animation : this.animation = this.options.animation;
		this.modal.dataset.speed !== undefined ? this.speed = +this.modal.dataset.speed : this.speed = +this.options.speed;
	}

	
	/**
	 * Открытие модального окна
	 */
	#open() {
		this.#addBtnCloseModal();

		this.previousActiveElement = document.activeElement;

		this.modalsContainer.style.setProperty('--transition-time', `${this.speed / 1000}s`);
		this.modalsContainer.classList.add(this.classes.active);

		this.#disableScroll();

		switch (this.contentType) {
			case 'dynamic': this.#getDynamicContent(); break;
			case 'frame': this.#getFrameContent(); break;
			case 'ajax': this.#getAjaxContent(); break;
		}

		this.modal.classList.add(this.classes.active);
		this.modal.classList.add(this.animation);
		setTimeout(() => {
			this.modal.classList.add(this.classes.animate);
		}, 1);
		setTimeout(() => {
			this.isOpen = true;
			this.#focusTrap();
		}, this.isOpen ? this.speed : 0);
	}

	
	/**
	 * Закрытие модального окна
	 */
	#close() {
		if (!this.modal) return;
		if (this.isClosing) return;

		this.isClosing = true;

		this.modalsContainer.classList.remove(this.classes.active);
		this.modal.classList.remove(this.classes.animate);
		setTimeout(() => {
			this.#removeBtnCloseModal();
			if (this.contentType && this.isOpen) {
				this.#removeContent();
			}
			this.modal.classList.remove(this.animation);
			this.modal.classList.remove(this.classes.active);
			this.isOpen = false;
			this.#enableScroll();
			this.#focusTrap();
			this.isClosing = false;
		}, this.isOpen ? this.speed : 0);
	}


	/**
	 * Создание кнопки закрытия в углу открывающегося модального окна
	 */
	#addBtnCloseModal() {
		const closeBtn = document.createElement('button');
		closeBtn.className = `${this.modal.className.split(/\s+/)[0]}__close ${this.classes.btnCloseIcon}`;
		closeBtn.setAttribute('type', 'button');
		closeBtn.setAttribute('data-close', '');
		this.modal.prepend(closeBtn);
	}

	
	/**
	 * Удаление кнопки закрытия в углу модального окна после его закрытия
	 */
	#removeBtnCloseModal() {
		const firstModalChild = this.modal.firstElementChild;
		if (firstModalChild?.dataset.close !== undefined)
			firstModalChild.remove();
	}


	/**
	 * Установка возможности фокусироваться только на элементах открытого модального окна
	 */
	#focusCatch(e) {
		const focusable = this.modal.querySelectorAll(this.focusElements);
		const focusArray = Array.prototype.slice.call(focusable);
		const focusedIndex = focusArray.indexOf(document.activeElement);

		if (e.shiftKey && focusedIndex === 0) {
			focusArray[focusArray.length - 1].focus();
			e.preventDefault();
		}

		if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
			focusArray[0].focus();
			e.preventDefault();
		}
	}


	/**
	 * Установка фокуса на первом элементе с возможностью фокусировки
	 */
	#focusTrap() {
		const focusable = this.modal.querySelectorAll(this.focusElements);
		if (this.isOpen) {
			focusable[0].focus();
		}
	}


	/**
	 * Запрет скролла при открытом модальном окне
	 */
	#disableScroll() {
		this.#lock();
		document.body.classList.add(this.classes.lock);
	}


	/**
	 * Разрешить скролл после закрытия модального окна
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
	 * Получение контента при типе модального окна: dynamic
	 */
	#getDynamicContent() {
		if (!this.contentSource) {
			console.error('Не установлен ресурс контента модального окна');
			return;
		}

		const content = document.querySelector(`[data-modal-src="${this.contentSource}"]`);
		const contentClone = content.cloneNode(true);
		delete contentClone.dataset.modalSrc;
		this.modal.append(contentClone);
	}

	
	/**
	 * Получение контента при типе модального окна: ajax
	 */
	#getAjaxContent() {
		if (!this.contentSource) {
			console.error('Не установлен ресурс контента модального окна');
			return;
		}

		this.modal.classList.add(this.classes.load);

		fetch(this.contentSource)
		.then(response => response.text())
		.then(modalContent => {
			this.modal.append(modalContent);
			this.modal.classList.remove(this.classes.load);
		})
		.catch(error => console.log(error.message));
	}

	
	/**
	 * Получение контента при типе модального окна: frame
	 */
	#getFrameContent() {
		if (!this.contentSource) { console.error('Не установлен ресурс контента модального окна'); return; }

		this.modal.classList.add(this.classes.load);
		
		const frame = document.createElement('iframe');
		let frameHightOld = 0;
		let frameOriginBlocked = false;
		
		frame.onload = () => {
			this.frameInterval = setInterval(() => {
				try {
					const frameHight = frame.contentWindow.document.body.scrollHeight;
					if (frameHight !== frameHightOld) {
						frame.style.minHeight = `${frameHight}px`;
						this.modal.style.minHeight = `${frameHight}px`;
						frameHightOld = frameHight;
					}
				} catch (error) {
					frameOriginBlocked = true;
					frame.style.minHeight = `80vh`;
					clearInterval(this.frameInterval);
				}
			}, 100);
			this.modal.classList.remove(this.classes.load);
		} 

		if (frameOriginBlocked) {
			frame.setAttribute('scrolling', 'no');
		}

		frame.setAttribute('src', this.contentSource);
		this.modal.append(frame);
	}
	

	/**
	 * Удаление динамически подгружаемого контента из модального окна
	 */
	#removeContent() {
		this.modal.innerHTML = null;

		if (this.frameInterval) {
			clearInterval(this.frameInterval);
			this.frameInterval = false;
			this.modal.style.minHeight = 0;
		}
	}


	/**
	 * Открыть модальное окно
	 * 
	 * @param {String} name - идентификатор модального окна указанный в data-modal
	 * @param {string} source - если модальное окно является динамическим, то в source необходимо передать соответствующее значение в соответствии с типом динамического модального окна. См. описание.
	 */
	openModal(name, source = false) {
		this.#close();
		setTimeout(() => {
			this.#initModal(name, source);
			this.#open();
		}, this.isOpen ? this.speed + 1 : 0);
	}
}
