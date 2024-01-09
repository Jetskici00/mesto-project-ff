// Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// Контейнер добавления карточки
const placesList = document.querySelector(".places__list");

// Функция создания карточки
const createCard = ({ link, name }, deleteCardFunction) => {
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;

  // Обработчик события для удаления карточки
  deleteButton.addEventListener("click", () => deleteCardFunction(cardElement));
  return cardElement;
};

// Функция удаления карточки
const deleteCard = (cardElement) => {
  cardElement.remove();
};

// Функция вывода карточки на страницу
const renderCards = (cards) => {
  cards.forEach((cardData) => {
    const cardElement = createCard(cardData, deleteCard);
    placesList.appendChild(cardElement);
  });
};

// Вывод карточки на страницу
renderCards(initialCards);
