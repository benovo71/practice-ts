// ========== DOM элементы ==========
const alphabet = document.querySelector(".alphabet");
const formInputs = document.querySelectorAll(".field__input");
const addBtn = document.querySelector("#add");

// ========== Хранилище состояния ==========
const state = {
  timers: {},
  defaultPlaceholders: {},
  users: {},
};

// ========== Функции ==========

// Инициализация
function init() {
  generateAlphabet();
  saveDefaultPlaceholders();
}

// Генерация алфавита
function generateAlphabet() {
  Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)).forEach(
    (letter) => {
      const li = document.createElement("li");
      li.dataset.letter = letter;
      li.textContent = letter;
      alphabet.appendChild(li);
    },
  );
}

// Сохранение оригинальных плейсхолдеров
function saveDefaultPlaceholders() {
  formInputs.forEach((input) => {
    state.defaultPlaceholders[input.id] = input.placeholder;
  });
}

function getFormData() {
  const data = {};
  formInputs.forEach((input) => {
    data[input.id] = input.value.trim();
    console.log(data);
  });
  return data;
}

function updateLetterCount(letter) {
  const lowerLetter = letter.toLowerCase();
  const letterElement = document.querySelector(
    `li[data-letter="${lowerLetter}"]`,
  );

  if (!letterElement) return;

  state.users[lowerLetter] = (state.users[lowerLetter] || 0) + 1;

  letterElement.textContent = `${lowerLetter} (${state.users[lowerLetter]})`;
}

// Валидация полей
function validateEmptyInputs(inputs) {
  let hasEmptyFields = false;

  inputs.forEach((input) => {
    clearTimeout(state.timers[input.id]);

    if (!input.value.trim()) {
      hasEmptyFields = true;
      input.placeholder = "⚠️ Empty field";

      state.timers[input.id] = setTimeout(() => {
        input.placeholder = state.defaultPlaceholders[input.id];
      }, 2000);
    }
  });

  return !hasEmptyFields; // true если все поля заполнены
}

// ========== Запуск приложения ==========

init();

// ========== Обработчики событий ==========

addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!validateEmptyInputs(formInputs)) {
    console.log("❌ Валидация не пройдена — есть пустые поля");
    return; // Прерываем выполнение
  }

  // ✅ Если дошли сюда — валидация пройдена
  console.log("✅ Валидация пройдена — все поля заполнены");

  const formData = getFormData();
  const firstLetter = formData.name.charAt(0).toLowerCase();
  console.log("✅ Первая буква имени:", firstLetter);

  updateLetterCount(firstLetter);
});
