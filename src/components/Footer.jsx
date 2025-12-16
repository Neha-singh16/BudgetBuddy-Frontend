import React from "react";
import { motion } from "framer-motion";
import { Wallet, Github, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

// Minimal links and socials to keep the footer compact and elegant
const nav = [
  { label: "Dashboard", to: "/app/dashboard" },
  { label: "Budget", to: "/app/budget" },
  { label: "Expense", to: "/app/expense" },
  { label: "Profile", to: "/app/profile" },
];

const socials = [
  { Icon: Github, href: "https://github.com/Neha-singh16" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/neha-singh-2142392a1/" },
  { Icon: Instagram, href: "https://www.instagram.com/nehaa16.__/" },
];

// A slimmer, neutral footer that matches the app's emerald/teal theme
export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-r from-emerald-700 via-teal-700 to-green-700 text-emerald-50">
      {/* top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-emerald-400/60 via-teal-300/60 to-green-400/60" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 8, scale: 1.02 }}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-300 to-teal-300 flex items-center justify-center text-emerald-900 shadow-sm"
          >
            <Wallet className="w-4 h-4" />
          </motion.div>
          <span className="text-sm sm:text-base font-semibold tracking-wide">Budget<span className="text-emerald-200">Buddy</span></span>
        </div>

        {/* Nav (condensed) */}
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-emerald-50/90">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="hover:text-white transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Socials */}
        <div className="flex items-center gap-2">
          {socials.map(({ Icon, href }) => (
            <motion.a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-emerald-50 hover:text-white hover:border-emerald-200/70"
            >
              <Icon className="w-4 h-4" />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs text-emerald-50/80">
          <span>© {new Date().getFullYear()} BudgetBuddy</span>
          <div className="flex items-center gap-3">
            <a className="hover:text-white" href="#">Privacy</a>
            <span className="opacity-40">•</span>
            <a className="hover:text-white" href="#">Terms</a>
            <span className="opacity-40">•</span>
            <a className="hover:text-white" href="#">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
