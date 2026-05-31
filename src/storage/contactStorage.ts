import { appState } from "../state.js";
import type { Contact, AppState } from "../types.js";

export function loadContactsFromStorage(): void {
  const storedData = localStorage.getItem("contacts");
  if (!storedData) return;

  try {
    const parsed = JSON.parse(storedData) as Contact[];
    appState.contacts = parsed;
  } catch {
    appState.contacts = [];
    localStorage.removeItem("contacts");
  }
}

export function saveContactsToStorage(): void {
  localStorage.setItem("contacts", JSON.stringify(appState.contacts));
}

export function findContactById(id: string): Contact | undefined {
  return appState.contacts.find((c) => c.id === id);
}

export function addContact(contact: Contact): void {
  appState.contacts.push(contact);
  saveContactsToStorage();
}

export function updateContact(
  id: string,
  updatedData: Partial<Contact>,
): boolean {
  const index = appState.contacts.findIndex((c) => c.id === id);
  if (index !== -1) {
    // Явно указываем, что результат — это Contact
    appState.contacts[index] = {
      ...appState.contacts[index],
      ...updatedData,
    } as Contact;
    saveContactsToStorage();
    return true;
  }
  return false;
}

export function deleteContactById(id: string): boolean {
  const initialLength = appState.contacts.length;
  appState.contacts = appState.contacts.filter((c) => c.id !== id);
  if (appState.contacts.length !== initialLength) {
    saveContactsToStorage();
    return true;
  }
  return false;
}

export function clearAllContacts(): void {
  appState.contacts = [];
  saveContactsToStorage();
}
