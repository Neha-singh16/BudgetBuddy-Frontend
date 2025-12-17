/**
 * ResponsiveSidebar.jsx - Mobile-first responsive sidebar
 * Desktop: Static left sidebar (768px+)
 * Mobile: Full-screen overlay that slides down (< 768px)
 */

import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMenu } from '../utils/menuSlice';
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaListUl,
  FaWallet,
  FaUserCircle,
} from 'react-icons/fa';

const ResponsiveSidebar = () => {
  const isMenuOpen = useSelector(s => s.menu.isMenuOpen);
  const dispatch = useDispatch();
  const location = useLocation();

  const navItems = [
    { to: '/app/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { to: '/app/budget', icon: FaListUl, label: 'Budget' },
    { to: '/app/expense', icon: FaPlusCircle, label: 'Add Expense' },
    { to: '/app/income', icon: FaWallet, label: 'Income' },
    { to: '/app/profile', icon: FaUserCircle, label: 'Profile' },
  ];

  useEffect(() => {
    // Close menu on mobile when route changes
    if (window.innerWidth < 768 && isMenuOpen) {
      dispatch(toggleMenu());
    }
  }, [location, dispatch, isMenuOpen]);

  // Block background scroll when menu is open on mobile
  useEffect(() => {
    if (window.innerWidth < 768 && isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMenuOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          style={{ top: '56px' }}
          onClick={() => dispatch(toggleMenu())}
          role="presentation"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`app-sidebar ${isMenuOpen ? 'open' : ''} ${window.innerWidth >= 768 ? 'static' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <nav className="nav-menu">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to} className="nav-item">
              <Link
                to={to}
                className={`nav-link ${isActive(to) ? 'active' : ''}`}
              >
                <span className="nav-icon">
                  <Icon />
                </span>
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default ResponsiveSidebar;
