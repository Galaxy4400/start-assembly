/**
 * forms.js
 * 
 * Copyright (c) 2023 Moiseev Evgeny
 * Organization: WebisGroup
 * 
 * Скрипты автоматизации построения и обработки форм.
 * 
 * Стартовые стили: assets/scss/_forms.scss
 */


/**
 * Инициализация input[type="radio"] по атрибуту data-radio
 * 
 * Выстраивает дополнительную обёртку для возможной кастомизации элемента.
 * 
 * Дополнительно есть возможность установить на элемент следующие атрибуты:
 * 
 * data-label="{value}" - Надпись радиокнопки
 * data-custom - Даёт возможность придать абсолютно любой вид радиокнопкам. Чтобы этого добиться, необходимо выполнить следующее:
 * Сразу же после input[type="radio"][data-radio][data-custom] в html разметке создать блок SPAN с атрибутом data-radio-custom - <span data-radio-custom></span> и верстать его так, будто input является его родителем.
 * (!) Так как и input и span будут обёрнуты в label, то есть семантические нюансы в html разметке. В теге label могут быть только такие теги как input, span и img. 
 * Поэтому всю разметку необходимо делать только ими. А уже затем, в стилях, по классам можно любому спану задать то отображение, которое необходимо: block, flex, grid...
 * Активный элемент будет получать класс _checked, с которым и нужно работать в дальнейшем при стилизации.
 */
document.querySelectorAll('input[data-radio]').forEach(radio => {

	if (radio.type != 'radio') { console.error("Элемент должен являеться input[type='radio']"); return; }

	const isCustom = radio.dataset.custom !== undefined ? true : false;
	const radioContainer = document.createElement('label');
	const radioLabel = isCustom ? radio.nextElementSibling : document.createElement('span');

	if (isCustom && (radioLabel.tagName.toLowerCase() != 'span' || radioLabel.dataset.radioCustom == undefined)) {
		console.error('Кастомное поле радиокнопки должно являться span-ом и иметь атрибут data-radio-custom');
		return;
	}

	radioContainer.classList.add('radio');
	radioContainer.classList.add(isCustom ? 'radio_custom' : 'radio_default');
	
	if (radio.className) {
		radioContainer.classList.add(radio.className.split(' ')[0]);
		radio.className = radio.className.split(' ')[0] + '__input';
	}

	if (!isCustom) {
		radioLabel.innerText = radio.dataset.label;
		radioLabel.className = 'radio__mark';
	}
	
	if (radio.checked) radioContainer.classList.add('_checked');

	radioContainer.append(radioLabel);

	radio.after(radioContainer);
	radioContainer.prepend(radio);
	
	radio.addEventListener('change', () => {
		document.querySelectorAll(`input[data-radio][name="${radio.name}"]`).forEach(radio => {
			radio.parentElement.classList.remove('_checked');
		});
		radio.parentElement.classList.add('_checked');
	});
});


/**
 * Инициализация input[type="checkbox"] по атрибуту data-check
 * 
 * Выстраивает дополнительную обёртку для возможной кастомизации элемента.
 * 
 * Дополнительно есть возможность установить на элемент следующие атрибуты:
 * 
 * data-label="{value}" - Надпись чекбокса
 * data-custom - Даёт возможность придать абсолютно любой вид чекбоксу. Чтобы этого добиться, необходимо выполнить следующее:
 * Сразу же после input[type="checkbox"][data-check][data-custom] в html разметке создать блок SPAN с атрибутом data-check-custom - <span data-check-custom></span> и верстать его так, будто input является его родителем.
 * (!) Так как и input и span будут обёрнуты в label, то есть семантические нюансы в html разметке. В теге label могут быть только такие теги как input, span и img. 
 * Поэтому всю разметку необходимо выполнять только ими. А уже затем, в стилях, по классам можно любому спану задать то отображение, которое необходимо: block, flex, grid...
 * Активный элемент будет получать класс _checked, с которым и нужно работать в дальнейшем при стилизации.
 */
document.querySelectorAll('input[data-check]').forEach(check => {

	if (check.type != 'checkbox') { console.error("Элемент должен являеться input[type='checkbox']"); return; }

	const isCustom = check.dataset.custom !== undefined ? true : false;
	const checkContainer = document.createElement('label');
	const checkLabel = isCustom ? check.nextElementSibling : document.createElement('span');

	if (isCustom && (checkLabel.tagName.toLowerCase() != 'span' || checkLabel.dataset.checkCustom == undefined)) {
		console.error('Кастомное поле радиокнопки должно являться span-ом и иметь атрибут data-check-custom');
		return;
	}

	checkContainer.classList.add('check');
	checkContainer.classList.add(isCustom ? 'check_custom' : 'check_default');
	
	if (check.className) {
		checkContainer.classList.add(check.className.split(' ')[0]);
		check.className = check.className.split(' ')[0] + '__input';
	}

	if (!isCustom) {
		checkLabel.innerText = check.dataset.label;
		checkLabel.className = 'check__mark';
	}
	if (check.checked) checkContainer.classList.add('_checked');

	checkContainer.append(checkLabel);

	check.after(checkContainer);
	checkContainer.prepend(check);

	check.addEventListener('change', () => {
		check.checked ? check.parentElement.classList.add('_checked') : check.parentElement.classList.remove('_checked');
	});
});


/**
 * Инициализация input[type="file"] по атрибуту data-file
 * 
 * Выстраивает дополнительную обёртку для возможной кастомизации элемента.
 */
document.querySelectorAll('input[data-file]').forEach(input => {

	if (input.type != 'file') { console.error("Элемент должен являеться input[type='file']"); return; }

	// Объект локализации для текста кнопки
	const fileButtonLocalization = {
		English: 'Choose File',
		Russian: 'Выберите файл',
	};

	const inputContainer = document.createElement('label');
	const inputLabel = document.createElement('span');
	const inputButton = document.createElement('span');

	inputContainer.className = 'input-file';
	inputLabel.className = 'input-file__text';
	inputButton.className = 'input-file__btn';

	inputButton.innerText = fileButtonLocalization[LOCALIZATION];

	inputContainer.append(inputLabel);
	inputContainer.append(inputButton);

	input.after(inputContainer);
	inputLabel.after(input);

	input.addEventListener('change', () => {
		// Вставка в текстовый блок названий выбранных файлов
		let files = [];
		Object.values(input.files).forEach((file) => files.push(file.name));
		const filesStr = files.join(', ');
		inputLabel.innerHTML = files.length ? filesStr : '';
		inputLabel.title = filesStr;
	});
});


