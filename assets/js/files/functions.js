/**
 * Установка тегу html класса в зависимости от типа устройства
 */
if (window.matchMedia("(pointer: coarse)").matches) {
	document.querySelector('html').classList.add('_touch');
}


/**
 * Установка тегу с классом wrapper класса после полной загрузки документа
 */
window.addEventListener("load", () => {
	if (document.querySelector('.wrapper')) {
		setTimeout(() => {
			document.querySelector('.wrapper').classList.add('_loaded');
		}, 0);
	}
});


/**
 * Инициализация иконки меню
 */
document.querySelectorAll('.menu-icon').forEach(menuIcon => {
	menuIcon.innerHTML = "<span></span>".repeat(3);
});


/**
 * События в зависимости от хеша в url
 */
if (location.hash) {
	const hash = location.hash.replace('#', '');
	// Если на странице есть такое модальное окно, то открывает его
	if (document.querySelector(`[data-modal="${hash}"]`)) {
		modal.openModal(hash);
	}
	// Если на странице есть блок с таким классом, то осуществляется плавный переход к нему
	if (document.querySelector(`.${hash}`)) {
		scrollTo(hash);
	}
}


/**
 * Инициализация связанных элементов по атрибуту data-link="{value}". Где value - класс элемента, с которым будет связь (без точки)
 *
 * При нажатии на элемент с data-link, класс _active будет добавлен и текущему элементу, и элементу с которым он связан.
 * При нажатии на другую область экрана класс _active с элементов будет снят
 */
document.querySelectorAll('[data-link]').forEach(link => {

	const linkSelector = `[data-link="${link.dataset.link}"]`;
	const linkedElementSelector = `.${link.dataset.link}`;

	document.addEventListener('mousedown', (event) => {
		const target = event.target;

		if (target.closest(linkSelector)) {
			link.classList.toggle('_active');
			document.querySelector(linkedElementSelector).classList.toggle('_active');
		} else if (!target.closest(linkedElementSelector) && document.querySelector(`${linkedElementSelector}._active`)) {
			link.classList.remove('_active');
			document.querySelector(linkedElementSelector).classList.remove('_active');
		}
	});
});



/**
 * Функция плавного переход к элементу
 * 
 * @param {String, Object} target - класс элемента к которому нужно перей (без точки). Или сам объект.
 * @param {Number} offset - Отступ от блока, к которому производится переход (в пикселях)
 * @param {Boolean} focus - Если true, то после перехода будет произведён фокус на объекте, либо на ближайшем дочернем элементе, являющимся элементом формы.
 */
function scrollTo(target, offset = 0, focus = false) {
	const scrollTarget = (typeof target == 'object') ? target : document.querySelector(`.${target}`);
	const elementPosition = scrollTarget.getBoundingClientRect().top;
	const offsetPosition = elementPosition - offset;

	const isLocked = document.body.classList.contains('_lock') ? true : false;

	// Определение элемента для фокуса
	const getFocusTarget = (elem) => {
		const targetTag = elem.tagName.toLowerCase();

		if (targetTag == 'input' || targetTag == 'textarea') return elem;

		return elem.querySelector('input, textarea');
	}

	// Установка фокуса
	const focusTarget = getFocusTarget(scrollTarget);
	if (focus && focusTarget) {
		if (isElementInViewport(focusTarget)) {
			focusTarget.focus();
			return;
		} else {
			setTimeout(() => {
				focusTarget.focus();
			}, isLocked ? 0 : 500);
		}
	}

	if (isLocked) return;

	// Переход к элементу
	window.scrollBy({
		top: offsetPosition,
		behavior: 'smooth',
	});
}


/**
 * Находится ли элемент в зоне видимости экрана
 * 
 * @param {Object} element - DOM элемент.
 * @param {Boolean} strict - строгий режим сравнения. По умолчанию включено.
 * 
 * @return {Boolean}
 */
function isElementInViewport(element, strict = true) {
	const elementRectangle = element.getBoundingClientRect();

	if (strict) {
		return (
			elementRectangle.top >= 0 &&
			elementRectangle.left >= 0 &&
			elementRectangle.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			elementRectangle.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	} else {
		return (
			elementRectangle.top <= (window.innerHeight || document.documentElement.clientHeight) &&
			elementRectangle.left <= (window.innerWidth || document.documentElement.clientWidth) &&
			elementRectangle.bottom >= 0 &&
			elementRectangle.right >= 0
		);
	}
}