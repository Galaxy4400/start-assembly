/**
 * Функции для работы с куками
 * Документация: https://github.com/iliakan/javascript-tutorial-ru/blob/master/11-extra/10-cookie/article.md
 */


/**
 * Получить значение существующей куки
 * 
 * @param {String} name - Название куки
 * @return {String} - Значение куки
 * 
 */
function getCookie(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}


/**
 * Установить куки
 * 
 * @param {String} name - Название куки
 * @param {String} value - значение куки
 * @param {Object} options - Объект с дополнительными свойствами для установки куки:
 * expires : Время истечения cookie. Интерпретируется по-разному, в зависимости от типа:
 * - Число - количество секунд до истечения. Например, `expires: 3600` -- кука на час.
 * - Объект типа [Date](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Date) -- дата истечения.
 * - Если expires в прошлом, то cookie будет удалено.
 * - Если expires отсутствует или `0`, то cookie будет установлено как сессионное и исчезнет при закрытии браузера.
 * path : Путь для cookie.
 * domain : Домен для cookie.
 * secure : Если true, то пересылать cookie только по защищенному соединению.
 */
function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}


/**
 * Удалить куки
 *
 * @param {String} name - Название куки
 */
function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}