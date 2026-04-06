// Глобальные переменные
let contacts = [];
let editingId = null;

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", function () {
  loadContactsFromStorage();
  renderAlphabetIndex();
  renderContacts();

  // Назначение обработчиков событий
  document
    .querySelector("#contactForm")
    .addEventListener("submit", handleAddContact);
  document
    .querySelector("#clearBtn")
    .addEventListener("click", clearAllContacts);
  document
    .querySelector("#searchBtn")
    .addEventListener("click", openSearchModal);
});

// Загрузка контактов из localStorage
function loadContactsFromStorage() {
  const stored = localStorage.getItem("contacts");
  if (stored) {
    contacts = JSON.parse(stored);
  }
}

// Сохранение в localStorage
function saveContactsToStorage() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

// Валидация данных
const ERROR_MESSAGES = {
  emptyMessage: "Все поля обязательны для заполнения!",
  textMessage: "Имя может содержать только буквы и пробелы!",
  vacancyMessage: "Вакансия может содержать только буквы и пробелы!",
  phoneMessage: "Введите корректный номер телефона!",
};

function validateContact(name, vacancy, phone) {
  const errorElement = document.querySelector(".error");
  const inputElements = document.querySelectorAll(".field__input");

  function errorElementInputs() {
    inputElements.forEach((input) => {
      if (input.value) {
        return;
      }
      input.classList.toggle("field__error");
    });
  }

  function errorElementErase() {
    setTimeout(() => {
      errorElement.textContent = "";
      errorElementInputs();
    }, 1000);
  }

  if (!name.trim() || !vacancy.trim() || !phone.trim()) {
    errorElement.textContent = ERROR_MESSAGES.emptyMessage;
    errorElementInputs();
    errorElementErase();
    return false;
  }

  const nameRegex = /^[a-zA-Zа-яА-Я\s]+$/;
  if (!nameRegex.test(name)) {
    errorElement.textContent = ERROR_MESSAGES.textMessage;
    errorElementErase();
    return false;
  }

  const vacancyRegex = /^[a-zA-Zа-яА-Я\s]+$/;
  if (!vacancyRegex.test(vacancy)) {
    errorElement.textContent = ERROR_MESSAGES.vacancyMessage;
    errorElementErase();
    return false;
  }

  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  if (!phoneRegex.test(phone)) {
    errorElement.textContent = ERROR_MESSAGES.phoneMessage;
    errorElementErase();
    return false;
  }

  return true;
}

// Добавление контакта
function handleAddContact(e) {
  e.preventDefault();

  const name = document.querySelector("#name").value;
  const vacancy = document.querySelector("#vacancy").value;
  const phone = document.querySelector("#phone").value;

  if (!validateContact(name, vacancy, phone)) return;

  const newContact = {
    id: Date.now(),
    name: name.trim(),
    vacancy: vacancy.trim(),
    phone: phone.trim(),
  };

  contacts.push(newContact);
  saveContactsToStorage();

  // Очистка формы
  document.querySelector("#name").value = "";
  document.querySelector("#vacancy").value = "";
  document.querySelector("#phone").value = "";

  renderAlphabetIndex();
  renderContacts();
}

// Рендеринг алфавитного индекса
function renderAlphabetIndex() {
  const alphabetContainer = document.querySelector("#alphabet");

  // Получаем уникальные первые буквы имён контактов
  const firstLettersOfContacts = contacts.map((contact) => {
    return contact.name[0].toUpperCase();
  });

  const uniqLetters = new Set(firstLettersOfContacts);
  const letters = Array.from(uniqLetters).sort();

  alphabetContainer.innerHTML = letters
    .map((letter) => {
      const count = contacts.filter((c) =>
        c.name.toUpperCase().startsWith(letter),
      ).length;

      return `<li onclick="filterByLetter('${letter}')">${letter} (${count})</li>`;
    })
    .join("/");
}

// Фильтрация по букве
function filterByLetter(letter) {
  const filtered = contacts.filter((c) =>
    c.name.toUpperCase().startsWith(letter.toUpperCase()),
  );
  renderContacts(filtered);
}

