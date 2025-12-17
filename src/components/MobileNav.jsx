/**
 * MobileNav.jsx - Mobile-first responsive navigation header with hamburger menu
 * Handles responsive layout switching between mobile and desktop
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu } from '../utils/menuSlice';
import { Menu, X } from 'lucide-react';

const MobileNav = () => {
  const dispatch = useDispatch();
  const isMenuOpen = useSelector(s => s.menu.isMenuOpen);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && isMenuOpen) {
        // Auto-close menu when transitioning to tablet/desktop
        dispatch(toggleMenu());
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen, dispatch]);

  const handleToggleMenu = () => {
    dispatch(toggleMenu());
  };

  return (
    <header className="app-header">
      <div className="app-header-title">Budget Buddy</div>
      
      {isMobile && (
        <button
          className="hamburger-btn"
          onClick={handleToggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <div className="hamburger-icon">
            {isMenuOpen ? (
              <>
                <span style={{ transform: 'rotate(45deg) translate(8px, 8px)' }}></span>
                <span style={{ opacity: 0 }}></span>
                <span style={{ transform: 'rotate(-45deg) translate(7px, -7px)' }}></span>
              </>
            ) : (
              <>
                <span></span>
                <span></span>
                <span></span>
              </>
            )}
          </div>
        </button>
      )}
    </header>
  );
};

export default MobileNav;
