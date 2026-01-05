# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **AstroWind**, a multi-client template system built with Astro 5.0 and Tailwind CSS. It's designed as a reusable base template that can be customized for different clients through configuration rather than code changes. The project includes a sophisticated theme system, content collections for blogs/podcasts/campaigns/coupons, redirect middleware with analytics tracking, and Cloudflare Workers deployment support.

## Development Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server at localhost:4321
npm run start           # Alias for dev

# Building & Preview
npm run build           # Build production site to ./dist/
npm run preview         # Preview production build locally

# Code Quality
npm run check           # Run all checks (Astro, ESLint, Prettier)
npm run check:astro     # Check Astro files only
npm run check:eslint    # Run ESLint only
npm run check:prettier  # Check Prettier formatting only
npm run fix             # Auto-fix ESLint and Prettier issues
npm run fix:eslint      # Auto-fix ESLint only
npm run fix:prettier    # Auto-fix Prettier only

# Cloudflare Deployment
npm run deploy          # Build and deploy to Cloudflare Workers
npm run cf-typegen      # Generate Cloudflare types from wrangler.json
```

## High-Level Architecture

### Configuration System

The project uses a custom Astro integration (`vendor/integration/index.ts`) that:
1. Loads `src/config.yaml` at build time
2. Transforms it via `configBuilder` into typed configuration objects
3. Exposes configuration as a virtual module `astrowind:config` that can be imported anywhere
4. Automatically updates `robots.txt` with sitemap URL after build

**Key insight:** All site configuration flows through this integration. Components import config via:
```ts
import { SITE, THEME, METADATA, APP_BLOG, UI, ANALYTICS, I18N } from 'astrowind:config';
```

### Theme System

Located in `src/config.yaml` under the `theme` key. The theme defines:
- Colors (primary, secondary, accent, text, background) with separate light/dark mode values
- Fonts (sans, serif, heading)
- Text selection colors for light/dark modes

**Implementation:** `src/components/CustomStyles.astro` reads theme config and generates CSS custom properties:
- `--aw-color-primary`, `--aw-color-secondary`, `--aw-color-accent`
- `--aw-color-text-heading`, `--aw-color-text-default`, `--aw-color-text-muted`
- `--aw-color-bg-page`, `--aw-font-sans`, `--aw-font-heading`

All components use these CSS variables, never hardcoded colors. This allows complete retheming via config changes only.

### Content Collections

Defined in `src/content/config.ts` using Astro's content layer with loaders:

1. **post** - Blog posts (markdown/MDX in `src/data/post/`)
   - Supports categories, tags, authors, publishing dates
   - Used by blog pages at `/blog`, `/category`, `/tag`

2. **podcast-episodes** - Podcast episodes with streaming links
   - Rich metadata including event info, streaming platform URLs
   - Supports episode navigation (next/previous)

3. **campaigns** - Marketing campaigns with UTM tracking
   - Can have associated coupons
   - Supports short URLs for redirect system

4. **coupons** - Promotional coupons/offers
   - Multiple discount types (percent, fixed, bogo, free)
   - Timezone-aware expiration dates
   - Can define multiple campaign links with different UTM parameters

### Redirect & Analytics System

**Middleware** (`src/middleware.ts`):
- Intercepts ALL requests before page rendering
- Checks promo redirects (from campaigns/coupons with `shortUrl` field) first
- Falls back to static redirects (`src/data/redirects.ts`)
- Routes through `/redirect` interstitial page for analytics tracking

**Redirect Flow:**
1. User hits short URL (e.g., `/go`)
2. Middleware finds redirect config
3. Redirects to `/redirect?source=/go&dest=/contact&type=temporary&...` (307)
4. Interstitial page (`src/pages/redirect.astro`) tracks event via GA4/Datadog
5. Client-side JS (`src/scripts/redirect-analytics.ts`) fires analytics then redirects

**Key features:**
- Preserves query parameters from original request
- Hardcoded UTM parameters in redirect config (merged with user-provided params)
- Category-based grouping for analytics
- Supports both temporary (307) and permanent (308) redirects

### Client Override System

The template supports a `src/client/` directory for client-specific customizations:
- `src/client/components/` - Override base components with same path
- `src/client/pages/` - Custom pages
- `src/client/styles/` - Custom CSS
- `src/client/assets/` - Client-specific images

**Resolution order:** Client components are imported first via path alias `~` which resolves to `./src`.

### Component Architecture

Components are organized into:
- **UI components** (`src/components/ui/`) - Buttons, Headlines, Forms
- **Widgets** (`src/components/widgets/`) - Full page sections (Hero, Features, CallToAction, etc.)
- **Common** (`src/components/common/`) - Shared utilities (Image, Metadata)
- **Blog** (`src/components/blog/`) - Blog-specific components
- **Podcast** (`src/components/podcast/`) - Podcast player and episode display
- **Promo** (`src/components/promo/`) - Campaign and coupon display components
- **Tracking** (`src/components/tracking/`) - Analytics integration components

All components accept a `class` prop for Tailwind customization and use theme CSS variables.

### New Widget Components

The template includes several advanced widgets built with Swiper.js and Google Maps:

#### 1. HeroCarousel Widget
**Location:** `src/components/widgets/HeroCarousel.astro`

Multi-slide hero carousel with auto-advance, navigation, and CTAs.

**Features:**
- Multiple slides with independent content (title, subtitle, CTAs)
- Auto-advance with configurable interval (default: 5s)
- Manual navigation (arrows and pagination dots)
- Keyboard navigation and pause on hover
- Background images with overlay opacity control
- Full analytics tracking (slide changes, CTA clicks)

**Usage:**
```astro
<HeroCarousel
  slides={[
    {
      title: 'Welcome to Our Practice',
      subtitle: 'Expert Care Since 1995',
      backgroundImage: import('~/assets/images/hero-1.jpg'),
      primaryCTA: { text: 'Book Appointment', href: '/contact' },
      overlayOpacity: 60
    },
    // ... more slides
  ]}
  autoAdvance={true}
  interval={5000}
