// Проверка, есть ли невалидные вводы в списке
const hasInvalidInput = (inputList) =>
  inputList.some((input) => !input.validity.valid);

// Показать сообщение об ошибке для конкретного поля ввода
const showInputError = ({
  formElement,
  inputElement,
  inputErrorClass,
  errorClass,
  errorMessage,
}) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);

  errorElement.classList.add(errorClass);
  errorElement.textContent = errorMessage;

  inputElement.classList.add(inputErrorClass);
};

// Скрыть сообщение об ошибке для конкретного поля ввода
const hideInputError = ({
  formElement,
  inputElement,
  inputErrorClass,
  errorClass,
}) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);

  errorElement.classList.remove(errorClass);
  errorElement.textContent = "";

  inputElement.classList.remove(inputErrorClass);
};

// Проверка валидности ввода для конкретного поля
const checkInputValidity = ({
  formElement,
  inputElement,
  inputErrorClass,
  errorClass,
}) => {
  // Установка или сброс пользовательского сообщения об ошибке в зависимости от валидности
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  // Показать или скрыть сообщение об ошибке
  if (!inputElement.validity.valid) {
    showInputError({
      formElement,
      inputElement,
      errorMessage: inputElement.validationMessage,
      errorClass,
      inputErrorClass,
    });
  } else {
    hideInputError({
      formElement,
      inputElement,
      errorClass,
      inputErrorClass,
    });
  }
};

// Изменение состояния кнопки отправки формы
const toggleButtonState = ({
  inputList,
  submitButtonElement,
  inactiveButtonClass,
}) => {
  if (hasInvalidInput(inputList)) {
    submitButtonElement.disabled = true;
    submitButtonElement.classList.add(inactiveButtonClass);
  } else {
    submitButtonElement.disabled = false;
    submitButtonElement.classList.remove(inactiveButtonClass);
  }
};

// Установка обработчиков событий для полей формы
const setEventListeners = ({
  formElement,
  inputSelector,
  inputErrorClass,
  submitButtonSelector,
  inactiveButtonClass,
  errorClass,
}) => {
  const inputList = [...formElement.querySelectorAll(inputSelector)];
  const submitButtonElement = formElement.querySelector(submitButtonSelector);

  // Инициализация состояния кнопки при загрузке страницы
  toggleButtonState({
    inputList,
    submitButtonElement,
    inactiveButtonClass,
  });

  // Установка обработчиков для каждого поля ввода
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      // Проверка валидности при вводе
      checkInputValidity({
        formElement,
        inputElement,
        inputErrorClass,
        errorClass,
      });

      // Изменение состояния кнопки
      toggleButtonState({
        inputList,
        submitButtonElement,
        inactiveButtonClass,
      });
    });
  });
};

// Включение валидации для форм
const enableValidation = ({
  formSelector,
  inputSelector,
  submitButtonSelector,
  inactiveButtonClass,
  inputErrorClass,
  errorClass,
}) => {
  const formList = document.querySelectorAll(formSelector);

  formList.forEach((formElement) => {
    // Предотвращение действия по умолчанию при отправке формы
    formElement.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    // Установка обработчиков событий для полей формы
    setEventListeners({
      formElement,
      inputSelector,
      submitButtonSelector,
      inactiveButtonClass,
      inputErrorClass,
      errorClass,
    });
  });
};

// Очистка состояния валидации для формы
const clearValidation = (
  formElement,
  {
    submitButtonSelector,
    inactiveButtonClass,
    inputSelector,
    inputErrorClass,
    errorClass,
  }
) => {
  const inputList = [...formElement.querySelectorAll(inputSelector)];
  const submitButtonElement = formElement.querySelector(submitButtonSelector);

  // Скрытие сообщений об ошибке для всех полей формы
  inputList.forEach((inputElement) => {
    hideInputError({
      formElement,
      inputElement,
      inputErrorClass,
      errorClass,
    });
  });

  // Обновление состояния кнопки отправки формы
  toggleButtonState({
    inputList,
    submitButtonElement,
    inactiveButtonClass,
  });
};

export { enableValidation, clearValidation };
