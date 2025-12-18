// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { PiggyBank, Wallet, Sparkles, ShieldCheck, ArrowRight, Coins, LineChart, CheckCircle2 } from "lucide-react";

// const floatingIcons = [
//   { Icon: PiggyBank, delay: 0, x: "10%", size: 52 },
//   { Icon: Coins, delay: 1.2, x: "70%", size: 44 },
//   { Icon: Wallet, delay: 2.4, x: "40%", size: 48 },
//   { Icon: LineChart, delay: 1.8, x: "85%", size: 40 },
// ];

// export default function IntroPage() {
//   const scrollToFeatures = () => {
//     const el = document.getElementById("features-section");
//     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white relative overflow-hidden">
//       {/* Ambient blobs */}
//       <motion.div
//         className="absolute -left-32 -top-32 w-96 h-96 bg-emerald-500/30 blur-3xl rounded-full"
//         animate={{ scale: [1, 1.05, 1], rotate: [0, 6, 0] }}
//         transition={{ duration: 10, repeat: Infinity }}
//       />
//       <motion.div
//         className="absolute -right-24 top-10 w-80 h-80 bg-cyan-400/20 blur-3xl rounded-full"
//         animate={{ scale: [1.05, 1, 1.05], rotate: [0, -8, 0] }}
//         transition={{ duration: 12, repeat: Infinity }}
//       />
//       <motion.div
//         className="absolute left-1/3 bottom-10 w-64 h-64 bg-green-400/15 blur-3xl rounded-full"
//         animate={{ y: [0, -10, 0], opacity: [0.5, 0.8, 0.5] }}
//         transition={{ duration: 9, repeat: Infinity }}
//       />

//       {/* Floating icons */}
//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         {floatingIcons.map(({ Icon, delay, x, size }, idx) => (
//           <motion.div
//             key={idx}
//             className="absolute text-emerald-200/30"
//             style={{ left: x, top: "-10%" }}
//             animate={{ y: ["0vh", "110vh"], rotate: [0, 360], opacity: [0, 0.7, 0] }}
//             transition={{ duration: 22, delay, repeat: Infinity, ease: "linear" }}
//           >
//             <Icon size={size * 0.7} />
//           </motion.div>
//         ))}
//       </div>

//       <div className="relative z-10 px-0 sm:px-6 md:px-10 py-8 sm:py-12 md:py-20 w-full mx-auto">
//         <div className="grid gap-8 sm:gap-10 lg:grid-cols-2 items-center">
//           {/* Hero copy */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="space-y-5 sm:space-y-6 px-4 sm:px-0"
//           >
//             <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 border border-emerald-400/30 backdrop-blur">
//               <Sparkles className="w-5 h-5 text-emerald-200 flex-shrink-0" />
//               <span className="text-sm sm:text-sm font-semibold text-emerald-50">Smarter budgets. Calmer wallets.</span>
//             </div>
//             <h1 className="text-3xl sm:text-3xl md:text-5xl lg:text-6xl font-black leading-tight">
//               Welcome to <span className="text-emerald-200">BudgetBuddy</span>
//             </h1>
//             <p className="text-base sm:text-base md:text-lg lg:text-xl text-emerald-100/90 max-w-2xl leading-relaxed">
//               Track every rupee, tame your expenses, and glide toward your goals with a calm, premium finance experience.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 pt-2">
//               <Link to="/login" className="relative w-full sm:w-auto">
//                 <motion.button
//                   whileHover={{ scale: 1.03, boxShadow: "0 20px 50px rgba(16, 185, 129, 0.35)" }}
//                   whileTap={{ scale: 0.97 }}
//                   className="w-full px-8 sm:px-6 py-4 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-900 font-bold shadow-xl flex items-center justify-center gap-3 overflow-hidden text-lg sm:text-base"
//                 >
//                   <motion.span
//                     className="absolute inset-0 bg-white/30"
//                     initial={{ x: "-100%" }}
//                     animate={{ x: "100%" }}
//                     transition={{ duration: 1.8, repeat: Infinity }}
//                   />
//                   <span className="relative">Start budgeting</span>
//                   <ArrowRight className="relative w-6 h-6 sm:w-5 sm:h-5" />
//                 </motion.button>
//               </Link>
//               <motion.button
//                 type="button"
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={scrollToFeatures}
//                 className="w-full sm:w-auto px-8 sm:px-6 py-4 sm:py-3 rounded-2xl border border-emerald-300/60 text-emerald-100 font-semibold bg-white/5 backdrop-blur flex items-center justify-center gap-3 text-lg sm:text-base"
//               >
//                 <ShieldCheck className="w-6 h-6 sm:w-5 sm:h-5" />
//                 See how it works
//               </motion.button>
//             </div>