/**
 * Инициализация слайдеров формы для выбора числа, либо диапазона чисел по атрибуту data-slider="{sliderName}". Где sliderName - любой уникальный идентификатор.
 * Идентификатор будет участвовать в формировании имён инпутов соответствующих управляющим элементам слайдера формы.
 * 
 * Используется библиотека nouislider.js: assets/js/libs/nouislider.min.js
 * Документация: https://refreshless.com/nouislider/
 * 
 * Требуется подключение стилей: assets/scss/_nouislider.scss
 * 
 * Инициализация происходит на блоке DIV: <div data-slider="value"></div>
 * 
 * Элемену слайдера также можно задать следующие атрибуты:
 * data-range="{min,max}" - диапазон от min до max (Обязательный атрибут!)
 * data-start="{value|value1,value2}" - начальное положение управляющих элементов.
 * data-start="{value}" - Если одно значение, то будет создан слайдер с одним ползунком и с одним инпутом input[name="sliderName"]
 * data-start="{value1,value2}" Если два значения (через запятую!), то создасться два ползунка и два инпута: input[name="sliderName_min"] и input[name="sliderName_max"]
 * data-step="{value}" - шаг прибавления/убавления.
 * data-label="{value}" - если не установлен, то будет отображаться стандартный лейбл. Если указать пустую строку, то лейбл отображаться не будет. Если задать значение, то оно отобразится перед основным лейблом.
 * data-suffix="{value}" - значение выводящееся после основного лейбла.
 * data-fraction="{value}" - количество нулей после запятой. По умолчанию 0.
 * data-between="{value|value1,value2}" - расстояние между ползунками.
 * data-between="{value}" - если значение одно, то будет установлено минимальное расстояние между ползунками
 * data-between="{value1,value2}" - если значения два (через запятую!), то будет установлено минимальное и максимальное расстояние между ползунками. Если нужно установить только максимальное, то первому значению нужно установить 0.
 * data-padding="{value}" - запрещающие отступы по краям слайдера
 * data-inputs - отображать инпуты
 * data-tooltips - отображать тултипы
 */
document.querySelectorAll('[data-slider]').forEach((range) => {

	const rangeName = range.dataset.slider;

	if (document.querySelectorAll(`[data-slider=${rangeName}]`).length > 1) { console.error(`Несколько диапазонов ${rangeName} на странице!`); return; }
	if (!range.dataset.range) { console.error(`Слайдеру data-slider="${rangeName}" не установлен диапазон (data-range)`); return; }

	// Объект локализации диапазона
	const rangeLocalization = {
		'from': {
			English: 'From',
			Russian: 'От',
		},
		'to': {
			English: 'to',
			Russian: 'до',
		},
		'value': {
			English: 'Value',
			Russian: 'Значение',
		},
	};

	// Разделение строки диапазона по запятой
	const [min, max] = range.dataset.range.split(',').map(num => +(num.trim()));

	if (min == undefined || max == undefined) { console.error(`Слайдеру data-slider="${rangeName}" некорректно установлен диапазон (data-range)`); return; }

	// Определение стартовых позиций диапазона
	const start = range.dataset.start ? range.dataset.start.split(',').map(num => +(num.trim())) : [min];

	// Определение дополнительных параметров диапазона
	const beetwen = range.dataset.between?.split(/,\s*/);
	const rangeBetweenMin = (beetwen && +beetwen[0] !== 0) ? +beetwen[0] : false;
	const rangeBetweenMax = (beetwen && +beetwen[1] !== 0 && start[1]) ? +beetwen[1] : false;
	const rangePadding = range.dataset.padding ? +range.dataset.padding : false;
	const rangeStep = range.dataset.step ? +range.dataset.step : false;
	const rangeFraction = range.dataset.fraction ? +range.dataset.fraction : 0;
	const rangeTooltips = range.dataset.tooltips !== undefined ? true : false;
	const rangeShowInputs = range.dataset.inputs !== undefined ? true : false;

	// Создание дополнительной структуры элементов
	const rangeContainer = document.createElement('div');
	const rangeLabel = document.createElement('div');
	const rangeInputsContainer = document.createElement('div');
	
	// Создание инпутов соответствующих элементам управлнения слайдера
	const rangeInputs = start.map((value, i) => {
		const rangeInput = document.createElement('input');
		if (start.length > 1) {
			switch (i) {
				case 0: rangeInput.name = `${rangeName}_min`; break;
				case 1: rangeInput.name = `${rangeName}_max`; break;
				default: rangeInput.name = `${rangeName}_${i}`; break;
			}
		} else {
			rangeInput.name = rangeName;
		}
		rangeInput.type = 'number';
		rangeInput.setAttribute('value', value);
		rangeInput.className = 'range__input';
		rangeInput.setAttribute('data-qty', "");
		if (rangeStep) rangeInput.setAttribute('step', rangeStep);
		rangeInputsContainer.append(rangeInput);
		return rangeInput;
	});

	rangeContainer.className = `range range_${rangeName}`;
	rangeLabel.className = `range__labels`;
	rangeInputsContainer.className = `range__inputs`;
	range.className = `range__slider`;

	rangeContainer.append(rangeInputsContainer);
	rangeContainer.append(rangeLabel);

	range.after(rangeContainer);
	rangeInputsContainer.after(range);

	// Инициализация диапазона
	noUiSlider.create(range, {
		start: start,
		range: {
			'min': min,
			'max': max,
		},
		format: {
			to: value => +Number(value).toFixed(rangeFraction),
			from: value => +Number(value).toFixed(rangeFraction),
		},
		connect: (start.length == 1) ? 'lower' : (start.length == 2) ? [false, true, false] : false, // Соединитель между ползунками: один - слева, два - посередине, больше - нет.
		...( rangeBetweenMin ? { margin: rangeBetweenMin } : {} ),
		...( rangeBetweenMax ? { limit: rangeBetweenMax } : {} ),
		...( rangeBetweenMax ? { behaviour: 'drag' } : {} ),
		...( rangePadding ? { padding: rangePadding } : {} ),
		...( rangeStep ? { step: rangeStep } : {} ),
		...( rangeTooltips ? { tooltips: start.length == 1 ? [true] : [true, true] } : {} ),
	});

	// Функция скрытия блока инпутов
	const hideInputs = () => {
		rangeInputsContainer.style.height = '0px';
		rangeInputsContainer.style.overflow = 'hidden';
		rangeInputsContainer.style.position = 'absolute';
	};

	// Функция добавления недостающих нулей
	const addZeroes = (num, fraction) => {
		return num.toLocaleString("en", {useGrouping: false, minimumFractionDigits: fraction})
	}

	// Функция синхронизации инпутов на изменение значений слайдера
	const synchronWithSlider = () => {
		range.noUiSlider.on('update', (values, handle) => {
			if (!handle) {
				if (rangeInputs[0]) rangeInputs[0].value = addZeroes(Number(values[handle]), rangeFraction);
			} else {
				if (rangeInputs[1]) rangeInputs[1].value = addZeroes(Number(values[handle]), rangeFraction);
			}
		});
	};

	// Функция синхронизации слайдера на изменение значений инпутов
	const synchronWithInputs = () => {
		if (rangeInputs[0]) rangeInputs[0].addEventListener('change', () => {
			range.noUiSlider.set([addZeroes(rangeInputs[0].value, rangeFraction), null]);
		});
		if (rangeInputs[1]) rangeInputs[1].addEventListener('change', () => {
			range.noUiSlider.set([null, addZeroes(rangeInputs[1].value, rangeFraction)]);
		});
	};

	// Вывод значения в лейбл
	range.noUiSlider.on('update', (values) => {
		const isLabel = range.dataset.label === '' ? false : true;
		if (!isLabel) return;
		const suffix = range.dataset.suffix ? ` ${range.dataset.suffix}` : '';
		if (values.length == 1) {
			const label = range.dataset.label ? range.dataset.label : rangeLocalization['value'][LOCALIZATION];
			rangeLabel.innerHTML = `${label}: ${addZeroes(values[0], rangeFraction)}${suffix}`;
		} else {
			const label = range.dataset.label ? range.dataset.label + ': ' : '';
			const value = values.map(value => addZeroes(value, rangeFraction)).join(' '+rangeLocalization['to'][LOCALIZATION]+' ');
			rangeLabel.innerHTML = `${label}${rangeLocalization['from'][LOCALIZATION]} ${value}${suffix}`;
		}
	});

	
	if (!rangeShowInputs) hideInputs();

	synchronWithSlider();
	synchronWithInputs();
});


