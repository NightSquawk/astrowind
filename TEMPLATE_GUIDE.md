# AstroWind Template Guide

## Overview

AstroWind is a multi-client template system built with Astro and Tailwind CSS. It provides a reusable component library and theming system that allows you to quickly create client websites while maintaining consistency and ease of maintenance.

## For Template Maintainers

This is the base template repository. When making changes:

1. **Keep components generic** - Components should be reusable across clients
2. **Use theme variables** - Never hardcode colors or fonts
3. **Document changes** - Update component READMEs when adding features
4. **Test theme changes** - Ensure theme config works correctly
5. **Maintain backward compatibility** - Don't break existing client implementations

## For Client Developers

### Quick Start

1. **Clone this template** to your client repository
2. **Update `src/config.yaml`** with client information:
   - Site name, URL, metadata
   - Theme colors and fonts
   - Analytics IDs
3. **Add content** to `src/content/`:
   - Blog posts
   - Campaigns
   - Coupons
   - Podcast episodes
4. **Replace images** in `src/assets/images/` with client branding
5. **Customize as needed** using the override system

### Customization Levels

#### Level 1: Configuration Only (Recommended for most clients)

**What to change:**
- `src/config.yaml` - Site info, theme colors, fonts
- `src/content/` - Add client content
- `src/assets/images/` - Replace with client images
- `src/components/Logo.astro` - Update logo component

**No code changes needed!** The theme system handles all styling.

**Example:**
```yaml
# src/config.yaml
site:
  name: "Client Name"
  site: "https://client.com"

theme:
  colors:
    primary: 'rgb(255 0 0)'  # Client brand color
    secondary: 'rgb(200 0 0)'
    accent: 'rgb(150 0 0)'
```

#### Level 2: Custom Components

**When to use:** Need components not in the base library

**What to do:**
1. Create component in `src/client/components/`
2. Import and use in pages

**Example:**
```astro
<!-- src/client/components/ClientHero.astro -->
---
import Button from '~/components/ui/Button.astro';
---

<section class="client-hero">
  <h1>Welcome to Client Name</h1>
  <Button variant="primary" href="/contact">Contact Us</Button>
</section>
```

```astro
<!-- src/pages/index.astro -->
---
import ClientHero from '~/client/components/ClientHero.astro';
---

<ClientHero />
```

#### Level 3: Custom Pages

**When to use:** Need pages with unique layouts

**What to do:**
1. Create page in `src/client/pages/` or `src/pages/`
2. Use base layouts and components
3. Follow existing page patterns

**Example:**
```astro
<!-- src/client/pages/custom-page.astro -->
---
import Layout from '~/layouts/Layout.astro';
import Features from '~/components/widgets/Features.astro';
---

<Layout>
  <Features 
    title="Custom Page"
    items={[...]}
  />
</Layout>
```

#### Level 4: Theme Extensions

**When to use:** Need custom CSS utilities or one-off styles

**What to do:**
1. Extend `tailwind.config.js` for custom utilities
2. Add to `src/client/styles/custom.css` for component-specific styles
3. Override `src/components/CustomStyles.astro` only if absolutely necessary

**Example:**
```css
/* src/client/styles/custom.css */
.client-specific-class {
  /* Custom styles */
}
```

### Component Library

All components in `src/components/` are reusable and theme-aware:

- **UI Components** (`src/components/ui/`): Buttons, Forms, Headlines
- **Widgets** (`src/components/widgets/`): Page sections (Hero, Features, Pricing, etc.)
- **Common** (`src/components/common/`): Shared utilities

See `src/components/README.md` for full component documentation.

### Theme System

The theme system is configured in `src/config.yaml`:

