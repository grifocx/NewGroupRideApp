import { format } from "date-fns";

/**
 * Format date for display - shows "Today", "Tomorrow", or formatted date
 */
export function formatDisplayDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (dateObj.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (dateObj.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return format(dateObj, 'EEE, MMM d');
  }
}

/**
 * Format time from 24-hour to 12-hour format
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Format full date and time for detailed display
 */
export function formatFullDateTime(date: Date | string, time: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return `${format(dateObj, 'EEEE, MMMM do')} at ${formatTime(time)}`;
}

/**
 * Get today's date in YYYY-MM-DD format for date inputs
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}