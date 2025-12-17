

// src/components/Budget.jsx
import React, { useEffect, useState, useRef } from 'react';
import useHashScroll from '../utils/useHashScroll';
import { useSelector, useDispatch } from 'react-redux';
import { setBudgets, addBudget, deleteBudget } from '../utils/budgetSlice';
import { setCategories } from '../utils/categorySlice';
import { USER } from '../utils/constant';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PiggyBank, Plus, Trash2, TrendingUp, Calendar, DollarSign, Coins, Target, Sparkles, Wallet, CircleDollarSign, AlertCircle, CheckCircle, Clock, TrendingDown } from 'lucide-react';

const FloatingCoins = () => {
  const coins = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 7,
    size: 20 + Math.random() * 30,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
      {coins.map((coin) => (
        <motion.div
          key={coin.id}
          className="absolute"
          style={{ left: coin.left, top: '-50px' }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: coin.duration,
            delay: coin.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Coins
            className="text-emerald-500"
            style={{ width: coin.size, height: coin.size }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default function Budget() {
  useHashScroll(100);
  const dispatch = useDispatch();
  const budgets = useSelector(state => state.budget.budgets);
  const categories = useSelector(state => state.category.categories);
  const expenses = useSelector(state => state.expense.expenses || []);
  const listRef = useRef(null);

  const [formData, setFormData] = useState({ amount: '', date: new Date().toISOString().substr(0, 10), category: '', budget: '', note: '' });
  const [newBudget, setNewBudget] = useState({ categoryId: '', limit: '', period: 'monthly' });
  const [error, setError] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const [cats, buds, exps] = await Promise.all([
          fetch(`${USER}/category`, { credentials: 'include' }).then(r => r.json()),
          fetch(`${USER}/user/budget`, { credentials: 'include' }).then(r => r.json()),
          fetch(`${USER}/user/expense`, { credentials: 'include' }).then(r => r.json()),
        ]);
        dispatch(setCategories(cats));
        dispatch(setBudgets(buds));
        if (exps && Array.isArray(exps)) {
          const { setExpenses } = require('../utils/expenseSlice');
          dispatch(setExpenses(exps));
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [dispatch]);

  // Handlers
  const handleBudgetChange = e => setNewBudget(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddBudget = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${USER}/user/budget`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: newBudget.categoryId, limit: Number(newBudget.limit), period: newBudget.period }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed');
      }
      const saved = await res.json();
      dispatch(addBudget(saved));
      setNewBudget({ categoryId: '', limit: '', period: 'monthly' });
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this budget?')) return;
    const res = await fetch(`${USER}/user/budget/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) dispatch(deleteBudget(id));
  };

  // Helper to format name
  const getCatName = id => categories.find(c => c._id === id)?.name || 'Unknown';

  // Calculate spent for a budget
  const getSpent = (budgetId) =>
    expenses
      .filter((e) => e.budget === budgetId)
      .reduce((sum, e) => sum + Number(e.amount), 0);

  // Calculate next reset date
  const getNextResetDate = (period) => {
    const today = new Date();
    let resetDate = new Date(today);

    if (period === 'weekly') {
      const daysUntilMonday = (1 - today.getDay() + 7) % 7 || 7;
      resetDate.setDate(today.getDate() + daysUntilMonday);
    } else if (period === 'monthly') {
      resetDate.setMonth(today.getMonth() + 1);
      resetDate.setDate(1);
    } else if (period === 'yearly') {
      resetDate.setFullYear(today.getFullYear() + 1);
      resetDate.setMonth(0);
      resetDate.setDate(1);
    }

    return resetDate.toLocaleDateString('en-IN', { day: 'short', month: 'short' });
  };

  // Get budget health percentage
  const getBudgetHealth = (budgetId, limit) => {
    const spent = getSpent(budgetId);
    return Math.min((spent / limit) * 100, 100);
  };

  // Get budget status
  const getBudgetStatus = (budgetId, limit) => {
    const spent = getSpent(budgetId);
    if (spent >= limit) return { status: 'fully-spent', label: '⚠️ Fully Spent', color: 'bg-red-100 border-red-200 text-red-600' };
    if (spent >= limit * 0.8) return { status: 'warning', label: '⚠️ 80% Used', color: 'bg-orange-100 border-orange-200 text-orange-600' };
    return { status: 'active', label: '✓ Active', color: 'bg-green-100 border-green-200 text-green-600' };
  };

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.limit), 0);
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const budgetHealthPercent = totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const activeBudgets = budgets.length;

  const scrollToList = () => {
    if (listRef.current) {
      const rectTop = listRef.current.getBoundingClientRect().top;
      const top = rectTop + window.scrollY - 100;
      window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
    }
  };

  // Derived filtered budgets
  const visibleBudgets = filterPeriod === 'all'
    ? budgets
    : budgets.filter(b => (b.period || '').toLowerCase() === filterPeriod);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6 relative overflow-hidden">
      <FloatingCoins />
      
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-emerald-300/30 to-teal-300/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-cyan-300/30 to-emerald-300/30 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header with sparkle effect */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl"
            >
              <PiggyBank className="text-white w-8 h-8" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
                Budget Management
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="text-emerald-500 w-6 h-6" />
                </motion.div>
              </h1>
              <p className="text-gray-600 font-medium">Create and track your spending limits</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-emerald-200/50 shadow-lg relative overflow-hidden cursor-pointer"
            onClick={() => { setFilterPeriod('all'); scrollToList(); }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Wallet className="text-white w-6 h-6" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="text-emerald-500 w-5 h-5" />
                </motion.div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Budget</p>
              <p className="text-3xl font-black text-emerald-600">₹{totalBudget.toLocaleString()}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)' }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-red-200/50 shadow-lg relative overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                  <TrendingUp className="text-white w-6 h-6" />
                </div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertCircle className="text-red-500 w-5 h-5" />
                </motion.div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Spent</p>
              <p className="text-3xl font-black text-red-600">₹{totalSpent.toLocaleString()}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(20, 184, 166, 0.3)' }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-teal-200/50 shadow-lg relative overflow-hidden cursor-pointer"
            onClick={() => { setFilterPeriod('monthly'); scrollToList(); }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <Target className="text-white w-6 h-6" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <CircleDollarSign className="text-teal-500 w-5 h-5" />
                </motion.div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Active Budgets</p>
              <p className="text-3xl font-black text-teal-600">{activeBudgets}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5, boxShadow: budgetHealthPercent >= 100 ? '0 20px 40px rgba(239, 68, 68, 0.3)' : '0 20px 40px rgba(6, 182, 212, 0.3)' }}
            className={`bg-white/70 backdrop-blur-xl rounded-2xl p-6 border shadow-lg relative overflow-hidden cursor-pointer transition-all ${
              budgetHealthPercent >= 100 ? 'border-red-200/50' : 'border-cyan-200/50'
            }`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${budgetHealthPercent >= 100 ? 'from-red-500/20' : 'from-cyan-500/20'} to-transparent rounded-full blur-2xl`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${budgetHealthPercent >= 100 ? 'from-red-500 to-pink-500' : 'from-cyan-500 to-blue-500'} flex items-center justify-center`}>
                  <TrendingDown className="text-white w-6 h-6" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {budgetHealthPercent >= 100 ? <AlertCircle className="text-red-500 w-5 h-5" /> : <CheckCircle className="text-cyan-500 w-5 h-5" />}
                </motion.div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Budget Health</p>
              <p className={`text-3xl font-black ${budgetHealthPercent >= 100 ? 'text-red-600' : 'text-cyan-600'}`}>{budgetHealthPercent}%</p>
            </div>
          </motion.div>
        </div>

      {/* Add Budget Form */}
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleAddBudget}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 mb-6 shadow-lg border border-emerald-100/50"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
          <select name="categoryId" value={newBudget.categoryId} onChange={handleBudgetChange}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-gray-50 focus:bg-white" required>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input type="number" name="limit" value={newBudget.limit} onChange={handleBudgetChange}
            placeholder="Budget Limit" className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-gray-50 focus:bg-white" required />
          <input type="date" name="date" value={formData.date}
            onChange={e => setFormData(fd => ({ ...fd, date: e.target.value }))}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100" disabled />
          <select name="period" value={newBudget.period} onChange={handleBudgetChange}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-gray-50 focus:bg-white">
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Budget
          </motion.button>
        </div>
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </motion.form>

        {/* Budget List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          id="budgets-list"
          className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border-2 border-emerald-200/50 relative overflow-hidden scroll-mt-24"
          ref={listRef}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <DollarSign className="text-white w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Your Budgets</h2>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Coins className="text-emerald-500 w-6 h-6" />
              </motion.div>
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {[
                { key: 'all', label: 'All' },
                { key: 'monthly', label: 'Monthly' },
                { key: 'weekly', label: 'Weekly' },
                { key: 'yearly', label: 'Yearly' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterPeriod(f.key)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                    filterPeriod === f.key
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
              {filterPeriod !== 'all' && (
                <button
                  onClick={() => setFilterPeriod('all')}
                  className="px-3 py-1.5 text-sm rounded-full bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {visibleBudgets.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <PiggyBank className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-gray-500 text-lg font-medium">No budgets created yet</p>
                    <p className="text-gray-400 text-sm">Create your first budget to start tracking!</p>
                  </motion.div>
                ) : (
                  visibleBudgets.map((b, idx) => {
                    const catName = getCatName(b.categoryId);
                    const spent = getSpent(b._id);
                    const health = getBudgetHealth(b._id, b.limit);
                    const budgetStatus = getBudgetStatus(b._id, b.limit);
                    const nextReset = getNextResetDate(b.period);
                    const remaining = b.limit - spent;
                    
                    const colors = [
                      { from: 'from-emerald-500', to: 'to-teal-500', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
                      { from: 'from-teal-500', to: 'to-cyan-500', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600' },
                      { from: 'from-cyan-500', to: 'to-blue-500', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600' },
                      { from: 'from-blue-500', to: 'to-indigo-500', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
                    ];
                    const colorScheme = colors[idx % colors.length];

                    return (
                      <motion.div
                        key={b._id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0 }}
                        transition={{ delay: idx * 0.05, type: 'spring' }}
                        whileHover={{ 
                          scale: 1.02, 
                          boxShadow: '0 15px 40px rgba(16, 185, 129, 0.15)',
                          x: 10
                        }}
                        className={`p-6 rounded-2xl border-2 ${budgetStatus.status === 'fully-spent' ? 'border-red-300 bg-red-50' : colorScheme.border + ' ' + colorScheme.bg} transition-all relative overflow-hidden group`}
                      >
                        {/* Animated background gradient */}
                        <motion.div
                          className={`absolute inset-0 ${budgetStatus.status === 'fully-spent' ? 'bg-gradient-to-r from-red-500 to-pink-500' : `bg-gradient-to-r ${colorScheme.from} ${colorScheme.to}`} opacity-0 group-hover:opacity-10 transition-opacity`}
                        />

                        <div className="relative flex justify-between items-start">
                          <div className="flex items-start gap-4 flex-1">
                            <motion.div
                              whileHover={{ rotate: 360, scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${budgetStatus.status === 'fully-spent' ? 'from-red-500 to-pink-500' : colorScheme.from + ' ' + colorScheme.to} flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0`}
                            >
                              {catName.charAt(0)}
                            </motion.div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-gray-800 text-lg">{catName}</p>
                                <div className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${budgetStatus.color}`}>
                                  {budgetStatus.label}
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span className="font-medium">{b.period.charAt(0).toUpperCase() + b.period.slice(1)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-xs text-gray-500">Reset: {nextReset}</span>
                                </div>
                              </div>

                              {/* Progress bar with spent indicator */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                  <span className="font-medium">Spent: ₹{spent.toLocaleString()}</span>
                                  <span className="font-bold">{Math.round(health)}%</span>
                                </div>
                                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${health}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                    className={`h-full rounded-full transition-all ${
                                      budgetStatus.status === 'fully-spent' 
                                        ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                                        : budgetStatus.status === 'warning'
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                                        : `bg-gradient-to-r ${colorScheme.from} ${colorScheme.to}`
                                    }`}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Limit: ₹{b.limit.toLocaleString()}</span>
                                  <span className={remaining < 0 ? 'text-red-600 font-semibold' : remaining < b.limit * 0.2 ? 'text-orange-600 font-semibold' : 'text-green-600'}>
                                    Remaining: ₹{remaining.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(b._id)}
                            className="p-3 text-red-500 hover:bg-red-100 rounded-xl transition-all border-2 border-transparent hover:border-red-200 flex-shrink-0"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(16, 185, 129, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #14b8a6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #0d9488);
        }
      `}</style>
    </div>
  );
}
