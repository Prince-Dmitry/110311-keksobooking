'use strict';

// 1 Пункт
// Массивы констант

var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'];

var TYPE = [
  'flat',
  'house',
  'bungalo'];

var CHECK = [
  '12:00',
  '13:00',
  '14:00'];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'];

var MAP_X_MIN = 300;
var MAP_X_MAX = 900;
var MAP_Y_MIN = 100;
var MAP_Y_MAX = 500;

var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;

var OFFER_ROOM_MIN = 1;
var OFFER_ROOM_MAX = 5;
var OFFER_GUESTS_MIN = 1;
var OFFER_GUESTS_MAX = 5;

var LABEL_WIDTH = 5;
var LABEL_HEIGHT = 40;
var NUMBER = 8;

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var fragment = document.createDocumentFragment();
var mapPins;
var mapElement = document.querySelector('.map');
var similarListButtons = document.querySelector('.map .map__pins');
var mapFilter = document.querySelector('.map .map__filters-container');

var similarListButtonsMain = similarListButtons.querySelector('.map__pin--main');
var mapCardsNode;

similarListButtonsMain = document.querySelector('.notice__form');

// Элементы пинов и формы

var map = document.querySelector('.map--faded');
var form = document.querySelector('.notice__form--disabled');

// Поведение формы и карты при нажатии на пин

similarListButtonsMain.addEventListener('mouseup', drawPins);

// Открытие попапа при клике

similarListButtons.addEventListener('click', function () {
  var target = event.target.parentNode;
  if (target.tagName !== 'BUTTON' || target.classList.contains('map__pin--main')) {
    return;
  }
  changeSelectPinActive(target);
  removePopup();
  createPopup(target.datashare);

  document.addEventListener('keydown', onPopEscPress);
});

// Открытие попапа при нажатии на ENTER

similarListButtons.addEventListener('keydown', function () {
  if (event.target.tagName !== 'BUTTON' || event.target.classList.contains('map__pin--main') || event.keyCode !== ENTER_KEYCODE) {
    return;
  }

  changeSelectPinActive(event.target);
  removePopup();
  createPopup(event.target.datashare);

  document.addEventListener('keydown', onPopEscPress);
});


// Закрытие попапа при клике на крестик

mapElement.addEventListener('click', function () {
  if (event.target.tagName === 'BUTTON' && event.target.classList.contains('popup__close')) {
    removePopup();
    diactivatePin();
  }
});

// Закрытие попапа при нажатии на ENTER
mapElement.addEventListener('keydown', function () {
  if (event.target.tagName === 'BUTTON' && event.target.classList.contains('popup__close') && event.keyCode === ENTER_KEYCODE) {
    removePopup();
    diactivatePin();
  }
});

var getRandom = function (startIndex, endIndex) {
  return Math.floor(Math.random() * (endIndex - (startIndex)) + startIndex);
};

//  Функция случайным образом сравнивает поступающие данные
var compareRandom = function () {
  return Math.random() - 0.5;
};

//  Массив рандомных чисел, count (int) - кол-во чисел
var getRandomArr = function (count) {
  var array = [];
  for (var i = 0; i < count; i++) {
    array[i] = i;
  }
  return array.sort(compareRandom);
};

// Рандомный массив строк заголовков

var generateTitlesArray = function (count) {
  var arr = getRandomArr(count);
  var arrTitels = [];
  for (var i = 0; i < count; i++) {
    arrTitels[arr[i]] = TITLES[i];
  }
  return arrTitels;
};

//  Случайный массив строк случайной длины (features)

var getRandomFeatures = function () {
  var count = getRandom(1, FEATURES.length + 1);
  var features = getRandomArr(FEATURES.length);

  //  Обрезание массива по случайной длине
  features.length = count;
  for (var i = 0; i < features.length; i++) {
    features[i] = FEATURES[features[i]];
  }

  return features;
};

//  Функция собирает объект mapPin
//  mapPin - объект состоящий из 3-х других объектов (objAuthor, objOffer, objLocation)