/**
 * Инициализация input[type="number"] по атрибуту data-qty.
 * 
 * Выстраивает дополнительную обёртку и создаёт дополнительные управляющие элементы вокруг инпута для возможной кастомизации.
 * Стандартные элементы управления убираются стилями.
 * 
 * Дополнительно есть возможность установить на элемент следующие атрибуты:
 * 
 * min="{value}" - минимальное значение
 * max="{value}" - максимальное значение
 * step="{value}" - шаг прибавления/убавления
 */
document.querySelectorAll('input[data-qty]').forEach(qtyInput => {

	if (qtyInput.type != 'number') { console.error("Элемент должен являеться input[type='number']"); return; }

	const isValue = qtyInput.value !== '' ? true : false;
	const min = qtyInput.min ? +qtyInput.min : -Infinity;
	const max = qtyInput.max ? +qtyInput.max : +Infinity;

	if (min > max) { console.error('data-min не может быть больше data-max'); return }

	if (!isValue) qtyInput.value = 0;
	if (qtyInput.value < min) qtyInput.value = min;
	if (qtyInput.value > max) qtyInput.value = max;

	const inputContainer = document.createElement('div');
	const inputMinus = document.createElement('button');
	const inputPlus = document.createElement('button');
	const inputWrapper = document.createElement('div');

	inputMinus.type = 'button';
	inputPlus.type = 'button';
	inputContainer.className = 'quantity' + (qtyInput.hasAttribute('readonly') ? ' _readonly' : '');
	inputMinus.className = 'quantity__button quantity__button_minus';
	inputPlus.className = 'quantity__button quantity__button_plus';
	inputWrapper.className = 'quantity__input';

	inputContainer.append(inputMinus);
	inputContainer.append(inputWrapper);
	inputContainer.append(inputPlus);

	qtyInput.after(inputContainer);
	inputWrapper.prepend(qtyInput);

	qtyInput.autocomplete = 'off';

	// Функционал изменения значения инпута
	// Реализовано изменение значения инпута при удержании нажатой кнопки мыши на элементах вычитания/прибавления
	const counterStep = qtyInput.hasAttribute('step') ? +qtyInput.getAttribute('step') : 1;
	const counterTimeoutSpeedMin = 20;
	const counterSpeedDivider = 2;
	let counterTimeoutSpeed = 500;
	let mousedownTimeout = null;
	
	// Функция сброса значений скорости прибавления/вычитания
	const qtyTimeoutReset = (value = qtyInput.value) => {
		clearInterval(mousedownTimeout);
		counterTimeoutSpeed = 500;
		qtyInput.value = value;
		qtyInput.dispatchEvent(new Event("change"));
	};

	// Функция вычисления скорости при длительном удержании нажатой кнопки мыши
	const qtyTimeoutSpeed = () => {
		counterTimeoutSpeed =
			counterTimeoutSpeed / counterSpeedDivider > counterTimeoutSpeedMin
				? counterTimeoutSpeed / counterSpeedDivider
				: counterTimeoutSpeedMin;
	};

	// Функция увеличение значения инпута
	const qtyIncreasing = () => {
		if ((+qtyInput.value + counterStep) > max) { qtyTimeoutReset(max); return; }
		qtyInput.value = +qtyInput.value + counterStep;
		qtyTimeoutSpeed();
		qtyInput.dispatchEvent(new Event("change"));
		mousedownTimeout = setTimeout(qtyIncreasing, counterTimeoutSpeed);
	};

	// Функция увеличения значения инпута
	const qtyReducing = () => {
		if ((+qtyInput.value - counterStep) < min) { qtyTimeoutReset(min); return; }
		qtyInput.value = qtyInput.value - counterStep;
		qtyTimeoutSpeed();
		qtyInput.dispatchEvent(new Event("change"));
		mousedownTimeout = setTimeout(qtyReducing, counterTimeoutSpeed);
	};

	// Обработка нажания на элементы управления инпута
	inputContainer.querySelectorAll('.quantity__button').forEach(qtyBtn => {
		qtyBtn.addEventListener('mousedown', () => {
			if (qtyInput.hasAttribute('readonly')) return;
			if (qtyBtn.classList.contains('quantity__button_plus')) {
				qtyIncreasing();
			} else {
				qtyReducing();
			}
			qtyInput.dispatchEvent(new Event("change"));
		});

		// Сброс значений скорости при отпускании кнопки мыши, или при уводе курсора мыши с элемента управления
		qtyBtn.addEventListener('mouseup', () => qtyTimeoutReset());
		qtyBtn.addEventListener('mouseout', () => qtyTimeoutReset());
	});

	// Обработка изменения значения инпута
	qtyInput.addEventListener('change', () => {
		let value = +qtyInput.value;
		if (isNaN(value)) value = 0;
		if (value < min) value = min;
		if (value > max) value = max;
		qtyInput.value = value;
	});
});


/**
 * Инициализация селекторов по атрибуту data-choice. Расширение функционала и улучшение внешнего вида селекторов.
 * 
 * Используется библиотека choices.js: assets/js/libs/choices.min.js
 * Документация: https://github.com/Choices-js/Choices
 * Примеры: https://choices-js.github.io/Choices/
 * 
 * Требуется подключение стилей: assets/scss/_choices.scss
 * 
 * Элемену селектора также можно задать следующие атрибуты:
 * multiple - множественный выбор
 * placeholder="{value}" - надпись в строке селектора
 * data-placeholder="{value}" - надпись в строке поиска по селектору (если есть)
 * data-search - отображение поиска по селектору
 */