/>
```

#### 2. PhotoCarousel Widget
**Location:** `src/components/widgets/PhotoCarousel.astro`

Responsive gallery with lightbox and thumbnail navigation.

**Features:**
- Responsive grid or carousel layout
- Full-screen lightbox with zoom
- Touch gestures and swipe support
- Thumbnail navigation
- Image captions
- Lazy loading and optimization

**Usage:**
```astro
<PhotoCarousel
  title="Our Facility"
  images={[
    { src: import('~/assets/images/office-1.jpg'), alt: 'Reception area', caption: 'Modern reception' },
    { src: import('~/assets/images/office-2.jpg'), alt: 'Treatment room' },
  ]}
  columns={4}
  lightboxEnabled={true}
/>
```

#### 3. GoogleMap Widget
**Location:** `src/components/widgets/GoogleMap.astro`

Interactive Google Maps with place search and geocoding.

**Features:**
- Place search by business name (Places API)
- Address geocoding fallback
- Direct coordinates fallback
- Custom markers and info windows
- Responsive container
- Graceful fallback when API key missing

**Setup:**
1. Get API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Set `PUBLIC_GOOGLE_MAPS_API_KEY` in `.env`

**Usage:**
```astro
<GoogleMap
  placeName="Dr. Brock Johnson Chiropractic"
  address="123 Main St, Anytown, USA"
  coordinates={{ lat: 37.7749, lng: -122.4194 }}
  zoom={16}
  height="500px"
/>
```

#### 4. Sidebar Navigation Widget
**Location:** `src/components/widgets/Sidebar.astro`

Vertical navigation sidebar with active state detection.

**Features:**
- Grouped sections with titles
- Active link highlighting (matches current URL)
- Icon support (Tabler icons)
- Sticky positioning on desktop
- Collapsible on mobile
- Optional CTA section at bottom

**Usage:**
```astro
<Sidebar
  sections={[
    {
      title: 'Our Services',
      links: [
        { text: 'Chiropractic Care', href: '/services/chiropractic', icon: 'tabler:heart-handshake' },
        { text: 'Physical Therapy', href: '/services/physical-therapy', icon: 'tabler:physotherapist' },
      ]
    }
  ]}
  callToAction={{
    title: 'Need Help?',
    content: 'Schedule a free consultation',
    button: { text: 'Book Now', href: '/contact' }
  }}
