// src/components/WalletPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIncomes, addIncome, updateIncome,  removeIncome} from '../utils/incomeSlice';
import { USER } from '../utils/constant';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Plus, Trash2, TrendingUp, DollarSign, Briefcase } from 'lucide-react';
import useHashScroll from '../utils/useHashScroll';

export default function WalletPage() {
  const dispatch = useDispatch();
  const incomes = useSelector(state => state.income.list);
  const listRef = useRef(null);
  useHashScroll();
  const [form, setForm] = useState({ amount: '', source: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch existing incomes
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${USER}/user/income`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load incomes');
        const data = await res.json();
        dispatch(setIncomes(data));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${USER}/user/income`, {
        method: 'POST', credentials: 'include', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ amount: Number(form.amount), source: form.source })
      });
      if (!res.ok) throw new Error('Add income failed');
      const newIncome = await res.json();
      dispatch(addIncome(newIncome));
      setForm({ amount: '', source: '' });
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this income?')) return;
    try {
      const res = await fetch(`${USER}/user/income/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
      dispatch(removeIncome(id));
    } catch (e) {
      alert(e.message);
    }
  };

  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-emerald-50/20 p-6 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-emerald-50/20 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <Wallet className="text-green-600" />
          Income & Wallet
        </h1>
        <p className="text-gray-600">Manage your income sources</p>
      </motion.div>

      {/* Total Income Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 mb-6 shadow-2xl text-white relative overflow-hidden cursor-pointer"
        onClick={() => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
        
        <div className="relative z-10">
          <p className="text-emerald-100 text-lg mb-2">Total Monthly Income</p>
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            ₹{totalIncome.toLocaleString()}
          </motion.p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-emerald-100">From {incomes.length} source{incomes.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </motion.div>

      {/* Add Income Form */}
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 mb-6 shadow-lg border border-green-100/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="₹ Enter amount"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
            <input
              type="text"
              name="source"
              value={form.source}
              onChange={handleChange}
              placeholder="e.g., Salary, Freelance"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="md:mt-7 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Income
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
            >
              <p className="text-red-700 font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      {/* Income List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        id="income-list"
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-green-100/50"
        ref={listRef}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Your Income Sources
        </h2>
        <div className="space-y-3">
          <AnimatePresence>
            {incomes.map((i, idx) => (
              <motion.div
                key={i._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ x: 5, backgroundColor: 'rgba(22, 163, 74, 0.05)' }}
                className="flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:border-green-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{i.source}</p>
                    <p className="text-sm text-gray-500">Monthly income</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">₹{i.amount.toLocaleString()}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(i._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {incomes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400">No income sources added yet</p>
              <p className="text-sm text-gray-400 mt-1">Add your first income source above</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
