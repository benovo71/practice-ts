export interface Contact {
  id: string;
  name: string;
  vacancy: string;
  phone: string;
}

export interface AppState {
  contacts: Contact[];
  filteredContacts: Contact[] | null;
  editingId: string | null;
}
