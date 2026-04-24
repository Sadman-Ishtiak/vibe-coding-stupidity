import { useState, useCallback } from 'react';
import { addBookmark, removeBookmark } from '@/services/candidates.service';
import { useAuth } from '@/context/AuthContext';

/**
 * Custom hook for managing bookmark state and actions
 * @param {string} jobId - The job ID to bookmark/unbookmark
 * @param {boolean} initialBookmarkState - Initial bookmark state from backend
 * @returns {object} Bookmark state and toggle function
 */
export const useBookmark = (jobId, initialBookmarkState = false) => {
  const { isAuth } = useAuth();
  // Ensure initialBookmarkState is explicitly boolean
  const [isBookmarked, setIsBookmarked] = useState(!!initialBookmarkState);
  const [isLoading, setIsLoading] = useState(false);

  const toggleBookmark = useCallback(async (e) => {
    // Prevent default link behavior if called from a link
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Require authentication
    if (!isAuth) {
      alert('Please log in to bookmark jobs');
      return;
    }

    if (!jobId) {
      console.error('Cannot bookmark: No job ID provided');
      return;
    }

    // Optimistic UI update
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);
    setIsLoading(true);

    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await removeBookmark(jobId);
        if (response.success) {
          // Success - state already updated optimistically
          alert('✅ Successfully removed from bookmarks');
        } else {
          // Rollback on failure
          setIsBookmarked(previousState);
          alert(response.message || '❌ Failed to remove bookmark');
        }
      } else {
        // Add bookmark
        const response = await addBookmark(jobId);
        if (response.success) {
          // Success - backend confirms bookmark added
          setIsBookmarked(true);
          // Show different message if already bookmarked vs newly added
          if (response.message === 'Job already bookmarked') {
            alert('⚠️ Job already bookmarked');
          } else {
            alert('✅ Successfully added to bookmarks');
          }
        } else {
          // Rollback on failure
          setIsBookmarked(previousState);
          alert(response.message || '❌ Failed to add bookmark');
        }
      }
    } catch (error) {
      // Rollback on error
      setIsBookmarked(previousState);
      console.error('Bookmark toggle error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update bookmark';
      alert('❌ ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [jobId, isBookmarked, isAuth]);

  return {
    isBookmarked,
    isLoading,
    toggleBookmark
  };
};
