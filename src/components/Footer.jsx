import React from "react";
import { motion } from "framer-motion";
import { Wallet, Sparkles, Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const links = [
  { label: "Dashboard", to: "/app/dashboard" },
  { label: "Budgets", to: "/app/budget" },
  { label: "Expenses", to: "/app/expense" },
  { label: "Profile", to: "/app/profile" },
];

const socials = [
  { Icon: Github, href: "https://github.com/" },
  { Icon: Twitter, href: "https://twitter.com/" },
  { Icon: Linkedin, href: "https://www.linkedin.com/" },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-emerald-50 border-t border-white/10">
      {/* Glow accents */}
      <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute right-10 -bottom-24 w-72 h-72 rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 md:px-10 py-10 md:py-12 grid gap-10 md:gap-12 md:grid-cols-4 items-start">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="inline-flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg"
            >
              <Wallet className="w-6 h-6" />
            </motion.div>
            <div>
              <p className="text-sm text-emerald-100/80">Premium finance</p>
              <p className="text-xl font-black">BudgetBuddy</p>
            </div>
          </div>
          <p className="text-emerald-100/80 leading-relaxed max-w-sm">
            Calm, animated budgeting that keeps every rupee accountable and your data secure.
          </p>
          <div className="flex items-center gap-2 text-emerald-100/80 text-sm">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Built for focus and clarity.</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-emerald-200">Navigate</h4>
          <div className="grid grid-cols-2 gap-3 text-emerald-100/80 text-sm">
            {links.map((link, idx) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
              >
                <Link
                  to={link.to}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-emerald-200">Get in touch</h4>
          <div className="space-y-3 text-sm text-emerald-100/80">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-emerald-300" />
              <span>hello@budgetbuddy.app</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-emerald-300" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>Mumbai, India</span>
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-emerald-200">Connect</h4>
          <div className="flex items-center gap-3">
            {socials.map(({ Icon, href }, idx) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-emerald-50 hover:text-white hover:border-emerald-200/60"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-slate-950/60">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-emerald-100/70">
          <span>© {new Date().getFullYear()} BudgetBuddy. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
