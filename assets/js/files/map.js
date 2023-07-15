// Дождёмся загрузки API и готовности DOM.
ymaps.ready(initMaps);


function initMaps() {
	initMainMap();
}


function initMainMap() {
	if (!document.getElementById('map')) return;

	//Создаём карту
	const map = new ymaps.Map('map', {
		center: [56.75, 37.198],
		zoom: 15,
		controls: ['zoomControl'],
	});

	//Устанавливаем маркер
	map.geoObjects.add(new ymaps.Placemark([56.75, 37.198], {
		balloonContent: '<strong>ФБУЗ МСЧ № 9 ФМБА РОССИИ</strong>',
	}, {
			preset: 'islands#dotIcon',
			iconColor: '#E35946',
	}));

	//Убираем возможность скролить и перетаскивать
	map.behaviors.disable('scrollZoom');
	map.behaviors.disable('multiTouch');
	map.behaviors.disable('drag');
}