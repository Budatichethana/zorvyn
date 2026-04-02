import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Section = 'home' | 'dashboard' | 'transactions' | 'insights';
export type UserRole = 'viewer' | 'admin';
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  type: TransactionType;
}

export interface TransactionFilters {
  search: string;
  type: 'all' | TransactionType;
}

export type ThemeMode = 'light' | 'dark';

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2024-03-28', category: 'Salary', amount: 50000, type: 'income' },
  { id: '2', date: '2024-03-27', category: 'Rent', amount: 15000, type: 'expense' },
  { id: '3', date: '2024-03-26', category: 'Groceries', amount: 2800, type: 'expense' },
  { id: '4', date: '2024-03-25', category: 'Freelance Income', amount: 8000, type: 'income' },
  { id: '5', date: '2024-03-24', category: 'Utilities', amount: 1200, type: 'expense' },
  { id: '6', date: '2024-03-23', category: 'Transport', amount: 750, type: 'expense' },
  { id: '7', date: '2024-03-22', category: 'Entertainment', amount: 1500, type: 'expense' },
  { id: '8', date: '2024-03-21', category: 'Food & Dining', amount: 950, type: 'expense' },
  { id: '9', date: '2024-03-20', category: 'Bonus', amount: 5000, type: 'income' },
  { id: '10', date: '2024-03-19', category: 'Travel', amount: 3200, type: 'expense' },
  { id: '11', date: '2024-03-18', category: 'Shopping', amount: 2100, type: 'expense' },
  { id: '12', date: '2024-03-17', category: 'Internet', amount: 499, type: 'expense' },
];

interface AppStore {
  activeSection: Section;
  role: UserRole;
  theme: ThemeMode;
  transactions: Transaction[];
  filters: TransactionFilters;
  setActiveSection: (section: Section) => void;
  setRole: (role: UserRole) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  setFilter: (filters: Partial<TransactionFilters>) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      activeSection: 'home',
      role: 'viewer',
      theme: 'light',
      transactions: INITIAL_TRANSACTIONS,
      filters: {
        search: '',
        type: 'all',
      },
      setActiveSection: (section: Section) => set({ activeSection: section }),
      setRole: (role: UserRole) => set({ role }),
      setTheme: (theme: ThemeMode) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [{ id: String(Date.now()), ...transaction }, ...state.transactions],
        })),
      updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) =>
        set((state) => ({
          transactions: state.transactions.map((item) =>
            item.id === id ? { id, ...transaction } : item,
          ),
        })),
      deleteTransaction: (id: string) =>
        set((state) => ({
          transactions: state.transactions.filter((transaction) => transaction.id !== id),
        })),
      setFilter: (filters) =>
        set((state) => ({
          filters: {
            ...state.filters,
            ...filters,
          },
        })),
    }),
    {
      name: 'zorvyn-global-store-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        role: state.role,
        theme: state.theme,
        transactions: state.transactions,
        filters: state.filters,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as Partial<AppStore>) || {};
        return {
          ...currentState,
          ...persisted,
          transactions:
            Array.isArray(persisted.transactions) && persisted.transactions.length > 0
              ? persisted.transactions
              : currentState.transactions,
          filters: {
            ...currentState.filters,
            ...(persisted.filters || {}),
          },
        };
      },
    },
  ),
);
