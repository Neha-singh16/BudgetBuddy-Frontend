

// src/components/Budget.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setBudgets, addBudget, deleteBudget } from '../utils/budgetSlice';
import { setCategories } from '../utils/categorySlice';
import { USER } from '../utils/constant';
import { Link } from 'react-router-dom';

export default function Budget() {
  const dispatch = useDispatch();
  const budgets = useSelector(state => state.budget.budgets);
  const categories = useSelector(state => state.category.categories);

  const [formData, setFormData] = useState({ amount: '', date: new Date().toISOString().substr(0, 10), category: '', budget: '', note: '' });
  const [newBudget, setNewBudget] = useState({ categoryId: '', limit: '', period: 'monthly' });
  const [error, setError] = useState('');

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

  return (
    <div className="p-6 bg-[#F5EFEB] min-h-screen">
      <h1 className="text-3xl font-bold text-[#2F4156] mb-6">Create Your Budgets</h1>

      {/* Add Budget Form (styled like expense UI) */}
      <form onSubmit={handleAddBudget} className="bg-[#C8D9E6] p-4 mb-6 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select name="categoryId" value={newBudget.categoryId} onChange={handleBudgetChange}
            className="p-2 rounded bg-white border text-[#2F4156]" required>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input type="number" name="limit" value={newBudget.limit} onChange={handleBudgetChange}
            placeholder="Limit" className="p-2 rounded bg-white border text-[#2F4156]" required />
          <input type="date" name="date" value={formData.date}
            onChange={e => setFormData(fd => ({ ...fd, date: e.target.value }))}
            className="p-2 rounded bg-white border text-[#2F4156]" disabled />
          <select name="period" value={newBudget.period} onChange={handleBudgetChange}
            className="p-2 rounded bg-white border text-[#2F4156]">
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-[#567C8D] text-white rounded hover:bg-[#2F4156]">
            Add Budget
          </button>
        </div>
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </form>

      {/* Budget List styled like expenses */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold text-[#2F4156] mb-4">Your Budgets</h2>
        <ul className="space-y-4 max-h-80 overflow-y-auto">
          {budgets.map(b => (
            <li key={b._id} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-[#2F4156]">
                  {getCatName(b.categoryId)} ({b.period.charAt(0).toUpperCase() + b.period.slice(1)})
                </p>
                <p className="text-sm text-gray-500">Limit: ₹{b.limit}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-[#2F4156]">₹{b.limit}</span>
                <button onClick={() => handleDelete(b._id)}
                  className="text-red-500 hover:text-red-700">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
