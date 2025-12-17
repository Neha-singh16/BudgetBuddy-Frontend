// import React, { useState } from "react";
// import { Eye, EyeOff, ArrowRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import axios from "axios";
// import { setUser } from "../utils/userSlice";
// import { USER } from "../utils/constant";

// export default function AuthPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
//   const [showPwd, setShowPwd] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const toggleShow = () => setShowPwd(s => !s);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isLogin && form.password !== form.confirm) {
//       setError('Passwords do not match');
//       return;
//     }
//     const endpoint = isLogin ? '/login' : '/signup';
//     const payload = isLogin
//       ? { email: form.email, password: form.password }
//       : { firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password };
//     try {
//       const res = await axios.post(USER + endpoint, payload, { withCredentials: true });
//       dispatch(setUser(res.data));
//       navigate('/app/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.error || 'An error occurred');
//     }
//   };

//   // choose image based on mode
//   const sideImageUrl = isLogin
//     ? 'https://videos.openai.com/vg-assets/assets%2Ftask_01jxms2rsteafa8fg8yeakz4xn%2F1749822935_img_1.webp?st=2025-06-21T15%3A09%3A45Z&se=2025-06-27T16%3A09%3A45Z&sks=b&skt=2025-06-21T15%3A09%3A45Z&ske=2025-06-27T16%3A09%3A45Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=mWNfXXfNd8k7rSN%2FcSvLfehGSr9fWoSxMvFmoHEgwbs%3D&az=oaivgprodscus'
//     : 'https://videos.openai.com/vg-assets/assets%2Ftask_01jxms2rsteafa8fg8yeakz4xn%2F1749822935_img_0.webp?st=2025-06-21T15%3A09%3A45Z&se=2025-06-27T16%3A09%3A45Z&sks=b&skt=2025-06-21T15%3A09%3A45Z&ske=2025-06-27T16%3A09%3A45Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=OKgvGGAKYbzfu6Xay19kM4xfjMXTiMKhqaWwEBVpIXA%3D&az=oaivgprodscus';

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F5EFEB] p-4">
//       <div className="max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
//         {/* Form Column */}
//         <div className="p-8">
//           <h2 className="text-3xl font-bold text-[#2F4156] mb-6">
//             {isLogin ? 'Welcome back' : 'Create an account'}
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {!isLogin && (
//               <div>
//                 <label className="block text-[#2F4156] mb-1">Full Name</label>
//                 <div className="flex space-x-4">
//                   <input
//                     name="firstName"
//                     value={form.firstName}
//                     onChange={handleChange}
//                     placeholder="First"
//                     required
//                     className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#567C8D]"
//                   />
//                   <input
//                     name="lastName"
//                     value={form.lastName}
//                     onChange={handleChange}
//                     placeholder="Last"
//                     required
//                     className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#567C8D]"
//                   />
//                 </div>
//               </div>
//             )}

//             <div>
//               <label className="block text-[#2F4156] mb-1">Email</label>
//               <input
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//                 required
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#567C8D]"
//               />
//             </div>

//             <div className="relative">
//               <label className="block text-[#2F4156] mb-1">Password</label>
//               <input
//                 name="password"
//                 type={showPwd ? 'text' : 'password'}
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 required
//                  autoComplete="current-password"
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#567C8D]"
//               />
//               <button type="button" onClick={toggleShow} className="absolute top-10 right-3 text-gray-500">
//                 {showPwd ? <EyeOff size={18}/> : <Eye size={18}/>}  
//               </button>
//             </div>

//             {!isLogin && (
//               <div className="relative">
//                 <label className="block text-[#2F4156] mb-1">Confirm Password</label>
//                 <input
//                   name="confirm"
//                   type={showPwd ? 'text' : 'password'}
//                   value={form.confirm}
//                   onChange={handleChange}
//                   placeholder="Confirm password"
//                   required
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#567C8D]"
//                 />
//               </div>
//             )}

//             {error && <p className="text-red-600 text-sm">{error}</p>}

//             <button
//               type="submit"
//               className="w-full flex justify-center items-center px-4 py-2 bg-[#2F4156] text-white font-semibold rounded-lg hover:bg-[#567C8D] transition"
//             >
//               {isLogin ? 'Log In' : 'Next Step'} <ArrowRight className="ml-2" />
//             </button>

//             <p className="text-center text-gray-600">
//               {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
//               <button type="button" onClick={() => { setIsLogin(l => !l); setError(''); }} className="text-[#567C8D] hover:underline">
//                 {isLogin ? 'Sign up' : 'Log in'}
//               </button>
//             </p>
//           </form>
//         </div>

//         {/* Image Column */}
//         <div className="hidden md:block">
//           <div
//             className="h-full bg-cover bg-center"
//             style={{ backgroundImage: `url('${sideImageUrl}')` }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Eye, EyeOff, DollarSign, TrendingUp, PiggyBank, Wallet, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../utils/userSlice";
import { USER } from "../utils/constant";
import { motion, AnimatePresence } from "framer-motion";

// Floating money icons component
const FloatingIcons = () => {
  const icons = [
    { Icon: DollarSign, delay: 0, x: "20%", duration: 20 },
    { Icon: Coins, delay: 2, x: "80%", duration: 25 },
    { Icon: PiggyBank, delay: 4, x: "50%", duration: 22 },
    { Icon: Wallet, delay: 1, x: "70%", duration: 18 },
    { Icon: TrendingUp, delay: 3, x: "30%", duration: 24 },
    { Icon: DollarSign, delay: 5, x: "60%", duration: 21 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, delay, x, duration }, idx) => (
        <motion.div
          key={idx}
          className="absolute text-emerald-200/20"
          style={{ left: x, top: '-10%' }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Icon size={40} />
        </motion.div>
      ))}
    </div>
  );
};

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleShow = () => setShowPwd(s => !s);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    const endpoint = isLogin ? '/login' : '/signup';
    const payload = isLogin
      ? { email: form.email, password: form.password }
      : { firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password };
    try {
      const res = await axios.post(USER + endpoint, payload, { withCredentials: true });
      dispatch(setUser(res.data));
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const toggleMode = () => {
    setIsLogin(l => !l);
    setError('');
    setForm({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900">
      {/* Animated Background */}
      <FloatingIcons />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/10 via-transparent to-teal-600/10" />
      
      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center px-3 xs:px-4 sm:px-6 md:px-6 py-4 xs:py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl lg:max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white/95 backdrop-blur-xl rounded-2xl xs:rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Left Side - Branding/Info */}
          <motion.div 
            className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 px-4 xs:px-5 sm:px-7 md:px-10 py-6 xs:py-8 sm:py-10 md:py-10 flex flex-col justify-center items-center text-white overflow-hidden"
            animate={{
              background: isLogin 
                ? "linear-gradient(to bottom right, #059669, #0d9488, #15803d)"
                : "linear-gradient(to bottom right, #10b981, #14b8a6, #22c55e)"
            }}
            transition={{ duration: 0.8 }}
          >
            {/* Decorative Elements */}
            <motion.div
              className="absolute top-6 xs:top-8 sm:top-10 right-6 xs:right-8 sm:right-10 opacity-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Coins size={70} className="xs:w-20 xs:h-20 sm:w-24 sm:h-24" />
            </motion.div>
            
            <motion.div
              className="absolute bottom-6 xs:bottom-8 sm:bottom-10 left-6 xs:left-8 sm:left-10 opacity-20"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <PiggyBank size={60} className="xs:w-16 xs:h-16 sm:w-20 sm:h-20" />
            </motion.div>

            <motion.div
              key={isLogin ? "login-brand" : "signup-brand"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-2 xs:mb-3 sm:mb-4 flex justify-center"
              >
                <div className="bg-white/20 backdrop-blur-md p-2.5 xs:p-3 sm:p-4 rounded-full">
                  <Wallet size={32} strokeWidth={1.5} className="xs:w-8 xs:h-8 sm:w-10 sm:h-10" />
                </div>
              </motion.div>
              
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mb-1 xs:mb-2 sm:mb-3 drop-shadow-lg">
                Budget<span className="text-emerald-200">Buddy</span>
              </h1>
              
              <p className="text-emerald-100 text-xs xs:text-sm sm:text-base mb-3 xs:mb-4 sm:mb-5 max-w-sm">
                {isLogin 
                  ? "Welcome back! Take control of your finances and achieve your money goals."
                  : "Start your journey to financial freedom. Track, save, and grow your wealth."}
              </p>

              <div className="flex gap-2 xs:gap-3 sm:gap-4 justify-center items-center flex-wrap">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-center"
                >
                  <div className="bg-white/20 backdrop-blur-md p-2 xs:p-2.5 sm:p-3 rounded-xl xs:rounded-2xl mb-0.5 xs:mb-1 sm:mb-2">
                    <TrendingUp size={20} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                  </div>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-emerald-100">Track Growth</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-center"
                >
                  <div className="bg-white/20 backdrop-blur-md p-2 xs:p-2.5 sm:p-3 rounded-xl xs:rounded-2xl mb-0.5 xs:mb-1 sm:mb-2">
                    <PiggyBank size={20} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                  </div>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-emerald-100">Save Smart</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-center"
                >
                  <div className="bg-white/20 backdrop-blur-md p-2 xs:p-2.5 sm:p-3 rounded-xl xs:rounded-2xl mb-0.5 xs:mb-1 sm:mb-2">
                    <DollarSign size={20} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                  </div>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-emerald-100">Earn More</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Form */}
          <div className="px-4 xs:px-5 sm:px-8 md:px-12 py-6 xs:py-8 sm:py-10 flex items-center justify-center">
            <div className="w-full max-w-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "login" : "signup"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
                    <motion.h2 
                      className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1 xs:mb-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </motion.h2>
                    <p className="text-gray-600 text-xs xs:text-sm sm:text-base">
                      {isLogin ? 'Login to manage your budget' : 'Sign up to start saving money'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-3.5 sm:space-y-5">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="block text-gray-700 font-medium mb-1.5 xs:mb-2 text-xs xs:text-sm">Full Name</label>
                        <div className="flex flex-col sm:flex-row gap-2 xs:gap-2.5 sm:gap-3">
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            onFocus={() => setFocusedInput('firstName')}
                            onBlur={() => setFocusedInput('')}
                            placeholder="First"
                            required
                            className="flex-1 px-3 xs:px-3.5 sm:px-4 py-2.5 xs:py-2.5 sm:py-3 text-sm xs:text-sm sm:text-base border-2 border-gray-200 rounded-lg xs:rounded-lg sm:rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                          />
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            onFocus={() => setFocusedInput('lastName')}
                            onBlur={() => setFocusedInput('')}
                            placeholder="Last"
                            required
                            className="flex-1 px-3 xs:px-3.5 sm:px-4 py-2.5 xs:py-2.5 sm:py-3 text-sm xs:text-sm sm:text-base border-2 border-gray-200 rounded-lg xs:rounded-lg sm:rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                          />
                        </div>
                      </motion.div>
                    )}

                    <div>
                        <label className="block text-gray-700 font-medium mb-1.5 xs:mb-2 text-xs xs:text-sm">Email Address</label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput('')}
                        placeholder="you@example.com"
                        required
                        className="w-full px-3 xs:px-3.5 sm:px-4 py-2.5 xs:py-2.5 sm:py-3 text-sm xs:text-sm sm:text-base border-2 border-gray-200 rounded-lg xs:rounded-lg sm:rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-gray-700 font-medium mb-1.5 xs:mb-2 text-xs xs:text-sm">Password</label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        name="password"
                        type={showPwd ? 'text' : 'password'}
                        value={form.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput('')}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                        className="w-full px-3 xs:px-3.5 sm:px-4 py-2.5 xs:py-2.5 sm:py-3 pr-10 xs:pr-11 sm:pr-12 text-sm xs:text-sm sm:text-base border-2 border-gray-200 rounded-lg xs:rounded-lg sm:rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={toggleShow}
                        className="absolute right-3 xs:right-3.5 sm:right-4 top-[38px] xs:top-[39px] sm:top-[42px] text-gray-500 hover:text-emerald-600 transition-colors flex-shrink-0"
                      >
                        {showPwd ? <EyeOff size={18} className="xs:w-5 xs:h-5 sm:w-5 sm:h-5" /> : <Eye size={18} className="xs:w-5 xs:h-5 sm:w-5 sm:h-5" />}
                      </motion.button>
                    </div>

                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative"
                      >
                        <label className="block text-gray-700 font-medium mb-1.5 xs:mb-2 text-xs xs:text-sm">Confirm Password</label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          name="confirm"
                          type={showPwd ? 'text' : 'password'}
                          value={form.confirm}
                          onChange={handleChange}
                          onFocus={() => setFocusedInput('confirm')}
                          onBlur={() => setFocusedInput('')}
                          placeholder="••••••••"
                          required
                          className="w-full px-3 xs:px-3.5 sm:px-4 py-2.5 xs:py-2.5 sm:py-3 text-sm xs:text-sm sm:text-base border-2 border-gray-200 rounded-lg xs:rounded-lg sm:rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                        />
                      </motion.div>
                    )}

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-red-50 border-l-4 border-red-500 p-2.5 xs:p-3 rounded text-xs xs:text-sm"
                        >
                          <p className="text-red-700 font-medium">{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-2.5 xs:py-3 px-4 sm:px-6 rounded-lg xs:rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mt-2 xs:mt-3 sm:mt-4 md:mt-6 text-sm xs:text-sm sm:text-base"
                    >
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <DollarSign size={18} className="xs:w-5 xs:h-5 sm:w-5 sm:h-5" />
                      </motion.div>
                    </motion.button>

                    <div className="relative my-3 xs:my-4 sm:my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-xs xs:text-sm">
                        <span className="px-3 bg-white text-gray-500">or</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-gray-600 text-xs xs:text-sm">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={toggleMode}
                          className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                        >
                          {isLogin ? 'Sign up free' : 'Sign in'}
                        </motion.button>
                      </p>
                    </div>
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500" />
    </div>
  );
}
