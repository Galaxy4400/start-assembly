/**
 * scroll.js
 * 
 * Copyright (c) 2023 Moiseev Evgeny
 * Organization: WebisGroup
 * 
 * Скрипты связанные со скроллом по странице.
 */


let lazyLoader;


/**
 * Инициализация анимации при скролле
 * 
 * Используется библиотека aos.js: assets/js/libs/aos.min.js
 * Документация: https://active-vision.ru/blog/animatsiya-pri-prokrutke/
 * Примеры: https://michalsnik.github.io/aos/
 */
function initAOS() {
	AOS.init({
		offset: 50,
		duration: 1000,
	});
}
document.addEventListener('DOMContentLoaded', () => setTimeout(initAOS, 1000));


/**
 * Инициализация ленивой загрузки изображениям, у которых есть атрибут data-src={value}. Где value - путь к большому изображению. В src путь к ужатому изображению.
 * 
 * Используется библиотека lazyload.js: assets/js/libs/lazyload.min.js
 * Документация: https://github.com/tuupola/lazyload
 * 
 * Адаптивные изображения с ленивой загрузкой поддерживаются с помощью data-srcset:
 * data-srcset="small.jpg 480w, medium.jpg 640w, large.jpg 1024w"
 * 
 */
function initLazyLoad() {
	const lazyloadImages = document.querySelectorAll('img[data-src]');
	lazyLoader = new LazyLoad(lazyloadImages);
}
document.addEventListener('DOMContentLoaded', () => initLazyLoad());


/**
 * Обработка глобального события скрола страницы
 */
window.addEventListener('scroll', actionsOnScroll);
document.addEventListener('DOMContentLoaded', () => actionsOnScroll());


/**
 * Основная функция скролла
 */
function actionsOnScroll() {
	moveUpBtnState();
	headerState();
	loadContentOnScroll();
	highlightingAnchorLinks();
}


/**
 * Функция изменения состояния кнопки возврата страницы наверх в зависимости от скролла.
 */
function moveUpBtnState() {
	const currentScroll = window.pageYOffset;

	const moveUpBtn = document.querySelector('[data-move-up]');

	if (!moveUpBtn) return;

	// Если страница проскролена на высоту скрина, то кнопке добавляется соответствующий класс.
	if (currentScroll > document.documentElement.clientHeight - 1) {
		moveUpBtn.classList.add('_scroll');
	} else {
		moveUpBtn.classList.remove('_scroll');
	}
}


/**
 * Функция изменения состояния заголовка в зависимости от скролла.
 */
function headerState() {
	const currentScroll = window.pageYOffset;

	const header = document.querySelector('header');

	if (!header) return;

	// Если страница не находится на самом верху, то заголовку добавляется соответствующий класс.
	if (currentScroll > 0) {
		header.classList.add('_scroll');
	} else {
		header.classList.remove('_scroll');
	}
}


/**
 * Инициализация плавного перехода к элементу по нажатию на другой элемент (якоря)
 * 
 * На элемент, по которому будет производиться клик нужно установить атрибут data-goto="{value}". Где value - класс элемента, к которому будет произведён переход (без точки).
 */
document.querySelectorAll('[data-goto]').forEach(link => {
	link.addEventListener('click', (e) => {
		e.preventDefault();
		let offset = 0;

		// Если смещение установлено в дата-атрибуте, то значение берётся из него.
		if (link.dataset.offset) {
			offset += +link.dataset.offset;
		}

		scrollTo(link.dataset.goto, offset);
	});
});


/**
 * Функция изменения состояния якорных ссылок (содержащих data-goto) в зависимости от видимости элемента, на который они ссылаются
 * 
 * (!) Чтобы данный функционал работал, необходимо родителю, содержащему якорные ссылки задать атрибут data-goto-group
 */
function highlightingAnchorLinks() {
	const groups = document.querySelectorAll('[data-goto-group]');

	if (!groups.length) return;

	const offset = document.querySelector('._fixed').clientHeight;

	// Функция снятия выделения со всех якорей
	const unhighlightAll = (links) => {
		links.forEach(link => link.classList.remove('_highlight'));
	};

	// Функция выделения якоря ссылающегося на первый видимый элемент на экране
	const highlightCurent = (links) => {

		let visibleAnchorAccordings = Object.values(links).map(link => {
			const anchor = link.dataset.goto;
			const anchorElement = document.querySelector(`.${anchor}`);
			const according = {};

			if (isElementInViewport(anchorElement, false, offset)) {
				according.link = link;
				according.block = anchorElement;
				according.border = anchorElement.getBoundingClientRect().bottom;
			}

			return according;
		});

		visibleAnchorAccordings = visibleAnchorAccordings.filter(according => Object.entries(according).length);

		let topVisibleAnchorAccording = null;
		visibleAnchorAccordings.forEach(according => {
			if (!topVisibleAnchorAccording) {
				topVisibleAnchorAccording = according;
				return;
			}
			if (according.border < topVisibleAnchorAccording.border) {
				topVisibleAnchorAccording = according;
			}
		});

		if (!topVisibleAnchorAccording) return;

		topVisibleAnchorAccording.link.classList.add('_highlight');
	};

	// Функция выделения якорей в группе
	const highlightingGroup = (group) => {
		const links = group.querySelectorAll('[data-goto]');

		if (!links) return;

		unhighlightAll(links);
		highlightCurent(links);
	};

	groups.forEach(group => highlightingGroup(group));
}