/>
```

### Analytics Integration

Multiple analytics platforms supported:
- **Google Analytics 4** - Via `@astrolib/analytics`
- **Google Tag Manager** - Container-based tag management (runs in parallel with GA4)
- **Datadog RUM** - Real User Monitoring with custom events
- **GoHighLevel** - Marketing platform tracking
- **Termly** - Cookie consent management

Analytics IDs configured in:
1. `src/config.yaml` (googleAnalytics.id)
2. Environment variables for GTM, Datadog, and other services
3. `wrangler.json` for Cloudflare Workers environment

Client-side scripts in `src/scripts/` handle event tracking.

**Google Tag Manager Integration:**
- Component: `src/components/tracking/GoogleTagManager.astro`
- Helper functions: `src/scripts/gtm-events.ts`
- Environment variable: `PUBLIC_GOOGLE_TAG_MANAGER_ID`
- Runs in parallel with GA4 (no conflicts)
- Supports custom dataLayer events with type-safe helpers

### Mux Video & Audio Integration

The template includes a modular Mux plugin for video and audio streaming.

**Location:** `src/plugins/mux/`

#### Components

- `MuxVideoPlayer.astro` - Video player with analytics
- `MuxAudioPlayer.astro` - Audio player for podcasts
- `MuxThumbnail.astro` - Generate video thumbnails

#### Setup

1. Get Mux credentials from [dashboard.mux.com](https://dashboard.mux.com)
2. Set environment variables:
   ```bash
   MUX_TOKEN_ID=your-token-id
   MUX_TOKEN_SECRET=your-token-secret
   ```
3. For production, use Cloudflare secrets:
   ```bash
   wrangler secret put MUX_TOKEN_ID
   wrangler secret put MUX_TOKEN_SECRET
   ```

#### Usage in Content

Add Mux video/audio to any content collection:

**Blog Post with Video:**
```markdown
---
title: 'My Post'
video:
  playbackId: 'abc123'
  type: 'video'
  aspectRatio: '16:9'
---
```

**Podcast Episode with Audio:**
```markdown
---
title: 'Episode 1'
audio:
  playbackId: 'xyz789'
  type: 'audio'
  title: 'Episode 1: Introduction'