// Рендеринг списка контактов
function renderContacts(filteredContacts = contacts) {
  const contactsContainer = document.querySelector("#contactsList");

  if (filteredContacts.length === 0) {
    contactsContainer.textContent = "Нет контактов для отображения";
    return;
  }

  contactsContainer.innerHTML = filteredContacts
    .map(
      (contact) => `
    <div class="contact-item" data-id="${contact.id}">
      <h3>${contact.name}</h3>
      <p><strong>Должность:</strong> ${contact.vacancy}</p>
      <p><strong>Телефон:</strong> ${contact.phone}</p>
      <div>
        <button class="button edit-btn" onclick="openEditModal(${contact.id})">✏️ Редактировать</button>
        <button class="button delete-btn" onclick="deleteContact(${contact.id})">🗑️ Удалить</button>
      </div>
    </div>
  `,
    )
    .join("");
}

// Открытие модального окна редактирования
function openEditModal(id) {
  editingId = id;
  const contact = contacts.find((c) => c.id === id);

  document.querySelector("#editName").value = contact.name;
  document.querySelector("#editVacancy").value = contact.vacancy;
  document.querySelector("#editPhone").value = contact.phone;

  document.querySelector("#editModal").style.display = "block";
}

// Закрытие модального окна редактирования
function closeEditModal() {
  document.querySelector("#editModal").style.display = "none";
  editingId = null;
}

// Сохранение изменений контакта
document.querySelector("#editForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.querySelector("#editName").value;
  const vacancy = document.querySelector("#editVacancy").value;
  const phone = document.querySelector("#editPhone").value;

  if (!validateContact(name, vacancy, phone)) return;

  const contactIndex = contacts.findIndex((c) => c.id === editingId);
  if (contactIndex !== -1) {
    contacts[contactIndex] = {
      ...contacts[contactIndex],
      name: name.trim(),
      vacancy: vacancy.trim(),
      phone: phone.trim(),
    };

    saveContactsToStorage();
    closeEditModal();
    renderAlphabetIndex();
    renderContacts();
  }
});

// Удаление контакта
function deleteContact(id) {
  if (confirm("Вы уверены, что хотите удалить этот контакт?")) {
    contacts = contacts.filter((c) => c.id !== id);
    saveContactsToStorage();
    renderAlphabetIndex();
    renderContacts();
  }
}

// Очистка всех контактов
function clearAllContacts() {
  if (confirm("Вы уверены, что хотите удалить все контакты?")) {
    contacts = [];
    saveContactsToStorage();
    renderAlphabetIndex();
    renderContacts();
  }
}

// Открытие модального окна поиска
function openSearchModal() {
  document.querySelector("#searchModal").style.display = "block";
  document.querySelector("#searchInput").value = "";
  document.querySelector("#searchResults").innerHTML = "";
}

// Поиск контактов
document.querySelector("#searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase().trim();
  const results = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.vacancy.toLowerCase().includes(query),
  );

  renderSearchResults(results);
});

// Рендеринг результатов поиска
function renderSearchResults(results) {
  const searchResultsContainer = document.querySelector("#searchResults");

  if (results.length === 0) {
    searchResultsContainer.innerHTML = "<p>Контакты не найдены</p>";
    return;
  }

  searchResultsContainer.innerHTML = results
    .map(
      (contact) => `
    <div class="search-result-item" data-id="${contact.id}">
      <h4>${contact.name}</h4>
      <p>${contact.vacancy} | ${contact.phone}</p>
      <div>
        <button class="button" onclick="openEditModal(${contact.id})">Редактировать</button>
        <button class="button" onclick="deleteContact(${contact.id})">Удалить</button>
      </div>
    </div>
  `,
    )
    .join("");
}

// Закрытие модальных окон по клику вне области
window.addEventListener("click", function (e) {
  const editModal = document.querySelector("#editModal");
  const searchModal = document.querySelector("#searchModal");

  if (e.target === editModal) {
    closeEditModal();
  }
  if (e.target === searchModal) {
    document.querySelector("#searchModal").style.display = "none";
  }
});
