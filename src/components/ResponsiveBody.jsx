/**
 * ResponsiveBody.jsx - Mobile-first layout wrapper
 * Handles responsive layout switching:
 * - Mobile (<768px): Header + Overlay Sidebar + Main
 * - Tablet/Desktop (≥768px): Header + Static Sidebar + Main
 */

import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, removeUser } from '../utils/userSlice';
import { USER } from '../utils/constant';
import MobileNav from './MobileNav';
import ResponsiveSidebar from './ResponsiveSidebar';
import Footer from './Footer';

const ResponsiveBody = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(s => s.user);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  // Fetch user profile on mount
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

  // Handle responsive layout changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with hamburger (mobile) */}
      <MobileNav />

      {/* Layout wrapper: Sidebar + Main */}
      <div
        className="flex flex-1 overflow-hidden"
        style={{
          display: 'flex',
          height: 'calc(100vh - 56px)',
        }}
      >
        {/* Sidebar - Static on tablet/desktop, overlay on mobile */}
        <ResponsiveSidebar />

        {/* Main content area */}
        <main className="app-main flex-1 overflow-y-auto">
          <div className="app-content">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default ResponsiveBody;
