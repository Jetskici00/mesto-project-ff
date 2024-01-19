// Функция для создания карточки на основе переданного шаблона и данных
const createCard = (template, data, onDelete, onLike, onImageClick) => {
  // Клонирование элемента из шаблона
  const cardElement = template.querySelector(".card").cloneNode(true);

  // Получение ссылки на изображение в карточке и добавление обработчика клика
  const image = cardElement.querySelector(".card__image");
  image.addEventListener("click", () => onImageClick(data.name, data.link));
  image.src = data.link;
  image.alt = data.name;

  // Установка заголовка карточки
  cardElement.querySelector(".card__title").textContent = data.name;

  // Добавление обработчика события для кнопки удаления
  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => onDelete(cardElement));

  // Добавление обработчика события для кнопки лайка
  const likeButton = cardElement.querySelector(".card__like-button");
  likeButton.addEventListener("click", () => onLike(likeButton));

  // Возвращение созданного элемента
  return cardElement;
};

// Функция для удаления карточки при клике на кнопку удаления
const deleteCard = (cardElement) => {
  cardElement.remove();
};

// Функция для переключения состояния лайка при клике на кнопку лайка
const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

// Экспорт функций для использования в других модулях
export { deleteCard, createCard, likeCard };
