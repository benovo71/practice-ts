import { loadContactsFromStorage } from "./storage/index.js";
import {
  renderAlphabetIndex,
  renderContacts,
  setupEventListeners,
} from "./ui/index.js";
import { appState } from "./state.js";

function initApp(): void {
  console.log("=== APP STARTED ===");

  loadContactsFromStorage();
  console.log("Contacts count:", appState.contacts.length);

  renderAlphabetIndex();
  renderContacts();
  setupEventListeners();

  console.log("=== APP INITIALIZED ===");
}

document.addEventListener("DOMContentLoaded", initApp);
