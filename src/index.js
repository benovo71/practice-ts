/**
 * ================================
 * МОДУЛЬ 1: УПРАВЛЕНИЕ ДАННЫМИ (CRUD + localStorage)
 * ================================
 */

// Глобальное состояние приложения
const appState = {
  contacts: [], // Массив контактов [{ id, name, vacancy, phone }]
  editingId: null, // ID контакта в режиме редактирования
  filteredContacts: null, // Текущий фильтр (буква алфавита или поиск). null = показать все
};

function loadContactsFromStorage() {
  const storedData = localStorage.getItem("contacts");

  if (storedData) {
    appState.contacts = JSON.parse(storedData);
  }
}

function saveContactsToStorage() {
  const jsonData = JSON.stringify(appState.contacts);
  localStorage.setItem("contacts", jsonData);
}

function findContactById(id) {
  return appState.contacts.find((contact) => contact.id === id);
}

function addContact(contact) {
  appState.contacts.push(contact);
  saveContactsToStorage();
}

function updateContact(id, updatedData) {
  const index = appState.contacts.findIndex((contact) => contact.id === id);

  if (index !== -1) {
    appState.contacts[index] = {
      ...appState.contacts[index],
      ...updatedData,
    };
    saveContactsToStorage();
    return true;
  }
  return false;
}

function deleteContactById(id) {
  const initialLength = appState.contacts.length;

  appState.contacts = appState.contacts.filter((contact) => contact.id !== id);

  if (appState.contacts.length !== initialLength) {
    saveContactsToStorage();
    return true;
  }
  return false;
}

function clearAllContacts() {
  appState.contacts = [];
  saveContactsToStorage();
}

/**
 * ================================
 * МОДУЛЬ 2: ВАЛИДАЦИЯ ДАННЫХ
 * ================================
 */
function validateForm(nameId, vacancyId, phoneId) {
  // Получаем поля и элементы ошибок
  const nameInput = document.getElementById(nameId);
  const vacancyInput = document.getElementById(vacancyId);
  const phoneInput = document.getElementById(phoneId);

  const nameErr = document.getElementById(`${nameId}-error`);
  const vacancyErr = document.getElementById(`${vacancyId}-error`);
  const phoneErr = document.getElementById(`${phoneId}-error`);

  // Сразу скрываем все ошибки (на случай, если они остались от прошлой попытки)
  [nameErr, vacancyErr, phoneErr].forEach((el) => {
    el.textContent = "";
  });

  // Получаем значения
  const name = nameInput.value.trim();
  const vacancy = vacancyInput.value.trim();
  const phone = phoneInput.value.trim();

  let valid = true;

  // Проверка имени
  if (!name) {
    showError(nameErr, "Name is required");
    valid = false;
  } else if (!/^[a-zA-Zа-яА-Я\s]+$/.test(name)) {
    showError(nameErr, "Only letters and spaces");
    valid = false;
  }

  // Проверка должности
  if (!vacancy) {
    showError(vacancyErr, "Vacancy is required");
    valid = false;
  } else if (!/^[a-zA-Zа-яА-Я\s]+$/.test(vacancy)) {
    showError(vacancyErr, "Only letters and spaces");
    valid = false;
  }

  // Проверка телефона
  if (!phone) {
    showError(phoneErr, "Phone is required");
    valid = false;
  } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) {
    showError(phoneErr, "Incorrect format of phone number");
    valid = false;
  }

  return valid;
}

// Вспомогательная функция: показать ошибку и скрыть через 1.5 сек
function showError(errorElement, message) {
  errorElement.textContent = message;

  // Через 1500 мс — скрыть
  setTimeout(() => {
    // Проверяем, не появилась ли новая ошибка (на случай, если пользователь быстро что-то изменил)
    if (errorElement.textContent === message) {
      errorElement.textContent = "";
    }
  }, 1500);
}
/**
 * ================================
 * МОДУЛЬ 3: РЕНДЕРИНГ ИНТЕРФЕЙСА
 * ================================
 */

/**
 * Рендерит алфавитный индекс на основе первых букв имён контактов
 * Создаёт список вида: А (3) / Б (1) / В (5)
 */
function renderAlphabetIndex() {
  const alphabetContainer = document.querySelector("#alphabet");

  if (!alphabetContainer) return;

  // Получаем уникальные первые буквы имён (в верхнем регистре)

  // Шаг 1: извлекаем и фильтруем
  const letters = appState.contacts
    .map((contact) => contact.name[0]?.toUpperCase() || "")
    .filter((letter) => letter);

  // Шаг 2: убираем дубликаты
  const uniqueLetters = [...new Set(letters)];

  // Шаг 3: сортируем итоговый массив
  const firstLetters = uniqueLetters.sort((a, b) => a.localeCompare(b, "ru"));

  // Если контактов нет — очищаем индекс
  if (firstLetters.length === 0) {
    alphabetContainer.innerHTML = "";
    return;
  }

  // Генерируем HTML для каждой буквы
  const letterItems = firstLetters.map((letter) => {
    // Считаем количество контактов на эту букву
    const count = appState.contacts.filter((contact) =>
      contact.name.toUpperCase().startsWith(letter),
    ).length;

    // Создаём элемент списка с данными для делегирования
    return `<li data-letter="${letter}" class="alphabet__item">
      ${letter} <span class="alphabet__count">(${count})</span>
    </li>`;
  });

  alphabetContainer.innerHTML = letterItems.join("");
}

