// src/components/ExpenseTracker.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setExpenses } from "../utils/expenseSlice";
import { setCategories } from "../utils/categorySlice";
import { setBudgets } from "../utils/budgetSlice";
import { USER } from "../utils/constant";
import { X } from "lucide-react";

export default function ExpenseTracker() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    setFormData((fd) => ({ ...fd, [e.target.name]: e.target.value }));
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
    if (Number(formData.amount) > remaining) {
      setError(`Amount exceeds remaining ₹${remaining}`);
      return false;
    }
    return true;
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

  return (
    <div className="p-6 bg-[#F5EFEB] min-h-screen">
      <h1 className="text-3xl font-bold text-[#2F4156] mb-6">
        Expense Tracker
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#C8D9E6] p-4 mb-6 rounded shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Amount */}
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="Amount"
            className="p-2 rounded bg-[#F5EFEB] border text-[#2F4156]"
          />

          {/* Date */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="p-2 rounded bg-[#F5EFEB] border text-[#2F4156]"
          />

          {/* Category */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="p-2 rounded bg-[#F5EFEB] border text-[#2F4156]"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Budget */}
          <div className="col-span-1 relative">
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              className="p-2 rounded bg-[#F5EFEB] border text-[#2F4156] w-full"
            >
              <option value="" disabled>
                Select Budget
              </option>
              {budgets.map((b) => {
                const spent = getSpent(b._id);
                const rem = b.limit - spent;
                const name =
                  categories.find((c) => c._id === b.categoryId)?.name ||
                  "Unnamed";
                return (
                  <option key={b._id} value={b._id}>
                    {name} — Rem: ₹{rem}
                  </option>
                );
              })}
            </select>
            {budgets.length === 0 && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  {/* <path d="M8.257 3.099c.765-1.36..." /> */}
                </svg>
              </div>
            )}
            {/* {budgets.length === 0 && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <X className="w-5 h-5 text-red-500" />
              </div>
            )} */}
          </div>

          {/* Note */}
          <input
            type="text"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Note"
            className="p-2 rounded bg-[#F5EFEB] border text-[#2F4156]"
          />
        </div>

        {budgets.length === 0 && (
          <p className="mt-2 text-red-600 text-sm">
            You haven’t created any budgets yet.{" "}
            <Link to="/app/budget" className="underline text-[#567C8D]">
              Create one now
            </Link>
            .
          </p>
        )}

        {error && <p className="mt-2 text-red-600">{error}</p>}

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-[#567C8D] text-white rounded hover:bg-[#2F4156]"
        >
          Add Expense
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold text-[#2F4156] mb-4">
          Recent Expenses
        </h2>
        <ul className="space-y-4">
          {expenses.map((e) => {
            const catName =
              categories.find((c) => c._id === e.category)?.name || "Unknown";
            const bud = budgets.find((b) => b._id === e.budget);
            const budName =
              categories.find((c) => c._id === bud?.categoryId)?.name ||
              "No Budget";
            return (
              <li key={e._id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-[#2F4156]">
                    {catName} ({bud ? budName : "—"})
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(e.date).toLocaleDateString()} — {e.note}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#2F4156]">
                    ₹{e.amount}
                  </span>
                  <button
                    onClick={() => handleDelete(e._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}


