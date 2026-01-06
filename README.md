# 🚀 AstroWind - NightSquawk Tech Edition

**A production-ready, multi-client template system built on AstroWind with enterprise-grade enhancements.**

This is **NightSquawk Tech's** enhanced version of the popular [AstroWind](https://github.com/arthelokyo/astrowind) template. We've extended the base template with powerful features, modern UI components, comprehensive analytics, and development tools to create a robust foundation for all our client websites.

---

## 📋 Table of Contents

- [What We've Added](#-what-weve-added)
- [Quick Start](#-quick-start)
- [Features](#-features)
- [Documentation](#-documentation)
- [Development Tools](#-development-tools)
- [Environment Setup](#-environment-setup)
- [Deployment](#-deployment)
- [Credits](#-credits)

---

## ✨ What We've Added

On top of the excellent AstroWind foundation, we've added:

### 🎨 **UI Component Library**
- **3 Icon Libraries**: Tabler, Material Design Icons (MDI), and Lucide icons
- **shadcn-style Components**: Modern, accessible UI components with variants
  - Button, Card, Badge, Input, Label, Textarea
  - Built with Tailwind CSS and class-variance-authority
  - Fully customizable and type-safe

### 📊 **Analytics & Tracking**
- **Microsoft Clarity**: Heatmaps and session recordings
- **Google Tag Manager**: Container-based tag management
- **Google Analytics 4**: Built-in with consent management
- **Datadog RUM**: Real user monitoring
- **GoHighLevel**: Marketing platform integration (configurable)

### 🔍 **SEO & Structured Data**
- **JSON-LD Schema Helpers**: Type-safe utilities for 9+ schema types
  - Organization, LocalBusiness, Article, Product, FAQ
  - WebSite, BreadcrumbList, VideoObject, Event
- **Schema Component**: Easy integration of structured data
- **Open Graph Preview**: Dev tool to preview social media cards

### ♿ **Accessibility & Quality**
- **Accessibility Checker**: Auto-scan for 8+ common a11y issues
- **Color Contrast Checker**: WCAG 2.1 compliance validation (AA/AAA)
- **Development Tools**: Only load in dev mode, auto-removed in production

### 🎬 **Media Integration**
- **Mux Video & Audio**: Professional streaming integration
- **Google Maps**: Place search, geocoding, and custom markers
- **Image Optimization**: Responsive images with lazy loading

### 📝 **Content Management**
- **Blog System**: Categories, tags, authors, reading time
- **Podcast Episodes**: Rich metadata with streaming links
- **Campaigns & Coupons**: UTM tracking and short URLs
- **Redirect Middleware**: Analytics-tracked URL shortening

### 🎯 **Advanced Features**
- **Photo Carousel**: Swiper.js gallery with lightbox
- **Hero Carousel**: Auto-advancing hero sections
- **Sidebar Navigation**: Active state detection
- **Form Integrations**: iframe embeds for HubSpot, Salesforce, GoHighLevel
- **Dynamic Theming**: Full customization via `config.yaml`

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation

```bash
# Clone this repository
git clone https://github.com/NightSquawk/astrowind.git
cd astrowind

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see your site.

### For New Clients

```bash
# Run the client setup script
bash .github/scripts/setup-client.sh  # Linux/Mac
# or
.github/scripts/setup-client.ps1      # Windows

# Update configuration
# Edit src/config.yaml with client details
# Replace src/components/Logo.astro with client logo
# Add content to src/content/
```

---

## 🎯 Features

### Icon Libraries
```astro
import { Icon } from 'astro-icon/components';

<Icon name="lucide:heart" class="w-6 h-6" />
<Icon name="mdi:email" class="w-5 h-5" />
<Icon name="tabler:user" class="w-4 h-4" />
```

### shadcn-style UI Components
```astro
import Button from '~/components/ui/shadcn/Button.astro';
import Card from '~/components/ui/shadcn/Card.astro';
import Badge from '~/components/ui/shadcn/Badge.astro';

<Card>
  <CardHeader>
    <CardTitle>Hello <Badge variant="success">New</Badge></CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="outline" size="lg">Learn More</Button>
  </CardContent>
</Card>
```

**Demo:** Visit `/shadcn-demo` in development mode

### JSON-LD Schema
```astro
import Schema from '~/components/common/Schema.astro';
import { createArticleSchema, createLocalBusinessSchema } from '~/utils/schema';

const schema = createArticleSchema({
  headline: 'My Article',
  datePublished: '2024-01-15T08:00:00Z',
  author: { '@type': 'Person', name: 'Author Name' },
  publisher: { name: 'Your Site' },
  url: Astro.url.href,
});

<Schema schema={schema} />
```

**Demo:** Visit `/schema-demo` in development mode

### Development Tools
```astro
import A11yChecker from '~/components/dev/A11yChecker.astro';
import OGPreview from '~/components/dev/OGPreview.astro';

{import.meta.env.DEV && <A11yChecker />}
{import.meta.env.DEV && <OGPreview position="bottom-right" />}
```

**Demo:** Visit `/dev-tools-demo` in development mode

---

## 📚 Documentation

- **`CLAUDE.md`** - Comprehensive template documentation and architecture guide
- **`src/plugins/mux/README.md`** - Mux video/audio integration guide
- **`.env.example`** - Environment variable reference

### Key Documentation Sections

- **Multi-Client Template System** - How to customize for each client
- **Theme System** - Dynamic theming via config.yaml
- **Component Architecture** - Widget structure and patterns
- **Content Collections** - Blog, podcasts, campaigns, coupons
- **Redirect System** - Analytics-tracked URL shortening
- **Analytics Integration** - Multiple analytics platforms
- **SEO Best Practices** - Structured data and meta tags

---

## 🛠 Development Tools

### Accessibility Checker
**Location:** `src/components/dev/A11yChecker.astro`

Automatically scans for:
- Missing alt text on images
- Missing form labels and ARIA labels
- Empty links and buttons
- Duplicate IDs
- Heading hierarchy issues
- And more...

### Open Graph Preview
**Location:** `src/components/dev/OGPreview.astro`

Preview social media cards:
- Facebook/Meta
- Twitter/X
- LinkedIn

### Color Contrast Checker
**Location:** `src/utils/contrast.ts`

WCAG 2.1 compliance checking:
```typescript
import { getContrastRatio, getWCAGCompliance } from '~/utils/contrast';

const ratio = getContrastRatio('#ffffff', '#000000');
const compliance = getWCAGCompliance(ratio, 'normal');
// { aa: true, aaa: true, level: 'AAA', message: '...' }
```

**Standards:**
- Level AA: 4.5:1 (normal), 3:1 (large)
- Level AAA: 7:1 (normal), 4.5:1 (large)

---

## 🔧 Environment Setup

Create a `.env` file (see `.env.example` for full reference):

```bash
# Site Configuration
PUBLIC_SITE_URL=https://yoursite.com

# Analytics
PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
PUBLIC_MICROSOFT_CLARITY_PROJECT_ID=xxxxx
PUBLIC_DATADOG_APPLICATION_ID=
PUBLIC_DATADOG_CLIENT_TOKEN=

# Maps
PUBLIC_GOOGLE_MAPS_API_KEY=

# Optional: GoHighLevel
PUBLIC_GO_HIGH_LEVEL_TRACKING_ID=
PUBLIC_GO_HIGH_LEVEL_SCRIPT_URL=

# Mux (keep secret!)
MUX_TOKEN_ID=your-token-id
MUX_TOKEN_SECRET=your-token-secret
```

---

## 📦 Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build |
| `npm run check` | Run Astro, ESLint, and Prettier checks |
| `npm run fix` | Auto-fix ESLint and Prettier issues |
| `npm run deploy` | Build and deploy to Cloudflare Workers |

---

## 🚢 Deployment

### Cloudflare Workers (Recommended)

```bash
# Build and deploy
npm run deploy

# Or manually
npm run build
wrangler deploy
```

**Configuration:** Edit `wrangler.json` for environment variables and settings.

### Other Platforms

The template works with:
- **Vercel** - Deploy with one click
- **Netlify** - Deploy with one click
- **Any static host** - Upload the `dist/` folder

---

## 📈 Analytics Integration

### Google Analytics 4
Set `PUBLIC_GOOGLE_ANALYTICS_ID` in `.env`

### Google Tag Manager
Set `PUBLIC_GOOGLE_TAG_MANAGER_ID` in `.env`
Runs in parallel with GA4, no conflicts

### Microsoft Clarity
Set `PUBLIC_MICROSOFT_CLARITY_PROJECT_ID` in `.env`
Get your project ID from [clarity.microsoft.com](https://clarity.microsoft.com/)

### Datadog RUM
Set `PUBLIC_DATADOG_APPLICATION_ID` and `PUBLIC_DATADOG_CLIENT_TOKEN`

All analytics respect Google Consent Mode v2 and integrate with Termly cookie consent.

---

## 🎨 Theme Customization

Edit `src/config.yaml`:

```yaml
theme:
  colors:
    primary: 'rgb(1 97 239)'      # Brand color
    secondary: 'rgb(1 84 207)'
    accent: 'rgb(109 40 217)'
    text:
      default: 'rgb(16 16 16)'
      muted: 'rgb(16 16 16 / 66%)'
  fonts:
    sans: 'Inter Variable'
    heading: 'Inter Variable'
```

All components automatically use these theme values—no code changes needed!

---

## 🧪 Demo Pages (Dev Mode Only)

These pages are only visible in development and demonstrate template features:

- `/shadcn-demo` - shadcn-style UI components showcase
- `/schema-demo` - JSON-LD structured data examples
- `/dev-tools-demo` - Development tools demonstration
- `/mux-demo` - Mux video/audio integration examples

Remove these before deploying to production or move to `src/client/pages/` for client-specific demos.

---

## 🏗 Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── ui/shadcn/          # shadcn-style components
│   │   ├── dev/                # Dev-only tools
│   │   ├── tracking/           # Analytics components
│   │   ├── widgets/            # Page sections
│   │   └── common/             # Shared components
│   ├── content/                # Content collections
│   │   ├── post/               # Blog posts
│   │   ├── podcast-episodes/   # Podcast episodes
│   │   ├── campaigns/          # Marketing campaigns
│   │   └── coupons/            # Promotional coupons
│   ├── plugins/                # Modular plugins
│   │   └── mux/                # Mux integration
│   ├── utils/                  # Utilities
│   │   ├── schema.ts           # JSON-LD helpers
│   │   ├── contrast.ts         # WCAG contrast checker
│   │   └── cn.ts               # className utility
│   ├── pages/                  # Routes
│   ├── layouts/                # Page layouts
│   └── config.yaml             # Site configuration
├── vendor/integration/         # Custom Astro integration
├── wrangler.json              # Cloudflare Workers config
└── astro.config.mts           # Astro configuration
```

---

## 💡 Best Practices

- **Never hardcode colors/fonts** - Use theme CSS variables
- **Configuration over code** - Prefer `config.yaml` changes
- **Use content collections** - Don't hardcode content in components
- **Client overrides** - Put client-specific code in `src/client/`
- **Dev tools** - Use built-in accessibility and preview tools
- **Test themes** - Verify both light and dark modes
- **Structured data** - Use schema helpers for better SEO

---

## 🤝 Credits

### Base Template
- **[AstroWind](https://github.com/arthelokyo/astrowind)** by Arthelokyo - The excellent foundation this template builds upon

### Enhanced by
- **[NightSquawk Tech](https://github.com/NightSquawk)** - Enterprise enhancements, component library, dev tools, and multi-client system

### Built With
- **[Astro 5.0](https://astro.build/)** - The web framework for content-driven websites
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Swiper.js](https://swiperjs.com/)** - Modern mobile touch slider
- **[Mux](https://mux.com/)** - Video/audio streaming infrastructure
- **[Iconify](https://iconify.design/)** - Unified icon framework

---

## 📄 License

This enhanced template maintains the MIT license from the original AstroWind project.

**Original AstroWind:** [MIT License](./LICENSE.md)

---

## 🆘 Support

For issues or questions about:
- **Base template features**: See [AstroWind repository](https://github.com/arthelokyo/astrowind)
- **NightSquawk enhancements**: Open an issue in this repository
- **Client-specific customization**: Refer to `CLAUDE.md` documentation

---

<div align="center">

**Built with ❤️ by NightSquawk Tech**

Enhanced from the amazing [AstroWind](https://github.com/arthelokyo/astrowind) template

</div>
