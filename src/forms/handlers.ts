import { appState } from "../state.js";
import type { Contact } from "../types.js";
import {
  addContact,
  updateContact,
  deleteContactById,
  clearAllContacts,
} from "../storage/index.js";
import { renderAlphabetIndex, renderContacts } from "../ui/index.js";
import { closeEditModal } from "../ui/modals.js";
import { validateForm } from "./validator.js";

export function handleAddContact(e: Event): void {
  e.preventDefault();

  if (!validateForm("name", "vacancy", "phone")) return;

  const nameInput = document.querySelector("#name") as HTMLInputElement;
  const vacancyInput = document.querySelector("#vacancy") as HTMLInputElement;
  const phoneInput = document.querySelector("#phone") as HTMLInputElement;

  const newContact: Contact = {
    id: crypto.randomUUID(),
    name: nameInput.value.trim(),
    vacancy: vacancyInput.value.trim(),
    phone: phoneInput.value.trim(),
  };

  addContact(newContact);
  renderAlphabetIndex();
  renderContacts(appState.filteredContacts);

  const form = document.querySelector("#contactForm") as HTMLFormElement;
  form.reset();
}

export function handleEditContact(e: Event): void {
  e.preventDefault();
  if (!validateForm("editName", "editVacancy", "editPhone")) return;

  const editNameInput = document.querySelector("#editName") as HTMLInputElement;
  const editVacancyInput = document.querySelector(
    "#editVacancy",
  ) as HTMLInputElement;
  const editPhoneInput = document.querySelector(
    "#editPhone",
  ) as HTMLInputElement;

  const updated = updateContact(appState.editingId as string, {
    name: editNameInput.value.trim(),
    vacancy: editVacancyInput.value.trim(),
    phone: editPhoneInput.value.trim(),
  });

  if (updated) {
    closeEditModal();
    renderAlphabetIndex();
    renderContacts(appState.filteredContacts);
  }
}

export function handleDeleteContact(id: string): void {
  if (!confirm("Are you sure you want to delete this contact?")) return;
  if (deleteContactById(id)) {
    renderAlphabetIndex();
    renderContacts(appState.filteredContacts);
    if (appState.contacts.length === 0) appState.filteredContacts = null;
  }
}

export function handleClearAllContacts(): void {
  if (!confirm("Are you sure you want to delete ALL contacts?")) return;
  clearAllContacts();
  appState.filteredContacts = null;
  renderAlphabetIndex();
  renderContacts();
}
