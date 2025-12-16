

// src/components/Budget.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setBudgets, addBudget, deleteBudget } from '../utils/budgetSlice';
import { setCategories } from '../utils/categorySlice';
import { USER } from '../utils/constant';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PiggyBank, Plus, Trash2, TrendingUp, Calendar, DollarSign, Coins, Target, Sparkles, Wallet, CircleDollarSign } from 'lucide-react';

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
  const dispatch = useDispatch();
  const budgets = useSelector(state => state.budget.budgets);
  const categories = useSelector(state => state.category.categories);
  const listRef = useRef(null);

  const [formData, setFormData] = useState({ amount: '', date: new Date().toISOString().substr(0, 10), category: '', budget: '', note: '' });
  const [newBudget, setNewBudget] = useState({ categoryId: '', limit: '', period: 'monthly' });
  const [error, setError] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all'); // all | monthly | weekly | yearly

  // Fetch categories & budgets
  useEffect(() => {
    (async () => {
      try {
        const [cats, buds] = await Promise.all([
          fetch(`${USER}/category`, { credentials: 'include' }).then(r => r.json()),
          fetch(`${USER}/user/budget`, { credentials: 'include' }).then(r => r.json()),
        ]);
        dispatch(setCategories(cats));
        dispatch(setBudgets(buds));
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

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.limit), 0);
  const activeBudgets = budgets.length;

  const scrollToList = () => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)' }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200/50 shadow-lg relative overflow-hidden cursor-pointer"
            onClick={() => { setFilterPeriod('yearly'); scrollToList(); }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <TrendingUp className="text-white w-6 h-6" />
                </div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <DollarSign className="text-cyan-500 w-5 h-5" />
                </motion.div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Average Budget</p>
              <p className="text-3xl font-black text-cyan-600">₹{activeBudgets ? Math.round(totalBudget / activeBudgets).toLocaleString() : 0}</p>
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
          className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border-2 border-emerald-200/50 relative overflow-hidden"
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
                        className={`p-6 rounded-2xl border-2 ${colorScheme.border} ${colorScheme.bg} transition-all relative overflow-hidden group`}
                      >
                        {/* Animated background gradient */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${colorScheme.from} ${colorScheme.to} opacity-0 group-hover:opacity-10 transition-opacity`}
                        />

                        <div className="relative flex justify-between items-center">
                          <div className="flex items-center gap-4 flex-1">
                            <motion.div
                              whileHover={{ rotate: 360, scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}
                            >
                              {catName.charAt(0)}
                            </motion.div>
                            
                            <div className="flex-1">
                              <p className="font-bold text-gray-800 text-lg mb-1">{catName}</p>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span className="font-medium">{b.period.charAt(0).toUpperCase() + b.period.slice(1)}</span>
                                </div>
                                <div className={`px-3 py-1 rounded-full ${colorScheme.bg} border ${colorScheme.border} font-semibold ${colorScheme.text} text-xs`}>
                                  Active
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                  <span className="font-medium">Budget Limit</span>
                                  <span className="font-bold">₹{b.limit.toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                    className={`h-full bg-gradient-to-r ${colorScheme.from} ${colorScheme.to} rounded-full`}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs text-gray-500 font-medium mb-1">Total Limit</p>
                              <motion.p 
                                whileHover={{ scale: 1.05 }}
                                className={`text-2xl font-black ${colorScheme.text}`}
                              >
                                ₹{b.limit.toLocaleString()}
                              </motion.p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(b._id)}
                              className="p-3 text-red-500 hover:bg-red-100 rounded-xl transition-all border-2 border-transparent hover:border-red-200"
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.button>
                          </div>
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
