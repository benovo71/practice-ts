import { appState } from "../state.js";
import { escapeHtml } from "../utils.js";
import type { Contact } from "../types.js";

/**
 * Рендерит алфавитный индекс на основе первых букв имён контактов
 */
export function renderAlphabetIndex(): void {
  const container = document.querySelector("#alphabet") as HTMLElement | null;
  if (!container) return;

  const letters = appState.contacts
    .map((c: Contact) => c.name[0]?.toUpperCase() || "")
    .filter(Boolean);
  const unique = [...new Set(letters)].sort((a, b) => a.localeCompare(b, "ru"));

  if (unique.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = unique
    .map((letter) => {
      const count = appState.contacts.filter((c: Contact) =>
        c.name.toUpperCase().startsWith(letter),
      ).length;
      return `<li data-letter="${letter}" class="alphabet__item">
      ${letter} <span class="alphabet__count">(${count})</span>
    </li>`;
    })
    .join("");
}

/**
 * Рендерит список контактов
 * @param contactsToShow - опциональный массив контактов для отображения (если не указан, используются все контакты)
 */
export function renderContacts(contactsToShow: Contact[] | null = null): void {
  const container = document.querySelector("#contactsList") as HTMLElement | null;
  if (!container) return;

  const list = contactsToShow ?? appState.contacts;

  if (list.length === 0) {
    container.innerHTML = '<p class="contacts-empty">The list is empty</p>';
    return;
  }

  container.innerHTML = list
    .sort((a: Contact, b: Contact) => a.name.localeCompare(b.name, "en"))
    .map(
      (c: Contact) => `
      <div class="contact-item" data-id="${c.id}">
        <h3 class="contact-item__name">${escapeHtml(c.name)}</h3>
        <p class="contact-item__vacancy"><strong>Vacancy:</strong> ${escapeHtml(c.vacancy)}</p>
        <p class="contact-item__phone"><strong>Phone:</strong> ${escapeHtml(c.phone)}</p>
        <div class="contact-item__actions">
          <button class="button button--edit" data-action="edit">Edit</button>
          <button class="button button--delete" data-action="delete">Delete</button>
        </div>
      </div>
    `,
    )
    .join("");
}

/**
 * Рендерит результаты поиска
 * @param results - массив найденных контактов
 */
export function renderSearchResults(results: Contact[]): void {
  const container = document.querySelector("#searchResults") as HTMLElement | null;
  if (!container) return;

  if (results.length === 0) {
    container.innerHTML = "No contacts found";
    return;
  }

  container.innerHTML = results
    .map(
      (c: Contact) => `
    <div class="search-result-item" data-id="${c.id}">
      <h4 class="search-result__name">${escapeHtml(c.name)}</h4>
      <p class="search-result__details">${escapeHtml(c.vacancy)} | ${escapeHtml(c.phone)}</p>
      <div class="search-result__actions">
        <button class="button button--small" data-action="edit">Edit</button>
        <button class="button button--small" data-action="delete">Delete</button>
      </div>
    </div>
  `,
    )
    .join("");
}