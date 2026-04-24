import { useEffect } from 'react';

/**
 * useScrollNavbar Hook
 * Adds sticky navbar behavior on scroll
 * Professional MERN pattern for handling scroll effects
 */
export function useScrollNavbar(navbarId = 'navbar', threshold = 50) {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById(navbarId);
      if (!navbar) return;

      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      
      if (scrollTop >= threshold) {
        navbar.classList.add('nav-sticky');
      } else {
        navbar.classList.remove('nav-sticky');
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check initial state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navbarId, threshold]);
}
