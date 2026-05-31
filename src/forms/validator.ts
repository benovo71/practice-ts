/**
 * Показывает сообщение об ошибке в указанном элементе и скрывает его через 1.5 секунды
 * @param el - HTML элемент для отображения ошибки
 * @param message - текст сообщения об ошибке
 */
function showError(el: HTMLElement | null, message: string): void {
  if (!el) return;
  
  el.textContent = message;
  setTimeout(() => {
    if (el.textContent === message) {
      el.textContent = "";
    }
  }, 1500);
}

/**
 * Валидирует поля формы: имя, вакансию и телефон
 * @param nameId - ID input поля для имени
 * @param vacancyId - ID input поля для вакансии
 * @param phoneId - ID input поля для телефона
 * @returns true если все поля валидны, иначе false
 */
export function validateForm(
  nameId: string,
  vacancyId: string,
  phoneId: string
): boolean {
  // Получаем input элементы
  const nameInput = document.getElementById(nameId) as HTMLInputElement | null;
  const vacancyInput = document.getElementById(vacancyId) as HTMLInputElement | null;
  const phoneInput = document.getElementById(phoneId) as HTMLInputElement | null;

  // Получаем элементы для отображения ошибок
  const nameErr = document.getElementById(`${nameId}-error`) as HTMLElement | null;
  const vacancyErr = document.getElementById(`${vacancyId}-error`) as HTMLElement | null;
  const phoneErr = document.getElementById(`${phoneId}-error`) as HTMLElement | null;

  // Очищаем предыдущие сообщения об ошибках
  [nameErr, vacancyErr, phoneErr].forEach((el) => {
    if (el) el.textContent = "";
  });

  // Проверяем существование input элементов
  if (!nameInput || !vacancyInput || !phoneInput) {
    console.error("One or more input fields not found");
    return false;
  }

  // Получаем значения
  const name = nameInput.value.trim();
  const vacancy = vacancyInput.value.trim();
  const phone = phoneInput.value.trim();

  let valid = true;

  // Валидация имени
  if (!name) {
    showError(nameErr, "Name is required");
    valid = false;
  } else if (!/^[a-zA-Zа-яА-Я\s'\-\.]+$/.test(name)) {
    showError(nameErr, "Invalid characters in name");
    valid = false;
  }

  // Валидация вакансии
  if (!vacancy) {
    showError(vacancyErr, "Vacancy is required");
    valid = false;
  } else if (!/^[a-zA-Zа-яА-Я\s'\-\.]+$/.test(vacancy)) {
    showError(vacancyErr, "Only letters and spaces");
    valid = false;
  }

  // Валидация телефона
  if (!phone) {
    showError(phoneErr, "Phone is required");
    valid = false;
  } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) {
    showError(phoneErr, "Incorrect format of phone number");
    valid = false;
  }

  return valid;
}