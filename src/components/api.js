const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-5",
  headers: {
    authorization: "0b0ab6bb-df45-434c-8fd4-603f164cb3ef",
    "Content-Type": "application/json",
  },
};

// Обработчик ответа от сервера
const handleResponse = async (response) => {
  if (response.ok) {
    return response.json();
  } else {
    const errorMessage = `Ошибка: ${response.status}`;
    throw new Error(errorMessage);
  }
};

// Проверка, что URL ссылается на изображение
const checkImageUrl = async (url) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) {
      const errorMessage = `Ошибка: ${response.status}`;
      throw new Error(errorMessage);
    }
    const contentType = response.headers.get("Content-Type");
    if (!contentType || !contentType.includes("image")) {
      throw new Error("Ошибка: URL ссылается не на изображение");
    }
  } catch (error) {
    throw new Error(`Ошибка при проверке URL: ${error.message}`);
  }
};

// Функция для выполнения HTTP-запросов
const makeRequest = async (url, method = "GET", data) => {
  try {
    const options = {
      method,
      headers: config.headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${config.baseUrl}${url}`, options);
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Ошибка при выполнении запроса: ${error.message}`);
  }
};

// Получение начальных карточек
const getInitialCards = () => makeRequest("/cards");

// Создание новой карточки
const createCard = async ({ name, link }) => {
  await checkImageUrl(link);
  return makeRequest("/cards", "POST", { name, link });
};

// Удаление карточки
const deleteCard = (cardId) => makeRequest(`/cards/${cardId}`, "DELETE");

// Поставить лайк карточке
const likeCard = (cardId) => makeRequest(`/cards/likes/${cardId}`, "PUT");

// Убрать лайк с карточки
const unlikeCard = (cardId) => makeRequest(`/cards/likes/${cardId}`, "DELETE");

// Получение информации о пользователе
const getUserInfo = () => makeRequest("/users/me");

// Обновление информации о пользователе
const updateUserInfo = async ({ name, description }) => {
  return makeRequest("/users/me", "PATCH", { name, about: description });
};

// Обновление аватара пользователя
const updateUserAvatar = async (url) => {
  await checkImageUrl(url);
  return makeRequest("/users/me/avatar", "PATCH", { avatar: url });
};

export {
  getInitialCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
  getUserInfo,
  updateUserInfo,
  updateUserAvatar,
};
