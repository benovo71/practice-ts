import { appState } from "../state.js";
import {
  addContact,
  updateContact,
  deleteContactById,
  clearAllContacts,
} from "../storage/index.js";
import { renderAlphabetIndex, renderContacts } from "../ui/index.js";
import { closeEditModal } from "../ui/modals.js";
import { validateForm } from "./validator.js";

export function handleAddContact(e) {
  e.preventDefault();
  if (!validateForm("name", "vacancy", "phone")) return;

  const newContact = {
    id: crypto.randomUUID(),
    name: document.querySelector("#name").value.trim(),
    vacancy: document.querySelector("#vacancy").value.trim(),
    phone: document.querySelector("#phone").value.trim(),
  };

  addContact(newContact);
  renderAlphabetIndex();
  renderContacts(appState.filteredContacts);
  document.querySelector("#contactForm").reset();
}

export function handleEditContact(e) {
  e.preventDefault();
  if (!validateForm("editName", "editVacancy", "editPhone")) return;

  const updated = updateContact(appState.editingId, {
    name: document.querySelector("#editName").value.trim(),
    vacancy: document.querySelector("#editVacancy").value.trim(),
    phone: document.querySelector("#editPhone").value.trim(),
  });

  if (updated) {
    closeEditModal();
    renderAlphabetIndex();
    renderContacts(appState.filteredContacts);
  }
}

export function handleDeleteContact(id) {
  if (!confirm("Are you sure you want to delete this contact?")) return;
  if (deleteContactById(id)) {
    renderAlphabetIndex();
    renderContacts(appState.filteredContacts);
    if (appState.contacts.length === 0) appState.filteredContacts = null;
  }
}

export function handleClearAllContacts() {
  if (!confirm("Are you sure you want to delete ALL contacts?")) return;
  clearAllContacts();
  appState.filteredContacts = null;
  renderAlphabetIndex();
  renderContacts();
}
