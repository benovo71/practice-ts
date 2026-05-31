import { appState } from "../state.js";
import type { Contact } from "../types.js";
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

/**
 * Настраивает все обработчики событий в приложении
 */
export function setupEventListeners(): void {
  console.log("=== setupEventListeners called ===");

  // --- Формы ---
  const contactForm = document.querySelector(
    "#contactForm",
  ) as HTMLFormElement | null;
  contactForm?.addEventListener("submit", handleAddContact);

  const editForm = document.querySelector(
    "#editForm",
  ) as HTMLFormElement | null;
  editForm?.addEventListener("submit", handleEditContact);

  // --- Кнопки ---
  const clearBtn = document.querySelector(
    "#clearBtn",
  ) as HTMLButtonElement | null;
  clearBtn?.addEventListener("click", handleClearAllContacts);

  const searchBtn = document.querySelector(
    "#searchBtn",
  ) as HTMLButtonElement | null;
  searchBtn?.addEventListener("click", openSearchModal);

  // Кнопка Cancel в модальном окне редактирования
  const cancelEditBtn = document.querySelector(
    "#cancelEditBtn",
  ) as HTMLButtonElement | null;
  cancelEditBtn?.addEventListener("click", closeEditModal);

  // Кнопки закрытия ×
  const closeEditModalX = document.querySelector(
    "#edit-modal-close",
  ) as HTMLButtonElement | null;
  closeEditModalX?.addEventListener("click", closeEditModal);

  const closeSearchModalX = document.querySelector(
    "#search-modal-close",
  ) as HTMLButtonElement | null;
  closeSearchModalX?.addEventListener("click", closeSearchModal);

  // --- Поиск ---
  const searchInput = document.querySelector(
    "#searchInput",
  ) as HTMLInputElement | null;
  searchInput?.addEventListener("input", (e: Event) => {
    const target = e.target as HTMLInputElement;
    const query = target.value.toLowerCase().trim();

    if (!query) {
      renderSearchResults([]);
      return;
    }

    const results = appState.contacts.filter(
      (c: Contact) =>
        c.name.toLowerCase().includes(query) ||
        c.vacancy.toLowerCase().includes(query),
    );
    renderSearchResults(results);
  });

  // --- Алфавитный индекс ---
  const alphabetContainer = document.querySelector(
    "#alphabet",
  ) as HTMLElement | null;
  alphabetContainer?.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    const el = target.closest("[data-letter]") as HTMLElement | null;
    if (!el) return;

    const letter = el.dataset.letter;
    if (!letter) return;

    appState.filteredContacts = appState.contacts.filter((c: Contact) =>
      c.name.toUpperCase().startsWith(letter.toUpperCase()),
    );
    renderContacts(appState.filteredContacts);
  });

  // --- Список контактов (ВАЖНО: здесь обработка Edit) ---
  const contactsList = document.querySelector(
    "#contactsList",
  ) as HTMLElement | null;
  console.log("contactsList found:", contactsList);

  contactsList?.addEventListener("click", (e: Event) => {
    console.log("=== Click on contactsList ===");
    const target = e.target as HTMLElement;
    console.log("Target:", target.tagName, target.className);

    const btn = target.closest("[data-action]") as HTMLElement | null;
    console.log("Button with data-action:", btn);

    if (!btn) {
      console.log("No button with data-action found");
      return;
    }

    const item = btn.closest("[data-id]") as HTMLElement | null;
    console.log("Item with data-id:", item);

    if (!item) {
      console.log("No item with data-id found");
      return;
    }

    const id = item.dataset.id;
    const action = btn.dataset.action;
    console.log(`Action: ${action}, ID: ${id}`);

    if (!id || !action) return;

    if (action === "edit") {
      console.log("Calling openEditModal with ID:", id);
      openEditModal(id);
    } else if (action === "delete") {
      handleDeleteContact(id);
    }
  });

  // --- Результаты поиска ---
  const searchResults = document.querySelector(
    "#searchResults",
  ) as HTMLElement | null;
  searchResults?.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    const btn = target.closest("[data-action]") as HTMLElement | null;
    if (!btn) return;

    const item = btn.closest("[data-id]") as HTMLElement | null;
    if (!item) return;

    const id = item.dataset.id;
    const action = btn.dataset.action;

    if (!id || !action) return;

    if (action === "edit") {
      closeSearchModal();
      openEditModal(id);
    } else if (action === "delete") {
      handleDeleteContact(id);

      const searchInputElem = document.querySelector(
        "#searchInput",
      ) as HTMLInputElement | null;
      const query = searchInputElem?.value || "";
      const results = appState.contacts.filter(
        (c: Contact) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.vacancy.toLowerCase().includes(query.toLowerCase()),
      );
      renderSearchResults(results);
    }
  });

  // --- Закрытие по клику вне модалки (на затемнение) ---
  window.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;

    if (target.id === "editModal") {
      closeEditModal();
    }
    if (target.id === "searchModal") {
      closeSearchModal();
    }
  });
}
