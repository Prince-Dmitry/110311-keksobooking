'use strict';
var mapElement = document.querySelector('.map');
var mapFilter = mapElement.querySelector('.map__filters-container');
var similarListButtons = document.querySelector('.map__pins');
var similarNoticeButton = document.querySelector('template').content.querySelector('.map__pin');
var similarNoticeCard = document.querySelector('template').content.querySelector('article.map__card');
// 1 Пункт
// Массивы констант

var AVATAR = ['img/avatars/user{{01}}.png]', 'img/avatars/user{{02}}.png]', 'img/avatars/user{{03}}.png]', 'img/avatars/user{{04}}.png]', 'img/avatars/user{{05}}.png]', 'img/avatars/user{{06}}.png]', 'img/avatars/user{{07}}.png]', 'img/avatars/user{{08}}.png'];
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPE = ['flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var NUMBER = 8;
var notices = [];

// Нахождение случайного числа

var getRandom = function (endIndex, startIndex) {
  return Math.floor(startIndex + Math.random() * (endIndex - startIndex + 1));
};

// Создание нового массива перебором значений старого массива в случайном порядки

var getRandomArr = function (arr) {
  var spliceArr = [];
  var copyArr = arr.slice();
  while (copyArr.length > 0) {
    var randomArr = getRandom(copyArr.length - 1, 0);
    var current = copyArr.splice(randomArr, 1)[0];
    spliceArr.push(current);
  }
  return spliceArr;
};

// Создание массива с данными по заданию

var getNotice = function () {
  var titleArr = getRandomArr(TITLES);

  for (var i = 0; i < NUMBER; i++) {
    var locationX = getRandom(900, 300);
    var locationY = getRandom(500, 100);

    var notice = {
      author: {
        avatar: AVATAR[i]
      },
      offer: {
        title: titleArr[i],
        address: locationX + ', ' + locationY,
        price: getRandom(1000000, 1000),
        type: TYPE[getRandom(0, TYPE.length - 1)],
        rooms: getRandom(5, 1),
        guests: rooms * 2,
        checkin: CHECKIN[getRandom(CHECKIN.length - 1, 0)],
        checkout: CHECKOUT[getRandom(CHECKOUT.length - 1, 0)],
        FEATURES: getRandomArr(FEATURES).slice(0, getRandom(FEATURES.length - 1, 0)),
        description: '',
        photos: ''
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
    notices.push(notice);
  }
};
getNotice();

// 2 Пункт - показываем карточку

mapElement.classList.remove('map--faded');

// 3 Пункт
// Функция отрисовки расположения одной карточки

var renderNoticeBtn = function (notice) {
  var noticeElementBtn = similarNoticeButton.cloneNode(true);
  noticeElementBtn.querySelector('.map__pin img').setAttribute('src', notice.author.avatar);
  noticeElementBtn.style.left = notice.location.x + 'px';
  noticeElementBtn.style.top = notice.location.y + 'px';

  return noticeElementBtn;
};

// Функция отрисовки одной карточки (не расположение)

var renderNoticeCard = function (notice) {
  var noticeElementCard = similarNoticeCard.cloneNode(true);

  noticeElementCard.querySelector('h3').textContent = notice.offer.title;
  noticeElementCard.querySelector('p small').textContent = notice.offer.address;
  noticeElementCard.querySelector('.popup__price').textContent = notice.offer.price + '&#x20bd;/ночь';
  noticeElementCard.querySelector('h4').textContent = notice.offer.type;
  noticeElementCard.querySelector('h4 + p').textContent = notice.offer.rooms + ' комнаты  для ' + notice.offer.guests + ' гостей';
  noticeElementCard.querySelector('h4 + p + p').textContent = 'Заезд после ' + notice.offer.checkin + ', выезд до ' + notice.offer.checkout;
  noticeElementCard.querySelector('.popup__avatar').removeAttribute('src');
  noticeElementCard.querySelector('.popup__avatar').setAttribute('src', notice.author.avatar);

  var popupFeature = noticeElementCard.querySelector('.popup__features');

  var renderFeature = function () {
    notice.offer.features.forEach(function (featureItem) {
      var li = document.createElement('li');
      popupFeature.appendChild(li).classList.add('feature');
      popupFeature.appendChild(li).classList.add('feature--' + featureItem);
    });
  };
  renderFeature();

  return noticeElementCard;
};

// 4 Пункт

var fragment = document.createDocumentFragment();
var fragmentCard = document.createDocumentFragment();

for (var i = 0; i < notices.length; i++) {
  fragment.appendChild(renderNoticeBtn(notices[i]));
  fragmentCard.appendChild(renderNoticeCard(notices[i]));
}

similarListButtons.appendChild(fragment);
mapElement.insertBefore(fragmentCard, mapFilter);