document.querySelectorAll('[data-choice]').forEach((select) => {
	
	// Объект локализации для настроек choice
	const choicesLocalization = {
		noResultsText: {
			English: 'No results found',
			Russian: 'Ничего не найдено',
		},
		noChoicesText: {
			English: 'No choices to chose form',
			Russian: 'Вариантов для выбора больше нет',
		},
	};

	// Подготовка переключателей валидации обычного селектора к переносу в choice
	const switcherOptions = {};
	select.querySelectorAll('[data-switcher]').forEach((option) => {
		switcherOptions[option.value] = option.dataset.switcher;
	});
	
	// Подготовка классов обычного селектора к переносу в choice
	const selectClassName = select.className;
	select.removeAttribute('class');
	
	// Инициализация choice
	const choice = new Choices(select, {
		searchEnabled: (select.dataset.search !== undefined) ? true : false,
		placeholderValue: select.getAttribute('placeholder'),
		searchPlaceholderValue: (select.dataset.placeholder !== undefined) ? select.dataset.placeholder : '',
		noResultsText: choicesLocalization.noResultsText[LOCALIZATION],
		noChoicesText: choicesLocalization.noChoicesText[LOCALIZATION],
		shouldSort: false,
		itemSelectText: '',
		removeItemButton: select.hasAttribute('multiple') ? true : false,
		classNames: {
			containerOuter: `choices ${selectClassName}`,
		},
	});

	// Добавление к choice объекта с данными о переключателях валидации
	choice.switcherOptions = switcherOptions;

	// Добавление к select внутри choice атрибута, содержащего все переключатели
	const switcherList = Object.entries(switcherOptions).map(switcher => `${switcher[1]}`).join(',');
	choice.passedElement.element.setAttribute('data-switcher', switcherList);

	// Функция установки активного переключателя в зависимости от выбранной опции choice
	const processChoiceSwitcher = (value) => {
		if (choice.switcherOptions[value]) {
			choice.passedElement.element.setAttribute('data-switcher-active', choice.switcherOptions[value]);
		} else {
			choice.passedElement.element.removeAttribute('data-switcher-active');
		}
	}

	// Установка текущего переклучателя
	processChoiceSwitcher(choice.getValue(true));
	
	// Обработка изменения choice
	choice.passedElement.element.addEventListener('change', event => {
		processChoiceSwitcher(event.detail.value)
	});

	// TODO: Пока что реализована обработка переключателей только у одиночных селекторов. Позже сделать мультиселекты.
});


/**
 * Инициализация полей выбора даты по атрибуту data-date
 * 
 * Используется библиотека air-datepicker.js: assets/js/libs/datepicker.min.js
 * Документация: https://air-datepicker.com/ru/docs
 * Примеры: https://air-datepicker.com/ru/examples
 * 
 * Требуется подключение стилей: assets/scss/_datepicker.scss
 */
document.querySelectorAll('input[data-date]').forEach(input => {

	let locale = false;

	switch (LOCALIZATION) {
		case 'English':
			locale = {
				days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
				daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
				months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				today: 'Today',
				clear: 'Clear',
				dateFormat: 'MM/dd/yyyy',
				timeFormat: 'hh:mm aa',
				firstDay: 0
			};
			break;
	}

	new AirDatepicker(input, {
		...( locale ? { locale } : {} ),
	});
});


/**
 * Инициализация рейтингов по атрибуту data-rating[="{value}"]. Где value - имя инпута рейтинга. Значение опционально. По умолчанию: rating
 * 
 * Используется плагин rating.js: assets/js/plugins/rating.js
 * Документация: assets/js/plugins/rating.txt
 * 
 * Дополнительно есть возможность установить на элемент следующие атрибуты:
 * 
 * data-value="{value}" - текущуу значение рейтинга. По умолчанию: 0
 * data-count="{value}" - количество "звёзд" в рейтинге. По умолчанию: 5
 * data-action="{value}" - url запроса, по которому будет ассинхронно обработано выбранное значение рейтинга. По умолчанию: null
 * data-fraction="{value}" - количество знаков после запятой в текущем значении
 * data-disable - отключение возможности выбрать значение рейтинга
 */
document.querySelectorAll('[data-rating]').forEach(rating => {
	const name = rating.dataset.rating ? rating.dataset.rating : 'rating';
	const value = rating.dataset.value ? +rating.dataset.value : 0;
	const count = rating.dataset.count ? +rating.dataset.count : 5;
	const fraction = rating.dataset.fraction ? +rating.dataset.fraction : 1;
	const action = rating.dataset.action ? rating.dataset.action : false;
	const disable = rating.dataset.disable !== undefined ? true : false;

	new Rating(rating, {
		ratingValue: value,
		inputName: name,
		bulletsCount: count,
		valueFraction: fraction,
		action: action,
		disable: disable,
	});
});


/**
 * Инициализация формата ввода (маски) в поле формы по атрибуду data-mask="{value}"
 * 
 * Используется библиотека inputmask.js: assets/js/libs/inputmask.min.js
 * Документация: https://robinherbots.github.io/Inputmask/#/documentation
 * Примеры: https://robinherbots.github.io/Inputmask/#/demo
 * 
 * Доступные атрибуты:
 * data-mask="{value}" - формат маски. Например: {+7 (999) 999-9999} - номер телефона, {99.99.9999} - дата. Подробней о возможностях см. документацию inputmask.js
 * data-mask-placeholder="{value}" - формат отображения плейсхолдера. По умолчанию - {пробел}. Есть возможность установить полноформатный плейсхолдер маски. Например: {dd.mm.yyyy} - плейсхолдер маски даты. Подробней о возможностях см. документацию inputmask.js
 * data-mask-between="{value}" - расстояние между символами (в пикселях)
 */
document.querySelectorAll('input[data-mask]').forEach(input => {
	const letterSpacing = input.dataset.maskBetween ? input.dataset.maskBetween : false;
	
	// Расстояние между символами маски в инпуте
	if (letterSpacing) input.style.setProperty('--mask-letter-spacing', `${letterSpacing}px`);
	
	// Инициализация маски
	new Inputmask({
		mask: input.dataset.mask,
		placeholder: input.dataset.maskPlaceholder ? input.dataset.maskPlaceholder : " ",
		clearIncomplete: true,
		clearMaskOnLostFocus: true,
	}).mask(input);
	
	// Условия добавления инпуту технического класса маски для корректного отображения расстояния между символами
	input.addEventListener('mouseenter', () => input.classList.add('_mask'));
	input.addEventListener('mouseleave', () => input.value || input === document.activeElement ? false : input.classList.remove('_mask'));
	input.addEventListener('focus', () => input.classList.add('_mask'));
	input.addEventListener('blur', () => input.value ? false : input.classList.remove('_mask'));
});