/**
 * Инициализация подгрузки контента по нажатию на кнопку
 * 
 * Элементу, по нажатию на который будет производится подгрузка контента необходимо установить атрибудт data-content-loader="{value}". Где value - класс контейнера, в который будет производиться подгрузка (без точки).
 * 
 * Контейнеру, в который будет подгружаться контент необходимо установить атрибут data-dynamic-content="{value}". Где value - экшен запроса на сервер.
 * 
 * Дополнительно к экшену будет добавлен параметр itemsLoaded={value}. Где value - количество элементов в контейнере.
 */
document.querySelectorAll('[data-content-loader]').forEach(button => {
	const container = document.querySelector(`.${button.dataset.contentLoader}`);
	
	if (!container) return;

	const loadContent = () => {
		const action = container.dataset.dynamicContent.includes('?')
			? `${container.dataset.dynamicContent}&itemsLoaded=${container.childElementCount}`
			: `${container.dataset.dynamicContent}?itemsLoaded=${container.childElementCount}`;

		fetch(action)
		.then(response => response.text())
		.then(html => {
			container.insertAdjacentHTML('beforeend', html);
		})
		.then(() => {
			lazyLoader.destroy();
			initLazyLoad();
		})
		.catch(error => console.log(error.message));
	};

	button.addEventListener('click', loadContent);
});


/**
 * Функция подгрузки контента по скроллу
 * 
 * Контейнеру, в который будет подгружаться контент необходимо установить атрибут data-scroll-dynamic="{value}".Где value - экшен запроса на сервер.
 * 
 * Дополнительно к экшену будет добавлен параметр itemsLoaded={value}. Где value - количество элементов в контейнере на текущий момент.
 * 
 * Также есть возможность установить контейнеру следующие атрибуты:
 * data-offset="{value}" - смещение нижней границы контейнера до нижнего края экрана при котором происходит подгрузка контента.
 * data-load-disable - запретить подгрузку
 * 
 * Есть возможность создать элемент, при нажатии на который будет переключаться возможность подгрузки контента по скроллу.
 * Нужно создать кнопку с атрибутом data-dynamic-loader (вне контейнера). Как правило сразу после контейнера.
 */
function loadContentOnScroll() {
	const container = document.querySelector('[data-scroll-dynamic]');

	if (!container) return;
	if (container.dataset.loadDisable !== undefined) return;

	const offset = container.dataset.offset ? container.dataset.offset : 0;

	const containerBottomBorder = container.getBoundingClientRect().bottom;

	if (containerBottomBorder > document.documentElement.clientHeight - offset) return;

	const action = container.dataset.scrollDynamic.includes('?')
		? `${container.dataset.scrollDynamic}&itemsLoaded=${container.childElementCount}`
		: `${container.dataset.scrollDynamic}?itemsLoaded=${container.childElementCount}`;

	container.setAttribute('data-load-disable', '');

	fetch(action)
	.then(response => response.text())
	.then(html => {
		container.insertAdjacentHTML('beforeend', html);
	})
	.then(() => {
		lazyLoader.destroy();
		initLazyLoad();
		container.removeAttribute('data-load-disable', '');
	})
	.catch(error => {
		console.log(error.message)
		container.removeAttribute('data-load-disable', '');
	});
}

// Инициализация элемента, по нажатию на который будет отменяться или возобровляться динамическая подгрузка контента по скроллу
document.querySelectorAll('[data-dynamic-loader]').forEach(dynamicLoader => {
	const container = document.querySelector('[data-scroll-dynamic]');

	if (!container) return;

	// Объект локализации для текста кнопки
	const loaderLocalization = {
		'enable': {
			English: 'Enable loading',
			Russian: 'Разрешить подгрузку',
		},
		'disable': {
			English: 'Disable loading',
			Russian: 'Запретить подгрузку',
		},
	};

	if (container.dataset.loadDisable === undefined) {
		dynamicLoader.classList.add('_active');
		dynamicLoader.innerHTML = loaderLocalization['disable'][LOCALIZATION];
	} else {
		dynamicLoader.classList.remove('_active');
		dynamicLoader.innerHTML = loaderLocalization['enable'][LOCALIZATION];
	}

	dynamicLoader.addEventListener('click', () => {
		if (container.dataset.loadDisable === undefined) {
			dynamicLoader.classList.remove('_active');
			container.setAttribute('data-load-disable', '');
			dynamicLoader.innerHTML = loaderLocalization['enable'][LOCALIZATION];
		} else {
			dynamicLoader.classList.add('_active');
			container.removeAttribute('data-load-disable');
			dynamicLoader.innerHTML = loaderLocalization['disable'][LOCALIZATION];
			loadContentOnScroll();
		}
	});
});

