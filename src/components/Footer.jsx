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
      <div className="absolute top-0 -left-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top gradient accent */}
      <div className="relative h-0.5 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      {/* Main footer content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Header section - compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-900 shadow-sm"
            >
              <Wallet className="w-5 h-5" />
            </motion.div>
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              BudgetBuddy
            </h2>
          </div>
          <p className="text-slate-400 text-xs md:text-sm max-w-lg leading-relaxed pl-11">
            Smart budgeting, intelligent spending. Master your finances with elegance.
          </p>
        </motion.div>

        {/* Grid sections - compact */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 mb-6">
          {/* Quick Nav */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h3 className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-emerald-300 mb-3">Navigate</h3>
            <nav className="space-y-1.5 flex flex-col">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="w-fit">
                  <motion.div
                    whileHover={{ x: 2 }}
                    className="text-slate-300/80 hover:text-emerald-300 transition-colors duration-300 text-[11px] md:text-xs block whitespace-nowrap"
                  >
                    {link.label}
                  </motion.div>
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Sections - compact */}
          {footerSections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 + idx * 0.03 }}
            >
              <h3 className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-emerald-300 mb-3">{section.title}</h3>
              <div className="space-y-1.5 flex flex-col">
                {section.links.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    whileHover={{ x: 2 }}
                    className="text-slate-300/80 hover:text-emerald-300 transition-colors duration-300 text-[11px] md:text-xs block whitespace-nowrap w-fit"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Connect section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-emerald-300 mb-3">Connect</h3>
            <div className="flex gap-2">
              {socials.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -2, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 rounded-md bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 hover:border-emerald-300/60 hover:bg-emerald-500/30 transition-all duration-300 shadow-sm hover:shadow-emerald-500/15"
                  title={label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-600/40 to-transparent mb-4" />

        {/* Bottom bar - compact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] md:text-xs text-slate-400"
        >
          <span>© {new Date().getFullYear()} BudgetBuddy. All rights reserved.</span>
          <div className="flex items-center gap-2 md:gap-3">
            <a href="#" className="hover:text-emerald-300 transition-colors">Privacy</a>
            <span className="text-slate-600">•</span>
            <a href="#" className="hover:text-emerald-300 transition-colors">Terms</a>
            <span className="text-slate-600">•</span>
            <a href="#" className="hover:text-emerald-300 transition-colors">Cookies</a>
          </div>
        </motion.div>

        {/* Scroll to top button - smaller */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ y: -1, scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 z-40 md:w-11 md:h-11"
        >
          <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
      </div>
    </footer>
  );
}