/**
 * Инициализация форм по атрибуту data-form
 * Инициализация по дата-атрибуту реализована затем, чтобы если по какой-то причине весь дополнительный функционал форме не нужен, была возможность этого не добавлять.
 * 
 * Добавляется валидация, маски, рекапча и т.д.
 * 
 * Помимо прочих обязательных атрибутов, элемену формы можно также задать:
 * data-send="{test|ajax}" - отправка формы без перезагрузки страницы.
 * data-send="test" - тестовая отправка формы. Данные никуда не отправляются. После сабмита открывается модальное окно с атрибутом data-modal="form-sended". См. modal.js
 * data-send="ajax" - ассинхронная отправка формы в соответствии с установками. После положительного ответа с сервера открывается модальное окно с атрибутом data-modal="form-sended". См. modal.js
 * data-before="{function_name}" - функция, которая будет выполнена перед отправкой формы. (!)Название функции без (). Если функция вернёт false, форма отправлена не будет.
 * data-after="{function_name}" - функция, которая будет выполнена после получения ответа с сервера. (!)Название функции без (). В параметре функции будут доступны данные, которые вернул сервер.
 * data-autocomplete-off - удаляет функцию автозаполнения полей формы браузерами
 */
document.querySelectorAll('form[data-form]').forEach((form) => {
	autoComplete(form);
	setRecaptcha(form);
	validateForm(form);
});


/**
 * Обработка функции автозаполнения полей форм браузерами
 */
function autoComplete(form) {
	const isAutocompleteOff = form.dataset.autocompleteOff !== undefined ? true : false;

	if (!isAutocompleteOff) return;

	form.setAttribute('autocomplete', 'none');

	const allFields = form.querySelectorAll('input, select, textarea');

	allFields.forEach(field => {
		field.setAttribute('autocomplete', 'none');
		field.setAttribute('readonly', 'readonly');
	});
	
	document.addEventListener('DOMContentLoaded', () => {
		setTimeout(() => {
			allFields.forEach(field => field.removeAttribute('readonly'));
		}, 1000);
	});
}


/**
 * Инициализация рекапчи формы.
 * 
 * Используется google reCAPTCHA v.3
 * Документация: https://developers.google.com/recaptcha/docs/v3
 * 
 * Чтобы рекапча установилась на форму, в форме необходимо создать два скрытых инпута:
 * <input type="hidden" name="siteKey" value="{ключ сайта, полученный при регистрации домена на https://developers.google.com/recaptcha/docs/v3}">
 * <input type="hidden" name="token" value="">
 * 
 * После инициализации, значение поля input[name="token"] будет заполнено неким хэшем, который необходимо будет обработать на стороне сервера после отправки формы, используя второй ключ secretKey, полученный при регистрации домена на https://developers.google.com/recaptcha/docs/v3.
 * Как правильно обрабатывать рекапчу на стороне сервева так же см. документацию https://developers.google.com/recaptcha/docs/v3
 */
function setRecaptcha(form) {
	const isRecaptcha = form.querySelector('input[name="siteKey"]') ? true : false;

	if (!isRecaptcha) return;

	document.addEventListener("DOMContentLoaded", () => {
		const siteKey = form.querySelector('input[name="siteKey"]').value;
		grecaptcha.ready(() => {
			grecaptcha.execute(siteKey, { action: 'homepage' }).then(token => {
				form.querySelector('input[name="token"]').value = token;
			});
		});
	});
}


/**
 * Установка валидации полей формы
 * 
 * Используется библиотека justvalidate.js: assets/js/libs/justvalidate.min.js
 * Документация: https://just-validate.dev/docs/intro
 * Примеры: https://just-validate.dev/examples
 * 
 * Каждый input формы будет валидироваться по разному в зависимости от установленного в нём значения атрибута type (text, email, password, checkbox, radio, file). См. документацию just-validate.
 * 
 * Также элементам input, texarea, checkbox есть возможность установить дополнительные атрибуты:
 * data-required - обязательное поле
 * data-min="{value}" - минимальное количество символов (минимальное количество файлов в input[type="file"])
 * data-max="{value}" - максимальное количество символов (максимальное количество файлов в input[type="file"])
 * data-regexp="{value}" - соответствие поля заданному регулярному выражению
 * 
 * Инпуту с пипом file можно задать также следующие атрибуты:
 * data-ext="{value}" - допустимые расширения файлов через запятую.
 * data-size-min="{value}" - минимальный размер файлов (в килабайтах)
 * data-size-max="{value}" - максимальный размер файлов (в килабайтах)
 * data-types="{value}" - допустимые типы файлов через запятую
 * 
 * Повтор пароля: инпуту с паролем добавить data-repeat, инпуту с повторением data-repeater
 * Валидация группы radio или checkbox: надо поместить инпуты в контейнер с атрибутом data-group={value}. Где value - уникальное имя группы. Удобно сделать в соответствии с атрибутом name инпутов группы.
 * Ассинхронная проверка существования почты: инпуту с типом email добавить атрибут data-action={value}, где value - это запрос. Например: ./?action=checkEmail. Далее запрос будт преобразован в: ./?action=checkEmail&email={текущее значение поля}. Сервер должен вернуть true или false.
 * Скрыть лейбл ошибки, оставить только выделение: инпуту установить атрибут data-hide-error
 * 
 * Бывают случаи, когда в форме есть чекбокс или радиокнопки, а также селекторы, по нажатию на которые показываются или скрываются дополнительные поля.
 * Для того, чтобы правильно обработать валидацию таких полей, необходимо сделать следующее:
 * Радиокнопке или чекбоксу, а также опции селектора, задать атрибут data-switcher="{value}". Где value - любой уникальный идентификатор.
 * А блоку, в котором находится поле/поля формы (допустим любой уровень вложенности), задать атрибут data-switch="{value}", или data-switch-rev="{value}". Где value - такой-же идентификатор, как и в управляющем data-switcher.
 * В этом случае, если указанный data-switcher активен, то сответсвующие ему data-switch будут отображаться и валидироваться, а data-switch-rev наоборот скрываться и невалидироваться.
 * Блоки скрываются по средствам задания стилей по селектору [data-switch][data-disable] и [data-switch-rev][data-disable] соответственно.
 * 
 * Бывают случаи, когда форму необходимо отправить сразу после изменения состояния какого либо элемента формы.
 * Чтобы это реализовать, необходимо нужному элементу формы добавить атрибут data-submitter.
 */
