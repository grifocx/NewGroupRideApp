import { type Ride } from "@shared/schema";
import { formatFullDateTime } from "./dateHelpers";

/**
 * Share ride using Web Share API or fallback to clipboard
 */
export async function shareRide(ride: Ride): Promise<void> {
  const shareData = {
    title: ride.title,
    text: `Join me for "${ride.title}" on ${formatFullDateTime(ride.date, ride.startTime)}`,
    url: window.location.href,
  };

  if (navigator.share && canShare(shareData)) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      // User cancelled sharing or error occurred
      if ((error as Error)?.name !== 'AbortError') {
        await fallbackShare(shareData.url);
      }
    }
  } else {
    await fallbackShare(shareData.url);
  }
}

/**
 * Check if Web Share API can share the data
 */
function canShare(shareData: any): boolean {
  return navigator.canShare ? navigator.canShare(shareData) : true;
}

/**
 * Fallback sharing method using clipboard
 */
async function fallbackShare(url: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(url);
    // Note: In real app, this would show a toast notification
    console.log('Link copied to clipboard');
  } catch (error) {
    // Final fallback - create a temporary input element
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      console.log('Link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy link');
    }
    
    document.body.removeChild(textArea);
  }
}

/**
 * Generate share text for a ride
 */
export function generateShareText(ride: Ride): string {
  return `🚴‍♀️ Join me for "${ride.title}"!\n\n📅 ${formatFullDateTime(ride.date, ride.startTime)}\n📍 ${ride.startLocation}\n\nFind more details at: ${window.location.href}`;
}

/**
 * Check if sharing is supported
 */
export function isSharingSupported(): boolean {
  return !!(navigator.share || navigator.clipboard);
}