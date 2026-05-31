import type { Contact, AppState } from "./types.js";

export const appState: AppState = {
  contacts: [],
  editingId: null,
  filteredContacts: null,
};
