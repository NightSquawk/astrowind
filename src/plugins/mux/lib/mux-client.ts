/**
 * Mux SDK wrapper for Cloudflare Workers
 *
 * This module wraps the official @mux/mux-node SDK with helper functions
 * optimized for our use case.
 */

import Mux from '@mux/mux-node';

/**
 * Get Mux client instance from environment variables
 */
export function getMuxClient(): Mux | null {
  const tokenId = import.meta.env.MUX_TOKEN_ID || import.meta.env.PUBLIC_MUX_TOKEN_ID;
  const tokenSecret = import.meta.env.MUX_TOKEN_SECRET || import.meta.env.PUBLIC_MUX_TOKEN_SECRET;

  if (!tokenId || !tokenSecret) {
    console.warn('[Mux] Credentials not found. Set MUX_TOKEN_ID and MUX_TOKEN_SECRET environment variables.');
    return null;
  }

  return new Mux({
    tokenId,
    tokenSecret,
  });
}

/**
 * Generate playback URL for video
 */
export function getVideoUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

/**
 * Generate thumbnail URL
 */
export function getThumbnailUrl(
  playbackId: string,
  options?: { time?: number; width?: number; height?: number }
): string {
  const params = new URLSearchParams();
  if (options?.time) params.set('time', options.time.toString());
  if (options?.width) params.set('width', options.width.toString());
  if (options?.height) params.set('height', options.height.toString());

  const query = params.toString();
  return `https://image.mux.com/${playbackId}/thumbnail.jpg${query ? '?' + query : ''}`;
}

/**
 * Get public playback ID from asset
 */
export async function getPlaybackIdFromAsset(assetId: string): Promise<string | null> {
  const mux = getMuxClient();
  if (!mux) return null;

  try {
    const asset = await mux.video.assets.retrieve(assetId);
    const publicPlaybackId = asset.playback_ids?.find((id) => id.policy === 'public');
    return publicPlaybackId?.id || null;
  } catch (error) {
    console.error('[Mux] Error retrieving asset:', error);
    return null;
  }
}
