// Инициализация динамической адаптации
new Adapt();

// Инициализация модального окна
const modal = new Modal({animation: 'fadeIn'});





// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! КОД ДЕМОНСТРАЦИОННОГО ШАБЛОНА !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
new Menu('navigation-menu', {
	lockOnOpen: false,
	isOpen: true,
	closeOnOutside: false,
});

new Menu('information-menu', {
	lockOnOpen: false,
	isOpen: true,
	closeOnOutside: false,
});

new Menu('main-menu');

new Menu('menu');

new Menu('simple-menu', {
	lockOnOpen: false,
	closeOnSelect: true,
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! КОД ДЕМОНСТРАЦИОННОГО ШАБЛОНА !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
new Spoiler('spoiler');

new Spoiler('accordion', {
	single: true,
	mediaMin: 1000,
});

new Spoiler('spoiler-deap');

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! КОД ДЕМОНСТРАЦИОННОГО ШАБЛОНА !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
new Tabs('tabs');

new Tabs('tabs-deap');

document.querySelectorAll('.tabs-inner').forEach((tabsInner) => {
	new Tabs(tabsInner.dataset.tabs);
});

new Tabs('tabs-ajax', {
	ajax: true,
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! КОД ДЕМОНСТРАЦИОННОГО ШАБЛОНА !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!