function renderContacts(contactsToShow = null) {
  const contactsContainer = document.querySelector("#contactsList");

  if (!contactsContainer) return;

  // Определяем, какие контакты показывать
  const contactsToRender = contactsToShow || appState.contacts;

  // Если контактов нет — показываем сообщение
  if (contactsToRender.length === 0) {
    contactsContainer.innerHTML =
      '<p class="contacts-empty">The list is empty</p>';
    return;
  }

  // Сортируем контакты по имени для удобства
  const sortedContacts = [...contactsToRender].sort((a, b) =>
    a.name.localeCompare(b.name, "ru"),
  );

  // Генерируем HTML для каждого контакта
  const contactElements = sortedContacts
    .map(
      (contact) => `
    <div class="contact-item" data-id="${contact.id}">
      <h3 class="contact-item__name">${escapeHtml(contact.name)}</h3>
      <p class="contact-item__vacancy"><strong>Должность:</strong> ${escapeHtml(contact.vacancy)}</p>
      <p class="contact-item__phone"><strong>Телефон:</strong> ${escapeHtml(contact.phone)}</p>
      <div class="contact-item__actions">
        <button class="button button--edit" data-action="edit">Редактировать</button>
        <button class="button button--delete" data-action="delete">Удалить</button>
      </div>
    </div>
  `,
    )
    .join("");

  contactsContainer.innerHTML = contactElements;
}

function renderSearchResults(results) {
  const resultsContainer = document.querySelector("#searchResults");

  if (!resultsContainer) return;

  // Если результатов нет — показываем сообщение
  if (results.length === 0) {
    resultsContainer.innerHTML = "No contacts found";
    return;
  }

  // Генерируем элементы результатов поиска
  const resultElements = results
    .map(
      (contact) => `
    <div class="search-result-item" data-id="${contact.id}">
      <h4 class="search-result__name">${escapeHtml(contact.name)}</h4>
      <p class="search-result__details">${escapeHtml(contact.vacancy)} | ${escapeHtml(contact.phone)}</p>
      <div class="search-result__actions">
        <button class="button button--small" data-action="edit">Редактировать</button>
        <button class="button button--small" data-action="delete">Удалить</button>
      </div>
    </div>
  `,
    )
    .join("");

  resultsContainer.innerHTML = resultElements;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * ================================
 * МОДУЛЬ 4: МОДАЛЬНЫЕ ОКНА
 * ================================
 */

function openEditModal(id) {
  const contact = findContactById(id);

  // Сохраняем ID редактируемого контакта в состоянии
  appState.editingId = id;

  // Заполняем поля формы данными контакта
  document.querySelector("#editName").value = contact.name;
  document.querySelector("#editVacancy").value = contact.vacancy;
  document.querySelector("#editPhone").value = contact.phone;

  // Показываем модальное окно
  document.querySelector("#editModal").style.display = "block";
}

/**
 * Закрывает модальное окно редактирования и сбрасывает состояние
 */
function closeEditModal() {
  document.querySelector("#editModal").style.display = "none";
  appState.editingId = null;

  // Очищаем поля формы
  document.querySelector("#editName").value = "";
  document.querySelector("#editVacancy").value = "";
  document.querySelector("#editPhone").value = "";
}

/**
 * Открывает модальное окно поиска
 */
function openSearchModal() {
  document.querySelector("#searchModal").style.display = "block";
  document.querySelector("#searchInput").value = "";
  document.querySelector("#searchResults").innerHTML = "";

  // Фокус на поле ввода для удобства
  setTimeout(() => {
    document.querySelector("#searchInput")?.focus();
  }, 100);
}

/**
 * Закрывает модальное окно поиска
 */
function closeSearchModal() {
  document.querySelector("#searchModal").style.display = "none";
}

/**
 * ================================
 * МОДУЛЬ 5: ОБРАБОТЧИКИ СОБЫТИЙ
 * ================================
 */

function handleAddContact(e) {
  e.preventDefault();

  if (!validateForm("name", "vacancy", "phone")) return;

  const name = document.querySelector("#name").value;
  const vacancy = document.querySelector("#vacancy").value;
  const phone = document.querySelector("#phone").value;

  // Создаём новый контакт
  const newContact = {
    id: Date.now(),
    name: name.trim(),
    vacancy: vacancy.trim(),
    phone: phone.trim(),
  };

  addContact(newContact);
  renderAlphabetIndex();
  renderContacts(appState.filteredContacts);
  document.querySelector("#contactForm").reset();
}

function handleEditContact(e) {
  e.preventDefault();

  if (!validateForm("editName", "editVacancy", "editPhone")) return;

  const name = document.querySelector("#editName").value;
  const vacancy = document.querySelector("#editVacancy").value;
  const phone = document.querySelector("#editPhone").value;

  const updated = updateContact(appState.editingId, {
    name: name.trim(),
    vacancy: vacancy.trim(),
    phone: phone.trim(),
  });

  if (updated) {
    closeEditModal();
    renderAlphabetIndex();
    renderContacts(appState.filteredContacts);
  } else {
    console.error("The contact for editing was not found");
  }
}

function handleDeleteContact(id) {
  if (!confirm("Are you sure you want to delete this contact?")) {
    return;
  }

  const deleted = deleteContactById(id);

  if (deleted) {
    renderAlphabetIndex();
    renderContacts(appState.filteredContacts);

    if (appState.contacts.length === 0) {
      appState.filteredContacts = null;
    }
  }
}

function handleClearAllContacts() {
  if (!confirm("Are you sure you want to delete ALL contacts?")) {
    return;
  }

  clearAllContacts();
  appState.filteredContacts = null;
  renderAlphabetIndex();
  renderContacts();
}

function filterContactsByLetter(letter) {
  // Сохраняем текущий фильтр в состоянии
  appState.filteredContacts = appState.contacts.filter((contact) =>
    contact.name.toUpperCase().startsWith(letter.toUpperCase()),
  );

  renderContacts(appState.filteredContacts);
}

function searchContacts(query) {
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm) {
    renderSearchResults([]);
    return;
  }

  const results = appState.contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.vacancy.toLowerCase().includes(searchTerm),
  );

  renderSearchResults(results);
}

