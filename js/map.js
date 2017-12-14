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

var mapPins;
var mapElement = document.querySelector('.map');
var similarListButtons = document.querySelector('.map .map__pins');
var mapFilter = document.querySelector('.map .map__filters-container');

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

var generateTitelsArray = function (count) {
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

var getNotice = function (avatarNumber, offerTitel) {
  var objAuthor = {
    avatar: 'img/avatars/user0' + avatarNumber.toString() + '.png'
  };
  var objLocation = {
    x: getRandom(MAP_X_MIN, MAP_X_MAX),
    y: getRandom(MAP_Y_MIN, MAP_Y_MAX)
  };
  var objOffer = {
    title: offerTitel,
    address: objLocation.x + ', ' + objLocation.y,
    price: getRandom(PRICE_MIN, PRICE_MAX),
    type: TYPE[getRandom(0, TYPE.length)],
    rooms: getRandom(OFFER_ROOM_MIN, OFFER_ROOM_MAX),
    guests: getRandom(OFFER_GUESTS_MIN, OFFER_GUESTS_MAX),
    checkin: CHECK[getRandom(0, CHECK.length)],
    checkout: CHECK[getRandom(0, CHECK.length)],
    features: getRandomFeatures(),
    description: [],
    photos: []
  };
  var mapPin = {
    author: objAuthor,
    offer: objOffer,
    location: objLocation
  };

  return mapPin;
};

//  Функция генерирует массив объектов mapPin

var generateMapPins = function (count) {
  var avatarNumbers = getRandomArr(count);
  var offerTitels = generateTitelsArray(count);
  var arrayMapPins = [];

  for (var i = 0; i < count; i++) {
    arrayMapPins[i] = getNotice(avatarNumbers[i] + 1, offerTitels[i]);
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
  mapCardNodePrice.textContent = mapPin.offer.price + ' \u20BD/ночь';
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

mapPins = generateMapPins(NUMBER);
mapElement.classList.remove('map--faded');
similarListButtons.appendChild(createMapPinsNode(mapPins));
mapElement.insertBefore(createMapCards(mapPins), mapFilter);
