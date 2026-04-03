import React from 'react';
import { AreaChart, Area, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import Card from './ui/Card';
import SectionContainer from './ui/SectionContainer';
import { useAppStore } from '../store/appStore';
import AnimatedNumber from './ui/AnimatedNumber';

const Dashboard: React.FC = () => {
  const { transactions, theme } = useAppStore();
  const [hiddenCategories, setHiddenCategories] = React.useState<string[]>([]);
  const BALANCE_KEY = 'balance';
  const EXPENSES_KEY = 'expenses';

  // Balance over time data
  const balanceData = [
    { month: 'Jan', balance: 24000 },
    { month: 'Feb', balance: 32000 },
    { month: 'Mar', balance: 38500 },
    { month: 'Apr', balance: 42000 },
    { month: 'May', balance: 40200 },
    { month: 'Jun', balance: 58700 },
  ];

  // Monthly expenses breakdown
  const expensesData = [
    { month: 'Jan', expenses: 8500 },
    { month: 'Feb', expenses: 7200 },
    { month: 'Mar', expenses: 9100 },
    { month: 'Apr', expenses: 8800 },
    { month: 'May', expenses: 7900 },
    { month: 'Jun', expenses: 9300 },
  ];

  // Spending by category
  const spendingData = [
    { name: 'Rent', value: 15000 },
    { name: 'Food', value: 8500 },
    { name: 'Travel', value: 5200 },
    { name: 'Utilities', value: 2800 },
    { name: 'Entertainment', value: 4500 },
    { name: 'Others', value: 3400 },
  ];

  const CATEGORY_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#3b82f6', '#8b5cf6'];

  const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? 'rgba(148,163,184,0.08)' : 'rgba(148,163,184,0.14)';
  const darkTooltipStyle = {
    borderRadius: 12,
    border: '1px solid rgba(71,85,105,0.6)',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    boxShadow: '0 12px 32px rgba(2, 6, 23, 0.35)',
    padding: '10px 12px',
  } as const;
  const darkTooltipLabelStyle = { color: '#cbd5e1', marginBottom: 6 };
  const darkTooltipItemStyle = { color: '#f8fafc', fontWeight: 500 };

  const renderTooltipContent = (props: any) => {
    const { active, payload, label } = props as {
      active?: boolean;
      payload?: ReadonlyArray<{ dataKey?: unknown; name?: unknown; value?: number | string; color?: string }>;
      label?: string | number;
    };
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    const seen = new Set<string>();
    const uniquePayload = payload.filter((item) => {
      const key = String(item.dataKey || item.name || 'series');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return (
      <div style={darkTooltipStyle}>
        <p style={darkTooltipLabelStyle}>{String(label || '')}</p>
        {uniquePayload.map((item) => (
          <div key={String(item.dataKey || item.name)} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '999px',
                background: item.color || '#60a5fa',
                display: 'inline-block',
              }}
            />
            <span style={darkTooltipItemStyle}>
              {String(item.name || item.dataKey || 'Value')}: {formatCurrency(Number(item.value || 0))}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  const stats = [
    { 
      label: 'Total Balance', 
      value: totalBalance,
      change: '+18.2%', 
      trendDirection: 'up' as const,
      metricType: 'balance' as const,
      icon: Wallet,
      color: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: 'text-emerald-700 dark:text-emerald-300',
      valueColor: 'text-emerald-700 dark:text-emerald-300',
    },
    { 
      label: 'Total Income', 
      value: totalIncome,
      change: '+5.3%', 
      trendDirection: 'up' as const,
      metricType: 'income' as const,
      icon: TrendingUp,
      color: 'bg-green-100 dark:bg-green-900/40',
      iconColor: 'text-green-700 dark:text-green-300',
      valueColor: 'text-green-700 dark:text-green-300',
    },
    { 
      label: 'Total Expenses', 
      value: totalExpenses,
      change: '2.1%',
      trendDirection: 'down' as const,
      metricType: 'expense' as const,
      icon: TrendingDown,
      color: 'bg-red-100 dark:bg-red-900/40',
      iconColor: 'text-red-700 dark:text-red-300',
      valueColor: 'text-red-700 dark:text-red-300',
    },
  ];

  return (
    <SectionContainer title="Finance Dashboard">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isTrendPositive = stat.metricType === 'expense'
            ? stat.trendDirection === 'down'
            : stat.trendDirection === 'up';
          const trendArrow = stat.trendDirection === 'up' ? '↑' : '↓';
          return (
            <Card key={stat.label} className="relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-dark-600" />
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.valueColor}`}>
                    <AnimatedNumber value={stat.value} formatter={(v) => formatCurrency(Math.round(v))} />
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className={stat.iconColor} size={24} />
                </div>
              </div>
              <p className={`text-sm font-medium ${isTrendPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} {trendArrow}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Line Chart - Balance Over Time */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Balance Over Time</h2>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={balanceData} margin={{ top: 12, right: 20, left: 4, bottom: 8 }}>
              <defs>
                <linearGradient id="balanceAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.42} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="balanceLineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
                <filter id="lineShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#166534" floodOpacity="0.22" />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="2 6" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" stroke={axisColor} tickLine={false} axisLine={false} dy={8} />
              <YAxis stroke={axisColor} tickLine={false} axisLine={false} width={72} />
              <Tooltip
                content={renderTooltipContent}
                cursor={{ stroke: 'rgba(148,163,184,0.35)', strokeWidth: 1 }}
              />
              <Legend wrapperStyle={{ paddingTop: 14 }} />
              <Area
                type="monotone"
                dataKey={BALANCE_KEY}
                stroke="none"
                fill="url(#balanceAreaGradient)"
                style={{ filter: 'url(#lineShadow)' }}
                legendType="none"
              />
              <Line
                type="monotone"
                dataKey={BALANCE_KEY}
                stroke="#14532d"
                strokeWidth={9}
                strokeOpacity={0.1}
                dot={false}
                activeDot={false}
                legendType="none"
              />
              <Line 
                type="monotone" 
                dataKey={BALANCE_KEY}
                stroke="url(#balanceLineGradient)"
                strokeWidth={3}
                dot={{ fill: '#4ade80', stroke: '#0f172a', strokeWidth: 1.5, r: 4.5 }}
                activeDot={{ r: 6 }}
                name="Balance"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart - Monthly Expenses */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Monthly Expenses</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={expensesData} margin={{ top: 12, right: 20, left: 4, bottom: 8 }} barCategoryGap="28%">
              <defs>
                <linearGradient id="expensesBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <filter id="barShadow" x="-20%" y="-20%" width="140%" height="150%">
                  <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#7f1d1d" floodOpacity="0.2" />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="2 6" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" stroke={axisColor} tickLine={false} axisLine={false} dy={8} />
              <YAxis stroke={axisColor} tickLine={false} axisLine={false} width={72} />
              <Tooltip
                content={renderTooltipContent}
                cursor={{ fill: 'rgba(148,163,184,0.08)' }}
              />
              <Legend wrapperStyle={{ paddingTop: 14 }} />
              <Bar dataKey={EXPENSES_KEY} fill="url(#expensesBarGradient)" name="Expenses" radius={[10, 10, 0, 0]} style={{ filter: 'url(#barShadow)' }} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Pie Chart - Spending by Category */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Spending by Category</h2>
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={spendingData.filter((item) => !hiddenCategories.includes(item.name))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {spendingData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={renderTooltipContent}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 lg:pl-8 mt-8 lg:mt-0">
            <div className="space-y-3">
              {spendingData.map((item, index) => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() =>
                    setHiddenCategories((prev) =>
                      prev.includes(item.name)
                        ? prev.filter((name) => name !== item.name)
                        : [...prev, item.name],
                    )
                  }
                  className={`w-full flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors ${hiddenCategories.includes(item.name) ? 'opacity-50' : 'hover:bg-gray-100 dark:hover:bg-dark-700'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[index] }} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(item.value)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </SectionContainer>
  );
};

export default Dashboard;
