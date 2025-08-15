/**
 * Get CSS class for difficulty badge color
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'bg-cycle-green';
    case 'intermediate': return 'bg-cycle-orange';
    case 'advanced': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}

/**
 * Get difficulty label for display
 */
export function getDifficultyLabel(difficulty: string): string {
  return difficulty.toUpperCase();
}

/**
 * Get map marker color for ride difficulty
 */
export function getMarkerColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return '#16A34A';
    case 'intermediate': return '#F97316';
    case 'advanced': return '#EF4444';
    default: return '#6B7280';
  }
}

/**
 * Format distance and duration for display
 */
export function formatRideDetails(distance?: string | null, duration?: string | null): string {
  const parts: string[] = [];
  
  if (distance) {
    parts.push(`${distance} miles`);
  } else {
    parts.push('Distance TBD');
  }
  
  if (duration) {
    parts.push(`${duration} hours`);
  }
  
  return parts.join(' • ');
}

/**
 * Format participant count for display
 */
export function formatParticipantCount(count: number | null | undefined): string {
  const participantCount = count || 0;
  return `+${participantCount} joined`;
}

/**
 * Check if ride has spots available
 */
export function hasAvailableSpots(participantCount: number | null | undefined, maxParticipants: number | null | undefined): boolean {
  if (!maxParticipants) return true;
  const currentCount = participantCount || 0;
  return currentCount < maxParticipants;
}

/**
 * Get remaining spots count
 */
export function getRemainingSpots(participantCount: number | null | undefined, maxParticipants: number | null | undefined): number | null {
  if (!maxParticipants) return null;
  const currentCount = participantCount || 0;
  return Math.max(0, maxParticipants - currentCount);
}