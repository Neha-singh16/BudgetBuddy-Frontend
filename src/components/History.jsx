import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp, Calendar, Zap, Trophy, Star, Flame, Award } from 'lucide-react';
import { USER } from '../utils/constant';

const History = () => {
  const dispatch = useDispatch();
  const [archives, setArchives] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [balance, setBalance] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoryData();
  }, [filterPeriod]);

  const normalizeDateKey = (d) => {
    try {
      const dt = new Date(d);
      // use only Y-M-D so multiple archives on same day collapse
      return `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`;
    } catch {
      return String(d);
    }
  };

  const dedupeArchives = (list) => {
    const seen = new Set();
    const out = [];
    for (const a of list || []) {
      const key = [
        a.categoryId || a.categoryName || 'unknown',
        a.period || 'unknown',
        normalizeDateKey(a.archivedAt || a.date || a._id)
      ].join('|');
      if (!seen.has(key)) {
        seen.add(key);
        out.push(a);
      } else {
        // If duplicate exists, prefer the one with higher percentageUsed (more informative)
        const idx = out.findIndex(x => (
          (x.categoryId || x.categoryName) === (a.categoryId || a.categoryName) &&
          (x.period || 'unknown') === (a.period || 'unknown') &&
          normalizeDateKey(x.archivedAt || x.date || x._id) === normalizeDateKey(a.archivedAt || a.date || a._id)
        ));
        if (idx !== -1 && (a.percentageUsed ?? 0) > (out[idx].percentageUsed ?? 0)) {
          out[idx] = a;
        }
      }
    }
    // Sort newest first
    return out.sort((a, b) => new Date(b.archivedAt || b.date || 0) - new Date(a.archivedAt || a.date || 0));
  };

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const [archivesRes, perfRes, balanceRes] = await Promise.all([
        fetch(`${USER}/user/budget-history${filterPeriod !== 'all' ? `?period=${filterPeriod}` : ''}`, {
          credentials: 'include',
        }).then(r => r.json()),
        fetch(`${USER}/user/performance`, { credentials: 'include' }).then(r => r.json()),
        fetch(`${USER}/user/balance`, { credentials: 'include' }).then(r => r.json()),
      ]);

      setArchives(dedupeArchives(archivesRes || []));
      setPerformance(perfRes);
      setBalance(balanceRes);
    } catch (err) {
      console.error('History load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRewardEmoji = (underBudget, streak) => {
    if (streak >= 5) return '🔥'; // Fire: 5+ streak
    if (streak >= 3) return '⭐'; // Star: 3+ streak
    if (underBudget >= 3) return '🏆'; // Trophy: 3+ under budget
    if (underBudget >= 1) return '😊'; // Happy: at least 1 under
    return '📈'; // Chart: trying
  };

  const getPerformanceMessage = () => {
    if (!performance) return '';
    const { underBudgetCount, streak } = performance;

    if (streak >= 5) return 'Incredible! 🔥 You\'re on fire!';
    if (streak >= 3) return 'Excellent! ⭐ Keep up the great work!';
    if (underBudgetCount >= 3) return 'Great! 🏆 You\'re doing amazing!';
    if (underBudgetCount >= 1) return 'Good! 😊 Keep improving!';
    return '📈 Push harder! You\'ve got this!';
  };

  const getTotalTrends = () => {
    if (!archives || archives.length === 0) return { avgSpent: 0, avgLimit: 0, trends: [] };

    const avgSpent = Math.round(archives.reduce((sum, a) => sum + a.spent, 0) / archives.length);
    const avgLimit = Math.round(archives.reduce((sum, a) => sum + a.limit, 0) / archives.length);

    return { avgSpent, avgLimit, count: archives.length };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4 md:p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-300/30 to-blue-300/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Your Financial Journey
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Track trends, celebrate wins, and improve together 🚀</p>
        </motion.div>

        {/* Performance Rewards Card */}
        {performance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 opacity-10">
              <Trophy className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40" />
            </div>
            <div className="relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-4xl sm:text-5xl md:text-6xl">{getRewardEmoji(performance.underBudgetCount, performance.streak)}</div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{getPerformanceMessage()}</h2>
                  <p className="text-purple-100 text-sm sm:text-base">
                    {performance.streak > 0 ? `${performance.streak}-period streak! 🎯` : 'Ready to build a streak!'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-center">
                <div className="bg-white/20 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 backdrop-blur">
                  <p className="text-xs sm:text-sm opacity-80 mb-1">Under Budget</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold">{performance.underBudgetCount}</p>
                </div>
                <div className="bg-white/20 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 backdrop-blur">
                  <p className="text-xs sm:text-sm opacity-80 mb-1">At Limit</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold">{performance.atLimitCount}</p>
                </div>
                <div className="bg-white/20 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 backdrop-blur">
                  <p className="text-xs sm:text-sm opacity-80 mb-1">Over Budget</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold">{performance.overBudgetCount}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Balance Card (safe rendering) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {/* Total Income */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-green-200/50 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              <h3 className="font-bold text-gray-800 text-sm sm:text-base">Total Income</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-green-600">₹{(balance?.totalIncome ?? 0).toLocaleString()}</p>
          </div>

          {/* Total Expenses */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-red-200/50 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              <h3 className="font-bold text-gray-800 text-sm sm:text-base">Total Expenses</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-red-600">₹{(balance?.totalExpenses ?? 0).toLocaleString()}</p>
          </div>

          {/* Net Balance */}
          <div className={`bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border shadow-lg ${
            ((balance?.balance ?? 0) >= 0) ? 'border-blue-200/50' : 'border-orange-200/50'
          }`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Zap className={`w-5 h-5 sm:w-6 sm:h-6 ${((balance?.balance ?? 0) >= 0) ? 'text-blue-600' : 'text-orange-600'}`} />
              <h3 className="font-bold text-gray-800 text-sm sm:text-base">Net Balance</h3>
            </div>
            <p className={`text-2xl sm:text-3xl font-black ${((balance?.balance ?? 0) >= 0) ? 'text-blue-600' : 'text-orange-600'}`}>
              ₹{(balance?.balance ?? 0).toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-purple-200/50"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Spending History</h2>
            <div className="flex flex-wrap gap-2">
              {['all', 'weekly', 'monthly', 'yearly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPeriod(p)}
                  className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full transition-all ${
                    filterPeriod === p
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading history...</p>
            </div>
          ) : archives.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No history yet. Archive budgets to see trends!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {archives.map((archive, idx) => (
                  <motion.div
                    key={archive._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 sm:p-5 rounded-xl border-2 transition-all ${
                      archive.status === 'over'
                        ? 'border-red-200 bg-red-50'
                        : archive.status === 'at-limit'
                        ? 'border-orange-200 bg-orange-50'
                        : 'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-800">{archive.categoryName}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            archive.status === 'over'
                              ? 'bg-red-200 text-red-700'
                              : archive.status === 'at-limit'
                              ? 'bg-orange-200 text-orange-700'
                              : 'bg-green-200 text-green-700'
                          }`}>
                            {archive.status === 'over' ? '⚠️ Over' : archive.status === 'at-limit' ? '⚠️ At Limit' : '✓ Under'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {archive.period.charAt(0).toUpperCase() + archive.period.slice(1)} • {
                            new Date(archive.archivedAt).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })
                          }
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Spent vs Limit</p>
                        <p className="text-lg font-bold text-gray-800">
                          ₹{archive.spent.toLocaleString()} / ₹{archive.limit.toLocaleString()}
                        </p>
                        <div className="mt-2 w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              archive.status === 'over'
                                ? 'bg-red-500'
                                : archive.status === 'at-limit'
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(archive.percentageUsed, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{archive.percentageUsed}% used</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Trends Summary */}
        {archives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-blue-200/50"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Your Trends</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-blue-50 border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Average Spending</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{getTotalTrends().avgSpent.toLocaleString()}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-purple-50 border border-purple-200">
                <p className="text-sm text-gray-600 mb-2">Average Budget Limit</p>
                <p className="text-3xl font-bold text-purple-600">
                  ₹{getTotalTrends().avgLimit.toLocaleString()}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-200">
                <p className="text-sm text-gray-600 mb-2">Total Periods Tracked</p>
                <p className="text-3xl font-bold text-indigo-600">{getTotalTrends().count}</p>
              </div>
              <div className="p-5 rounded-xl bg-pink-50 border border-pink-200">
                <p className="text-sm text-gray-600 mb-2">Your Streak</p>
                <p className="text-3xl font-bold text-pink-600">
                  {performance?.streak || 0} 🔥
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default History;
