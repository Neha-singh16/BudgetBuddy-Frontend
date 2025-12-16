


// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleMenu } from "../utils/menuSlice";
// import { removeUser } from "../utils/userSlice";
// import { USER } from "../utils/constant";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function Navbar() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const user = useSelector((s) => s.user);

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [avatarVersion, setAvatarVersion] = useState(Date.now()); // 👈 added

//   const dropdownRef = useRef(null);

//   // 🔁 Update avatar version when user changes
//   useEffect(() => {
//     if (user?._id) {
//       setAvatarVersion(Date.now()); // triggers new image load on user change
//     }
//   }, [user]);

//   const avatarUrl = user
//     ? `${USER}/user/${user._id}/avatar?ver=${avatarVersion}` // 👈 cache busting
//     : "https://i.pravatar.cc/40";

//   const onHamburgerClick = () => dispatch(toggleMenu());

//   const handleLogout = async () => {
//     try {
//       await axios.post(USER + "/logout", {}, { withCredentials: true });
//       dispatch(removeUser());
//       navigate("/login");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     const onBodyClick = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", onBodyClick);
//     return () => document.removeEventListener("mousedown", onBodyClick);
//   }, []);

//   useEffect(() => {
//     if (!dropdownOpen) return;
//     const timer = setTimeout(() => setDropdownOpen(false), 5000);
//     return () => clearTimeout(timer);
//   }, [dropdownOpen]);

//   return (
//     <nav className="h-16 bg-[#2F4156] text-white px-6 flex justify-between items-center shadow">
//       {/* ─── Left: Hamburger + Title ────────────────────────────── */}
//       <div className="flex items-center space-x-4">
//        <button
//           onClick={onHamburgerClick}
//           aria-label="Toggle sidebar"
//           className="p-2 focus:outline-none hover:bg-[#3A536E] rounded"
//         > 
      
  
 
//           <svg
//             className="w-6 h-6 text-[#F5EFEB]"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//           >
//             <path
//               d="M4 6h16M4 12h16M4 18h16"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </button>
//         <span className="text-2xl font-bold select-none">BudgetBuddy</span>
//       </div>

//       {/* ─── Right: Welcome + Avatar + Dropdown ──────────────────── */}
//       {user && (
//         <div ref={dropdownRef} className="relative flex items-center space-x-3">
//           <span className="text-sm opacity-75">Welcome, {user.firstName}</span>

//           <img
//             src={avatarUrl}
//             alt="Profile"
//             className="w-10 h-10 rounded-full border-2 border-[#C8D9E6] cursor-pointer object-cover"
//             onClick={() => setDropdownOpen((o) => !o)}
//             // onError={(e) => {
//             //   e.currentTarget.src = "https://i.pravatar.cc/40";
//             // }}
//             onError={(e) => {
//                 e.currentTarget.onerror = null; // prevent loops
//                 e.currentTarget.src = "https://cdn.pfps.gg/pfps/2301-default-2.png";
//               }}
//           />

//           <div
//             className={`absolute right-0 top-full mt-2 w-44
//               bg-[#E7EEF5] text-[#2F4156]
//               border border-[#C8D9E6] rounded-lg shadow-lg
//               transform transition-all origin-top-right
//               z-50
//               ${dropdownOpen
//                 ? "opacity-100 scale-100 pointer-events-auto"
//                 : "opacity-0 scale-95 pointer-events-none"
//               }`}
//           >
//             <ul>
//               <li>
//                 <button
//                   className="w-full text-left px-4 py-2 hover:bg-[#567C8D] hover:text-white transition"
//                   onClick={() => {
//                     setDropdownOpen(false);
//                     navigate("/app/password");
//                   }}
//                 >
//                   Change Password
//                 </button>
//               </li>
//               <li>
//                 <button
//                   className="w-full text-left px-4 py-2 hover:bg-[#567C8D] hover:text-white transition"
//                   onClick={() => {
//                     setDropdownOpen(false);
//                     handleLogout();
//                   }}
//                 >
//                   Log Out
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../utils/menuSlice";
import { removeUser } from "../utils/userSlice";
import { USER } from "../utils/constant";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, LogOut, KeyRound, ChevronDown } from "lucide-react";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.user);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(Date.now());
  const [logoutError, setLogoutError] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      setAvatarVersion(Date.now());
    }
  }, [user]);

  const avatarUrl = user
    ? `${USER}/user/${user._id}/avatar?ver=${avatarVersion}`
    : "https://i.pravatar.cc/40";

  const onHamburgerClick = () => {
    dispatch(toggleMenu());
  };

  const canLogout = () => {
    if (!user) return true;
    if (user.canLogout === false) return false;
    if (Array.isArray(user.permissions)) {
      // If permissions are defined, require explicit logout permission
      return user.permissions.includes("logout");
    }
    return true;
  };

  const handleLogout = async () => {
    if (!canLogout()) {
      setLogoutError("Logout is disabled for this account.");
      setDropdownOpen(true);
      return;
    }
    try {
      await axios.post(USER + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const onBodyClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onBodyClick);
    return () => document.removeEventListener("mousedown", onBodyClick);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const timer = setTimeout(() => setDropdownOpen(false), 5000);
    return () => clearTimeout(timer);
  }, [dropdownOpen]);

  useEffect(() => {
    if (!logoutError) return;
    const timer = setTimeout(() => setLogoutError(""), 3000);
    return () => clearTimeout(timer);
  }, [logoutError]);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="h-16 sticky top-0 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white px-4 md:px-6 flex justify-between items-center shadow-lg backdrop-blur-sm"
    >
      {/* Decorative gradient bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 opacity-50" />
      
      <div className="flex items-center space-x-4">
        {/* Hamburger with animation - Always visible */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onHamburgerClick}
          aria-label="Toggle sidebar"
          className="p-2 focus:outline-none hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
        
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Wallet className="w-6 h-6 md:w-7 md:h-7" />
          </motion.div>
          <span className="text-xl md:text-2xl font-bold select-none">
            Budget<span className="text-emerald-200">Buddy</span>
          </span>
        </motion.div>
      </div>

      {user && (
        <div ref={dropdownRef} className="relative flex items-center space-x-2 md:space-x-3">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm opacity-90 hidden sm:inline font-medium"
          >
            Welcome, <span className="text-emerald-200">{user.firstName}</span>
          </motion.span>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 cursor-pointer bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm"
            onClick={() => setDropdownOpen((o) => !o)}
          >
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-emerald-200 object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://cdn.pfps.gg/pfps/2301-default-2.png";
              }}
            />
            <motion.div
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} className="hidden sm:block" />
            </motion.div>
          </motion.div>
          
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white text-gray-800 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 text-white">
                  <p className="font-semibold">{user.firstName} {user.lastName}</p>
                  <p className="text-xs opacity-90">{user.email}</p>
                </div>
                <ul className="py-2">
                  <li>
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.1)", x: 5 }}
                      transition={{ duration: 0.2 }}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/app/password");
                      }}
                    >
                      <KeyRound size={18} className="text-emerald-600" />
                      <span className="font-medium">Change Password</span>
                    </motion.button>
                  </li>
                  <li>
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)", x: 5 }}
                      transition={{ duration: 0.2 }}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors text-red-600"
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Log Out</span>
                    </motion.button>
                  </li>
                </ul>
                {logoutError && (
                  <div className="px-4 pb-4 text-sm text-red-600 font-semibold">
                    {logoutError}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.nav>
  );
}


