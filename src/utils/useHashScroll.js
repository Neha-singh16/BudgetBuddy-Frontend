import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Smoothly scrolls to the element targeted by location.hash on route changes
export default function useHashScroll() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      // Use a small timeout to ensure layout is ready
      const t = setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [location]);
}