function validateForm(form) {

	// Инициализация валидатора
	const validator = new JustValidate(form, {
		focusInvalidField: false, // отключение дефолтного фокуса для того, чтобы сделать плавную прокрутку до поля, а уже потом делать фокус
		errorFieldCssClass: '_error',
		successFieldCssClass: '_success',
		errorLabelCssClass: 'form__error-label',
	}, getValidatorLocalizations());


	// Установка локализации валидатора
	validator.setCurrentLocale(LOCALIZATION);


	// Функция добавления валидации одиночному полю
	const addFieldValidation = (field) => {
		const rules = getFieldRules(field, form);
		const config = getFieldConfig(field);

		if (rules.length) {
			field.setAttribute('data-validating', '');
			validator.addField(field, rules, config);
		}
	};


	// Функция добавления валидации группе полей
	const addGroupValidation = (group) => {
		if (group.closest('.choices')) return; // убираем конфликт с choices по атрибуту data-group

		const config = getFieldConfig(group);

		validator.addRequiredGroup(group, 'You should select at least one communication channel', config);
	};


	// Функция установки правил валидации на поля и группы
	const initValidation = (elements) => {
		const { fields, groups } = elements;

		[...fields, ...groups].forEach(elem => elem.closest('[data-switch], [data-switch-rev]')?.removeAttribute('data-disable')); // Удаление всем переданным элементам атрибута data-disable

		fields.forEach(field => {
			field.disabled = false;
			addFieldValidation(field);
		});

		groups.forEach(group => addGroupValidation(group));
	}


	// Функция удаления правил валидации с полей и групп
	const removeValidation = (elements) => {
		const { fields, groups } = elements;

		[...fields, ...groups].forEach(elem => elem.closest('[data-switch], [data-switch-rev]')?.setAttribute('data-disable', '')); // Установка всем переданным элементам атрибута data-disable

		fields.forEach(field => {
			field.closest('label')?.classList.remove(...[validator.globalConfig.errorFieldCssClass, validator.globalConfig.successFieldCssClass]);
			field.disabled = true;
			if (field.dataset.validating !== undefined) {
				field.removeAttribute('data-validating');
				validator.removeField(field);
			}
		});

		groups.forEach(group => validator.removeGroup(`[data-group="${group.dataset.group}"]`)); // (!!!) Баг плагина. Выдаёт ошибку при удалении валидации группы при любых условиях и селекторах. Очень специфичный и редкий случай где подобное может понадобиться, но стоит иметь в виду. Чтобы избежать данной ошибки, в скрываемых областях формы не должно находиться валидирующихся групп (data-group).
	}
	

	// Определение и инициализация всех полей и групп формы
	const allFields = form.querySelectorAll('input, select, textarea');
	const allGroups = form.querySelectorAll('[data-group]');
	const allElements = { fields: allFields, groups: allGroups };

	initValidation(allElements);
	

	// Инициализация переключателей
	form.querySelectorAll('[data-switcher]').forEach(formSwitcher => {
		
		// Определение типа переключателя
		const getSwitcherType = (switcher) => {
			let switcherType = false;

			if (switcher.type == 'checkbox' || switcher.type == 'radio') switcherType = 'check';
			if (switcher.type == 'select-one' || switcher.type == 'select-multiple') switcherType = 'choice';
			if (switcher.tagName.toLowerCase() == 'option') switcherType = 'option';

			return switcherType;
		};


		// Проверка состояния переключателя
		const checkSwitcherState = (switcher, switcherName) => {
			switch (getSwitcherType(switcher)) {
				case 'check': if (switcher.hasAttribute('checked')) return true; break;
				case 'option': if (switcher.hasAttribute('checked')) return true; break;
				case 'choice': if (switcherName === switcher.dataset.switcherActive) return true; break;
			}
			return false;
		};


		// Получить элементы переключателя
		const getSwitcherElements = (name, reverce = false) => {

			// Получение всех эелементов, привязанных к текущему переключателю
			const switchElems = document.querySelectorAll(`[data-switch${reverce?'-rev':''}="${name}"]`);

			// Получение полей из набора элементов переключателя
			const fields = 
				Object.values(switchElems)
				.reduce((elems, elem) => elems.concat(...elem.querySelectorAll('input, select, textarea')), [])
				.filter(elem => !elem.closest('[data-group]'));

			// Получение групп из набора элементов переключателя
			const groups = 
				Object.values(switchElems)
				.reduce((groups, elem) => groups.concat(...elem.querySelectorAll('[data-group]')), []);

			return { fields: fields, groups: groups };
		};


		// Переопределение валидации полей привязанных к соответствующему переключателю
		const redeclareValidation = (switcher, isChecked) => {
			const switcherName = (typeof switcher === 'string') ? switcher : switcher.dataset.switcher;

			const elements = getSwitcherElements(switcherName);
			const elementsRev = getSwitcherElements(switcherName, true);

			if (isChecked) {
				initValidation(elements);
				removeValidation(elementsRev)
			} else {
				initValidation(elementsRev);
				removeValidation(elements)
			}
		};


		// Получить массив всех переключателей в choice
		const getAllChoiceSwitchers = (switcher) => {
			return switcher.dataset.switcher.split(/,\s*/);
		};


		// Обработка изменения состояния переключателя c типом 'check'
		const checkSwitcherChange = (switcher) => {
			const switcherElems = form.querySelectorAll(`[name="${switcher.name}"]`);
			switcherElems.forEach(elem => {
				elem.addEventListener('change', () => redeclareValidation(switcher, switcher.checked));
			});
		};


		// Обработка изменения состояния переключателя c типом 'choice'
		const choiceSwitcherChange = (switcher) => {
			switcher.addEventListener('change', () => {
				const choiceSwitchers = getAllChoiceSwitchers(switcher);
				choiceSwitchers.forEach(switcherName => {
					redeclareValidation(switcherName, switcher.dataset.switcherActive === switcherName);
				});
			});
		}
		

		// Обработка изменения состояния переключателя c типом 'option'
		const optionSwitcherChange = (switcher) => {
			const selector = switcher.closest('select');
			selector.addEventListener('change', () => {
				redeclareValidation(switcher, selector.options[selector.selectedIndex].dataset.switcher === switcher.dataset.switcher);
			});
		};


		// Устанавка начального состояния элементов в зависимости от переключателя
		const setStartSwitcherElementsState = (switcher, switcherName) => {
			const elements = getSwitcherElements(switcherName);
			const elementsRev = getSwitcherElements(switcherName, true);

			if (!checkSwitcherState(switcher, switcherName)) removeValidation(elements);
			if (checkSwitcherState(switcher, switcherName)) removeValidation(elementsRev);
		};


		// Инициализация переключателя
		const initSwitcher = (switcher) => {
			const switcherName = switcher.dataset.switcher;

			// Установка начального состояния
			setStartSwitcherElementsState(switcher, switcherName);
	
			// Обработка в зависимости от типа переключателя
			switch (getSwitcherType(switcher)) {
				case 'check': checkSwitcherChange(switcher); break;
				case 'option': optionSwitcherChange(switcher); break;
				default: break;
			}
		};


		// Инициализация переключателя choice
		const initChoiceSwitcher = (switcher) => {
			const choiceSwitchers = getAllChoiceSwitchers(switcher);

			choiceSwitchers.forEach(switcherName => {
				setStartSwitcherElementsState(switcher, switcherName);
			});

			choiceSwitcherChange(switcher);
		}


		// Обработка переключателя
		const switcherType = getSwitcherType(formSwitcher);

		if (switcherType) { 
			switcherType === 'choice' ? initChoiceSwitcher(formSwitcher) : initSwitcher(formSwitcher);
		} else {
			console.error("Недопустимый тип переключателя"); return;
		}
		
		// TODO: Пока что реализована обработка переключателей только у одиночных селекторов. Позже сделать мультиселекты.
	});
	// Конец блока инициализации переключателей


	// Инициализация полей, при изменении которых будет произведена попытка отправки формы
	form.querySelectorAll('[data-submitter]').forEach(field => {
		field.addEventListener('change', () => validator.revalidate());
	});


	// Действие после каждой проверки полей
	validator.onValidate((validationData) => {
		
		// Только если форма отправлена
		if (!validationData.isSubmitted) return;

		// Функция добавления или удаления классов успеха или ошибки обёрткам кастомных элементов
		const processFieldValidClass = (elem, isValid) => {
			if (isValid) {
				elem.classList.add(validator.globalConfig.successFieldCssClass);
				elem.classList.remove(validator.globalConfig.errorFieldCssClass);
			} else {
				elem.classList.add(validator.globalConfig.errorFieldCssClass);
				elem.classList.remove(validator.globalConfig.successFieldCssClass)
			}
		}

		// Одиночные поля
		Object.values(validationData.fields).forEach((field) => {
			const elem = field.elem;
			const parent = elem.parentElement;

			const isChoics = elem.closest('.choices') ? true : false;
			const isCustomFile = elem.closest('.input-file') ? true : false;
			const isCustomCheck = (parent.tagName.toLowerCase() == 'label' && (elem.type == 'checkbox' || elem.type == 'radio')) ? true : false;

			if (isCustomFile || isChoics || isCustomCheck) {
				processFieldValidClass(parent, field.isValid);
			}
		});

		// Групповые поля
		Object.values(validationData.groups).forEach((group) => {
			group.elems.forEach(elem => {
				const parent = elem.parentElement;

				const isCustomCheck = (parent.tagName.toLowerCase() == 'label' && (elem.type == 'checkbox' || elem.type == 'radio')) ? true : false;

				if (isCustomCheck) {
					processFieldValidClass(parent, group.isValid);
				}
			});
		});
	});


	// Действие после успешной валидации формы
	// TODO: Попробовать научиться возвращать в doSubmitForm Promise, чтобы можно было через .then() что-то сделать после получения результата с сервера
	validator.onSuccess(() => doSubmitForm(form));
	

	// Действие на ошибку валидации
	validator.onFail(fields => {
		const errorField = Object.values(fields).find(field => !field.isValid).elem.parentElement;
		scrollTo(errorField, 0, true); // Переход к первому элементу с ошибкой
	});
}


