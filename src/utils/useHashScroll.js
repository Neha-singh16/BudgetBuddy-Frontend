import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Smoothly scrolls to the element targeted by location.hash on route changes
// Uses a fixed offset to avoid headers overlapping the section title
export default function useHashScroll(offsetPx = 96) {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const t = setTimeout(() => {
        const rectTop = el.getBoundingClientRect().top;
        const absoluteTop = rectTop + window.scrollY;
        const targetTop = Math.max(absoluteTop - offsetPx, 0);
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [location, offsetPx]);
}
