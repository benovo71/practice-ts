import { appState } from "../state.js";
import { findContactById } from "../storage/index.js";
import type { Contact } from "../types.js";

function setupFocusTrap(
  modal: HTMLElement,
  onCloseCallback: () => void,
): () => void {
  const focusable = modal.querySelectorAll<HTMLElement>(
    'input, button, [tabindex]:not([tabindex="-1"])',
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const lastFocused = document.activeElement as HTMLElement | null;

  first?.focus();

  function onKey(e: KeyboardEvent): void {
    if (e.key === "Escape") {
      onCloseCallback();
      return;
    }
    if (e.key !== "Tab") return;

    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    }
  }

  modal.addEventListener("keydown", onKey);

  return () => {
    modal.removeEventListener("keydown", onKey);
    lastFocused?.focus();
  };
}

export function openEditModal(id: string): (() => void) | undefined {
  console.log("=== openEditModal called with ID:", id);

  const contact = findContactById(id);
  console.log("Contact found:", contact);

  if (!contact) {
    console.log("Contact not found!");
    return;
  }

  appState.editingId = id;
  console.log("appState.editingId set to:", appState.editingId);

  const nameInput = document.querySelector(
    "#editName",
  ) as HTMLInputElement | null;
  const vacancyInput = document.querySelector(
    "#editVacancy",
  ) as HTMLInputElement | null;
  const phoneInput = document.querySelector(
    "#editPhone",
  ) as HTMLInputElement | null;

  console.log("Inputs found:", { nameInput, vacancyInput, phoneInput });

  if (nameInput) nameInput.value = contact.name;
  if (vacancyInput) vacancyInput.value = contact.vacancy;
  if (phoneInput) phoneInput.value = contact.phone;

  const modal = document.querySelector("#editModal") as HTMLElement | null;
  console.log("Modal element:", modal);

  if (!modal) {
    console.log("Modal not found!");
    return;
  }

  modal.classList.add("modal--visible");
  modal.hidden = false;
  console.log("Modal opened, classes:", modal.className);

  return setupFocusTrap(modal, closeEditModal);
}

export function closeEditModal(): void {
  console.log("=== closeEditModal called ===");
  const modal = document.querySelector("#editModal") as HTMLElement | null;
  if (!modal) return;

  modal.classList.remove("modal--visible");
  modal.hidden = true;
  appState.editingId = null;

  const editForm = document.querySelector(
    "#editForm",
  ) as HTMLFormElement | null;
  editForm?.reset();
}

export function openSearchModal(): (() => void) | undefined {
  const modal = document.querySelector("#searchModal") as HTMLElement | null;
  if (!modal) return;

  modal.classList.add("modal--visible");
  modal.hidden = false;

  const searchInput = document.querySelector(
    "#searchInput",
  ) as HTMLInputElement | null;
  const searchResults = document.querySelector(
    "#searchResults",
  ) as HTMLElement | null;

  if (searchInput) {
    searchInput.value = "";
  }
  if (searchResults) {
    searchResults.innerHTML = "";
  }
  searchInput?.focus();

  return setupFocusTrap(modal, closeSearchModal);
}

export function closeSearchModal(): void {
  const modal = document.querySelector("#searchModal") as HTMLElement | null;
  if (!modal) return;

  modal.classList.remove("modal--visible");
  modal.hidden = true;
}
