import { loadContactsFromStorage } from "./storage/index.js";
import {
  renderAlphabetIndex,
  renderContacts,
  setupEventListeners,
} from "./ui/index.js";

function initApp() {
  loadContactsFromStorage();
  renderAlphabetIndex();
  renderContacts();
  setupEventListeners();
}

document.addEventListener("DOMContentLoaded", initApp);
