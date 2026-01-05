import type { ImageMetadata } from 'astro';

/**
 * Mux Asset stored in content frontmatter
 */
export interface MuxAsset {
  /** Mux Asset ID (e.g., "abc123xyz") */
  assetId?: string;
  /** Mux Playback ID (public or signed) */
  playbackId: string;
  /** Asset type */
  type: 'video' | 'audio';
  /** Asset title/description */
  title?: string;
  /** Duration in seconds */
  duration?: number;
  /** Thumbnail URL or image metadata */
  thumbnail?: string | ImageMetadata;
  /** Custom aspect ratio (e.g., "16:9", "4:3") */
  aspectRatio?: string;
}

/**
 * Mux Player component props
 */
export interface MuxPlayerProps {
  /** Mux playback ID */
  playbackId: string;
  /** Player metadata for analytics */
  metadata?: {
    video_id?: string;
    video_title?: string;
    viewer_user_id?: string;
    [key: string]: any;
  };
  /** Player settings */
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  /** Custom poster image */
  poster?: string;
  /** Aspect ratio */
  aspectRatio?: string;
  /** Additional CSS classes */
  class?: string;
}

/**
 * Mux Audio Player props
 */
export interface MuxAudioPlayerProps {
  /** Mux playback ID */
  playbackId: string;
  /** Track title */
  title?: string;
  /** Artist/author */
  artist?: string;
  /** Album artwork */
  artwork?: string;
  /** Player metadata */
  metadata?: Record<string, any>;
  /** Additional CSS classes */
  class?: string;
}
