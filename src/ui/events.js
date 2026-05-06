import { appState } from "../state.js";
import {
  renderAlphabetIndex,
  renderContacts,
  renderSearchResults,
} from "./renderer.js";

import {
  openEditModal,
  closeEditModal,
  openSearchModal,
  closeSearchModal,
} from "./modals.js";

import {
  handleAddContact,
  handleEditContact,
  handleDeleteContact,
  handleClearAllContacts,
} from "../forms/index.js";

export function setupEventListeners() {
  // Формы
  document
    .querySelector("#contactForm")
    ?.addEventListener("submit", handleAddContact);
  document
    .querySelector("#editForm")
    ?.addEventListener("submit", handleEditContact);

  // Кнопки
  document
    .querySelector("#clearBtn")
    ?.addEventListener("click", handleClearAllContacts);
  document
    .querySelector("#searchBtn")
    ?.addEventListener("click", openSearchModal);

  document
    .querySelector('#editModal button[type="button"]')
    ?.addEventListener("click", closeEditModal);

  // Поиск
  document.querySelector("#searchInput")?.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderSearchResults([]);
      return;
    }
    const results = appState.contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.vacancy.toLowerCase().includes(query),
    );
    renderSearchResults(results);
  });

  // Алфавит
  document.querySelector("#alphabet")?.addEventListener("click", (e) => {
    const el = e.target.closest("[data-letter]");
    if (!el) return;
    const letter = el.dataset.letter;
    appState.filteredContacts = appState.contacts.filter((c) =>
      c.name.toUpperCase().startsWith(letter.toUpperCase()),
    );
    renderContacts(appState.filteredContacts);
  });

  // Список контактов
  document.querySelector("#contactsList")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const item = btn.closest("[data-id]");
    if (!item) return;
    const id = item.dataset.id;
    const action = btn.dataset.action;

    if (action === "edit") openEditModal(id);
    else if (action === "delete") handleDeleteContact(id);
  });

  // Результаты поиска
  document.querySelector("#searchResults")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const item = btn.closest("[data-id]");
    if (!item) return;
    const id = item.dataset.id;
    const action = btn.dataset.action;

    if (action === "edit") {
      closeSearchModal();
      openEditModal(id);
    } else if (action === "delete") {
      handleDeleteContact(id);
      const query = document.querySelector("#searchInput")?.value || "";
      const results = appState.contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.vacancy.toLowerCase().includes(query),
      );
      renderSearchResults(results);
    }
  });

  // Закрытие по клику вне модалки (на затемнение)
  window.addEventListener("click", (e) => {
    // Проверяем, что клик был именно по фону модалки
    if (e.target.id === "editModal") closeEditModal();
    if (e.target.id === "searchModal") closeSearchModal();
  });
}
