# Mux Video & Audio Plugin

This plugin integrates Mux streaming platform into the AstroWind template for simplified video and audio content delivery.

## Features

- 🎥 **Video Playback** - Mux Player component with analytics
- 🎵 **Audio Playback** - Mux Audio player for podcasts
- 📦 **Content Collections** - Store Mux IDs in frontmatter
- 🔒 **Secure** - Environment variables for credentials
- ☁️ **Cloudflare Compatible** - Works in Workers environment
- 📊 **Analytics** - Automatic GA4 event tracking

## Setup

### 1. Install Dependencies

```bash
npm install @mux/mux-node @mux/mux-player @mux/mux-audio
```

These packages should already be installed if you're using this template.

### 2. Get Mux Credentials

1. Sign up at [mux.com](https://mux.com)
2. Go to Settings > Access Tokens
3. Create a new token with read permissions
4. Copy Token ID and Token Secret

### 3. Configure Environment

**Local Development (.env):**
```bash
MUX_TOKEN_ID=your-token-id
MUX_TOKEN_SECRET=your-token-secret
```

**Production (Cloudflare Secrets):**
```bash
wrangler secret put MUX_TOKEN_ID
wrangler secret put MUX_TOKEN_SECRET
```

### 4. Upload Videos to Mux

Use Mux Dashboard or API to upload videos. Get the **Playback ID** for each asset.

### 5. Add to Content

**Blog Post with Video:**
```markdown
---
title: 'My Video Post'
video:
  playbackId: 'qIJBqaJPkhNXiHbed8j2jyx02tQQWBI5fL6WkIQYL63w'
  type: 'video'
  title: 'Tutorial Video'
  aspectRatio: '16:9'
---
```

**Podcast Episode with Audio:**
```markdown
---
title: 'Episode 1'
audio:
  playbackId: 'abc123xyz'
  type: 'audio'
  title: 'Episode 1: Introduction'
---
```

## Usage

### Video Player

```astro
import MuxVideoPlayer from '~/plugins/mux/components/MuxVideoPlayer.astro';

<MuxVideoPlayer
  playbackId="your-playback-id"
  metadata={{ video_title: 'My Video' }}
  aspectRatio="16:9"
/>
```

### Audio Player

```astro
import MuxAudioPlayer from '~/plugins/mux/components/MuxAudioPlayer.astro';

<MuxAudioPlayer
  playbackId="your-playback-id"
  title="Episode 1"
  artist="Podcast Name"
/>
```

### Thumbnail

```astro
import MuxThumbnail from '~/plugins/mux/components/MuxThumbnail.astro';

<MuxThumbnail
  playbackId="your-playback-id"
  time={10}
  width={640}
  alt="Video thumbnail"
/>
```

## Analytics

Player events are automatically tracked in Google Analytics:
- `video_play` - When video starts
- `video_complete` - When video ends
- `audio_play` - When audio starts

## Content Collections Integration

The plugin adds optional Mux fields to the following collections:

### Posts (`src/content/post/`)
```yaml
video:
  playbackId: string
  type: 'video' | 'audio'
  title: string (optional)
  duration: number (optional)
  thumbnail: string (optional)
  aspectRatio: string (optional)
```

### Podcast Episodes (`src/content/podcast-episodes/`)
```yaml
audio:
  playbackId: string
  type: 'video' | 'audio'
  title: string (optional)
  duration: number (optional)
  thumbnail: string (optional)
  aspectRatio: string (optional)
```

### Campaigns (`src/content/campaigns/`)
```yaml
video:
  playbackId: string
  type: 'video' | 'audio'
  title: string (optional)
  duration: number (optional)
  thumbnail: string (optional)
  aspectRatio: string (optional)
```

## Advanced

### Custom Player Settings

Override defaults in `src/config.yaml`:

```yaml
mux:
  enabled: true
  defaultPlayerSettings:
    autoplay: true
    muted: true
    loop: false
  analytics:
    trackPlayback: true
    trackEngagement: true
```

### Server-Side Asset Retrieval

```typescript
import { getMuxClient } from '~/plugins/mux/lib/mux-client';

const mux = getMuxClient();
if (mux) {
  const asset = await mux.video.assets.retrieve('asset-id');
  console.log(asset);
}
```

### Generating Playback URLs

```typescript
import { getVideoUrl, getThumbnailUrl } from '~/plugins/mux/lib/mux-client';

const videoUrl = getVideoUrl('playback-id');
const thumbnailUrl = getThumbnailUrl('playback-id', { time: 10, width: 640 });
```

## Troubleshooting

### Player Not Loading

1. Check that Mux packages are installed:
   ```bash
   npm list @mux/mux-player @mux/mux-audio @mux/mux-node
   ```

2. Verify environment variables are set correctly

3. Check browser console for errors

### Analytics Not Tracking

1. Ensure Google Analytics is configured in `src/config.yaml`
2. Check that `window.gtag` is defined in browser console
3. Verify player events are firing (check Network tab)

### Cloudflare Workers Issues

1. Ensure environment variables are set as secrets:
   ```bash
   wrangler secret list
   ```

2. Check that @mux/mux-node is compatible with Workers runtime
   - If issues arise, the plugin can fallback to direct API calls

## Plugin Architecture

All Mux code is isolated in `src/plugins/mux/` for:
- **Modularity** - Easy to add/remove
- **Extensibility** - Template for future plugins
- **Maintainability** - Isolated from core template

## License

This plugin is part of the AstroWind template and follows the same license.
