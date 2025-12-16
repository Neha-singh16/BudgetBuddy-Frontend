

// // src/components/Sidebar.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import {
//   FaTachometerAlt,
//   FaPlusCircle,
//   FaListUl,
//   FaWallet,
//   FaUserCircle,
// } from 'react-icons/fa';

// const Sidebar = () => {
//   const isMenuOpen = useSelector((store) => store.menu.isMenuOpen);
//   if (!isMenuOpen) return null;

//   return (
//     <div
//       className="
//         sticky
//         top-16                /* 4rem down = height of your Navbar */
//         left-0
//         h-[calc(100vh-4rem)]  /* full viewport minus Navbar */
//         w-64
//         bg-[#2F4156]
//         text-[#F5EFEB]
//         z-50
//         overflow-y-auto
//         shadow-2xl
//       "
//     >
//       <div className="p-6">
//         <nav className="space-y-4">
//           <SidebarLink to="/app/dashboard" icon={<FaTachometerAlt />} label="Dashboard" />
//           <SidebarLink to="/app/budget"    icon={<FaListUl />}       label="Budget"    />
//           <SidebarLink to="/app/expense"   icon={<FaPlusCircle />}   label="Add Expense"/>
//           {/* NEW INCOME LINK */}
//           <SidebarLink to="/app/income"    icon={<FaWallet />}        label="Income"    />
//           {/* EXISTING PROFILE LINK */}
//           <SidebarLink to="/app/profile"   icon={<FaUserCircle />}   label="Profile"   />
//         </nav>
//       </div>
//     </div>
//   );
// };

// const SidebarLink = ({ to, icon, label }) => (
//   <Link to={to}>
//     <div className="flex items-center gap-3 hover:bg-[#3A536E] px-4 py-2 rounded-lg transition duration-200">
//       <span className="text-[#C8D9E6]">{icon}</span>
//       <span className="text-[#C8D9E6] font-medium">{label}</span>
//     </div>
//   </Link>
// );


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaTachometerAlt, FaPlusCircle, FaListUl, FaWallet, FaUserCircle } from 'react-icons/fa';
import { toggleMenu } from "../utils/menuSlice";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const isMenuOpen = useSelector((store) => store.menu.isMenuOpen);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = () => {
    // Only close on mobile
    if (window.innerWidth < 768 && isMenuOpen) {
      dispatch(toggleMenu());
    }
  };

  const sidebarVariants = {
    open: {
      x: 0,
      width: "16rem",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: -320,
      width: "0rem",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    show: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 300
      }
    })
  };

  const links = [
    { to: "/app/dashboard", icon: FaTachometerAlt, label: "Dashboard", color: "from-blue-500 to-cyan-500" },
    { to: "/app/budget", icon: FaListUl, label: "Budget", color: "from-emerald-500 to-teal-500" },
    { to: "/app/expense", icon: FaPlusCircle, label: "Add Expense", color: "from-orange-500 to-red-500" },
    { to: "/app/income", icon: FaWallet, label: "Income", color: "from-green-500 to-emerald-500" },
    { to: "/app/profile", icon: FaUserCircle, label: "Profile", color: "from-purple-500 to-pink-500" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleLinkClick}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        variants={sidebarVariants}
        initial={window.innerWidth >= 768 ? "open" : "closed"}
        animate={isMenuOpen ? "open" : "closed"}
        className={`
          fixed md:relative top-16 md:top-0 bottom-0 left-0 z-40 
          bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900
          text-white overflow-y-auto shadow-2xl
        `}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-teal-600/10 pointer-events-none" />
        
        <div className="relative p-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h3 className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">Navigation</h3>
            <div className="h-0.5 w-12 bg-gradient-to-r from-emerald-500 to-transparent rounded-full"></div>
          </motion.div>

          <nav className="space-y-2">
            {links.map((link, i) => (
              <SidebarLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                color={link.color}
                onClick={handleLinkClick}
                active={location.pathname.startsWith(link.to)}
                custom={i}
                variants={linkVariants}
              />
            ))}
          </nav>

          {/* Bottom decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 p-4 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-xl backdrop-blur-sm border border-emerald-500/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <FaWallet className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Your Financial</p>
                <p className="text-sm font-semibold text-emerald-400">Dashboard</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

const SidebarLink = ({ to, icon: Icon, label, color, onClick, active, custom, variants }) => (
  <Link to={to} onClick={onClick}>
    <motion.div
      custom={custom}
      variants={variants}
      initial="hidden"
      animate="show"
      whileHover={{ scale: 1.03, x: 5 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
        ${active 
          ? 'bg-gradient-to-r ' + color + ' text-white shadow-lg shadow-emerald-500/20' 
          : 'hover:bg-white/5 text-gray-300'
        }
      `}
    >
      {/* Active indicator */}
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      
      <motion.div
        animate={active ? { rotate: [0, 10, -10, 0] } : {}}
        transition={{ duration: 0.5 }}
        className={`text-xl ${active ? 'text-white' : 'text-emerald-400'}`}
      >
        <Icon />
      </motion.div>
      <span className={`font-medium ${active ? 'text-white' : 'text-gray-200'}`}>
        {label}
      </span>
      
      {/* Glow effect for active link */}
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent pointer-events-none"
        />
      )}
    </motion.div>
  </Link>
);

export default Sidebar;
