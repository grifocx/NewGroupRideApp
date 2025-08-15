/**
 * Filter interface for ride filtering
 */
export interface RideFilters {
  difficulty: string;
  date: string;
  location: string;
}

/**
 * Create URL search params from filters
 */
export function createFilterParams(searchQuery: string, filters: RideFilters): URLSearchParams {
  const params = new URLSearchParams();
  
  if (searchQuery) params.append("search", searchQuery);
  if (filters.difficulty) params.append("difficulty", filters.difficulty);
  if (filters.date) params.append("date", filters.date);
  if (filters.location) params.append("location", filters.location);
  
  return params;
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(searchQuery: string, filters: RideFilters): boolean {
  return !!(searchQuery || filters.difficulty || filters.date || filters.location);
}

/**
 * Clear all filters
 */
export function clearAllFilters(): RideFilters {
  return {
    difficulty: '',
    date: '',
    location: ''
  };
}

/**
 * Apply quick filter based on type and value
 */
export function applyQuickFilter(
  currentFilters: RideFilters, 
  filterType: string, 
  value?: string
): RideFilters {
  switch (filterType) {
    case 'today':
      return { ...currentFilters, date: new Date().toISOString().split('T')[0] };
    case 'difficulty':
      return { ...currentFilters, difficulty: value || '' };
    case 'nearMe':
      // For demo purposes, clear location filter when "Near Me" is clicked
      return { ...currentFilters, location: '' };
    default:
      return currentFilters;
  }
}