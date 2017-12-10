'use strict';
var mapElement = document.querySelector('.map');
var mapFilter = mapElement.querySelector('.map__filters-container');
var similarListButtons = document.querySelector('.map__pins');
var similarNoticeButton = document.querySelector('template').content.querySelector('.map__pin');
var similarNoticeCard = document.querySelector('template').content.querySelector('article.map__card');

// 1 Пункт
// Массивы констант

var AVATAR = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08'];

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

var photos = [];

// Нахождение случайного числа

var getRandom = function (startIndex, endIndex) {
  var randomNum = Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex;
  return randomNum;
};

// Создание нового массива перебором значений старого массива в случайном порядке

var getRandomArr = function (arr) {
  var spliceArr = [];
  var copyArr = arr.slice();
  for (var i = copyArr.length - 1; i < 0; i--) {
    spliceArr[i] = copyArr.splice(getRandom(0, copyArr.length), 1).join();
  }
  return copyArr;
};

// Создание массива с данными по заданию

var getNotice = function () {
  var notices = [];
  var avatarArr = getRandomArr(AVATAR);
  var titleArr = getRandomArr(TITLES);
  var NUMBER = titleArr.length;

  for (var i = 0; i < NUMBER; i++) {
    var locationX = getRandom(300, 900);
    var locationY = getRandom(100, 500);

    var notice = {
      author: {
        avatar: 'img/avatars/user' + avatarArr[i] + '.png'
      },
      offer: {
        title: titleArr[i],
        address: locationX + ', ' + locationY,
        price: getRandom(1000, 1000000),
        type: TYPE[getRandom(0, TYPE.length - 1)],
        rooms: getRandom(1, 5),
        checkin: CHECK[getRandom(0, CHECK.length - 1)],
        checkout: CHECK[getRandom(0, CHECK.length - 1)],
        features: getRandomArr(FEATURES).slice(0, getRandom(0, FEATURES.length - 1)),
        description: '',
        photos: photos
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
    notices.push(notice);
  }
  return notices;
};
getNotice();


var cleanFeatureList = function () {
  var popupFeatureList = document.querySelector('template').content.querySelector('.popup__features');
  while (popupFeatureList.firstChild) {
    popupFeatureList.removeChild(popupFeatureList.firstChild);
  }
};

cleanFeatureList();

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
  noticeElementCard.querySelector('h4 + p').textContent = notice.offer.rooms + ' комнаты  для ' + (notice.offer.rooms * 2) + ' гостей';
  noticeElementCard.querySelector('h4 + p + p').textContent = 'Заезд после ' + notice.offer.checkin + ', выезд до ' + notice.offer.checkout;
  noticeElementCard.querySelector('.popup__avatar').removeAttribute('src');
  noticeElementCard.querySelector('.popup__avatar').setAttribute('src', notice.author.avatar);

  switch (noticeElementCard.querySelector('h4').textContent) {
    case 'flat':
      noticeElementCard.querySelector('h4').textContent = 'квартира';
      break;
    case 'house':
      noticeElementCard.querySelector('h4').textContent = 'дом';
      break;
    case 'bungalo':
      noticeElementCard.querySelector('h4').textContent = 'бунгало';
      break;
  }

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

var fragment = document.createDocumentFragment();
var fragmentCard = document.createDocumentFragment();

for (var i = 0; i < getNotice.length; i++) {
  fragment.appendChild(renderNoticeBtn(getNotice[i]));
  fragmentCard.appendChild(renderNoticeCard(getNotice[i]));
}

similarListButtons.appendChild(fragment);
mapElement.insertBefore(fragmentCard, mapFilter);