//             <div className="grid grid-cols-3 gap-3 sm:gap-3 md:gap-4 text-sm sm:text-sm text-emerald-50/90 pt-3">
//               {[
//                 { label: "Budgets tracked", value: "12.4k" },
//                 { label: "Avg. saved /mo", value: "₹8,200" },
//                 { label: "Satisfaction", value: "98%" },
//               ].map((item, idx) => (
//                 <motion.div
//                   key={item.label}
//                   initial={{ opacity: 0, y: 12 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 * idx + 0.2 }}
//                   className="rounded-xl sm:rounded-2xl bg-white/5 border border-emerald-300/20 px-3 sm:px-3 py-3 sm:py-3 backdrop-blur text-center"
//                 >
//                   <p className="text-[10px] uppercase tracking-wide text-emerald-100/70 leading-tight">{item.label}</p>
//                   <p className="text-xl sm:text-xl font-bold text-white mt-1">{item.value}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Hero visual card */}
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.15, duration: 0.6 }}
//             className="relative px-4 sm:px-0"
//           >
//             <div className="absolute -inset-4 bg-gradient-to-br from-emerald-400/20 via-teal-400/10 to-cyan-300/15 blur-3xl rounded-3xl" />
//             <div className="relative bg-slate-950/60 border border-emerald-300/20 rounded-2xl sm:rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
//               <div className="flex items-center justify-between mb-4 sm:mb-4 gap-2">
//                 <div className="flex items-center gap-3 sm:gap-3 min-w-0">
//                   <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-slate-900 font-bold text-base sm:text-base flex-shrink-0">₹</div>
//                   <div className="min-w-0">
//                     <p className="text-sm sm:text-sm text-emerald-100/80">Monthly Outlook</p>
//                     <p className="text-base sm:text-lg font-bold text-white">Balanced & thriving</p>
//                   </div>
//                 </div>
//                 <Sparkles className="text-emerald-200 w-6 h-6 sm:w-6 sm:h-6 flex-shrink-0" />
//               </div>

//               <div className="space-y-3 sm:space-y-3">
//                 {["Housing", "Food", "Savings", "Leisure"].map((cat, idx) => {
//                   const hues = [
//                     "from-emerald-400 to-teal-400",
//                     "from-cyan-400 to-blue-400",
//                     "from-amber-300 to-orange-400",
//                     "from-pink-400 to-rose-400",
//                   ];
//                   const widths = ["75%", "62%", "88%", "54%"];
//                   return (
//                     <div key={cat} className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-3">
//                       <div className="flex justify-between text-sm text-emerald-50/80 mb-1.5">
//                         <span className="text-sm font-medium">{cat}</span>
//                         <span className="text-sm font-semibold">{widths[idx]}</span>
//                       </div>
//                       <div className="h-3 sm:h-3 rounded-xl bg-slate-800 overflow-hidden">
//                         <motion.div
//                           initial={{ width: 0 }}
//                           animate={{ width: widths[idx] }}
//                           transition={{ delay: 0.2 * idx, duration: 0.8, type: "spring", bounce: 0.1 }}
//                           className={`h-full rounded-xl bg-gradient-to-r ${hues[idx]}`}
//                         />
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-3 text-sm sm:text-sm">
//                 {[{ label: "Spent", value: "₹24,500" }, { label: "Remaining", value: "₹31,200" }].map((item, idx) => (
//                   <div key={item.label} className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 px-4 sm:px-4 py-3 sm:py-3">
//                     <p className="text-emerald-100/70 text-sm">{item.label}</p>
//                     <p className="text-xl sm:text-xl font-bold text-white">{item.value}</p>
//                     {idx === 1 && <p className="text-emerald-300 text-sm mt-1">+12% vs last month</p>}
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-4 sm:mt-4 flex items-center gap-2.5 text-sm sm:text-sm text-emerald-100/80">
//                 <ShieldCheck className="w-5 h-5 sm:w-5 sm:h-5 text-emerald-300 flex-shrink-0" />
//                 <span>Secure, privacy-first budgeting. Your data stays yours.</span>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Features section */}
//       <div id="features-section" className="relative z-10 px-0 sm:px-6 md:px-10 pb-14 sm:pb-16 md:pb-24 w-full mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.3 }}
//           transition={{ duration: 0.5 }}
//           className="text-center mb-10 sm:mb-12 md:mb-14 px-4 sm:px-0"
//         >
//           <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 border border-emerald-400/30 backdrop-blur mb-4">
//             <Sparkles className="w-5 h-5 text-emerald-200 flex-shrink-0" />
//             <span className="text-sm sm:text-sm font-semibold text-emerald-50">How BudgetBuddy guides you</span>
//           </div>
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight px-2">From chaos to calm in three steps</h2>
//           <p className="text-emerald-100/80 max-w-3xl mx-auto mt-3 sm:mt-3 text-base sm:text-base leading-relaxed px-2">
//             Plan smarter, track effortlessly, and stay protected with a finance buddy that feels premium and playful.
//           </p>
//         </motion.div>

