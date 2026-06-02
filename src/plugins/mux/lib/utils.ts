import type { MuxAsset } from './types';

/**
 * Validate Mux playback ID format
 */
export function isValidPlaybackId(playbackId: string): boolean {
  // Mux playback IDs are typically 22-character alphanumeric strings
  return /^[a-zA-Z0-9]{20,24}$/.test(playbackId);
}

/**
 * Extract playback ID from Mux asset
 */
export function getPlaybackIdFromAsset(asset: MuxAsset): string | null {
  return asset.playbackId || null;
}

/**
 * Format duration from seconds to HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get aspect ratio class for Tailwind
 */
export function getAspectRatioClass(ratio?: string): string {
  const ratioMap: Record<string, string> = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '21:9': 'aspect-[21/9]',
  };

  return ratioMap[ratio || '16:9'] || 'aspect-video';
}