/**
 * Установка правил валидации одиночному полю
 * 
 * @param {Object} input - поле формы
 * 
 * @return {Array} - массив объектов правил валидации поля
 */
function getFieldRules(input, form) {
	let rules = [];

	const type = input.type ? input.type : false;
	const required = input.required ? true : false;
	const repeater = input.dataset.repeater !== undefined ? true : false;
	const min = input.dataset.min ? input.dataset.min : false;
	const max = input.dataset.max ? input.dataset.max : false;
	const regexp = input.dataset.regexp ? input.dataset.regexp : false;

	// Поле обязательно
	if (required) {
		rules.push({
			rule: 'required',
			errorMessage: 'Field is required',
		});
	}

	// Валидация почты
	if (type == 'email') {

		// Корректность почты
		rules.push({
			rule: 'email',
			errorMessage: 'Field is invalid',
		});

		// Проверка на существование почты
		if (input.dataset.action) {
			rules.push({
				validator: (value) => () =>
					new Promise((resolve) => {
						// Формирование запроса
						const action = input.dataset.action.includes('?')
							? `${input.dataset.action}&email=${value}`
							: `${input.dataset.action}?email=${value}`;
						// Запрос на сервер
						fetch(action)
						.then(response => response.text())
						.then(isExist => resolve(isExist.toLowerCase() === 'true')) // Ответ с сервера (true/false)
						.catch(error => console.log(error));
					}),
				errorMessage: 'Email already exists!',
			});
		}
	}

	// Валидация пароля
	if (type == 'password') {
		rules.push({
			rule: 'password',
			errorMessage: `Password must contain minimum eight characters, at least one letter and one number`,
		});
	}

	// Совпадение пароля
	if (repeater) {
		rules.push({
			validator: (repeatValue, fields) => {
				const passwordField = form.querySelector('[data-repeat]');
				if (!passwordField || (!passwordField.value && !repeatValue)) return true;
				return repeatValue === passwordField.value;
			},
			errorMessage: 'Passwords should be the same',
		});
	}

	// Минимальная длина поля
	if (min) {
		rules.push({
			rule: 'minLength',
			value: parseInt(min),
			errorMessage: `Field is too short`,
		});
	}

	// Максимальная длина поля
	if (max) {
		rules.push({
			rule: 'maxLength',
			value: parseInt(max),
			errorMessage: `Field is too long`,
		});
	}

	// Соответствие регулярному выражению
	if (regexp) {
		rules.push({
			rule: 'customRegexp',
			value: new RegExp(regexp, "gi"),
			errorMessage: `Field is invalid`,
		});
	}
	
	// Валидация файлов
	if (type == 'file') {
		
		// Конфигурация загружаемых файлов
		rules.push({
			rule: 'files',
			value: {
				files: {
					extensions: input.dataset.ext ? input.dataset.ext.split(/,\s*/) : null,
					minSize: input.dataset.sizeMin ? +input.dataset.sizeMin * 1024 : null,
					maxSize: input.dataset.sizeMax ? +input.dataset.sizeMax * 1024 : null,
					types: input.dataset.type ? input.dataset.type.split(/,\s*/) : null,
				},
			},
			errorMessage: `Uploaded files have one or several invalid properties (extension/size/type etc).`,
		},);
		
		// Минимальное количество файлов
		if (min) {
			rules.push({
				rule: 'minFilesCount',
				value: parseInt(min),
				errorMessage: input.multiple ? `Files count should be more` : `No file selected`,
			});
		}
		
		// Максимальное количество файлов
		if (max) {
			rules.push({
				rule: 'maxFilesCount',
				value: parseInt(max),
				errorMessage: `Files count should be less`,
			});
		}
	}

	return rules;
}


/**
 * Создание и установка контейнеров для поля формы под вывод ошибки валидации
 * 
 * @param {Object} elem - элемент формы
 * 
 * @return {Object} - объект конфигурации элемента формы
 */