//         <div className="grid gap-5 sm:gap-6 md:gap-8 md:grid-cols-3 px-4 sm:px-0">
//           {[{
//             title: "Set your budgets",
//             desc: "Create tailored envelopes with smart limits and instant category suggestions.",
//             icon: <PiggyBank className="w-7 h-7 sm:w-6 sm:h-6" />,
//             gradient: "from-emerald-400/20 to-teal-400/10",
//           }, {
//             title: "Track every rupee",
//             desc: "Log expenses in seconds and watch live progress bars keep you on course.",
//             icon: <LineChart className="w-7 h-7 sm:w-6 sm:h-6" />,
//             gradient: "from-cyan-400/20 to-blue-400/10",
//           }, {
//             title: "Stay secure",
//             desc: "Privacy-first, logout guards, and gentle alerts so your wallet stays yours.",
//             icon: <ShieldCheck className="w-7 h-7 sm:w-6 sm:h-6" />,
//             gradient: "from-amber-300/20 to-orange-300/10",
//           }].map((card, idx) => (
//             <motion.div
//               key={card.title}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, amount: 0.3 }}
//               transition={{ delay: 0.1 * idx, duration: 0.5 }}
//               className="relative rounded-2xl sm:rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6 shadow-xl overflow-hidden"
//             >
//               <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-70`} />
//               <div className="relative space-y-3 sm:space-y-3 text-emerald-50">
//                 <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white shadow-inner flex-shrink-0">
//                   {card.icon}
//                 </div>
//                 <h3 className="text-lg sm:text-lg md:text-xl font-bold text-white">{card.title}</h3>
//                 <p className="text-emerald-50/80 text-base sm:text-sm leading-relaxed">{card.desc}</p>
//                 <div className="flex items-center gap-2 text-emerald-100/90 text-sm sm:text-sm font-semibold">
//                   <CheckCircle2 className="w-5 h-5 text-emerald-200 flex-shrink-0" />
//                   <span>Ready in minutes</span>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PiggyBank, Wallet, Sparkles, ShieldCheck, ArrowRight, Coins, LineChart, CheckCircle2 } from "lucide-react";

const floatingIcons = [
  { Icon: PiggyBank, delay: 0, x: "10%", size: 52 },
  { Icon: Coins, delay: 1.2, x: "70%", size: 44 },
  { Icon: Wallet, delay: 2.4, x: "40%", size: 48 },
  { Icon: LineChart, delay: 1.8, x: "85%", size: 40 },
];