var getNotice = function (avatarNumber, offerTitle) {
  var objAuthor = {
    'avatar': 'img/avatars/user0' + avatarNumber.toString() + '.png'
  };
  var objLocation = {
    x: getRandom(MAP_X_MIN, MAP_X_MAX),
    y: getRandom(MAP_Y_MIN, MAP_Y_MAX)
  };
  var objOffer = {
    'title': offerTitle,
    'address': objLocation.x + ', ' + objLocation.y,
    'price': getRandom(PRICE_MIN, PRICE_MAX),
    'type': TYPE[getRandom(0, TYPE.length)],
    'rooms': getRandom(OFFER_ROOM_MIN, OFFER_ROOM_MAX),
    'guests': getRandom(OFFER_GUESTS_MIN, OFFER_GUESTS_MAX),
    'checkin': CHECK[getRandom(0, CHECK.length)],
    'checkout': CHECK[getRandom(0, CHECK.length)],
    'features': getRandomFeatures(),
    'description': [],
    'photos': []
  };
  var mapPin = {
    'author': objAuthor,
    'offer': objOffer,
    'location': objLocation
  };

  return mapPin;
};

//  Функция генерирует массив объектов mapPin

var generateMapPins = function (count) {
  var avatarNumbers = getRandomArr(count);
  var offerTitles = generateTitlesArray(count);
  var arrayMapPins = [];

  for (var i = 0; i < count; i++) {
    arrayMapPins[i] = getNotice(avatarNumbers[i] + 1, offerTitles[i]);
  }
  return arrayMapPins;
};

//  Клонируем и собираем DOM элемент шаблона (template) '.map__pin' по объекту mapPin

var buildMapPinNode = function (mapPin) {
  var mapPinNode = document.querySelector('template').content.querySelector('.map__pin').cloneNode(true);
  var mapPinNodeAvatar = mapPinNode.querySelector('img');
  mapPinNode.style.left = (mapPin.location.x - LABEL_WIDTH) + 'px';

  // mapElement.clientHeight (замыкание для определения смещения от верха, если известно только смещение снизу)
  mapPinNode.style.top = (mapElement.clientHeight - mapPin.location.y - LABEL_HEIGHT) + 'px';
  mapPinNodeAvatar.src = mapPin.author.avatar;

  return mapPinNode;
};

function drawPins() {
  // Задаем цикл для функции генерации элемента (метки)
  if (map.classList.contains('map--faded')) {
    for (var i = 0; i < 8; i++) {
      var pinObject = getNotice(i, generateMapPins(NUMBER));
      var pinNode = buildMapPinNode(pinObject);
      pinNode.datashare = pinObject;
      fragment.appendChild(pinNode);
    }
    similarListButtons.appendChild(fragment);

    var formFieldset = document.querySelectorAll('.form__element');
    enableFields(formFieldset);

    similarListButtonsMain.removeEventListener('mouseup', drawPins);
  }
}

//  Функция создает фрагмент с DOM элементами шаблона (template) '.map__pin', согласно массиву объектов mapPins

var createMapPinsNode = function (arrayMapPins) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arrayMapPins.length; i++) {
    fragment.appendChild(buildMapPinNode(arrayMapPins[i]));
  }
  return fragment;
};

//  Убираем все недоступные преимущества отеля из узла (features)
//  node (object) - узел со всеми преимуществами
//  features (object) - массив получившихся преимуществ

var buildMapCardFeatures = function (node, features) {
  for (var i = 0; i < FEATURES.length; i++) {
    if (features.indexOf(FEATURES[i]) === -1) {
      node.removeChild(node.querySelector('.feature--' + FEATURES[i]));
    }
  }
};

//  Создаем DOM элемент шаблона (template) 'article.map__card' по массиву объектов mapPins

