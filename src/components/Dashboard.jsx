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

import {
  PieChart, Pie, Cell, Tooltip as PieTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer
} from 'recharts';

const colors = {
  navy:    '#2F4156',
  teal:    '#567C8D',
  skyBlue: '#C8D9E6',
  beige:   '#F5EFEB',
  accent:  '#567C8D',
  danger:  '#e53e3e',
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

  // Corrected wallet balance
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


  return (
    <div className="p-6 bg-[#F5EFEB] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-navy">Dashboard</h1>
        <select
          value={period}
          onChange={handlePeriodChange}
          className="p-2 rounded bg-white border"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
        {/* Wallet Balance */}
        <div className="p-4 bg-white rounded shadow" style={{ borderTop: `4px solid ${colors.teal}` }}>
          <p className="text-sm text-gray-500">Wallet Balance</p>
          <p className="text-xl font-semibold text-navy">₹{walletBalance.toLocaleString()}</p>
          <p className="text-xs text-gray-400">
            Income ₹{totalIncome.toLocaleString()} − Spent ₹{totalSpent.toLocaleString()}
          </p>
        </div>

        {/* Remaining Income */}
        <div className="p-4 bg-white rounded shadow" style={{ borderTop: `4px solid ${colors.navy}` }}>
          <p className="text-sm text-gray-500">Remaining Income</p>
          <p className="text-xl font-semibold text-navy">₹{remainingIncome.toLocaleString()}</p>
          <p className="text-xs text-gray-400">
            Income ₹{totalIncome.toLocaleString()} − Budgets ₹{totalBudget.toLocaleString()}
          </p>
        </div>

        {/* Other cards */}
        {[
          { label: 'Total Budget',      value: `₹${totalBudget.toLocaleString()}`,    color: colors.navy },
          { label: 'Total Spent',       value: `₹${totalSpent.toLocaleString()}`,     color: colors.teal },
          { label: 'Remaining Budget',  value: `₹${remainingBudget.toLocaleString()}`, color: colors.skyBlue },
          { label: 'Active Budgets',    value: activeCount,                           color: colors.beige },
          { label: 'Over-Budget %',     value: `${overBudgetPct}%`,                   color: colors.navy },
        ].map(c => (
          <div key={c.label} className="p-4 bg-white rounded shadow" style={{ borderTop: `4px solid ${c.color}` }}>
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-xl font-semibold text-navy">{c.value}</p>
          </div>
        ))}
      </div>


      {/* Charts */}
{/* 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-navy mb-4">Expense Breakdown</h2>
          {breakdownData.length ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={breakdownData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {breakdownData.map((_, i) => (
                    <Cell key={i} fill={i % 2 ? colors.teal : colors.accent} />
                  ))}
                </Pie>
                <PieTooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No expenses yet</p>
          )}
        </div> */}

   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
         <div className="bg-white rounded-lg p-6 shadow">
           <h2 className="text-xl font-semibold text-navy mb-4">Expense Breakdown</h2>
          {breakdownData.length ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={breakdownData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {breakdownData.map((_, idx) => (
                    <Cell key={idx} fill={idx % 2 ? colors.teal : colors.navy} />
                  ))}
                </Pie>
                <PieTooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No expenses yet</p>
          )}
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-navy mb-4">Spending Trend</h2>
          {trendData.length ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={colors.teal}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <LineTooltip />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No expenses yet</p>
          )}
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-navy mb-4">Recent Activity</h2>
          <ul className="space-y-4 max-h-80 overflow-y-auto">
            {expenses.slice(0, 10).map(e => {
              const name = categories.find(c => c._id === e.category)?.name || 'Unknown';
              return (
                <li key={e._id} className="flex justify-between">
                  <div>
                    <p className="font-medium text-navy">{name}</p>
                    <p className="text-sm text-gray-500">{new Date(e.date).toLocaleDateString()}</p>
                  </div>
                  <span className="font-semibold text-navy">-₹{e.amount}</span>
                </li>
              );
            })}
          </ul>
        </div>
      
  <div className="bg-white rounded-lg p-6 shadow flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[#2F4156] mb-2">Quick Actions</h2>

          {/* Always visible buttons with strong contrast */}
          <button
            onClick={() => navigate('/app/expense')}
            className="flex-1 px-4 py-2 bg-[#567C8D] text-white font-medium rounded hover:bg-[#2F4156] transition"
          >
            + Add Expense
          </button>
          <button
            onClick={() => navigate('/app/budget')}
            className="flex-1 px-4 py-2 bg-[#567C8D] text-white font-medium rounded hover:bg-[#2F4156] transition"
          >
            + Add Budget
          </button>
          <button
            onClick={() => navigate('/app/category')}
            className="flex-1 px-4 py-2 bg-[#567C8D] text-white font-medium rounded hover:bg-[#2F4156] transition"
          >
            Manage Categories
          </button>
          <button
            onClick={() => navigate('/app/income')}
            className="flex-1 px-4 py-2 bg-[#567C8D] text-white font-medium rounded hover:bg-[#2F4156] transition"
          >
            + Add Income
          </button>
        </div>
      </div>
    </div>
  );
}