/**
 * ================================
 * МОДУЛЬ 6: ДЕЛЕГИРОВАНИЕ СОБЫТИЙ
 * ================================
 */

function setupEventListeners() {
  // Форма добавления контакта
  document
    .querySelector("#contactForm")
    ?.addEventListener("submit", handleAddContact);

  // Кнопка очистки списка
  document
    .querySelector("#clearBtn")
    ?.addEventListener("click", handleClearAllContacts);

  // Кнопка поиска
  document
    .querySelector("#searchBtn")
    ?.addEventListener("click", openSearchModal);

  // Форма редактирования
  document
    .querySelector("#editForm")
    ?.addEventListener("submit", handleEditContact);

  // Кнопка отмены в модалке редактирования
  document
    .querySelector('#editModal button[type="button"]')
    ?.addEventListener("click", closeEditModal);

  // Поле поиска (реакция на ввод)
  document.querySelector("#searchInput")?.addEventListener("input", (e) => {
    searchContacts(e.target.value);
  });

  // Делегирование для алфавитного индекса
  document.querySelector("#alphabet")?.addEventListener("click", (e) => {
    const letterElement = e.target.closest("[data-letter]");
    if (letterElement) {
      const letter = letterElement.dataset.letter;
      filterContactsByLetter(letter);
    }
  });

  // Делегирование для списка контактов
  document.querySelector("#contactsList")?.addEventListener("click", (e) => {
    const button = e.target.closest("[data-action]");
    if (!button) return;

    const contactItem = button.closest("[data-id]");
    if (!contactItem) return;

    const id = Number(contactItem.dataset.id);
    const action = button.dataset.action;

    if (action === "edit") {
      openEditModal(id);
    } else if (action === "delete") {
      handleDeleteContact(id);
    }
  });

  // Делегирование для результатов поиска
  document.querySelector("#searchResults")?.addEventListener("click", (e) => {
    const button = e.target.closest("[data-action]");
    if (!button) return;

    const resultItem = button.closest("[data-id]");
    if (!resultItem) return;

    const id = Number(resultItem.dataset.id);
    const action = button.dataset.action;

    if (action === "edit") {
      closeSearchModal();
      openEditModal(id);
    } else if (action === "delete") {
      handleDeleteContact(id);
      // После удаления из поиска — обновляем результаты
      const currentQuery = document.querySelector("#searchInput")?.value || "";
      searchContacts(currentQuery);
    }
  });

  // Закрытие модальных окон по клику на затемнённую область
  window.addEventListener("click", (e) => {
    if (e.target.id === "editModal") closeEditModal();
    if (e.target.id === "searchModal") closeSearchModal();
  });

  // Закрытие модальных окон по нажатию Escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeEditModal();
      closeSearchModal();
    }
  });
}

/**
 * ================================
 * МОДУЛЬ 7: ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
 * ================================
 */

/**
 * Главная функция инициализации приложения
 * Вызывается один раз при загрузке DOM
 */
function initApp() {
  // 1. Загружаем контакты из хранилища
  loadContactsFromStorage();

  // 2. Рендерим начальное состояние интерфейса
  renderAlphabetIndex();
  renderContacts();

  // 3. Настраиваем все обработчики событий
  setupEventListeners();
}

// Запускаем приложение после полной загрузки DOM
document.addEventListener("DOMContentLoaded", initApp);
