'use strict';

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

var photosItems = [];
var MIN_ROOM = 1;
var MAX_ROOM = 6;
var MIN_GUEST = 1;
var MAX_GUEST = 12;
var NUMBER = 8;

var MAP_X_MIN = 300;
var MAP_X_MAX = 900;
var MAP_Y_MIN = 200;
var MAP_Y_MAX = 500;

var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var mapElement = document.querySelector('.map');
var mapFilters = mapElement.querySelector('.map__filters-container');
var noticeFormElement = document.querySelector('.notice__form');
var noticeFormFieldsetElements = noticeFormElement.querySelectorAll('fieldset');
var template = document.querySelector('template').content;
var pinTemplate = template.querySelector('.map__pin');
var mapPinsListElement = document.querySelector('.map__pins');

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var randomArr = function (arr) {
  var arrTemp = arr.slice();
  var newLength = Math.ceil(Math.random() * arrTemp.length);
  var newArray = [];
  for (var i = 0; i < newLength; i++) {
    var randomIndex = Math.floor(Math.random() * arrTemp.length);
    newArray[i] = arrTemp[randomIndex];
    arrTemp.splice(randomIndex, 1);
  }
  return newArray;
};

var announcements = [];

for (var n = 0; n < NUMBER; n++) {
  var locationX = getRandom(MAP_X_MIN, MAP_X_MAX);
  var locationY = getRandom(MAP_Y_MIN, MAP_Y_MAX);
  var numberAvatar = n + 1;
  announcements[n] = {
    author: {
      avatar: 'img/avatars/user0' + numberAvatar + '.png'
    },
    offer: {
      title: TITLES[n],
      address: 'location.' + locationX + ', ' + 'location.' + locationY,
      price: getRandom(PRICE_MIN, PRICE_MAX),
      type: TYPE[getRandom(0, TYPE.length)],
      rooms: getRandom(MIN_ROOM, MAX_ROOM),
      guests: getRandom(MIN_GUEST, MAX_GUEST),
      checkin: CHECK[getRandom(0, CHECK.length)],
      checkout: CHECK[getRandom(0, CHECK.length)],
      features: randomArr(FEATURES),
      description: '',
      photos: photosItems

    },
    location: {
      x: locationX,
      y: locationY
    }
  };
}

var getPin = function (ad) {
  var pin = pinTemplate.cloneNode(true);
  pin.id = ad.announcementId;
  pin.style.left = (ad.location.x - 20) + 'px';
  pin.style.top = (ad.location.y - 60) + 'px';
  pin.querySelector('img').src = ad.author.avatar;
  return pin;
};


var showPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < announcements.length; i++) {
    fragment.appendChild(getPin(announcements[i]));
  }
  mapPinsListElement.appendChild(fragment);
};
showPins();

var typeTranslateRus = function (type) {
  switch (type) {
    case 'flat':
      return 'Квартира';
    case 'house':
      return 'Дом';
    default:
      return 'Бунгало';
  }
};

var articleTemplate = template.querySelector('.map__card');
var card = articleTemplate.cloneNode(true);
var featuresList = card.querySelectorAll('.feature');

var hideFeatures = function () {
  for (var i = 0; i < featuresList.length; i++) {
    featuresList[i].classList.add('hidden');
  }
};

var showFeatures = function (features) {
  for (var i = 0; i < features.length; i++) {
    featuresList[i].classList.remove('hidden');
  }
};


var fillCard = function (index) {
  var offerItem = announcements[index].offer;
  var articleP = card.querySelectorAll('p');

  card.querySelector('h3').textContent = offerItem.title;
  card.querySelector('small').textContent = offerItem.address;
  card.querySelector('.popup__price').textContent = offerItem.price + ' ₽' + '/ночь';
  card.querySelector('h4').textContent = typeTranslateRus(offerItem.type);
  articleP[2].textContent = offerItem.rooms + ' комнаты для ' + offerItem.guests + ' гостей';
  articleP[3].textContent = 'Заезд после ' + offerItem.checkin + ', выезд до' + offerItem.checkout;
  articleP[4].textContent = offerItem.description;
  card.querySelector('.popup__avatar').src = announcements[index].author.avatar;

  hideFeatures();
  showFeatures(offerItem.features);
};

var disableFields = function () {
  for (var i = 0; i < noticeFormFieldsetElements.length; i++) {
    noticeFormFieldsetElements[i].disabled = true;
  }
};
disableFields();
var enableFields = function () {
  for (var i = 0; i < noticeFormFieldsetElements.length; i++) {
    noticeFormFieldsetElements[i].disabled = false;
  }
};

var mapPinMainElement = mapElement.querySelector('.map__pin--main');
var pinElements = mapPinsListElement.querySelectorAll('.map__pin:not(.map__pin--main)');


var hidePins = function () {
  for (var i = 0; i < pinElements.length; i++) {
    pinElements[i].classList.add('hidden');
  }
};
hidePins();

// перетаскивание, открытие карты

mapPinMainElement.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };
  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    mapPinMainElement.style.top = (mapPinMainElement.offsetTop - shift.y) + 'px';
    mapPinMainElement.style.left = (mapPinMainElement.offsetLeft - shift.x) + 'px';
  };
  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    openMap();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

var openMap = function () {
  mapElement.classList.remove('map--faded');
  for (var i = 0; i < pinElements.length; i++) {
    pinElements[i].classList.remove('hidden');
  }
  noticeFormElement.classList.remove('notice__form--disabled');
  enableFields();
};

mapPinMainElement.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openMap();
  }
});

// открытие-закрытие карточек

card.classList.add('hidden');
mapElement.insertBefore(card, mapFilters);
var cardsClose = document.querySelector('.popup__close');
cardsClose.setAttribute.tabIndex = 0;

var clearPin = function () {
  for (var i = 0; i < pinElements.length; i++) {
    if (pinElements[i].classList.contains('map__pin--active')) {
      pinElements[i].classList.remove('map__pin--active');
    }
  }
};

var openCard = function (index) {
  clearPin();
  pinElements[index].classList.add('map__pin--active');
  fillCard(index);
  card.classList.remove('hidden');
  document.addEventListener('keydown', onEscPress);
};

var closeCard = function () {
  card.classList.add('hidden');
  document.removeEventListener('keydown', onEscPress);
};

var onPinClick = function (index) {
  return function () {
    openCard(index);
  };
};

var onPinEnterPress = function (evt, index) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openCard(index);
  }
};

var onEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    card.classList.add('hidden');
    document.querySelector('.map__pin--active').classList.remove('map__pin--active');
  }
};

var onCloseEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeCard();
  }
};

for (var e = 0; e < pinElements.length; e++) {
  pinElements[e].addEventListener('click', onPinClick(e));
  pinElements[e].addEventListener('keydown', onPinEnterPress(e));
}

cardsClose.addEventListener('click', closeCard);
cardsClose.addEventListener('keydown', onCloseEnterPress);
