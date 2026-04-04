import React from 'react';
import { PiggyBank, Wallet, TriangleAlert, TrendingUp, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import SectionContainer from './ui/SectionContainer';
import Card from './ui/Card';
import { useAppStore } from '../store/appStore';
import { formatCurrency } from '../utils/currency';
import AnimatedNumber from './ui/AnimatedNumber';

const Home: React.FC = () => {
  const { transactions, setActiveSection } = useAppStore();
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
  const lastMonthSavings = lastMonth.income - lastMonth.expense;
  const savingsDelta = currentMonthSavings - lastMonthSavings;

  const topSpendingCategoryEntry = Object.entries(currentMonth.expenseByCategory)
    .sort(([, a], [, b]) => b - a)[0];
  const topSpendingCategory = topSpendingCategoryEntry
    ? { name: topSpendingCategoryEntry[0], amount: topSpendingCategoryEntry[1] }
    : { name: 'No expenses yet', amount: 0 };

  const topCategoryExpenseShare = currentMonth.expense > 0
    ? Math.round((topSpendingCategory.amount / currentMonth.expense) * 100)
    : 0;

  const spendingRatio = currentMonth.income > 0
    ? Math.round((currentMonth.expense / currentMonth.income) * 100)
    : 0;
  const previousSpendingRatio = lastMonth.income > 0
    ? Math.round((lastMonth.expense / lastMonth.income) * 100)
    : 0;
  const spendingRatioDelta = spendingRatio - previousSpendingRatio;
  const savingsTrendDirection = savingsDelta > 0 ? 'up' : savingsDelta < 0 ? 'down' : 'flat';
  const spendingTrendDirection = spendingRatioDelta > 0 ? 'up' : spendingRatioDelta < 0 ? 'down' : 'flat';

  const incomeGrowthPercent = lastMonth.income > 0
    ? Math.round(((currentMonth.income - lastMonth.income) / lastMonth.income) * 100)
    : 0;

  const getIncomeInsight = () => {
    if (monthKeys.length <= 1) {
      return 'Income comparison will appear once two months of data are available.';
    }

    if (lastMonth.income === 0 && currentMonth.income > 0) {
      return 'You started earning income this month compared to last month.';
    }

    if (lastMonth.income > 0 && currentMonth.income === 0) {
      return 'Your income decreased significantly compared to last month.';
    }

    if (incomeGrowthPercent <= -75) {
      return 'Your income decreased significantly compared to last month.';
    }

    if (incomeGrowthPercent < 0) {
      return `Your income decreased by ${Math.abs(incomeGrowthPercent)}% compared to last month.`;
    }

    if (incomeGrowthPercent >= 75) {
      return 'Your income increased significantly compared to last month.';
    }

    return `Your income increased by ${incomeGrowthPercent}% compared to last month.`;
  };

  const insights = [
    currentMonth.expense > 0
      ? `${topCategoryExpenseShare}% of your expenses were on ${topSpendingCategory.name} this month.`
      : 'Start adding expenses to unlock spending insights.',
    monthKeys.length > 1
      ? currentMonth.income >= lastMonth.income
        ? 'Your income increased compared to last month.'
        : 'Your income decreased compared to last month.'
      : getIncomeInsight(),
    currentMonthSavings >= 0
      ? `You saved ${formatCurrency(currentMonthSavings)} this month.`
      : `You overspent by ${formatCurrency(Math.abs(currentMonthSavings))} this month.`,
  ].slice(0, 3);

  type SummaryCard = {
    title: string;
    value: number;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    helper: string;
    valueClass: string;
    iconWrapClass: string;
    iconClass: string;
    displayAsCategory?: boolean;
    displayAsPercent?: boolean;
    trendDirection?: 'up' | 'down' | 'flat';
    trendText?: string;
  };

  const summaryCards = [
    {
      title: 'Total Savings',
      value: currentMonthSavings,
      icon: PiggyBank,
      helper: 'Income - Expenses this month',
      valueClass: currentMonthSavings >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300',
      iconWrapClass: currentMonthSavings >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30',
      iconClass: currentMonthSavings >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300',
      trendDirection: savingsTrendDirection,
      trendText:
        savingsTrendDirection === 'flat'
          ? 'No change vs last month'
          : `${formatCurrency(Math.abs(savingsDelta))} vs last month`,
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
      displayAsPercent: false,
    },
    {
      title: 'Spending Ratio',
      value: spendingRatio,
      icon: TrendingUp,
      helper: `${spendingRatio}% of your income spent this month`,
      valueClass: 'text-red-600 dark:text-red-300',
      iconWrapClass: 'bg-red-100 dark:bg-red-900/30',
      iconClass: 'text-red-600 dark:text-red-300',
      displayAsCategory: false,
      displayAsPercent: true,
      trendDirection: spendingTrendDirection,
      trendText:
        spendingTrendDirection === 'flat'
          ? 'No change vs last month'
          : `${Math.abs(spendingRatioDelta)}% vs last month`,
    },
    {
      title: 'Net Balance',
      value: netBalance,
      icon: Wallet,
      helper: 'Overall income - expenses',
      valueClass: netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300',
      iconWrapClass: netBalance >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30',
      iconClass: netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300',
      displayAsCategory: false,
      displayAsPercent: false,
    },
  ]satisfies SummaryCard[];

  return (
    <SectionContainer title="Personal Finance Summary">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between min-h-[72px]">
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
                      <AnimatedNumber value={card.value} formatter={(v) => formatCurrency(v)} />
                    </p>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconWrapClass}`}>
                  <Icon size={18} className={card.iconClass} />
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {card.title === 'Spending Ratio' ? 'of your income spent this month' : card.helper}
              </p>
              {'trendDirection' in card && card.trendText ? (
                <div
                  className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${
                    card.trendDirection === 'flat'
                      ? 'text-gray-500 dark:text-gray-400'
                      : card.title === 'Spending Ratio'
                        ? card.trendDirection === 'up'
                          ? 'text-red-600 dark:text-red-300'
                          : 'text-emerald-600 dark:text-emerald-300'
                        : card.trendDirection === 'up'
                          ? 'text-emerald-600 dark:text-emerald-300'
                          : 'text-red-600 dark:text-red-300'
                  }`}
                >
                  {card.trendDirection === 'up' ? <ArrowUpRight size={14} /> : null}
                  {card.trendDirection === 'down' ? <ArrowDownRight size={14} /> : null}
                  <span>{card.trendText}</span>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
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

      <Card className="mt-6">
       <div className="flex items-center justify-between">

  <h2 className="text-lg font-semibold">
    Recent Activity
  </h2>

  <button
  onClick={() => setActiveSection("dashboard")}
  className="text-blue-500 hover:underline font-medium"
>
  View all →
</button>

  </div>


        {recentTransactions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-dark-600 p-8 text-center flex flex-col items-center justify-center gap-1">
            <p className="text-base font-semibold text-gray-900 dark:text-white">No transactions yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Add your first transaction to get started</p>
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
