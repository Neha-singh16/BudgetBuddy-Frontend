import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck, Lock, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { USER } from "../utils/constant";
import { motion, AnimatePresence } from "framer-motion";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ current: "", password: "", confirm: "" });
  const [show, setShow] = useState({ current: false, password: false, confirm: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError("");
    setSuccess("");
  };

  const toggleShow = (field) => {
    setShow((s) => ({ ...s, [field]: !s[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.confirm) {
      setError("New passwords do not match");
      return;
    }
    try {
      const res = await fetch(`${USER}/profile/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword: form.current, newPassword: form.password }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Password update failed");
      }
      setSuccess("Password updated successfully");
      setForm({ current: "", password: "", confirm: "" });
      setShow({ current: false, password: false, confirm: false });
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  const fields = [
    { key: "current", label: "Current Password", accent: "from-emerald-500 to-teal-500" },
    { key: "password", label: "New Password", accent: "from-cyan-500 to-blue-500" },
    { key: "confirm", label: "Confirm New Password", accent: "from-indigo-500 to-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 relative overflow-hidden flex items-center justify-center p-4 md:p-8">
      {/* Floating accents */}
      <motion.div
        className="absolute -left-24 -top-24 w-72 h-72 bg-gradient-to-br from-emerald-300/30 to-teal-300/30 rounded-full blur-3xl"
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-28 top-10 w-80 h-80 bg-gradient-to-br from-blue-300/25 to-cyan-300/25 rounded-full blur-3xl"
        animate={{ scale: [1.05, 1, 1.05], rotate: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-2xl"
      >
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-100/60 overflow-hidden">
          <div className="relative px-6 md:px-10 py-8 border-b border-emerald-100/60 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white">
            <div className="absolute right-6 top-6 text-white/70">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shadow-inner"
              >
                <Lock className="w-6 h-6" />
              </motion.div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black">Change Password</h1>
                <p className="text-white/80 font-medium">Keep your vault secure with a fresh key</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 md:px-10 py-8 space-y-6">
            <div className="grid gap-5">
              {fields.map((f, idx) => (
                <motion.div
                  key={f.key}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx, type: "spring", stiffness: 220, damping: 20 }}
                  className="relative"
                >
                  <label className="block font-semibold text-gray-800 mb-2">{f.label}</label>
                  <div className="relative group">
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${f.accent} opacity-0 group-focus-within:opacity-100 transition-opacity`} />
                    <div className="relative rounded-2xl bg-white border-2 border-gray-100 focus-within:border-emerald-400 shadow-sm overflow-hidden">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <input
                        name={f.key}
                        type={show[f.key] ? "text" : "password"}
                        value={form[f.key]}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-12 py-4 rounded-2xl bg-transparent outline-none text-gray-800 placeholder-gray-400"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShow(f.key)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-500 transition"
                      >
                        {show[f.key] ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Use at least 8 characters with a mix of letters, numbers, and symbols.</span>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-red-200 bg-red-50 text-red-700 font-semibold"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(-1)}
                className="px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 font-semibold shadow-sm hover:shadow-md transition"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(16, 185, 129, 0.35)" }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white font-bold shadow-lg hover:shadow-xl transition relative overflow-hidden"
              >
                <motion.span
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <span className="relative">Save New Password</span>
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
