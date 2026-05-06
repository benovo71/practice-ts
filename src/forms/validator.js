function showError(el, message) {
  el.textContent = message;
  setTimeout(() => {
    if (el.textContent === message) el.textContent = "";
  }, 1500);
}

export function validateForm(nameId, vacancyId, phoneId) {
  const nameInput = document.getElementById(nameId);
  const vacancyInput = document.getElementById(vacancyId);
  const phoneInput = document.getElementById(phoneId);

  const nameErr = document.getElementById(`${nameId}-error`);
  const vacancyErr = document.getElementById(`${vacancyId}-error`);
  const phoneErr = document.getElementById(`${phoneId}-error`);

  [nameErr, vacancyErr, phoneErr].forEach((el) => (el.textContent = ""));

  const name = nameInput.value.trim();
  const vacancy = vacancyInput.value.trim();
  const phone = phoneInput.value.trim();

  let valid = true;

  if (!name) {
    showError(nameErr, "Name is required");
    valid = false;
  } else if (!/^[a-zA-Zа-яА-Я\s'\-\.]+$/.test(name)) {
    showError(nameErr, "Invalid characters in name");
    valid = false;
  }

  if (!vacancy) {
    showError(vacancyErr, "Vacancy is required");
    valid = false;
  } else if (!/^[a-zA-Zа-яА-Я\s'\-\.]+$/.test(vacancy)) {
    showError(vacancyErr, "Only letters and spaces");
    valid = false;
  }

  if (!phone) {
    showError(phoneErr, "Phone is required");
    valid = false;
  } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) {
    showError(phoneErr, "Incorrect format of phone number");
    valid = false;
  }

  return valid;
}
