// src/components/Dashboard.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setBudgets }    from '../utils/budgetSlice';
import { setExpenses }   from '../utils/expenseSlice';
import { setCategories } from '../utils/categorySlice';
import { setIncomes }    from '../utils/incomeSlice';
import { setPeriod }     from '../utils/dashboardSlice';
import { USER }          from '../utils/constant';
import { useNavigate }   from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wallet, TrendingUp, TrendingDown, DollarSign, 
  PiggyBank, CreditCard, AlertCircle, Plus, ArrowUpRight 
} from 'lucide-react';

import {
  PieChart, Pie, Cell, Tooltip as PieTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer
} from 'recharts';

const colors = {
  emerald: ['#10b981', '#059669', '#047857'],
  teal: ['#14b8a6', '#0d9488', '#0f766e'],
  orange: ['#f97316', '#ea580c', '#c2410c'],
  purple: ['#a855f7', '#9333ea', '#7e22ce'],
};

const MAX_SLICES = 5;

export default function Dashboard() {
  const dispatch   = useDispatch();
  const budgets    = useSelector(s => s.budget.budgets);
  const expenses   = useSelector(s => s.expense.expenses);
  const categories = useSelector(s => s.category.categories);
  const incomes    = useSelector(s => s.income.list);
  const period     = useSelector(s => s.dashboard.period);
  const navigate   = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [buds, exps, cats, incs] = await Promise.all([
          fetch(`${USER}/user/budget`,  { credentials: 'include' }).then(r => r.json()),
          fetch(`${USER}/user/expense`, { credentials: 'include' }).then(r => r.json()),
          fetch(`${USER}/category`,     { credentials: 'include' }).then(r => r.json()),
          fetch(`${USER}/user/income`,  { credentials: 'include' }).then(r => r.json()),
        ]);
        dispatch(setBudgets(buds));
        dispatch(setExpenses(exps));
        dispatch(setCategories(cats));
        dispatch(setIncomes(incs));
      } catch (e) {
        console.error('Dashboard load error:', e);
      }
    })();
  }, [dispatch, period]);

  // Metrics
  const totalIncome     = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalBudget     = budgets.reduce((sum, b) => sum + Number(b.limit), 0);
  const totalSpent      = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const remainingBudget = totalBudget - totalSpent;
  const remainingIncome = totalIncome - totalBudget;
  const activeCount     = budgets.filter(b => b.isActive).length;
  const overBudgetPct   = budgets.length
    ? Math.round(
        budgets.filter(b => {
          const spent = expenses
            .filter(e => e.budget === b._id)
            .reduce((s, e) => s + Number(e.amount), 0);
          return spent > b.limit;
        }).length / budgets.length * 100
      )
    : 0;

  const walletBalance = totalIncome - totalSpent;

  // Expense breakdown data
  let breakdownMap = {};
  expenses.forEach(e => {
    const name = categories.find(c => c._id === e.category)?.name || 'Unknown';
    breakdownMap[name] = (breakdownMap[name] || 0) + Number(e.amount);
  });
  let breakdownData = Object.entries(breakdownMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  if (breakdownData.length > MAX_SLICES) {
    const top = breakdownData.slice(0, MAX_SLICES);
    const otherTotal = breakdownData
      .slice(MAX_SLICES)
      .reduce((sum, { value }) => sum + value, 0);
    top.push({ name: 'Other', value: otherTotal });
    breakdownData = top;
  }
  
  // Spending trend data
  const trendMap = {};
  expenses.forEach(e => {
    const date = new Date(e.date).toLocaleDateString();
    trendMap[date] = (trendMap[date] || 0) + Number(e.amount);
  });
  const trendData = Object.entries(trendMap)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const handlePeriodChange = e => dispatch(setPeriod(e.target.value));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const statCards = [
    { 
      label: 'Wallet Balance', 
      value: `₹${walletBalance.toLocaleString()}`, 
      icon: Wallet, 
      gradient: 'from-emerald-500 to-teal-500',
      subtitle: `Income ₹${totalIncome.toLocaleString()} − Spent ₹${totalSpent.toLocaleString()}`,
      trend: walletBalance > 0 ? 'up' : 'down'
    },
    { 
      label: 'Remaining Income', 
      value: `₹${remainingIncome.toLocaleString()}`, 
      icon: DollarSign, 
      gradient: 'from-blue-500 to-cyan-500',
      subtitle: `Income ₹${totalIncome.toLocaleString()} − Budgets ₹${totalBudget.toLocaleString()}`,
      trend: remainingIncome > 0 ? 'up' : 'down'
    },
    { 
      label: 'Total Budget', 
      value: `₹${totalBudget.toLocaleString()}`, 
      icon: PiggyBank, 
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      label: 'Total Spent', 
      value: `₹${totalSpent.toLocaleString()}`, 
      icon: CreditCard, 
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      label: 'Remaining Budget', 
      value: `₹${remainingBudget.toLocaleString()}`, 
      icon: TrendingUp, 
      gradient: 'from-green-500 to-emerald-500',
      trend: remainingBudget > 0 ? 'up' : 'down'
    },
    { 
      label: 'Active Budgets', 
      value: activeCount, 
      icon: CreditCard, 
      gradient: 'from-indigo-500 to-purple-500'
    },
    { 
      label: 'Over-Budget', 
      value: `${overBudgetPct}%`, 
      icon: AlertCircle, 
      gradient: overBudgetPct > 20 ? 'from-red-500 to-orange-500' : 'from-yellow-500 to-amber-500'
    },
  ];

  const handleStatClick = (label) => {
    switch (label) {
      case 'Total Budget':
      case 'Active Budgets':
      case 'Remaining Budget':
        navigate('/app/budget#budgets-list');
        break;
      case 'Total Spent':
        navigate('/app/expense#expenses-list');
        break;
      case 'Wallet Balance':
      case 'Remaining Income':
        navigate('/app/income#income-list');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30 p-4 md:p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Welcome back! Here's your financial overview</p>
        </div>
        <motion.select
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          value={period}
          onChange={handlePeriodChange}
          className="px-4 py-2 rounded-xl bg-white border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </motion.select>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4 mb-8"
      >
        {statCards.map((card, idx) => (
          <motion.div
            key={card.label}
            variants={cardVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group cursor-pointer"
            onClick={() => handleStatClick(card.label)}
          >
            <div className={`h-full p-5 bg-gradient-to-br ${card.gradient} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-white overflow-hidden`}>
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-white/80">{card.label}</p>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <card.icon className="w-5 h-5 text-white/80" />
                  </motion.div>
                </div>
                
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold">{card.value}</p>
                  {card.trend && (
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {card.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </motion.div>
                  )}
                </div>
                
                {card.subtitle && (
                  <p className="text-xs text-white/70 mt-2">{card.subtitle}</p>
                )}
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 rounded-2xl"></div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        {/* Expense Breakdown */}
        <motion.div variants={cardVariants} className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-emerald-100/50">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-emerald-600" />
            Expense Breakdown
          </h2>
          {breakdownData.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={breakdownData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {breakdownData.map((_, idx) => (
                    <Cell key={idx} fill={colors.emerald[idx % colors.emerald.length]} />
                  ))}
                </Pie>
                <PieTooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-400">No expenses yet. Start tracking!</p>
            </div>
          )}
        </motion.div>

        {/* Spending Trend */}
        <motion.div variants={cardVariants} className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-teal-100/50">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            Spending Trend
          </h2>
          {trendData.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ fill: '#0d9488', r: 4 }}
                  activeDot={{ r: 6 }}
                  fill="url(#colorValue)"
                />
                <LineTooltip />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-400">No spending data yet</p>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Recent Activity & Quick Actions */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={cardVariants} className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-600" />
            Recent Activity
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {expenses.slice(0, 10).map((e, idx) => {
              const name = categories.find(c => c._id === e.category)?.name || 'Unknown';
              return (
                <motion.div
                  key={e._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: 5, backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                  className="flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:border-emerald-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                      {name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{name}</p>
                      <p className="text-sm text-gray-500">{new Date(e.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="font-bold text-red-600">-₹{e.amount}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      
        {/* Quick Actions */}
        <motion.div variants={cardVariants} className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-4 md:p-6 shadow-lg text-white">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Quick Actions
          </h2>
          
          <div className="space-y-3">
            {[
              { label: 'Add Expense', path: '/app/expense', icon: Plus, color: 'from-orange-400 to-red-400' },
              { label: 'Add Budget', path: '/app/budget', icon: PiggyBank, color: 'from-purple-400 to-pink-400' },
              { label: 'Add Income', path: '/app/income', icon: DollarSign, color: 'from-green-400 to-emerald-400' },
            ].map((action, idx) => (
              <motion.button
                key={action.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">{action.label}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
            ))}
          </div>

          {/* Stats Mini Cards */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 pt-6 border-t border-white/20"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs text-white/70">This Month</p>
                <p className="text-lg font-bold">₹{totalSpent.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs text-white/70">Budgets</p>
                <p className="text-lg font-bold">{activeCount}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