---
```

The video/audio will be automatically displayed when rendering the post or episode.

#### Plugin Architecture

All Mux code is in `src/plugins/mux/` for:
- **Modularity** - Easy to add/remove
- **Extensibility** - Template for future plugins
- **Maintainability** - Isolated from core template

See `src/plugins/mux/README.md` for detailed documentation.

### Deployment Architecture

**Build output:** Static site with Cloudflare Workers adapter
- `output: 'static'` in `astro.config.mts`
- Adapter: `@astrojs/cloudflare` with platform proxy enabled
- Site URL from `PUBLIC_SITE_URL` environment variable

**Cloudflare configuration** (`wrangler.json`):
- Node.js compatibility enabled
- Observability with logs enabled
- Environment variables for Datadog, Google Maps, Termly

## Important Patterns

### Adding a New Content Type

1. Define schema in `src/content/config.ts`
2. Add content files to `src/content/[collection-name]/`
3. Create page routes in `src/pages/` to display content
4. Update `src/config.yaml` if needed for routing config

### Creating Redirect Short Links

**Static redirects:**
1. Add to `REDIRECTS` object in `src/data/redirects.ts`
2. Include destination, category, UTM params as needed

**Campaign/coupon redirects:**
1. Add `shortUrl` field to campaign or coupon frontmatter
2. Middleware automatically picks it up
3. Optional: Define `campaignLinks` in coupons for multiple short URLs

### Customizing for a New Client

1. Run `.github/scripts/setup-client.sh` (or `.ps1` on Windows)
2. Update `src/config.yaml` - site info, theme colors, fonts, analytics IDs
3. Replace `src/components/Logo.astro` with client logo
4. Add images to `src/assets/images/`
5. Add content to `src/content/`
6. Create custom components in `src/client/components/` if needed
7. Set environment variables (see `.env.example`)

### Theme Customization Levels

**Level 1 (Config only):** Update `src/config.yaml` theme section
**Level 2 (Custom components):** Create in `src/client/components/`
**Level 3 (Custom pages):** Create in `src/client/pages/` or `src/pages/`
**Level 4 (Theme extensions):** Extend `tailwind.config.js` or add `src/client/styles/custom.css`

## Key Files & Their Roles

- `astro.config.mts` - Astro configuration, integrations, markdown plugins
- `src/config.yaml` - Single source of truth for site configuration and theming
- `vendor/integration/` - Custom Astro integration that powers config system
- `src/middleware.ts` - Request interception for redirect system
- `src/content/config.ts` - Content collection schemas
- `src/components/CustomStyles.astro` - Generates CSS variables from theme config
- `src/utils/frontmatter.ts` - Markdown/MDX processing (reading time, responsive tables, lazy images)
- `wrangler.json` - Cloudflare Workers deployment configuration

## Environment Variables

Create a `.env` file (see `.env.example`):
- `PUBLIC_SITE_URL` - Site URL for sitemap generation
- `PUBLIC_GOOGLE_ANALYTICS_ID` - Google Analytics 4 measurement ID
- `PUBLIC_GOOGLE_TAG_MANAGER_ID` - Google Tag Manager container ID (runs alongside GA4)
- `PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key (for GoogleMap widget)
- `PUBLIC_DATADOG_APPLICATION_ID` - Datadog RUM app ID
- `PUBLIC_DATADOG_CLIENT_TOKEN` - Datadog RUM client token
- `PUBLIC_TERMLY_CMP_WEBSITE_UUID` - Termly cookie consent UUID
- `PUBLIC_GO_HIGH_LEVEL_TRACKING_ID` - GoHighLevel tracking ID
- `MUX_TOKEN_ID` - Mux API token ID (keep secret!)
- `MUX_TOKEN_SECRET` - Mux API token secret (keep secret!)

Variables prefixed with `PUBLIC_` are exposed to client-side code. Keep `MUX_TOKEN_*` variables private (no PUBLIC_ prefix).

## CRM Form Integration Patterns

The template includes `IframeEmbed` component for embedding external CRM forms.

**Component:** `src/components/forms/IframeEmbed.astro`

**Features:**
- Loading skeleton with smooth transition
- Auto-resize support via external scripts
- Responsive container
- Security via sandbox attributes
- Analytics tracking (form load events)

### Common CRM Integrations

#### HubSpot Forms
```astro
<IframeEmbed
  src="https://share.hsforms.com/1XXXXXXXX"
  title="HubSpot Contact Form"
  height="700px"
  scriptUrl="https://js.hsforms.net/forms/embed/v2.js"
/>
```

#### Salesforce Web-to-Lead
```astro
<IframeEmbed
  src="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8"
  title="Contact Form"
  height="650px"
/>
```

#### GoHighLevel Forms
```astro
<IframeEmbed
  src="https://link.nsqkt.app/widget/form/XXXXXXXX"
  title="Appointment Request"
  height="750px"
  scriptUrl="https://link.nsqkt.app/js/form_embed.js"
/>
```

#### NightSquawk Forms
```astro
<IframeEmbed
  src="https://app.nightsquawk.com/forms/XXXXXXXX"
  title="Contact Form"
  height="600px"
/>
```

**Tips:**
- Set appropriate `height` to avoid scrollbars (test different viewport sizes)
- Use `scriptUrl` for forms that support auto-resize
- The component uses a loading skeleton to improve perceived performance
- Forms are lazy-loaded by default for better page load performance

## Best Practices

- Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.
- **Never hardcode colors/fonts** - Always use theme CSS variables
- **Configuration over code** - Prefer `src/config.yaml` changes to code modifications
- **Keep base template generic** - Client-specific code goes in `src/client/`
- **Use content collections** - Don't hardcode content in components
- **Respect the override system** - Check `src/client/` before modifying base components
- **Test theme changes** - Verify both light and dark modes work
- **Track analytics properly** - Use redirect system for campaign links, not direct links
