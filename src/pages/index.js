import "./index.css";
import {
  closeModal,
  openModal,
  handleModalClick,
} from "../components/modal.js";
import { createCard as DOMCreateCard } from "../components/card.js";
import {
  getInitialCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
  getUserInfo,
  updateUserInfo,
  updateUserAvatar,
} from "../components/api.js";
import { clearValidation, enableValidation } from "../components/validation.js";

// Конфигурация валидации
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Ссылки на элементы DOM
const popupImage = document.querySelector(".popup_type_image");
const popupImageCaption = popupImage.querySelector(".popup__caption");
const popupImageImage = popupImage.querySelector(".popup__image");
const cardsContainer = document.querySelector(".places__list");
const cardTemplate = document.querySelector("#card-template").content;
const cardForm = document.forms["new-place"];
const cardFormSubmitButton = cardForm.querySelector(".popup__button");
const cardNameInput = cardForm.elements["place-name"];
const cardLinkInput = cardForm.elements.link;
const popupCard = document.querySelector(".popup_type_new-card");
const popupCardButtonOpen = document.querySelector(".profile__add-button");
const profileImageForm = document.forms["edit-avatar"];
const profileImageInput = profileImageForm.elements.avatar;
const profileImageFormSubmitButton =
  profileImageForm.querySelector(".popup__button");
const popupProfileImage = document.querySelector(".popup_type_edit-avatar");
const profileImage = document.querySelector(".profile__image");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileForm = document.forms["edit-profile"];
const profileFormSubmitButton = profileForm.querySelector(".popup__button");
const profileNameInput = profileForm.elements.name;
const profileDescriptionInput = profileForm.elements.description;
const popupProfile = document.querySelector(".popup_type_edit");
const popupProfileButtonOpen = document.querySelector(".profile__edit-button");
const popupConfirm = document.querySelector(".popup_type_confirm");
const popupConfirmButton = popupConfirm.querySelector(".popup__button_confirm");

// Установка профиля
const setProfile = ({ name, description, avatar }) => {
  profileName.textContent = name;
  profileDescription.textContent = description;
  profileImage.style.backgroundImage = `url(${avatar})`;
};

// Отображение загрузки
const renderLoading = ({ buttonElement, isLoading }) => {
  const buttonText = isLoading ? "Сохранение..." : "Сохранить";
  buttonElement.textContent = buttonText;
};

// Обработчик лайка карточки
const handleCardLike = ({ cardId, buttonElement, counterElement }) => {
  buttonElement.disabled = true;

  const likePromise = buttonElement.classList.contains(
    "card__like-button_is-active"
  )
    ? unlikeCard(cardId)
    : likeCard(cardId);

  likePromise
    .then(({ likes }) => {
      buttonElement.classList.toggle("card__like-button_is-active");

      if (likes.length) {
        counterElement.classList.add("card__like-counter_is-active");
        counterElement.textContent = likes.length;
      } else {
        counterElement.classList.remove("card__like-counter_is-active");
        counterElement.textContent = "";
      }
    })
    .catch((error) => console.error(error))
    .finally(() => {
      buttonElement.disabled = false;
    });
};

// Обработчик удаления карточки
const handleCardDelete = ({ cardId, buttonElement }) => {
  openModal(popupConfirm);

  const confirmButtonClickHandler = () => {
    buttonElement.disabled = true;

    deleteCard(cardId)
      .then(() => {
        buttonElement.closest(".card").remove();
        closeModal(popupConfirm);
      })
      .catch((error) => {
        buttonElement.disabled = false;
        console.error(error);
      });
  };

  popupConfirmButton.addEventListener("click", confirmButtonClickHandler, {
    once: true,
  });
};

// Обработчик отправки формы новой карточки
const handleCardFormSubmit = (event) => {
  event.preventDefault();

  renderLoading({ buttonElement: cardFormSubmitButton, isLoading: true });

  createCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((cardData) => {
      cardsContainer.prepend(
        DOMCreateCard({
          currentUserId: cardData.owner["_id"],
          template: cardTemplate,
          data: cardData,
          onDelete: handleCardDelete,
          onLike: handleCardLike,
          onImageClick: handleCardImageClick,
        })
      );

      cardForm.reset();
      closeModal(popupCard);
    })
    .catch((error) => console.error(error))
    .finally(() => {
      renderLoading({ buttonElement: cardFormSubmitButton, isLoading: false });
    });
};

const handleProfileFormSubmit = (event) => {
  event.preventDefault();

  renderLoading({
    buttonElement: profileFormSubmitButton,
    isLoading: true,
  });

  updateUserInfo({
    name: profileNameInput.value,
    description: profileDescriptionInput.value,
  })
    .then(({ name, about, avatar }) => {
      setProfile({
        name,
        description: about,
        avatar,
      });

      closeModal(popupProfile);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      renderLoading({
        buttonElement: profileFormSubmitButton,
        isLoading: false,
      });
    });
};

const handleProfileImageFormSubmit = (event) => {
  event.preventDefault();

  renderLoading({
    buttonElement: profileImageFormSubmitButton,
    isLoading: true,
  });

  updateUserAvatar(profileImageInput.value)
    .then(({ name, about, avatar }) => {
      setProfile({
        name,
        description: about,
        avatar,
      });

      closeModal(popupProfileImage);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      renderLoading({
        buttonElement: profileImageFormSubmitButton,
        isLoading: false,
      });
    });
};

const handlePopupProfileButtonOpenClick = () => {
  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;

  clearValidation(profileForm, validationConfig);

  openModal(popupProfile);
};

const handlePopupCardButtonOpenClick = () => {
  cardForm.reset();

  clearValidation(cardForm, validationConfig);

  openModal(popupCard);
};

const handleCardImageClick = ({ cardName, cardLink }) => {
  popupImageImage.src = cardLink;
  popupImageImage.alt = cardName;
  popupImageCaption.textContent = cardName;

  openModal(popupImage);
};

const handleProfileImageClick = () => {
  profileImageForm.reset();

  clearValidation(profileImageForm, validationConfig);

  openModal(popupProfileImage);
};

// Основные обработчики событий
cardForm.addEventListener("submit", handleCardFormSubmit);
profileForm.addEventListener("submit", handleProfileFormSubmit);
profileImageForm.addEventListener("submit", handleProfileImageFormSubmit);
popupImage.addEventListener("click", handleModalClick);
popupProfileImage.addEventListener("click", handleModalClick);
profileImage.addEventListener("click", handleProfileImageClick);
popupCard.addEventListener("click", handleModalClick);
popupCardButtonOpen.addEventListener("click", handlePopupCardButtonOpenClick);
popupProfileButtonOpen.addEventListener(
  "click",
  handlePopupProfileButtonOpenClick
);
popupProfile.addEventListener("click", handleModalClick);
popupConfirm.addEventListener("click", handleModalClick);

// Инициализация валидации
enableValidation(validationConfig);

// Загрузка данных и отображение карточек
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userInfo, cardsData]) => {
    setProfile({
      name: userInfo.name,
      description: userInfo.about,
      avatar: userInfo.avatar,
    });

    cardsData.forEach((cardData) => {
      cardsContainer.append(
        DOMCreateCard({
          currentUserId: userInfo["_id"],
          template: cardTemplate,
          data: cardData,
          onDelete: handleCardDelete,
          onLike: handleCardLike,
          onImageClick: handleCardImageClick,
        })
      );
    });
  })
  .catch((error) => {
    console.error(error);
  });
