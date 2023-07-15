/*
 * rating.js
 *
 * Copyright (c) 2023 Moiseev Evgeny
 * Organization: WebisGroup
 *
 * Rating - простой и удобный класс для создания рейтингов различных типов и величины
 *
 * Требуется подключение стилей: assets/scss/_rating.scss
 */

class Rating {
	constructor(element, options) {
		const defaultOptions = {
			inputName: 'rating',
			ratingValue: 0,
			bulletsCount: 5,
			valueFraction: 1,
			action: null,
			disable: false,
		};
		
		this.classes = {
			hover: '_hover',
			unhover: '_unhover',
			active: '_active',
			disable: '_disable',
		};

		this.elements = {};

		this.options = Object.assign(defaultOptions, options);
		this.elements.rating = (typeof element === 'object') ? element : document.querySelector(element);
		this.checked = false;
		this.checkedIndex = false;
		this.disable = this.options.disable;
		this.currentValue = this.options.ratingValue;
		this.bulletsCount = this.options.bulletsCount;
		this.action = this.options.action;
		this.inputName = this.options.inputName;

		if (!this.elements.rating) return;

		this.#build();
		this.#setActive();
		this.#actions();
	}


	// Построение HTML структуры рейтинга
	#build() {
		if (this.disable)
			this.elements.rating.classList.add(this.classes.disable);

		this.elements.bulletsContainer = document.createElement('div');
		this.elements.ratingValue = document.createElement('div');

		this.elements.rating.classList.add('rating');
		this.elements.bulletsContainer.classList.add('rating__bullets');
		this.elements.ratingValue.classList.add('rating__value');

		this.elements.ratingValue.innerHTML = this.currentValue;

		this.elements.bullets = [];
		this.elements.inputs = [];

		for (let index = 0; index < this.bulletsCount; index++) {
			const bullet = document.createElement('div');
			const input = document.createElement('input');

			bullet.classList.add('rating__bullet');
			input.classList.add('rating__input');

			input.setAttribute('type', 'radio');
			input.setAttribute('name', this.inputName);
			input.setAttribute('value', index + 1);

			bullet.append(input);

			this.elements.bulletsContainer.append(bullet);

			this.elements.bullets.push(bullet);
			this.elements.inputs.push(input);
		}

		this.elements.rating.append(this.elements.bulletsContainer);
		this.elements.rating.append(this.elements.ratingValue);
	}


	// Установка отображения текущего значения рейтинга
	#setActive() {
		const fullValueBulletsCount = Math.trunc(this.currentValue);
		const valueFraction = +(this.currentValue - fullValueBulletsCount).toFixed(this.options.valueFraction);

		for (let index = 0; index < this.bulletsCount; index++) {
			if (index < fullValueBulletsCount) {
				this.elements.bullets[index].style.setProperty('--active-fraction', '100%');
			} else {
				this.elements.bullets[index].style.removeProperty('--active-fraction');
			}
		}
		
		if (fullValueBulletsCount < this.bulletsCount) {
			this.elements.bullets[fullValueBulletsCount].style.setProperty('--active-fraction', `${valueFraction * 100}%`);
		}
	}


	// Инициализация событий рейтинга
	#actions() {
		if (this.disable) return;

		// Выделить буллеты рейтинга
		const emphasizeBullets = (currentndex) => {
			for (let index = 0; index < this.bulletsCount; index++) {
				if (index > currentndex) {
					this.elements.bullets[index].classList.add(this.classes.unhover);
				} else {
					this.elements.bullets[index].classList.add(this.classes.hover);
				}
			}
		}


		// Снять выделение с буллетов рейтинга
		const unemphasizeBullets = () => {
			this.elements.bullets.forEach(bullet => bullet.classList.remove(...[this.classes.hover, this.classes.unhover]));
		};
		

		// Установить выбранное значение рейтинга
		const checkBullet = (index) => {
			this.elements.inputs[index].checked = true;
			this.checked = true;
			this.checkedIndex = index;
			this.elements.ratingValue.innerHTML = this.elements.inputs[index].value;
			this.elements.ratingValue.classList.add(this.classes.active);
			unemphasizeBullets();
			emphasizeBullets(index);
		};


		// Онтменить выбор значения рейтига
		const uncheckBullet = (index) => {
			this.elements.inputs[index].checked = false;
			this.checked = false;
			this.checkedIndex = false;
			this.elements.ratingValue.innerHTML = this.currentValue;
			this.elements.ratingValue.classList.remove(this.classes.active);
		};


		// Заблокировать рейтинг
		const disableRating = () => {
			this.disable = true;
			this.elements.rating.classList.add(this.classes.disable);
		};


		// Установить новое значение рейтинга
		const setNewRatingValue = (value) => {
			this.elements.ratingValue.innerHTML = value;
			this.currentValue = value;
			unemphasizeBullets();
			this.#setActive();
		};


		// Отправка выбранного значения рейтинга на сервер для обработки
		const sendRating = (index) => {
			const ratingValue = this.elements.inputs[index].value;
			const action = this.action.includes('?')
				? `${this.action}&${this.inputName}=${ratingValue}`
				: `${this.action}?${this.inputName}=${ratingValue}`;

			disableRating();

			fetch(action)
			.then(response => response.text())
			.then(ratingValue => {
				if (isNaN(+ratingValue)) {
					console.error('Возвращённое значение рейтинга не является числом');
					unemphasizeBullets();
					return;
				}
				setNewRatingValue(+ratingValue);
			})
			.catch(error => console.log(error.message));
		};


		// Нажатие на буллет рейтинга
		const clickBullet = (bullet) => {
			if (this.disable) return;

			const bulletIndex = this.#getIndexInParent(this.elements.bulletsContainer, bullet);

			if (this.action) {
				sendRating(bulletIndex);
				return;
			}

			if (this.#isBulletChecked(bulletIndex)) {
				uncheckBullet(bulletIndex);
			} else {
				checkBullet(bulletIndex);
			}
		};


		// Наведение курсора на буллет рейтинга
		const hoverBullet = (bullet) => {
			if (this.disable) return;
			if (this.checked) return;

			const bulletIndex = this.#getIndexInParent(this.elements.bulletsContainer, bullet);
			
			emphasizeBullets(bulletIndex);
		};


		// Увод курсора с буллета рейтинга
		const unhoverBullet = () => {
			if (this.disable) return;

			unemphasizeBullets();

			if (this.checked) {
				emphasizeBullets(this.checkedIndex);
			}
		};


		// Нажатие на лейбл со значением рейтинга
		const clickLabel = () => {
			if (!this.checked) return;
			
			uncheckBullet(this.checkedIndex);
			unemphasizeBullets();
		}


		// Обработка событий буллетов
		this.elements.bullets.forEach(bullet => {
			bullet.addEventListener('mouseover', () => hoverBullet(bullet));
			bullet.addEventListener('mouseout', () => unhoverBullet());
			bullet.addEventListener('click', () => clickBullet(bullet));
		});

		
		// Обработка событий лейбла
		this.elements.ratingValue.addEventListener('click', () => clickLabel());
	}


	// Является ли буллет выбранным
	#isBulletChecked(index) {
		if (this.elements.inputs[index].checked) return true;
		return false;
	}

	
	// Получить порядковый номер элемента в родителе
	#getIndexInParent(parent, element) {
		return Array.from(parent.children).indexOf(element);
	}
}