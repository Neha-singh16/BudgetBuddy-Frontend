


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

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.user);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(Date.now());
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

  const handleLogout = async () => {
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

  return (
    <nav className="h-16 sticky top-0 z-50 bg-[#2F4156] text-white px-4 md:px-6 flex justify-between items-center shadow">
      <div className="flex items-center space-x-4">
        {/* Hamburger only on mobile */}
        <button
          onClick={onHamburgerClick}
          aria-label="Toggle sidebar"
          className="p-2 focus:outline-none hover:bg-[#3A536E] rounded md:hidden"
        >
          <svg
            className="w-6 h-6 text-[#F5EFEB]"
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
        </button>
        <span className="text-xl md:text-2xl font-bold select-none">BudgetBuddy</span>
      </div>

      {user && (
        <div ref={dropdownRef} className="relative flex items-center space-x-2 md:space-x-3">
          <span className="text-sm opacity-75 hidden sm:inline">Welcome, {user.firstName}</span>
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#C8D9E6] cursor-pointer object-cover"
            onClick={() => setDropdownOpen((o) => !o)}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://cdn.pfps.gg/pfps/2301-default-2.png";
            }}
          />
          <div
            className={`
              absolute right-0 top-full mt-2 w-44
              bg-[#E7EEF5] text-[#2F4156]
              border border-[#C8D9E6] rounded-lg shadow-lg
              transform transition-all origin-top-right
              z-50
              ${dropdownOpen
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
              }
            `}
          >
            <ul>
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-[#567C8D] hover:text-white transition"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/app/password");
                  }}
                >
                  Change Password
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-[#567C8D] hover:text-white transition"
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                >
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}


