
// /* Body.jsx */
// import React, { useEffect } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";
// import Footer from "./Footer";
// import { useDispatch, useSelector } from "react-redux";
// import { setUser, removeUser } from '../utils/userSlice';
// import { USER } from '../utils/constant';

// const Body = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isMenuOpen = useSelector((s) => s.menu.isMenuOpen);
//   const user = useSelector(s => s.user);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch(`${USER}/profile/view`, { credentials: 'include' });
//         if (res.ok) {
//           const data = await res.json();
//           dispatch(setUser(data));
//         } else {
//           dispatch(removeUser());
//           navigate('/login', { replace: true });
//         }
//       } catch {
//         dispatch(removeUser());
//         navigate('/login', { replace: true });
//       }
//     })();
//   }, [dispatch, navigate]);

//   if (user === undefined) {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
//   }

//   return (
//     <div className="flex flex-col h-screen">
//       <Navbar />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar />
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <main className="flex-1 overflow-auto p-4 bg-gray-50">
//             <Outlet />
//           </main>
//           <Footer />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Body;


/* Body.jsx */
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { setUser, removeUser } from '../utils/userSlice';
import { USER } from '../utils/constant';

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMenuOpen = useSelector((s) => s.menu.isMenuOpen);
  const user = useSelector(s => s.user);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${USER}/profile/view`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          dispatch(setUser(data));
        } else {
          dispatch(removeUser());
          navigate('/login', { replace: true });
        }
      } catch {
        dispatch(removeUser());
        navigate('/login', { replace: true });
      }
    })();
  }, [dispatch, navigate]);

  if (user === undefined) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
          <main className="flex-1 overflow-auto bg-gray-50">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Body;