export default function IntroPage() {
  const scrollToFeatures = () => {
    const el = document.getElementById("features-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white relative overflow-hidden">
      {/* Ambient blobs */}
      <motion.div
        className="absolute -left-32 -top-32 w-96 h-96 bg-emerald-500/30 blur-3xl rounded-full"
        animate={{ scale: [1, 1.05, 1], rotate: [0, 6, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-24 top-10 w-80 h-80 bg-cyan-400/20 blur-3xl rounded-full"
        animate={{ scale: [1.05, 1, 1.05], rotate: [0, -8, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute left-1/3 bottom-10 w-64 h-64 bg-green-400/15 blur-3xl rounded-full"
        animate={{ y: [0, -10, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 9, repeat: Infinity }}
      />

      {/* Floating icons */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {floatingIcons.map(({ Icon, delay, x, size }, idx) => (
          <motion.div
            key={idx}
            className="absolute text-emerald-200/30"
            style={{ left: x, top: "-10%" }}
            animate={{ y: ["0vh", "110vh"], rotate: [0, 360], opacity: [0, 0.7, 0] }}
            transition={{ duration: 22, delay, repeat: Infinity, ease: "linear" }}
          >
            <Icon size={size} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 px-6 md:px-10 py-12 md:py-20 max-w-6xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Hero copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-emerald-400/30 backdrop-blur">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span className="text-sm font-semibold text-emerald-50">Smarter budgets. Calmer wallets.</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              Welcome to <span className="text-emerald-200">BudgetBuddy</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100/90 max-w-2xl">
              Track every rupee, tame your expenses, and glide toward your goals with a calm, premium finance experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="relative">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 20px 50px rgba(16, 185, 129, 0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-900 font-bold shadow-xl flex items-center gap-2 overflow-hidden"
                >
                  <motion.span
                    className="absolute inset-0 bg-white/30"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  <span className="relative">Start budgeting</span>
                  <ArrowRight className="relative w-5 h-5" />
                </motion.button>
              </Link>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToFeatures}
                className="px-6 py-3 rounded-2xl border border-emerald-300/60 text-emerald-100 font-semibold bg-white/5 backdrop-blur flex items-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                See how it works
              </motion.button>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-sm text-emerald-50/90">
              {[
                { label: "Budgets tracked", value: "12.4k" },
                { label: "Avg. saved /mo", value: "₹8,200" },
                { label: "Satisfaction", value: "98%" },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx + 0.2 }}
                  className="rounded-2xl bg-white/5 border border-emerald-300/20 px-3 py-3 backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-wide text-emerald-100/70">{item.label}</p>
                  <p className="text-xl font-bold text-white">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero visual card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-emerald-400/20 via-teal-400/10 to-cyan-300/15 blur-3xl rounded-3xl" />
            <div className="relative bg-slate-950/60 border border-emerald-300/20 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-slate-900 font-bold">₹</div>
                  <div>
                    <p className="text-sm text-emerald-100/80">Monthly Outlook</p>
                    <p className="text-lg font-bold text-white">Balanced & thriving</p>
                  </div>
                </div>
                <Sparkles className="text-emerald-200" />
              </div>

              <div className="space-y-4">
                {["Housing", "Food", "Savings", "Leisure"].map((cat, idx) => {
                  const hues = [
                    "from-emerald-400 to-teal-400",
                    "from-cyan-400 to-blue-400",
                    "from-amber-300 to-orange-400",
                    "from-pink-400 to-rose-400",
                  ];
                  const widths = ["75%", "62%", "88%", "54%"];
                  return (
                    <div key={cat} className="bg-white/5 border border-white/10 rounded-2xl p-3">
                      <div className="flex justify-between text-sm text-emerald-50/80 mb-2">
                        <span>{cat}</span>
                        <span>{widths[idx]}</span>
                      </div>
                      <div className="h-3 rounded-xl bg-slate-800 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: widths[idx] }}
                          transition={{ delay: 0.2 * idx, duration: 0.8, type: "spring", bounce: 0.1 }}
                          className={`h-full rounded-xl bg-gradient-to-r ${hues[idx]}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                {[{ label: "Spent", value: "₹24,500" }, { label: "Remaining", value: "₹31,200" }].map((item, idx) => (
                  <div key={item.label} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-emerald-100/70 text-xs">{item.label}</p>
                    <p className="text-xl font-bold text-white">{item.value}</p>
                    {idx === 1 && <p className="text-emerald-300 text-xs">+12% vs last month</p>}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3 text-sm text-emerald-100/80">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <span>Secure, privacy-first budgeting. Your data stays yours.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features section */}
      <div id="features-section" className="relative z-10 px-6 md:px-10 pb-16 md:pb-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-emerald-400/30 backdrop-blur mb-3">
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span className="text-sm font-semibold text-emerald-50">How BudgetBuddy guides you</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black">From chaos to calm in three steps</h2>
          <p className="text-emerald-100/80 max-w-3xl mx-auto mt-3">
            Plan smarter, track effortlessly, and stay protected with a finance buddy that feels premium and playful.
          </p>
        </motion.div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {[{
            title: "Set your budgets",
            desc: "Create tailored envelopes with smart limits and instant category suggestions.",
            icon: <PiggyBank className="w-6 h-6" />,
            gradient: "from-emerald-400/20 to-teal-400/10",
          }, {
            title: "Track every rupee",
            desc: "Log expenses in seconds and watch live progress bars keep you on course.",
            icon: <LineChart className="w-6 h-6" />,
            gradient: "from-cyan-400/20 to-blue-400/10",
          }, {
            title: "Stay secure",
            desc: "Privacy-first, logout guards, and gentle alerts so your wallet stays yours.",
            icon: <ShieldCheck className="w-6 h-6" />,
            gradient: "from-amber-300/20 to-orange-300/10",
          }].map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
              className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-70`} />
              <div className="relative space-y-3 text-emerald-50">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white shadow-inner">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{card.title}</h3>
                <p className="text-emerald-50/80 text-sm leading-relaxed">{card.desc}</p>
                <div className="flex items-center gap-2 text-emerald-100/90 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Ready in minutes</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
