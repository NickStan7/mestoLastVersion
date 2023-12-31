import "./pages/index.css";
import { openPopup, closePopup } from "./components/modal";

import { createCard } from "./components/card";
import enableValidation from "./components/validation.js";


// Находим форму в DOM
const formName = document.forms.name;
// Получаем элементы, куда должны быть вставлены значения полей
const profileName = document.querySelector(".profile__name");
const profileSpeciality = document.querySelector(".profile__speciality");

//111111 Открытие и закрытие модального окна

// Получаем кнопку "Редактировать профиль"
const openButton = document.querySelector(".profile__edit-button");

const profilePopup = document.querySelector(".profile-popup");

// Получаем кнопку закрытия попапа
const popupCloseButtons = document.querySelectorAll(".popup__close");

// Получаем инпуты
const nameInput = formName.elements.username;
const jobInput = formName.elements.speciality;

function insertInput() {
  // Получите значение из атрибута textContent элементов profile__name и profile__speciality
  const nameValue = profileName.textContent;
  const jobValue = profileSpeciality.textContent;
  nameInput.focus();

  // Вставьте новые значения в инпуты
  nameInput.value = nameValue;
  jobInput.value = jobValue;
}

function EditProfileButtonClick() {
  openPopup(profilePopup);
  insertInput();
}

popupCloseButtons.forEach((button) =>
  button.addEventListener("click", (e) => {
    const popup = e.target.closest(".popup");
    closePopup(popup);
  })
);

// Слушаем клик на кнопке "Редактировать профиль" и открываем попап
openButton.addEventListener("click", EditProfileButtonClick);

//111111(222222) Редактирование имени и информации о себе

// Обработчик «отправки» формы, хотя пока
// она никуда отправляться не будет



formName.addEventListener("submit", function (evt) {
  // отменим стандартное поведение
  evt.preventDefault();

  // вызываем функцию
  handleFormSubmit(evt);
});

//22222222222  Вставка Шесть карточек «из коробки»

const elementsContainer = document.querySelector(".elements");

// Добавление карточек из массива initialCards
export function addCards() {

initialCards.forEach((card) => {
  const newCard = createCard(card.name, card.link); // Создаем карточку
  elementsContainer.appendChild(newCard); // Вставляем карточку в контейнер
});
}

//33333333333 Форма добавления карточки

// Получаем кнопку "добавить"
const addButton = document.querySelector(".profile__add-button");

// Получаем попап
const newPlacePopup = document.querySelector(".popup_new-place");

// Получаем инпуты
const namePlace = document.querySelector("#new-place-name");
const imgUrl = document.querySelector("#new-place-url");

// Функция-обработчик клика для кнопки "Добавить место"
function handleAddPlaceButtonClick() {
  openPopup(newPlacePopup);
}

// Слушаем клик на кнопке "Редактировать профиль" и открываем попап
addButton.addEventListener("click", handleAddPlaceButtonClick);

//4444444444444  Добавление карточки

function addItem() {
  event.preventDefault(); // Предотвращаем перезагрузку страницы

  const nameValue = namePlace.value; // Получаем значение из поля ввода имени
  const urlValue = imgUrl.value; // Получаем значение из поля ввода URL

  const newCard = createCard(nameValue, urlValue); // Создаем новую карточку
  elementsContainer.insertBefore(newCard, elementsContainer.firstChild);

  closePopup(newPlacePopup); // Закрываем всплывающее окно

  namePlace.value = "";
  imgUrl.value = "";
}

const formPlace = document.forms.place;

formPlace.addEventListener("submit", addItem);

//777777777777

// Получаем попап
const popupImage = document.querySelector(".popup_type_image");

// Получаем изображение "subtitle"
const popupSubtitle = document.querySelector(".popup__subtitle");

// Находим элемент <img> внутри попапа
const popupImageImg = popupImage.querySelector(".popup__image");

export function openImagePopup(event) {
  const clickedImage = event.target;
  const imageUrl = clickedImage.src;
  const imageAlt = clickedImage.alt;

  popupImageImg.src = imageUrl;
  popupImageImg.alt = `${imageAlt} вставлять`;
  popupSubtitle.textContent = imageAlt;
  openPopup(popupImage);
}

const validationSettings = {
  inputSelector: ".popup__field",
  buttonSelector: ".popup__save",
  formSelector: ".popup__form",
  ivalidPopupField: "popup__field_invalid",
};

enableValidation(validationSettings);


// 8 спринт
// 3. Загрузка информации о пользователе с сервера

const profileAvatar = document.querySelector(".profile__avatar");

function fetchProfile() {
  return fetch('https://mesto.nomoreparties.co/v1/wbf-cohort-12/users/me', {
    headers: {
      authorization: 'a5b874b6-9996-4636-90dc-7aca01fd7b4e'
    }
  })
    .then(res => res.json())
    .then((data) => {
      profileName.textContent = data.name;
      profileSpeciality.textContent = data.about;
      profileAvatar.src = data.avatar;
    })
    .catch(error => {
      console.error('Ошибка при обновлении профиля:', error);
    });
    
  }

fetchProfile()


import { initialCards } from "./components/card.js"

// 4. Загрузка карточек с сервера

import { getInitialCards } from "./components/api.js"

getInitialCards();


//5. Редактирование профиля

function patchUserProfile(name, about) { 
  return fetch('https://mesto.nomoreparties.co/v1/wbf-cohort-12/users/me', {
    method: 'PATCH',
    headers: {
      authorization: 'a5b874b6-9996-4636-90dc-7aca01fd7b4e',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      about: about
    })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Ошибка при обновлении профиля');
    }
    return res.json();
  });
}

// Функция для обработки сохранения профиля
function handleFormSubmit(evt) {
  evt.preventDefault();

  const nameValue = nameInput.value; // Получаем новое имя из поля ввода
  const jobValue = jobInput.value; // Получаем новую информацию о себе из поля ввода

  patchUserProfile(nameValue, jobValue)
    .then(() => {
      console.log('Профиль успешно обновлен.');
      // Вставьте новые значения с помощью textContent
      profileName.textContent = nameValue;
      profileSpeciality.textContent = jobValue;
      closePopup(profilePopup);
    })
    .catch(error => {
      console.error('Ошибка при обновлении профиля:', error);
    });
}

// 6. Добавление новой карточки