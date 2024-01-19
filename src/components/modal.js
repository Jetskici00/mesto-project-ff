// Функция для обработки события нажатия клавиши "Escape" на документе
const handleDocumentKeydown = (event) => {
  if (event.key === "Escape") {
    // Закрытие модального окна с использованием функции closeModal
    closeModal(document.querySelector(".popup_is-opened"));
  }
};

// Функция для обработки клика по модальному окну
const handleModalClick = ({ target }) => {
  if (target.classList.contains("popup_is-opened")) {
    // Закрытие модального окна при клике на фон
    return closeModal(target);
  }

  if (target.closest(".popup__close")) {
    // Закрытие модального окна при клике на кнопку закрытия
    return closeModal(target.closest(".popup"));
  }
};

// Функция для открытия модального окна
const openModal = (element) => {
  // Добавление класса для отображения модального окна
  element.classList.add("popup_is-opened");
  // Добавление слушателя события нажатия клавиши "Escape" на документе
  document.addEventListener("keydown", handleDocumentKeydown);
};

// Функция для закрытия модального окна
const closeModal = (element) => {
  // Удаление слушателя события нажатия клавиши "Escape" с документа
  document.removeEventListener("keydown", handleDocumentKeydown);
  // Удаление класса для скрытия модального окна
  element.classList.remove("popup_is-opened");
};

// Экспорт функций для использования в других модулях
export { openModal, closeModal, handleModalClick };
