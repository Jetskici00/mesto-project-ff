// Подключение стилей для текущего модуля
import "./index.css";

// Импорт массива initialCards из файла cards.js
import { initialCards } from "../components/cards.js";

// Импорт функций для работы с модальным окном из файла modal.js
import {
  closeModal,
  openModal,
  handleModalClick,
} from "../components/modal.js";

// Импорт функций для работы с карточками из файла card.js
import { createCard, deleteCard, likeCard } from "../components/card.js";

// Получение ссылок на DOM-элементы, с которыми будет взаимодействовать скрипт
const popupImage = document.querySelector(".popup_type_image");
const popupImageCaption = popupImage.querySelector(".popup__caption");
const popupImageImage = popupImage.querySelector(".popup__image");
const cardsContainer = document.querySelector(".places__list");
const cardTemplate = document.querySelector("#card-template").content;
const cardForm = document.forms["new-place"];
const cardNameInput = cardForm.elements["place-name"];
const cardLinkInput = cardForm.elements.link;
const popupCard = document.querySelector(".popup_type_new-card");
const popupCardButtonOpen = document.querySelector(".profile__add-button");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileForm = document.forms["edit-profile"];
const profileNameInput = profileForm.elements.name;
const profileDescriptionInput = profileForm.elements.description;
const popupProfile = document.querySelector(".popup_type_edit");
const popupProfileButtonOpen = document.querySelector(".profile__edit-button");

// Функция для обработки клика по изображению в карточке
const handleCardImageClick = (cardName, cardLink) => {
  popupImageImage.src = cardLink;
  popupImageImage.alt = cardName;
  popupImageCaption.textContent = cardName;
  openModal(popupImage);
};

// Функция для обработки отправки формы добавления новой карточки
const handleCardFormSubmit = (event) => {
  event.preventDefault();
  // Создание новой карточки с использованием данных из формы и добавление её в начало контейнера
  cardsContainer.prepend(
    createCard(
      cardTemplate,
      {
        name: cardNameInput.value,
        link: cardLinkInput.value,
      },
      deleteCard,
      likeCard,
      handleCardImageClick
    )
  );
  // Очистка формы и закрытие модального окна
  cardForm.reset();
  closeModal(popupCard);
};

// Функция для обработки отправки формы редактирования профиля
const handleProfileFormSubmit = (event) => {
  event.preventDefault();
  // Обновление информации о профиле на странице и закрытие модального окна
  profileName.textContent = profileNameInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closeModal(popupProfile);
};

// Функция для открытия модального окна редактирования профиля с текущими данными
const handlePopupProfileButtonOpenClick = () => {
  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModal(popupProfile);
};

// Функция для открытия модального окна добавления новой карточки и сброса формы
const handlePopupCardButtonOpenClick = () => {
  cardForm.reset();
  openModal(popupCard);
};

// Назначение обработчиков событий
cardForm.addEventListener("submit", handleCardFormSubmit);
profileForm.addEventListener("submit", handleProfileFormSubmit);
popupImage.addEventListener("click", handleModalClick);
popupCard.addEventListener("click", handleModalClick);
popupCardButtonOpen.addEventListener("click", handlePopupCardButtonOpenClick);
popupProfile.addEventListener("click", handleModalClick);
popupProfileButtonOpen.addEventListener(
  "click",
  handlePopupProfileButtonOpenClick
);

// Добавление начальных карточек на страницу
initialCards.forEach((cardData) => {
  cardsContainer.append(
    createCard(
      cardTemplate,
      cardData,
      deleteCard,
      likeCard,
      handleCardImageClick
    )
  );
});
