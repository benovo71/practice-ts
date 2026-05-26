import { appState } from "../state.js";
import { findContactById } from "../storage/index.js";

// Вспомогательная функция: ловушка фокуса
function setupFocusTrap(modal, onCloseCallback) {
  const focusable = modal.querySelectorAll(
    'input, button, [tabindex]:not([tabindex="-1"])',
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const lastFocused = document.activeElement;

  first?.focus();

  function onKey(e) {
    if (e.key === "Escape") {
      onCloseCallback();
      return;
    }
    if (e.key !== "Tab") return;

    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  }

  modal.addEventListener("keydown", onKey);

  // Возвращаем функцию очистки (чтобы убрать слушатель при закрытии)
  return () => {
    modal.removeEventListener("keydown", onKey);
    lastFocused?.focus();
  };
}

// --- ЭКСПОРТИРУЕМЫЕ ФУНКЦИИ ---

export function openEditModal(id) {
  const contact = findContactById(id);
  if (!contact) return;

  appState.editingId = id;
  document.querySelector("#editName").value = contact.name;
  document.querySelector("#editVacancy").value = contact.vacancy;
  document.querySelector("#editPhone").value = contact.phone;

  const modal = document.querySelector("#editModal");
  if (!modal) return;

  modal.classList.add("modal--visible");
  modal.hidden = false;

  // Запускаем ловушку фокуса, передавая ссылку на closeEditModal
  return setupFocusTrap(modal, closeEditModal);
}

export function closeEditModal() {
  const modal = document.querySelector("#editModal");

  if (!modal) return;

  modal.classList.remove("modal--visible");
  modal.hidden = true;
  appState.editingId = null;
  document.querySelector("#editForm")?.reset();
}

export function openSearchModal() {
  const modal = document.querySelector("#searchModal");
  if (!modal) return;

  modal.classList.add("modal--visible");
  modal.hidden = false;
  document.querySelector("#searchInput").value = "";
  document.querySelector("#searchResults").innerHTML = "";
  document.querySelector("#searchInput")?.focus();

  return setupFocusTrap(modal, closeSearchModal);
}

export function closeSearchModal() {
  const modal = document.querySelector("#searchModal");
  if (!modal) return;

  modal.classList.remove("modal--visible");
  modal.hidden = true;
}
