import { deleteCard, likeCard, unlikeCard } from "./api";

const createCard = ({
  currentUserId,
  template,
  data,
  onDelete,
  onLike,
  onImageClick,
}) => {
  // Клонируем карточку из шаблона
  const element = template.querySelector(".card").cloneNode(true);

  // Находим изображение в карточке и добавляем обработчик клика
  const image = element.querySelector(".card__image");
  image.addEventListener("click", () =>
    onImageClick({
      cardName: data.name,
      cardLink: data.link,
    })
  );
  // Устанавливаем атрибуты изображения
  image.src = data.link;
  image.alt = data.name;

  // Устанавливаем заголовок карточки
  element.querySelector(".card__title").textContent = data.name;

  // Находим счетчик лайков
  const counter = element.querySelector(".card__like-counter");

  // Проверяем наличие лайков и обновляем счетчик
  if (data.likes.length) {
    counter.classList.add("card__like-counter_is-active");
    counter.textContent = data.likes.length;
  }

  // Находим кнопку удаления
  const deleteButton = element.querySelector(".card__delete-button");

  // Проверяем, является ли текущий пользователь владельцем карточки
  if (data.owner["_id"] === currentUserId) {
    // Показываем кнопку удаления и добавляем обработчик
    deleteButton.classList.add("card__delete-button_is-active");
    deleteButton.addEventListener("click", () => {
      onDelete({
        cardId: data["_id"],
        cardElement: element,
        buttonElement: deleteButton,
      });
    });
  }

  // Находим кнопку лайка
  const likeButton = element.querySelector(".card__like-button");

  // Проверяем, лайкнул ли текущий пользователь эту карточку
  if (data.likes.find((element) => element["_id"] === currentUserId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Добавляем обработчик клика по кнопке лайка
  likeButton.addEventListener("click", () => {
    onLike({
      cardId: data["_id"],
      buttonElement: likeButton,
      counterElement: counter,
    });
  });

  // Возвращаем созданный элемент карточки
  return element;
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

export { createCard, handleCardDelete, handleCardLike };
