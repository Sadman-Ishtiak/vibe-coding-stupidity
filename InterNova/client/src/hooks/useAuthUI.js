import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * useAuthUI Hook
 * Manages authentication-based UI visibility (auth menu vs profile menu)
 * Professional MERN pattern for UI state management based on auth
 * 
 * This hook intentionally manipulates the DOM for navbar menus to work
 * with the existing template structure without requiring a full rewrite
 */
export function useAuthUI() {
  const { isAuth, user } = useAuth();

  useEffect(() => {
    const updateAuthMenuVisibility = () => {
      const authMenu = document.getElementById('authMenu');
      const profileMenu = document.getElementById('profileMenu');

      if (!authMenu || !profileMenu) {
        // Elements not yet mounted, retry
        setTimeout(updateAuthMenuVisibility, 50);
        return;
      }

      if (isAuth && user) {
        // User is authenticated - show profile menu
        authMenu.style.setProperty('display', 'none', 'important');
        profileMenu.style.setProperty('display', 'flex', 'important');

        // Update user display name
        const userDropdown = profileMenu.querySelector('a#userdropdown');
        if (userDropdown) {
          const nameSpan = userDropdown.querySelector('span.fw-medium');
          if (nameSpan) {
            const displayName = user.username || user.name || user.email || 'User';
            nameSpan.textContent = `Hi, ${displayName}`;
          }

          // Update avatar if available
          const avatarImg = userDropdown.querySelector('img');
          const avatarSrc = user.profileImageDataUrl || user.profileImageUrl;
          if (avatarImg instanceof HTMLImageElement && avatarSrc) {
            avatarImg.src = avatarSrc;
          }
        }

        // Handle role-based menu items
        const accountType = (user.accountType || user.role || '').toLowerCase();
        const isRecruiter = accountType === 'company' || accountType === 'recruiter';

        const appliedJobsItem = profileMenu.querySelector('[data-internnova-item="applied-jobs"]');
        const bookmarkItem = profileMenu.querySelector('[data-internnova-item="bookmark-jobs"]');
        const postJobItem = profileMenu.querySelector('[data-internnova-item="post-job"]');
        
        if (appliedJobsItem instanceof HTMLElement) {
          appliedJobsItem.style.display = isRecruiter ? 'none' : '';
        }
        if (bookmarkItem instanceof HTMLElement) {
          bookmarkItem.style.display = isRecruiter ? 'none' : '';
        }
        if (postJobItem instanceof HTMLElement) {
          postJobItem.style.display = isRecruiter ? '' : 'none';
        }

        // Update profile link based on role
        const myProfileLink = profileMenu.querySelector('a[data-internnova-item="my-profile"]');
        if (myProfileLink instanceof HTMLAnchorElement) {
          const userId = user.id || user._id;
          if (isRecruiter) {
            myProfileLink.setAttribute('href', '/company-list');
          } else if (userId) {
            myProfileLink.setAttribute('href', `/candidate-details?id=${encodeURIComponent(userId)}`);
          } else {
            myProfileLink.setAttribute('href', '/candidate-profile');
          }
        }
      } else {
        // User not authenticated - show auth menu
        authMenu.style.setProperty('display', 'flex', 'important');
        profileMenu.style.setProperty('display', 'none', 'important');
      }
    };

    updateAuthMenuVisibility();
  }, [isAuth, user]);
}
