import React from 'react';
import { PiggyBank, Wallet, TriangleAlert, TrendingUp, ReceiptText, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import SectionContainer from './ui/SectionContainer';
import Card from './ui/Card';
import Button from './ui/Button';
import { useAppStore } from '../store/appStore';
import { formatCurrency } from '../utils/currency';
import AnimatedNumber from './ui/AnimatedNumber';

const Home: React.FC = () => {
  const { role, transactions, setActiveSection } = useAppStore();

  const groupedByMonth = transactions.reduce<Record<string, { income: number; expense: number; expenseByCategory: Record<string, number> }>>((acc, transaction) => {
    const monthKey = transaction.date.slice(0, 7);
    if (!acc[monthKey]) {
      acc[monthKey] = { income: 0, expense: 0, expenseByCategory: {} };
    }

    if (transaction.type === 'income') {
      acc[monthKey].income += transaction.amount;
    } else {
      acc[monthKey].expense += transaction.amount;
      acc[monthKey].expenseByCategory[transaction.category] =
        (acc[monthKey].expenseByCategory[transaction.category] || 0) + transaction.amount;
    }

    return acc;
  }, {});

  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const monthKeys = Object.keys(groupedByMonth).sort();
  const currentMonth = monthKeys.length > 0
    ? groupedByMonth[monthKeys[monthKeys.length - 1]]
    : { income: 0, expense: 0, expenseByCategory: {} };
  const lastMonth = monthKeys.length > 1
    ? groupedByMonth[monthKeys[monthKeys.length - 2]]
    : { income: 0, expense: 0, expenseByCategory: {} };

  const currentMonthSavings = currentMonth.income - currentMonth.expense;

  const topSpendingCategoryEntry = Object.entries(currentMonth.expenseByCategory)
    .sort(([, a], [, b]) => b - a)[0];
  const topSpendingCategory = topSpendingCategoryEntry
    ? { name: topSpendingCategoryEntry[0], amount: topSpendingCategoryEntry[1] }
    : { name: 'No expenses yet', amount: 0 };

  const monthlySpendPercent = currentMonth.expense > 0
    ? Math.round((topSpendingCategory.amount / currentMonth.expense) * 100)
    : 0;

  const incomeGrowthPercent = lastMonth.income > 0
    ? Math.round(((currentMonth.income - lastMonth.income) / lastMonth.income) * 100)
    : 0;

  const insights = [
    currentMonth.expense > 0
      ? `You spent ${monthlySpendPercent}% of your expenses on ${topSpendingCategory.name} this month.`
      : 'No expense data for this month yet.',
    monthKeys.length > 1
      ? `Your income ${incomeGrowthPercent >= 0 ? 'increased' : 'decreased'} by ${Math.abs(incomeGrowthPercent)}% compared to last month.`
      : 'Income comparison will appear once two months of data are available.',
    `You saved ${formatCurrency(currentMonthSavings)} this month.`,
    topSpendingCategory.amount > 0
      ? `Your highest expense was ${topSpendingCategory.name} at ${formatCurrency(topSpendingCategory.amount)}.`
      : 'Add expenses to see your top spending category.',
  ];

  const summaryCards = [
    {
      title: 'Total Savings',
      value: currentMonthSavings,
      icon: PiggyBank,
      helper: 'Income - Expenses this month',
      valueClass: currentMonthSavings >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300',
      iconWrapClass: currentMonthSavings >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30',
      iconClass: currentMonthSavings >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300',
    },
    {
      title: 'Top Spending Category',
      value: topSpendingCategory.amount,
      icon: TriangleAlert,
      helper: `${topSpendingCategory.name}${topSpendingCategory.amount > 0 ? ` ${formatCurrency(topSpendingCategory.amount)}` : ''}`,
      valueClass: 'text-red-600 dark:text-red-300',
      iconWrapClass: 'bg-red-100 dark:bg-red-900/30',
      iconClass: 'text-red-600 dark:text-red-300',
      displayAsCategory: true,
    },
    {
      title: 'Monthly Spend %',
      value: monthlySpendPercent,
      icon: TrendingUp,
      helper: `${monthlySpendPercent}% spent on ${topSpendingCategory.name}`,
      valueClass: monthlySpendPercent >= 50 ? 'text-red-600 dark:text-red-300' : 'text-emerald-600 dark:text-emerald-300',
      iconWrapClass: monthlySpendPercent >= 50 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30',
      iconClass: monthlySpendPercent >= 50 ? 'text-red-600 dark:text-red-300' : 'text-emerald-600 dark:text-emerald-300',
      displayAsPercent: true,
    },
    {
      title: 'Net Balance',
      value: netBalance,
      icon: Wallet,
      helper: 'Overall income - expenses',
      valueClass: netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300',
      iconWrapClass: netBalance >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30',
      iconClass: netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300',
    },
  ] as const;

  return (
    <SectionContainer title="Personal Finance Summary">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="panel-label mb-1">{card.title}</p>
                  {card.displayAsCategory ? (
                    <p className={`text-xl font-bold ${card.valueClass}`}>{topSpendingCategory.name}</p>
                  ) : card.displayAsPercent ? (
                    <p className={`text-xl font-bold ${card.valueClass}`}>
                      <AnimatedNumber value={card.value} formatter={(v) => `${Math.round(v)}%`} />
                    </p>
                  ) : (
                    <p className={`text-xl font-bold ${card.valueClass}`}>
                      <AnimatedNumber value={card.value} formatter={(v) => formatCurrency(Math.round(v))} />
                    </p>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconWrapClass}`}>
                  <Icon size={18} className={card.iconClass} />
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{card.helper}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <Card className="xl:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personalized Insights</h3>
          <div className="space-y-3">
            {insights.map((insight) => (
              <div key={insight} className="rounded-xl border border-gray-200 dark:border-dark-700 p-3 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                <div className="flex items-start gap-2">
                  <Sparkles size={16} className="text-primary-600 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Financial Overview</h3>
          <div className="space-y-3">
            <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50/60 dark:bg-green-900/20 p-3">
              <p className="text-xs text-green-700 dark:text-green-300">Total Income</p>
              <p className="text-lg font-semibold text-green-700 dark:text-green-300">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-900/20 p-3">
              <p className="text-xs text-red-700 dark:text-red-300">Total Expenses</p>
              <p className="text-lg font-semibold text-red-700 dark:text-red-300">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-900/20 p-3">
              <p className="text-xs text-emerald-700 dark:text-emerald-300">Savings</p>
              <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">{formatCurrency(currentMonthSavings)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setActiveSection('transactions')}>
              View all
            </Button>
            <Button variant="secondary" onClick={() => setActiveSection('dashboard')}>
              Open Dashboard
            </Button>
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-dark-600 p-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No transactions available yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="rounded-xl border border-gray-200 dark:border-dark-700 px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.category}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</p>
                </div>
                <p className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </SectionContainer>
  );
};

export default Home;
