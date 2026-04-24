import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Shared hook for job filtering with URL sync and debounced search
 * Used by both JobGrid and JobList components
 */
export default function useJobFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    experience: searchParams.get('experience') || '',
    jobType: searchParams.get('jobType') || '',
    datePosted: searchParams.get('datePosted') || '',
    page: Number(searchParams.get('page')) || 1,
  });

  // Debounced keyword for API calls
  const [debouncedKeyword, setDebouncedKeyword] = useState(filters.keyword);
  const debounceTimerRef = useRef(null);

  /**
   * Debounce the keyword input (300ms delay)
   * Prevents excessive API calls while user is typing
   */
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timeout
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedKeyword(filters.keyword);
    }, 300);

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters.keyword]);

  /**
   * Sync URL params whenever filters change (except keyword which uses debounced value)
   */
  useEffect(() => {
    const params = new URLSearchParams();

    // Use debounced keyword for URL sync
    if (debouncedKeyword) params.set('keyword', debouncedKeyword);
    if (filters.location) params.set('location', filters.location);
    if (filters.category) params.set('category', filters.category);
    if (filters.experience) params.set('experience', filters.experience);
    if (filters.jobType) params.set('jobType', filters.jobType);
    if (filters.datePosted) params.set('datePosted', filters.datePosted);
    if (filters.page > 1) params.set('page', String(filters.page));

    setSearchParams(params, { replace: true });
  }, [
    debouncedKeyword,
    filters.location,
    filters.category,
    filters.experience,
    filters.jobType,
    filters.datePosted,
    filters.page,
    setSearchParams
  ]);

  /**
   * Update a specific filter
   * Automatically resets page to 1 when filters change (except page itself)
   */
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset to page 1 when any filter changes (except page change)
      ...(key !== 'page' && { page: 1 })
    }));
  }, []);

  /**
   * Update multiple filters at once
   * Resets page to 1
   */
  const updateFilters = useCallback((updates) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
      page: 1
    }));
  }, []);

  /**
   * Set page number
   */
  const setPage = useCallback((page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  }, []);

  /**
   * Reset all filters to default
   * Clears URL params and triggers data refetch
   */
  const resetFilters = useCallback(() => {
    setFilters({
      keyword: '',
      location: '',
      category: '',
      experience: '',
      jobType: '',
      datePosted: '',
      page: 1
    });
    setDebouncedKeyword('');
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  /**
   * Get filters for API call
   * Uses debounced keyword for the actual API request
   */
  const getApiFilters = useCallback(() => {
    const apiFilters = {};

    if (debouncedKeyword) apiFilters.keyword = debouncedKeyword;
    if (filters.location) apiFilters.location = filters.location;
    if (filters.category) apiFilters.category = filters.category;
    if (filters.experience) apiFilters.experience = filters.experience;
    if (filters.jobType) apiFilters.jobType = filters.jobType;
    if (filters.datePosted) apiFilters.datePosted = filters.datePosted;
    apiFilters.page = filters.page;

    return apiFilters;
  }, [
    debouncedKeyword,
    filters.location,
    filters.category,
    filters.experience,
    filters.jobType,
    filters.datePosted,
    filters.page
  ]);

  return {
    filters,
    debouncedKeyword,
    updateFilter,
    updateFilters,
    setPage,
    resetFilters,
    getApiFilters
  };
}
