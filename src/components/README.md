# Component Library

This directory contains reusable, theme-aware components similar to Bootstrap. All components are designed to work with the theme configuration system and can be customized via `src/config.yaml`.

## Component Categories

### UI Components (`src/components/ui/`)

Base UI building blocks that are used throughout the site.

#### Button
**Location:** `src/components/ui/Button.astro`

**Props:**
- `variant`: 'primary' | 'secondary' | 'tertiary' | 'link'
- `href`: string (optional, makes it a link)
- `class`: string (optional, additional classes)
- All standard HTML button/link attributes

**Usage:**
```astro
---
import Button from '~/components/ui/Button.astro';
---

<Button variant="primary" href="/signup">Get Started</Button>
<Button variant="secondary">Learn More</Button>
```

**Theme Integration:**
- Uses `--aw-color-primary` for primary variant
- Fully responsive
- Dark mode supported automatically

#### Headline
**Location:** `src/components/ui/Headline.astro`

**Props:**
- `title`: string
- `subtitle`: string (optional)
- `tagline`: string (optional)
- `classes`: object with container, title, subtitle, tagline classes

**Usage:**
```astro
---
import Headline from '~/components/ui/Headline.astro';
---

<Headline 
  title="Welcome" 
  subtitle="Get started today"
  tagline="New Feature"
/>
```

### Widgets (`src/components/widgets/`)

Complete page sections that can be dropped into pages.

#### CallToAction
**Location:** `src/components/widgets/CallToAction.astro`

**Props:**
- `title`: string
- `subtitle`: string (optional)
- `tagline`: string (optional)
- `actions`: CallToAction | CallToAction[] (button config)
- `isDark`: boolean (optional)
- `id`: string (optional, for anchor links)

**Usage:**
```astro
---
import CallToAction from '~/components/widgets/CallToAction.astro';
---

<CallToAction 
  title="Ready to get started?"
  subtitle="Join thousands of satisfied customers"
  actions={{
    text: "Sign Up",
    href: "/signup",
    variant: "primary"
  }}
/>
```

#### Features
**Location:** `src/components/widgets/Features.astro`

**Props:**
- `title`: string
- `subtitle`: string (optional)
- `items`: array of feature objects
- `columns`: number (default: 2)
- `isDark`: boolean (optional)

**Usage:**
```astro
---
import Features from '~/components/widgets/Features.astro';

const features = [
  {
    title: "Fast",
    description: "Lightning fast performance",
    icon: "tabler:bolt"
  },
  {
    title: "Secure",
    description: "Bank-level security",
    icon: "tabler:shield"
  }
];
---

<Features 
  title="Why Choose Us"
  items={features}
  columns={2}
/>
```

### Common Components (`src/components/common/`)

Shared utilities and helpers.

#### Image
**Location:** `src/components/common/Image.astro`

Optimized image component with automatic optimization.

#### Metadata
**Location:** `src/components/common/Metadata.astro`

SEO metadata component.

## Component Override System

**Powered by Vite Plugin:**

The template includes a custom Vite plugin (`vendor/integration/vite-plugin-client-overrides.ts`) that enables automatic component overrides. When you import from `~/components/*`, the plugin automatically checks for a client version first.

**How to Override:**

1. Create file in `src/client/components/` matching the base component path
2. Example: To override `src/components/ui/Button.astro`, create `src/client/components/ui/Button.astro`
3. The client version is used automatically - no import changes needed!

**Example:**

```astro
---
// src/client/components/ui/Button.astro
// This file automatically overrides the base Button component

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; // Added ghost
  // ... other props
}
---
<!-- Your custom implementation -->
```

**Usage in pages:**

```astro
---
// No changes needed! Import works the same way
import Button from '~/components/ui/Button.astro'; // Uses client version automatically
---

<Button variant="ghost">Click Me</Button>
```

**See Examples:**

Check `src/client/components/` for working examples:
- `ui/Button.astro` - Override example with added ghost variant
- `custom/ClientHero.astro` - Custom component example

For full documentation, see `src/client/components/README.md`.

## Theme Integration

All components use CSS variables defined in `src/components/CustomStyles.astro`:
- `--aw-color-primary`
- `--aw-color-secondary`
- `--aw-color-accent`
- `--aw-color-text-heading`
- `--aw-color-text-default`
- `--aw-color-text-muted`
- `--aw-color-bg-page`
- `--aw-font-sans`
- `--aw-font-heading`

These are configured in `src/config.yaml` under the `theme` section.

## Best Practices

1. **Use CSS variables** instead of hardcoded colors
2. **Accept `class` prop** for customization
3. **Support dark mode** via `.dark` class
4. **Make components responsive** using Tailwind breakpoints
5. **Document props** in component comments
6. **Keep components focused** - one component, one purpose
