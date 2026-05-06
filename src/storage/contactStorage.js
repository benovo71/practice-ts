import { appState } from "../state.js";

export function loadContactsFromStorage() {
  const storedData = localStorage.getItem("contacts");
  if (!storedData) return;
  try {
    appState.contacts = JSON.parse(storedData);
  } catch {
    appState.contacts = [];
    localStorage.removeItem("contacts");
  }
}

export function saveContactsToStorage() {
  localStorage.setItem("contacts", JSON.stringify(appState.contacts));
}

export function findContactById(id) {
  return appState.contacts.find((c) => c.id === id);
}

export function addContact(contact) {
  appState.contacts.push(contact);
  saveContactsToStorage();
}

export function updateContact(id, updatedData) {
  const index = appState.contacts.findIndex((c) => c.id === id);
  if (index !== -1) {
    appState.contacts[index] = { ...appState.contacts[index], ...updatedData };
    saveContactsToStorage();
    return true;
  }
  return false;
}

export function deleteContactById(id) {
  const initialLength = appState.contacts.length;
  appState.contacts = appState.contacts.filter((c) => c.id !== id);
  if (appState.contacts.length !== initialLength) {
    saveContactsToStorage();
    return true;
  }
  return false;
}

export function clearAllContacts() {
  appState.contacts = [];
  saveContactsToStorage();
}
