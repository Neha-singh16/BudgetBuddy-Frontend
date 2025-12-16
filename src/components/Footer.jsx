import React from "react";
import { motion } from "framer-motion";
import { Wallet, Github, Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Dashboard", to: "/app/dashboard" },
  { label: "Budget", to: "/app/budget" },
  { label: "Expense", to: "/app/expense" },
  { label: "Profile", to: "/app/profile" },
];

const socials = [
  { Icon: Github, href: "https://github.com/Neha-singh16", label: "GitHub" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/neha-singh-2142392a1/", label: "LinkedIn" },
  { Icon: Instagram, href: "https://www.instagram.com/nehaa16.__/", label: "Instagram" },
];

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 text-slate-100">
      {/* Decorative blurred elements */}
      <div className="absolute top-0 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top gradient accent */}
      <div className="relative h-0.5 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      {/* Main footer content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-900 shadow-lg"
            >
              <Wallet className="w-6 h-6" />
            </motion.div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300 bg-clip-text text-transparent">
                BudgetBuddy
              </h2>
              <p className="text-xs text-slate-400 font-medium tracking-widest">Smart Finance Companion</p>
            </div>
          </div>
          <p className="text-slate-300/90 text-sm md:text-base max-w-md leading-relaxed">
            Master your finances with intelligent budgeting. Track, analyze, and optimize your spending with elegance and ease.
          </p>
        </motion.div>

        {/* Grid sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Quick Nav */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-300 mb-6">Navigate</h3>
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="text-slate-300/80 hover:text-emerald-300 transition-colors duration-300 flex items-center gap-2 text-sm"
                  >
                    <span className="text-emerald-400/60">→</span>
                    {link.label}
                  </motion.div>
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Sections */}
          {footerSections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + idx * 0.05 }}
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-300 mb-6">{section.title}</h3>
              <div className="space-y-3">
                {section.links.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    whileHover={{ x: 4 }}
                    className="text-slate-300/80 hover:text-emerald-300 transition-colors duration-300 flex items-center gap-2 text-sm"
                  >
                    <span className="text-emerald-400/60">→</span>
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Connect section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-300 mb-6">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {socials.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 hover:border-emerald-300/60 hover:bg-emerald-500/30 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20"
                  title={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent mb-8" />

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400"
        >
          <div className="flex items-center gap-2">
            <span className="text-emerald-400/60">©</span>
            <span>{new Date().getFullYear()} BudgetBuddy. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-emerald-300 transition-colors">Privacy Policy</a>
            <span className="text-slate-600">|</span>
            <a href="#" className="hover:text-emerald-300 transition-colors">Terms of Service</a>
            <span className="text-slate-600">|</span>
            <a href="#" className="hover:text-emerald-300 transition-colors">Cookie Settings</a>
          </div>
        </motion.div>

        {/* Scroll to top button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ y: -2, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 z-40"
        >
          <ArrowUpRight className="w-5 h-5" />
        </motion.button>
      </div>
    </footer>
  );
}
