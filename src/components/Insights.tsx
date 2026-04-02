import React from 'react';
import { PiggyBank, PieChart, TrendingUp, TrendingDown, Repeat, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import Card from './ui/Card';
import SectionContainer from './ui/SectionContainer';
import { useAppStore } from '../store/appStore';

const Insights: React.FC = () => {
  const { transactions } = useAppStore();

  const groupedByMonth = React.useMemo(() => {
    return transactions.reduce<Record<string, { income: number; expense: number }>>((acc, transaction) => {
      const monthKey = transaction.date.slice(0, 7);
      if (!acc[monthKey]) {
        acc[monthKey] = { income: 0, expense: 0 };
      }

      if (transaction.type === 'income') {
        acc[monthKey].income += transaction.amount;
      } else {
        acc[monthKey].expense += transaction.amount;
      }

      return acc;
    }, {});
  }, [transactions]);

  const categoryTotals = React.useMemo(() => {
    return transactions.reduce<Record<string, number>>((acc, transaction) => {
      if (transaction.type !== 'expense') {
        return acc;
      }

      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});
  }, [transactions]);

  const categoryFrequency = React.useMemo(() => {
    return transactions.reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + 1;
      return acc;
    }, {});
  }, [transactions]);

  const sortedMonthKeys = Object.keys(groupedByMonth).sort();
  const currentMonthKey = sortedMonthKeys[sortedMonthKeys.length - 1] || '';
  const previousMonthKey = sortedMonthKeys[sortedMonthKeys.length - 2] || '';

  const currentMonth = currentMonthKey ? groupedByMonth[currentMonthKey] : { income: 0, expense: 0 };
  const previousMonth = previousMonthKey ? groupedByMonth[previousMonthKey] : { income: 0, expense: 0 };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalSavings = totalIncome - totalExpenses;

  const highestSpendingCategoryEntry = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];
  const highestSpendingCategory = highestSpendingCategoryEntry
    ? { category: highestSpendingCategoryEntry[0], amount: highestSpendingCategoryEntry[1] }
    : { category: 'No expenses yet', amount: 0 };

  const mostFrequentCategoryEntry = Object.entries(categoryFrequency).sort(([, a], [, b]) => b - a)[0];
  const mostFrequentCategory = mostFrequentCategoryEntry
    ? { category: mostFrequentCategoryEntry[0], count: mostFrequentCategoryEntry[1] }
    : { category: 'No transactions yet', count: 0 };

  const totalExpenseAmount = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);
  const categoryShare = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenseAmount > 0 ? Math.round((amount / totalExpenseAmount) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const expenseTrendDelta = currentMonth.expense - previousMonth.expense;
  const expenseTrendPercent = previousMonth.expense > 0
    ? Math.round((expenseTrendDelta / previousMonth.expense) * 100)
    : 0;
  const incomeTrendDelta = currentMonth.income - previousMonth.income;
  const incomeTrendPercent = previousMonth.income > 0
    ? Math.round((incomeTrendDelta / previousMonth.income) * 100)
    : 0;

  const trendDirection = expenseTrendDelta > 0 ? 'increased' : expenseTrendDelta < 0 ? 'decreased' : 'stayed flat';
  const trendIconClass = expenseTrendDelta <= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300';
  const TrendIcon = expenseTrendDelta <= 0 ? TrendingDown : TrendingUp;

  const topCategory = categoryShare[0];

  const fixedCostKeywords = ['rent', 'utilities', 'internet', 'emi', 'insurance', 'subscription'];
  const fixedCostEntries = categoryShare.filter((item) =>
    fixedCostKeywords.some((keyword) => item.category.toLowerCase().includes(keyword)),
  );
  const fixedCostAmount = fixedCostEntries.reduce((sum, item) => sum + item.amount, 0);
  const fixedCostShare = totalExpenseAmount > 0 ? Math.round((fixedCostAmount / totalExpenseAmount) * 100) : 0;
  const fixedCostLabels = fixedCostEntries.slice(0, 2).map((item) => item.category).join(', ');

  const actionableInsights = [
    totalExpenseAmount > 0 && topCategory
      ? `Your spending is heavily concentrated on ${topCategory.category} (${topCategory.percentage}%). Consider optimizing this first.`
      : 'You are off to a great start. Add a few expenses to unlock personalized suggestions.',
    totalSavings >= 0
      ? `Great job! You saved ${formatCurrency(totalSavings)} this month.`
      : `You overspent by ${formatCurrency(Math.abs(totalSavings))} this month. A small cut in top categories can bring you back on track.`,
    sortedMonthKeys.length > 1
      ? `Your monthly expenses ${trendDirection} by ${Math.abs(expenseTrendPercent)}% compared to last month.`
      : 'Keep logging this month too so we can compare trends and suggest improvements.',
    sortedMonthKeys.length > 1
      ? `Your income ${incomeTrendDelta >= 0 ? 'grew' : 'dropped'} by ${Math.abs(incomeTrendPercent)}% month over month.`
      : 'One more month of income data will unlock smarter income trend advice.',
    fixedCostAmount > 0
      ? `Most of your expenses are fixed costs${fixedCostLabels ? ` (${fixedCostLabels})` : ''} at ${fixedCostShare}%.`
      : 'Your expenses are currently more variable, giving you flexibility to optimize month by month.',
    mostFrequentCategory.count > 0
      ? `${mostFrequentCategory.category} appears most often (${mostFrequentCategory.count} entries). Reviewing this category weekly can improve control.`
      : 'Add a few more transactions to identify your strongest spending patterns.',
  ];

  const insightCards = [
    {
      icon: PiggyBank,
      label: 'Savings',
      value: formatCurrency(totalSavings),
      helper: 'Income - Expense',
      helperClass: totalSavings >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300',
    },
    {
      icon: PieChart,
      label: 'Top Spending Category',
      value: highestSpendingCategory.category,
      helper: highestSpendingCategory.amount > 0 ? formatCurrency(highestSpendingCategory.amount) : 'Add expenses to get insights',
      helperClass: 'text-red-600 dark:text-red-300',
    },
    {
      icon: TrendIcon,
      label: 'Monthly Expense Trend',
      value: `${expenseTrendDelta >= 0 ? '+' : ''}${Math.abs(expenseTrendPercent)}%`,
      helper: `Expenses ${trendDirection}`,
      helperClass: trendIconClass,
    },
    {
      icon: Repeat,
      label: 'Most Frequent Category',
      value: mostFrequentCategory.category,
      helper: mostFrequentCategory.count > 0 ? `${mostFrequentCategory.count} transactions` : 'Start logging transactions',
      helperClass: 'text-primary-600 dark:text-primary-300',
    },
  ];

  return (
    <SectionContainer title="Financial Insights">

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {insightCards.map(({ icon: Icon, label, value, helper, helperClass }) => (
          <Card key={label}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <Icon className="text-primary-600 dark:text-primary-400" size={20} />
              </div>
            </div>
            <p className={`text-xs font-medium ${helperClass}`}>{helper}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending Percentage by Category</h3>
          {categoryShare.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No expense transactions yet.</p>
          ) : (
            <div className="space-y-4">
              {categoryShare.slice(0, 5).map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.category}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.percentage}% · {formatCurrency(item.amount)}
                    </p>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 dark:bg-dark-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Trend</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">Current Month Expenses</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(currentMonth.expense)}</p>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 dark:bg-dark-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400"
                  style={{
                    width: `${Math.min(
                      previousMonth.expense > 0 ? Math.round((currentMonth.expense / previousMonth.expense) * 100) : 100,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">Previous Month Expenses</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(previousMonth.expense)}</p>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 dark:bg-dark-700 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-slate-500 to-slate-400" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-dark-700 p-3 flex items-center gap-2">
              <TrendIcon size={16} className={trendIconClass} />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Expenses {trendDirection} by <span className={`font-semibold ${trendIconClass}`}>{Math.abs(expenseTrendPercent)}%</span> month-over-month.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actionable Insights</h3>
        <div className="space-y-3">
          {actionableInsights.map((insight) => (
            <div key={insight} className="rounded-xl border border-gray-200 dark:border-dark-700 p-3 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
              <div className="flex items-start gap-2">
                <Sparkles size={15} className="text-primary-600 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </SectionContainer>
  );
};

export default Insights;
