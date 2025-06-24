

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

const Sidebar = () => {
  const isMenuOpen = useSelector((store) => store.menu.isMenuOpen);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLinkClick = () => {
    if (isMenuOpen) {
      dispatch(toggleMenu());
    }
  };

  return (
    <div
      className={`
        fixed top-16 bottom-0 left-0 z-50 w-64 bg-[#2F4156] text-[#F5EFEB] overflow-y-auto shadow-2xl
        transform transition-transform duration-300
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:shadow-none
      `}
    >
      <div className="p-6">
        <nav className="space-y-4">
          <SidebarLink to="/app/dashboard" icon={<FaTachometerAlt />} label="Dashboard" onClick={handleLinkClick} active={location.pathname.startsWith('/app/dashboard')} />
          <SidebarLink to="/app/budget" icon={<FaListUl />} label="Budget" onClick={handleLinkClick} active={location.pathname.startsWith('/app/budget')} />
          <SidebarLink to="/app/expense" icon={<FaPlusCircle />} label="Add Expense" onClick={handleLinkClick} active={location.pathname.startsWith('/app/expense')} />
          <SidebarLink to="/app/income" icon={<FaWallet />} label="Income" onClick={handleLinkClick} active={location.pathname.startsWith('/app/income')} />
          <SidebarLink to="/app/profile" icon={<FaUserCircle />} label="Profile" onClick={handleLinkClick} active={location.pathname.startsWith('/app/profile')} />
        </nav>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, label, onClick, active }) => (
  <Link to={to} onClick={onClick}>
    <div className={`
      flex items-center gap-3 px-4 py-2 rounded-lg transition duration-200
      ${active ? 'bg-[#3A536E]' : 'hover:bg-[#3A536E]'}
    `}>
      <span className="text-[#C8D9E6]">{icon}</span>
      <span className="text-[#C8D9E6] font-medium">{label}</span>
    </div>
  </Link>
);

export default Sidebar;