var buildMapCard = function (mapPin) {
  var mapCardNode = document.querySelector('template').content.querySelector('article.map__card').cloneNode(true);
  var mapCardNodeAvatar = mapCardNode.querySelector('.popup__avatar');
  var mapCardNodeTitle = mapCardNode.querySelector('h3');
  var mapCardNodeAddress = mapCardNode.querySelector('p:first-of-type');
  var mapCardNodePrice = mapCardNode.querySelector('.popup__price');
  var mapCardNodeType = mapCardNode.querySelector('h4');
  var mapCardNodeRoomsGuests = mapCardNode.querySelector('p:nth-of-type(3)');
  var mapCardNodeCheckInOut = mapCardNode.querySelector('p:nth-of-type(4)');
  var mapCardNodeFeatures = mapCardNode.querySelector('.popup__features');
  var mapCardNodeDescription = mapCardNode.querySelector('p:last-of-type');

  mapCardNodeAvatar.src = mapPin.author.avatar;
  mapCardNodeTitle.textContent = mapPin.offer.title;
  mapCardNodeAddress.textContent = mapPin.offer.address;
  mapCardNodePrice.textContent = mapPin.offer.price + '	\u20BD/ночь';
  mapCardNodeType.textContent = mapPin.offer.type;
  mapCardNodeRoomsGuests.textContent = mapPin.offer.rooms + ' комнаты для ' + mapPin.offer.guests + ' гостей';
  mapCardNodeCheckInOut.textContent = 'Заезд после ' + mapPin.offer.checkin + ', выезд до ' + mapPin.offer.checkout;
  buildMapCardFeatures(mapCardNodeFeatures, mapPin.offer.features);
  mapCardNodeDescription.textContent = mapPin.offer.description;

  switch (mapCardNode.querySelector('h4').textContent) {
    case 'flat':
      mapCardNode.querySelector('h4').textContent = 'квартира';
      break;
    case 'house':
      mapCardNode.querySelector('h4').textContent = 'дом';
      break;
    case 'bungalo':
      mapCardNode.querySelector('h4').textContent = 'бунгало';
      break;
  }

  return mapCardNode;
};

//  Создаем элемент DIV с DOM элементами шаблона (template) 'article.map__card' по массиву объектов mapPins

var createMapCards = function (arrayMapPins) {
  var divNode = document.createElement('div');
  divNode.className = 'map__cards';
  for (var i = 0; i < arrayMapPins.length; i++) {
    divNode.appendChild(buildMapCard(arrayMapPins[i]));
  }
  return divNode;
};

// Функция отображения скрытых полей
function enableFields(formFieldset) {
  for (var i = 0; i < formFieldset.length; i++) {
    formFieldset[i].disabled = false;
  }
  map.classList.remove('map--faded');
  form.classList.remove('notice__form--disabled');
}

// Функция смены класса активного пина

function changeSelectPinActive(targetNode) {
  var activePinNode = document.querySelector('.map__pin--active');
  if (activePinNode) {
    activePinNode.classList.toggle('map__pin--active');
  }
  targetNode.classList.add('map__pin--active');
}

// Функция снятия класса с неактивного пина

function diactivatePin() {
  var activePinNode = document.querySelector('.map__pin--active');
  if (activePinNode) {
    activePinNode.classList.remove('map__pin--active');
  }
}

// Функция удаления попапа

function removePopup() {
  var popup = mapElement.querySelector('.popup');
  if (popup) {
    popup.remove();
  }
}

// Функция рендера попапа

function createPopup(data) {
  var noticeNode = buildMapCard(data);
  mapElement.appendChild(noticeNode);
}

// Функция удаления попапа при нажатии на крестик
function onPopEscPress(event) {
  var popup = mapElement.querySelector('.popup');
  if (popup && event.keyCode === ESC_KEYCODE) {
    removePopup();
    diactivatePin();
    document.removeEventListener('keydown', onPopEscPress);
  }
}

//  Генерация и сборка узлов

mapPins = generateMapPins(NUMBER);
mapPins.appendChild(createMapPinsNode(mapPins));

// Сгенерированные кнопки (без главной)

mapGeneratedPins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');

//  Генерация предложений

mapCardsNode = createMapCards(mapPins);
mapElement.insertBefore(mapCardsNode, mapFilter);
mapGeneratedCards = mapElement.querySelectorAll('.map__card');
