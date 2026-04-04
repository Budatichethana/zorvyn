import React from 'react';
import { ArrowUpRight, ArrowDownLeft, FolderSearch } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatCurrency } from '../utils/currency';
import Card from './ui/Card';
import Button from './ui/Button';
import SectionContainer from './ui/SectionContainer';
import Toast from './ui/Toast';
import ConfirmDialog from './ui/ConfirmDialog';

const Transactions: React.FC = () => {
  const { role, transactions, filters, setFilter, addTransaction, updateTransaction, deleteTransaction } = useAppStore();
  const isAdmin = role === 'admin';
  const [isLoading, setIsLoading] = React.useState(true);
  const [sortBy, setSortBy] = React.useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [newTransaction, setNewTransaction] = React.useState({
    date: '2024-03-29',
    category: '',
    type: 'expense' as 'income' | 'expense',
    amount: '',
  });

  React.useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 180);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSaveTransaction = () => {
    if (!isAdmin) return;
    if (!newTransaction.category.trim() || !newTransaction.amount) {
      setToast({ message: 'Please fill category and amount', type: 'error' });
      return;
    }

    const amount = Number(newTransaction.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      setToast({ message: 'Amount must be greater than zero', type: 'error' });
      return;
    }

    const payload = {
      date: newTransaction.date,
      category: newTransaction.category.trim(),
      type: newTransaction.type,
      amount,
    };

    if (editingId) {
      updateTransaction(editingId, payload);
      setToast({ message: 'Transaction updated', type: 'success' });
    } else {
      addTransaction(payload);
      setToast({ message: 'Transaction added', type: 'success' });
    }

    setNewTransaction({
      date: '2024-03-29',
      category: '',
      type: 'expense',
      amount: '',
    });
    setEditingId(null);
  };

  const handleStartEdit = (id: string) => {
    if (!isAdmin) return;
    const target = transactions.find((transaction) => transaction.id === id);
    if (!target) return;

    setEditingId(id);
    setNewTransaction({
      date: target.date,
      category: target.category,
      type: target.type,
      amount: String(target.amount),
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewTransaction({
      date: '2024-03-29',
      category: '',
      type: 'expense',
      amount: '',
    });
  };

  const handleDeleteTransaction = (id: string) => {
    if (!isAdmin) return;
    setPendingDeleteId(id);
  };

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteTransaction(pendingDeleteId);
    setPendingDeleteId(null);
    setToast({ message: 'Transaction deleted', type: 'success' });
  };

  const summary = {
    totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    totalExpense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
  };

  const visibleTransactions = React.useMemo(() => {
    const filtered = transactions.filter((transaction) => {
      const matchesCategory = transaction.category.toLowerCase().includes(filters.search.toLowerCase().trim());
      const matchesType = filters.type === 'all' ? true : transaction.type === filters.type;
      return matchesCategory && matchesType;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'amount-asc':
          return a.amount - b.amount;
        case 'amount-desc':
        default:
          return b.amount - a.amount;
      }
    });
  }, [transactions, filters.search, filters.type, sortBy]);

  return (
    <SectionContainer title="Transactions">

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {pendingDeleteId && (
        <ConfirmDialog
          title="Delete transaction?"
          message="This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}

      {!isAdmin && (
        <Card className="mb-8 border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-900/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Viewer mode: you can view data only. Add, edit, and delete actions are hidden.
          </p>
        </Card>
      )}

      {isAdmin && (
        <Card className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingId ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <div className="flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <label className="panel-label mb-1 block">Date</label>
              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction((prev) => ({ ...prev, date: e.target.value }))}
                className="surface-input"
              />
            </div>
            <div className="flex-1">
              <label className="panel-label mb-1 block">Category</label>
              <input
                type="text"
                placeholder="e.g. Freelance"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction((prev) => ({ ...prev, category: e.target.value }))}
                className="surface-input"
              />
            </div>
            <div>
              <label className="panel-label mb-1 block">Type</label>
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction((prev) => ({ ...prev, type: e.target.value as 'income' | 'expense' }))}
                className="surface-input"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="panel-label mb-1 block">Amount</label>
              <input
                type="number"
                min="1"
                placeholder="0"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction((prev) => ({ ...prev, amount: e.target.value }))}
                className="surface-input"
              />
            </div>
            <Button onClick={handleSaveTransaction}>
              {editingId ? 'Save Changes' : 'Add Transaction'}
            </Button>
            {editingId && (
              <Button variant="secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="h-full">
          <div className="flex items-center justify-between min-h-[72px]">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalIncome)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <ArrowDownLeft className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="h-full">
          <div className="flex items-center justify-between min-h-[72px]">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalExpense)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="text-red-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-end md:justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div>
              <label className="panel-label mb-1 block">Search Category</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilter({ search: e.target.value })}
                placeholder="e.g. Rent"
                className="surface-input md:w-48"
              />
            </div>
            <div>
              <label className="panel-label mb-1 block">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilter({ type: e.target.value as 'all' | 'income' | 'expense' })}
                className="surface-input md:w-40"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="panel-label mb-1 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc')}
                className="surface-input md:w-48"
              >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="amount-desc">Amount (High to Low)</option>
                <option value="amount-asc">Amount (Low to High)</option>
              </select>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-12 rounded-xl bg-gray-100 dark:bg-dark-700 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[460px] rounded-xl border border-gray-200 dark:border-dark-700">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm">
                <tr className="border-b border-gray-200 dark:border-dark-700">
                  <th className="table-header-cell">Date</th>
                  <th className="table-header-cell">Amount</th>
                  <th className="table-header-cell">Category</th>
                  <th className="table-header-cell">Type</th>
                  {isAdmin && <th className="table-header-cell text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {visibleTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={isAdmin ? 5 : 4}
                      className="py-16 px-4 text-center"
                    >
                      {transactions.length === 0 ? (
                        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-gray-300 dark:border-dark-600 bg-gray-50/70 dark:bg-dark-700/40 p-8 text-center flex flex-col items-center justify-center">
                          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <FolderSearch className="text-primary-600 dark:text-primary-300" size={24} />
                          </div>
                          <p className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No transactions yet.</p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add your first transaction to get started.</p>
                        </div>
                      ) : (
                        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-gray-300 dark:border-dark-600 bg-gray-50/70 dark:bg-dark-700/40 p-8">
                          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <FolderSearch className="text-primary-600 dark:text-primary-300" size={24} />
                          </div>
                          <p className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No transactions found</p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            No matches for your current filters yet. Try adjusting search or type filter.
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
                {visibleTransactions.map((transaction) => (
                  <tr key={transaction.id} className="table-row">
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{transaction.date}</td>
                    <td className={`py-4 px-4 text-sm font-semibold whitespace-nowrap ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">{transaction.category}</td>
                    <td className="py-4 px-4 text-sm font-medium">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          transaction.type === 'income'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}
                      >
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            onClick={() => handleStartEdit(transaction.id)}
                            variant="secondary"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            variant="danger"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </SectionContainer>
  );
};

export default Transactions;