```yaml
theme:
  colors:
    primary: 'rgb(1 97 239)'      # Main brand color
    secondary: 'rgb(1 84 207)'    # Secondary brand color
    accent: 'rgb(109 40 217)'     # Accent color
    text:
      heading: 'rgb(0 0 0)'      # Heading text color
      default: 'rgb(16 16 16)'   # Body text color
      muted: 'rgb(16 16 16 / 66%)' # Muted text color
    textDark:                    # Dark mode text colors
      heading: 'rgb(247, 248, 248)'
      default: 'rgb(229 236 246)'
      muted: 'rgb(229 236 246 / 66%)'
    background:
      page: 'rgb(255 255 255)'   # Light mode background
      pageDark: 'rgb(3 6 32)'    # Dark mode background
  fonts:
    sans: 'Inter Variable'       # Body font
    serif: 'Inter Variable'      # Serif font
    heading: 'Inter Variable'    # Heading font
  selection:
    light:
      background: 'lavender'    # Light mode selection
    dark:
      background: 'black'       # Dark mode selection
      color: 'snow'
```

All components automatically use these theme values via CSS variables.

### Client Override System

**How It Works:**

The template includes a Vite plugin (`vendor/integration/vite-plugin-client-overrides.ts`) that automatically resolves component imports to client versions when they exist.

When you import a component:
```astro
import Button from '~/components/ui/Button.astro';
```

The plugin checks if a corresponding file exists at `src/client/components/ui/Button.astro`:
- **If it exists:** Import automatically resolves to the client version
- **If it doesn't exist:** Import resolves to the base component

**This means no code changes are needed when you override a component!**

**To Override a Component:**

1. Create file matching base component path:
   - **Base:** `src/components/ui/Button.astro`
   - **Override:** `src/client/components/ui/Button.astro`

2. The override is used automatically everywhere

3. No need to update imports in pages/layouts

**Example Overrides:**

The template includes example overrides in `src/client/components/`:
- `ui/Button.astro` - Adds "ghost" variant to base Button
- `custom/ClientHero.astro` - Custom hero component composing base components

See `src/client/components/README.md` for detailed documentation and best practices.

### File Structure

```
astrowind-template/
├── src/
│   ├── components/          # Base components (don't modify)
│   │   ├── ui/             # UI components
│   │   ├── widgets/        # Page sections
│   │   └── common/         # Shared utilities
│   ├── layouts/            # Base layouts
│   ├── pages/              # Base pages
│   ├── content/            # Content collections
│   ├── assets/             # Base assets
│   ├── config.yaml         # Site & theme configuration
│   └── client/             # Client-specific overrides
│       ├── components/     # Custom components
│       ├── layouts/        # Custom layouts
│       ├── pages/          # Custom pages
│       └── assets/         # Client assets
├── vendor/                 # Integration code (don't modify)
└── tailwind.config.js      # Tailwind config (extend, don't replace)
```

### Best Practices

1. **Start with configuration** - Most customizations can be done via `config.yaml`
2. **Use base components** - Don't recreate what already exists
3. **Follow patterns** - Look at existing pages/components for examples
4. **Keep overrides minimal** - Only override when necessary
5. **Document custom code** - Add comments for client-specific logic
6. **Test theme changes** - Verify light and dark modes work
7. **Use CSS variables** - Never hardcode colors in components

### Common Tasks

#### Change Brand Colors

Edit `src/config.yaml`:
```yaml
theme:
  colors:
    primary: 'rgb(YOUR_COLOR)'
    secondary: 'rgb(YOUR_COLOR)'
```

#### Add Custom Font

1. Install font package: `npm install @fontsource-variable/your-font`
2. Update `src/components/CustomStyles.astro` to import it
3. Update `src/config.yaml`:
```yaml
theme:
  fonts:
    sans: 'Your Font Variable'
```

#### Create Custom Page

1. Create `src/client/pages/custom-page.astro`
2. Use base Layout and components
3. Add to navigation if needed

#### Override Component

1. Copy component from `src/components/` to `src/client/components/`
2. Modify as needed
3. Component will automatically be used

### Getting Help

- Check `src/components/README.md` for component documentation
- Review existing pages in `src/pages/` for examples
- Look at `src/config.yaml` for all configuration options

### Updating the Template

When the base template is updated:

1. **Merge updates carefully** - Client overrides may conflict
2. **Test theme changes** - Verify your theme still works
3. **Check component changes** - Review component updates
4. **Update documentation** - Note any breaking changes
