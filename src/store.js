import { create } from 'zustand';

export const useStore = create((set, get) => ({
  transactions: [],
  role: 'admin',
  searchQuery: '',
  typeFilter: 'all',
  sortBy: 'date_desc',

  setRole: (newRole) => set({ role: newRole }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTypeFilter: (filter) => set({ typeFilter: filter }),
  setSortBy: (sort) => set({ sortBy: sort }),
  addTransaction: (newTx) => set((state) => {
    const maxId = Math.max(...state.transactions.map(t => t.id), 0);
    const txWithId = { ...newTx, id: maxId + 1, date: newTx.date || new Date().toISOString().split('T')[0] };
    return { transactions: [txWithId, ...state.transactions] };
  }),
  editTransaction: (id, updatedFields) => set((state) => ({
    transactions: state.transactions.map(tx => tx.id === id ? { ...tx, ...updatedFields } : tx)
  })),
  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(tx => tx.id !== id)
  })),
  setTransactions: (transactions) => set({ transactions }),
}));