function getFieldConfig(elem) {
	const config = {};

	const type = (elem.dataset.group !== undefined) ? 'group' : elem.type;

	if (type == 'hidden') return;


	// Функция создания контейнера под ошибку валидации
	const createErrorContainer = (type) => {
		const newErrorsContainer =  document.createElement('div');

		if (elem.dataset.hideError !== undefined) newErrorsContainer.style.display = 'none';

		newErrorsContainer.className = `form__validate-error form__validate-error_${type}`;
		
		return newErrorsContainer;
	};


	// Функция удаления лишних контейнеров если есть
	const onlyOneErrorContainer = (container) => {
		const containerSelector = '.'+container.className.split(/ /g,).join('.');

		let containers = Array.from(container.parentElement.querySelectorAll(containerSelector));

		if (containers.length > 1) {
			container = containers.pop();
			containers.forEach(el => el.remove());
		}

		return container;
	};

	
	let errorsContainer;

	switch (type) {
		// Блок для ошибки валидации группы чек/радио
		case 'group':
			errorsContainer = createErrorContainer('group');
			elem.after(errorsContainer);
			config.errorsContainer = onlyOneErrorContainer(errorsContainer);
			break;

		// Блок для ошибки валидации одиночного чекбокса
		case 'checkbox':
			if (elem.closest('[data-group]')) break;
			errorsContainer = createErrorContainer('check');
			const checkboxParent = elem.parentElement;
			checkboxParent.tagName.toLowerCase() == 'label' ? checkboxParent.after(errorsContainer) : elem.after(errorsContainer);
			config.errorsContainer = onlyOneErrorContainer(errorsContainer);
			break;

		// Блок для ошибки валидации загружаемых файлов
		case 'file':
			errorsContainer = createErrorContainer('file');
			const fileParent = elem.parentElement;
			fileParent.tagName.toLowerCase() == 'label' ? fileParent.after(errorsContainer) : elem.after(errorsContainer);
			config.errorsContainer = onlyOneErrorContainer(errorsContainer);
			break;

		// Блок для ошибки валидации селектора
		case 'select-one':
		case 'select-multiple':
			const choice = elem.closest('.choices');
			errorsContainer = createErrorContainer('select');
			choice ? choice.after(errorsContainer) : elem.after(errorsContainer);
			config.errorsContainer = onlyOneErrorContainer(errorsContainer);
			break;

		// Блок для ошибки валидации радиокнопкам не нужен
		case 'radio':
			break;
		
		// Блок для ошибки валидации дефолтных инпутов
		default:
			errorsContainer = createErrorContainer('input');
			const inputParent = elem.parentElement;
			inputParent.tagName.toLowerCase() == 'label' ? inputParent.after(errorsContainer) : elem.after(errorsContainer);
			config.errorsContainer = onlyOneErrorContainer(errorsContainer);
			break;
	}

	return config;
}


/**
 * Функция отправки формы при успешном прохождении всех проверок валидации.
 * 
 * Если не установлен атрибут data-send, то произойдёт обычный сабмит формы в соответствии с её установками с перезагрузкой страницы.
 */
function doSubmitForm(form) {
	const sendForm = form.dataset.send;
	const beforeSubmit = form.dataset.before;
	const afterSubmit = form.dataset.after;

	// Выполнение функции до отправки формы
	if (beforeSubmit && !window[beforeSubmit]()) return;

	// Отправка формы
	switch (sendForm) {
		case 'ajax':
			submitByAjax(form, afterSubmit);
			break;

		case 'test':
			modal.openModal('form-sended');
			if (afterSubmit) window[afterSubmit]();
			alert('Форма отправлена');
			break;

		default:
			HTMLFormElement.prototype.submit.call(form);
			break;
	}
}


/**
 * Функция ассинхронной отправки формы после успешной валидации. Если data-send="ajax"
 * 
 * Ко всем прочим полям формы так же добавляется поле ajax=true
 * 
 * @param {Object} form - форма
 * @param {String} afterSubmit - название функции, которая будет выполнена после получения ответа с сервера
 */
function submitByAjax(form, afterSubmit = false) {
	const formAction = form.action ? form.getAttribute('action').trim() : '#';
	const formMethod = form.method ? form.getAttribute('method').trim() : 'GET';

	const formData = new FormData(form);
	formData.append('ajax', true);

	fetch(formAction, {
		method: formMethod,
		body: formData,
	})
	.then(response => response.json())
	.then(data => {
		// Выполнение функции после отправки формы
		if (afterSubmit) window[afterSubmit].call(null, data);
		modal.openModal('form-sended');
	})
	.catch(error => console.log(error.message));
}


/**
 * Функция возвращает объект локализации валидатора
 *
 * При необходимости добавить языковой ключ с текстом.
 *
 * @return {Array} - массив конфигураций локализации валидатора
 */
function getValidatorLocalizations() {
	return [
		{
			key: `Field is required`,
			dict: {
				Russian: `Поле обязательно`,
				Spanish: `El campo es obligatorio`,
			},
		},
		{
			key: `Field is too short`,
			dict: {
				Russian: `Поле слишком короткое`,
				Spanish: `El campo es demasiado corto`,
			},
		},
		{
			key: `Field is too long`,
			dict: {
				Russian: `Поле слишком длинное`,
				Spanish: `El campo es demasiado largo`,
			},
		},
		{
			key: `Field is invalid`,
			dict: {
				Russian: `Недопустимый формат поля`,
				Spanish: `El campo no es válido`,
			},
		},
		{
			key: `Password must contain minimum eight characters, at least one letter and one number`,
			dict: {
				Russian: `Пароль должен содержать минимум восемь символов. По крайней мере одну букву и одну цифру`,
				Spanish: `La contraseña debe contener un mínimo de ocho caracteres, al menos una letra y un número`,
			},
		},
		{
			key: `Passwords should be the same`,
			dict: {
				Russian: `Пароли должны совпадать`,
				Spanish: `Las contraseñas deben ser las mismas`,
			},
		},
		{
			key: `You should select at least one communication channel`,
			dict: {
				Russian: `Вы должны выбрать хотя бы одину опцию`,
				Spanish: `Debe seleccionar al menos un canal de comunicación`,
			},
		},
		{
			key: `Files count should be less`,
			dict: {
				Russian: `Файлов должно быть меньше`,
				Spanish: `El recuento de archivos debería ser menor`,
			},
		},
		{
			key: `Files count should be more`,
			dict: {
				Russian: `Файлов должно быть больше`,
				Spanish: `El recuento de archivos debería ser mayor`,
			},
		},
		{
			key: `No file selected`,
			dict: {
				Russian: `Файл не выбран`,
				Spanish: `No hay ningún archivo seleccionado`,
			},
		},
		{
			key: `Uploaded files have one or several invalid properties (extension/size/type etc).`,
			dict: {
				Russian: `Загруженные файлы имеют одно или несколько недопустимых свойств (расширение/размер/тип и т.д.).`,
				Spanish: `Los archivos cargados tienen una o varias propiedades no válidas (extensión/tamaño/tipo, etc.).`,
			},
		},
		{
			key: `Email already exists!`,
			dict: {
				Russian: `Почта уже существует!`,
				Spanish: `¡El correo electrónico ya existe!`,
			},
		},
		{
			key: `Field should be a number`,
			dict: {
				Russian: `Должно быть число`,
				Spanish: `El campo debe ser un número`,
			},
		},
	];
}