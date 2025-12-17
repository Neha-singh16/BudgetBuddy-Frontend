// src/components/ExpenseTracker.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useHashScroll from "../utils/useHashScroll";
import { setExpenses } from "../utils/expenseSlice";
import { setCategories } from "../utils/categorySlice";
import { setBudgets } from "../utils/budgetSlice";
import { USER } from "../utils/constant";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CreditCard, Calendar, FileText, TrendingDown, AlertCircle, Receipt, Sparkles, Banknote, ArrowDownCircle, ShoppingBag, DollarSign } from "lucide-react";

const FloatingReceipts = () => {
  const receipts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 8,
    size: 25 + Math.random() * 25,
    rotation: Math.random() * 45 - 22.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-15">
      {receipts.map((receipt) => (
        <motion.div
          key={receipt.id}
          className="absolute"
          style={{ left: receipt.left, top: '-50px' }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [receipt.rotation, receipt.rotation + 360],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: receipt.duration,
            delay: receipt.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Receipt
            className="text-orange-500"
            style={{ width: receipt.size, height: receipt.size }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default function ExpenseTracker() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const listRef = useRef(null);
  useHashScroll(100);
  const expenses = useSelector((s) => s.expense.expenses);
  const categories = useSelector((s) => s.category.categories);
  const budgets = useSelector((s) => s.budget.budgets);

  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().substr(0, 10),
    category: "",
    budget: "",
    note: "",
  });
  const [error, setError] = useState("");
  const [overrideBudget, setOverrideBudget] = useState(false);
  const [budgetWarning, setBudgetWarning] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [cats, buds, exps] = await Promise.all([
          fetch(`${USER}/category`, { credentials: "include" }).then((r) =>
            r.json()
          ),
          fetch(`${USER}/user/budget`, { credentials: "include" }).then((r) =>
            r.json()
          ),
          fetch(`${USER}/user/expense`, { credentials: "include" }).then((r) =>
            r.json()
          ),
        ]);
        dispatch(setCategories(cats));
        dispatch(setBudgets(buds));
        dispatch(setExpenses(exps));
      } catch (e) {
        console.error("Expense load error:", e);
      }
    })();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setOverrideBudget(checked);
    } else {
      setFormData((fd) => ({ ...fd, [name]: value }));
    }
    setError("");
  };

  const getSpent = (budgetId) =>
    expenses
      .filter((e) => e.budget === budgetId)
      .reduce((sum, e) => sum + Number(e.amount), 0);

  const canAfford = () => {
    const b = budgets.find((b) => b._id === formData.budget);
    if (!b) return true;
    const remaining = b.limit - getSpent(b._id);
    const amount = Number(formData.amount);
    
    if (amount > remaining) {
      if (amount > remaining + 1000) {
        // Large overage, always warn
        setBudgetWarning({
          type: 'error',
          message: `Budget exceeded by ₹${(amount - remaining).toLocaleString()}. Only ₹${remaining.toLocaleString()} remaining.`,
          remaining
        });
        return false;
      } else if (remaining <= 0) {
        // Budget fully spent
        setBudgetWarning({
          type: 'warning',
          message: `Budget is fully spent! Adding ₹${amount.toLocaleString()} will exceed limit.`,
          remaining: 0
        });
        return !overrideBudget; // Allow if override is checked
      } else {
        // Minor overage
        setBudgetWarning({
          type: 'warning',
          message: `Amount exceeds remaining ₹${remaining.toLocaleString()}.`,
          remaining
        });
        return !overrideBudget;
      }
    }
    setBudgetWarning(null);
    return true;
  };

  const handleBudgetChange = (e) => {
    setFormData((fd) => ({ ...fd, [e.target.name]: e.target.value }));
    setError("");
    setBudgetWarning(null);
    setOverrideBudget(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canAfford()) return;

    const res = await fetch(`${USER}/user/expense`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const newExp = await res.json();
      dispatch(setExpenses([newExp, ...expenses]));
      setFormData({
        amount: "",
        date: new Date().toISOString().substr(0, 10),
        category: "",
        budget: "",
        note: "",
      });
      setOverrideBudget(false);
      setBudgetWarning(null);
    } else {
      const errObj = await res
        .json()
        .catch(async () => ({ error: await res.text() }));
      setError(errObj.error || "Add failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    const res = await fetch(`${USER}/user/expense/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      dispatch(setExpenses(expenses.filter((e) => e._id !== id)));
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const expenseCount = expenses.length;
  const avgExpense = expenseCount ? Math.round(totalExpenses / expenseCount) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-3 sm:p-4 md:p-6 relative overflow-hidden">
      <FloatingReceipts />
      
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-orange-300/30 to-red-300/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-red-300/30 to-pink-300/30 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <motion.div
              animate={{ 
                rotate: [0, -5, 5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 rounded-lg sm:rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <CreditCard className="text-white w-7 sm:w-8 md:w-10" />
            </motion.div>
            <div>
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2 sm:gap-3">
                Expense
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="text-orange-500 w-5 sm:w-6 md:w-7" />
                </motion.div>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Monitor your spending</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards - Mobile-First */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(249, 115, 22, 0.3)' }}
            className="bg-white/70 backdrop-blur-xl rounded-lg sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-orange-200/50 shadow-md sm:shadow-lg relative overflow-hidden cursor-pointer"
            onClick={() => {
              if (listRef.current) {
                const rectTop = listRef.current.getBoundingClientRect().top;
                const top = rectTop + window.scrollY - 100;
                window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
              }
            }}
          >
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-11 sm:w-12 md:w-14 h-11 sm:h-12 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                  <ArrowDownCircle className="text-white w-5 sm:w-6 md:w-7" />
                </div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingDown className="text-orange-500 w-4 sm:w-5 md:w-6" />
                </motion.div>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Total Spent</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-orange-600">₹{totalExpenses.toLocaleString()}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)' }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-red-200/50 shadow-lg relative overflow-hidden cursor-pointer"
            onClick={() => {
              if (listRef.current) {
                const rectTop = listRef.current.getBoundingClientRect().top;
                const top = rectTop + window.scrollY - 100;
                window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
              }
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                  <Receipt className="text-white w-6 h-6" />
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FileText className="text-red-500 w-5 h-5" />
                </motion.div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Expenses</p>
              <p className="text-3xl font-black text-red-600">{expenseCount}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)' }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-pink-200/50 shadow-lg relative overflow-hidden cursor-pointer"
            onClick={() => {
              if (listRef.current) {
                const rectTop = listRef.current.getBoundingClientRect().top;
                const top = rectTop + window.scrollY - 100;
                window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
              }
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <Banknote className="text-white w-6 h-6" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ShoppingBag className="text-pink-500 w-5 h-5" />
                </motion.div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Avg Expense</p>
              <p className="text-3xl font-black text-pink-600">₹{avgExpense.toLocaleString()}</p>
            </div>
          </motion.div>
        </div>

        {/* Add Expense Form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-2xl rounded-3xl p-4 md:p-6 lg:p-8 mb-8 shadow-2xl border-2 border-orange-200/50 relative overflow-hidden"
        >
          {/* Form glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-pink-500/5" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Plus className="text-white w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Add New Expense</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    placeholder="₹ Amount"
                    className="w-full pl-4 pr-10 py-4 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all bg-white hover:border-orange-300 font-medium text-gray-700"
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full pl-4 pr-10 py-4 rounded-xl border-2 border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all bg-white hover:border-red-300 font-medium text-gray-700"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <div className="relative">
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full pl-4 pr-10 py-4 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all bg-white hover:border-pink-300 font-medium text-gray-700 appearance-none"
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </motion.select>
                  <ShoppingBag className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Budget</label>
                <div className="relative">
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    className="w-full pl-4 pr-10 py-4 rounded-xl border-2 border-rose-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 outline-none transition-all bg-white hover:border-rose-300 font-medium text-gray-700 appearance-none"
                  >
                    <option value="" disabled>Select Budget</option>
                    {budgets.map((b) => {
                      const spent = getSpent(b._id);
                      const rem = b.limit - spent;
                      const name = categories.find((c) => c._id === b.categoryId)?.name || "Unnamed";
                      return (
                        <option key={b._id} value={b._id}>
                          {name} — Rem: ₹{rem}
                        </option>
                      );
                    })}
                  </motion.select>
                  <Banknote className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Note</label>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Optional note"
                    className="w-full pl-4 pr-10 py-4 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all bg-white hover:border-amber-300 font-medium text-gray-700"
                  />
                  <FileText className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(249, 115, 22, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 relative overflow-hidden group mt-7"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Add Expense</span>
              </motion.button>
            </div>

            {/* Budget Warning Section */}
            <AnimatePresence>
              {budgetWarning && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-6 p-4 rounded-xl border-2 flex items-start gap-3 ${
                    budgetWarning.type === 'error'
                      ? 'bg-red-50 border-red-300'
                      : 'bg-orange-50 border-orange-300'
                  }`}
                >
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    budgetWarning.type === 'error' ? 'text-red-600' : 'text-orange-600'
                  }`} />
                  <div className="flex-1">
                    <p className={`font-bold mb-2 ${
                      budgetWarning.type === 'error' ? 'text-red-700' : 'text-orange-700'
                    }`}>
                      {budgetWarning.message}
                    </p>
                    {budgetWarning.type === 'warning' && budgetWarning.remaining <= 0 && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={overrideBudget}
                          onChange={handleChange}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <span className="text-sm text-orange-700 font-medium">
                          I understand and want to proceed anyway
                        </span>
                      </label>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {budgets.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-medium">
                  You haven't created any budgets yet.{" "}
                  <Link to="/app/budget" className="underline font-bold hover:text-red-800">
                    Create one now
                  </Link>
                </p>
              </motion.div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
                >
                  <p className="text-red-700 font-bold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.form>

        {/* Expense List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          id="expenses-list"
          className="bg-white/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border-2 border-orange-200/50 relative overflow-hidden scroll-mt-24"
          ref={listRef}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Recent Expenses</h2>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Receipt className="text-orange-500 w-6 h-6" />
              </motion.div>
            </div>

            <div className="space-y-2 sm:space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {expenses.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Receipt className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-gray-500 text-lg font-medium">No expenses recorded yet</p>
                    <p className="text-gray-400 text-sm">Add your first expense to start tracking!</p>
                  </motion.div>
                ) : (
                  expenses.map((e, idx) => {
                    const catName = categories.find((c) => c._id === e.category)?.name || "Unknown";
                    const bud = budgets.find((b) => b._id === e.budget);
                    const budName = categories.find((c) => c._id === bud?.categoryId)?.name || "No Budget";
                    
                    const colors = [
                      { from: 'from-orange-500', to: 'to-red-500', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
                      { from: 'from-red-500', to: 'to-pink-500', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
                      { from: 'from-pink-500', to: 'to-rose-500', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600' },
                      { from: 'from-rose-500', to: 'to-orange-500', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600' },
                    ];
                    const colorScheme = colors[idx % colors.length];

                    return (
                      <motion.div
                        key={e._id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30, height: 0 }}
                        transition={{ delay: idx * 0.03, type: 'spring' }}
                        whileHover={{ 
                          scale: 1.02, 
                          boxShadow: '0 15px 40px rgba(249, 115, 22, 0.15)',
                          x: 10
                        }}
                        className={`p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 ${colorScheme.border} ${colorScheme.bg} transition-all relative overflow-hidden group`}
                      >
                        {/* Animated background gradient */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${colorScheme.from} ${colorScheme.to} opacity-0 group-hover:opacity-10 transition-opacity`}
                        />

                        <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <motion.div
                              whileHover={{ rotate: 360, scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}
                            >
                              {catName.charAt(0)}
                            </motion.div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-800 text-lg mb-1">{catName}</p>
                              <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span className="font-medium">{new Date(e.date).toLocaleDateString()}</span>
                                </div>
                                {e.note && (
                                  <div className="flex items-center gap-1">
                                    <FileText className="w-4 h-4" />
                                    <span className="font-medium">{e.note}</span>
                                  </div>
                                )}
                              </div>
                              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${colorScheme.bg} border ${colorScheme.border} font-semibold ${colorScheme.text} text-xs w-fit`}> 
                                <span>Budget: {budName}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 md:self-end">
                            <div className="text-right whitespace-nowrap">
                              <p className="text-xs text-gray-500 font-medium mb-1">Amount Spent</p>
                              <motion.p 
                                whileHover={{ scale: 1.05 }}
                                className={`text-2xl font-black ${colorScheme.text}`}
                              >
                                -₹{e.amount}
                              </motion.p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(e._id)}
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
          background: rgba(249, 115, 22, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #ef4444);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #dc2626);
        }
      `}</style>
    </div>
  );
}
