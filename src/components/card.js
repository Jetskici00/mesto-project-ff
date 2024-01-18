// Функция для создания карточки на основе переданного шаблона и данных
const createCard = (template, data, onDelete, onLike, onImageClick) => {
  // Клонирование элемента из шаблона
  const element = template.querySelector(".card").cloneNode(true);

  // Получение ссылки на изображение в карточке и добавление обработчика клика
  const image = element.querySelector(".card__image");
  image.addEventListener("click", () => onImageClick(data.name, data.link));
  image.src = data.link;
  image.alt = data.name;

  // Установка заголовка карточки
  element.querySelector(".card__title").textContent = data.name;

  // Добавление обработчика события для кнопки удаления
  element
    .querySelector(".card__delete-button")
    .addEventListener("click", onDelete);

  // Добавление обработчика события для кнопки лайка
  element.querySelector(".card__like-button").addEventListener("click", onLike);

  // Возвращение созданного элемента
  return element;
};

// Функция для удаления карточки при клике на кнопку удаления
const deleteCard = (event) => {
  event.target.closest(".card").remove();
};

// Функция для переключения состояния лайка при клике на кнопку лайка
const likeCard = (event) => {
  event.currentTarget.classList.toggle("card__like-button_is-active");
};

// Экспорт функций для использования в других модулях
export { deleteCard, createCard, likeCard };
