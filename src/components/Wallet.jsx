// src/components/WalletPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIncomes, addIncome, updateIncome,  removeIncome} from '../utils/incomeSlice';
import { USER } from '../utils/constant';

export default function WalletPage() {
  const dispatch = useDispatch();
  const incomes = useSelector(state => state.income.list);
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


  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 bg-[#F5EFEB] min-h-screen">
      <h1 className="text-3xl font-bold text-[#2F4156] mb-4">Wallet / Income</h1>
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number" name="amount" value={form.amount}
            onChange={handleChange} placeholder="Amount"
            className="p-2 border rounded"
            required
          />
          <input
            type="text" name="source" value={form.source}
            onChange={handleChange} placeholder="Source"
            className="p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#567C8D] text-white rounded hover:bg-[#2F4156]"
          >
            Add Income
          </button>
        </div>
      </form>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Your Incomes</h2>
        <ul className="space-y-2">
          {incomes.map(i => (
            <li key={i._id} className="flex justify-between items-center">
              <span>{i.source}: ₹{i.amount.toLocaleString()}</span>
              <button
                onClick={() => handleDelete(i._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
