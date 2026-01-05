# Client Components

This directory is for client-specific components, including both overrides of base components and completely custom components.

## How the Auto-Override System Works

The template includes a **Vite plugin** (`vendor/integration/vite-plugin-client-overrides.ts`) that automatically resolves component imports to client versions when they exist.

### Automatic Resolution

When you import a component from `~/components/*`:

```astro
import Button from '~/components/ui/Button.astro';
```

The plugin checks if a corresponding file exists in `src/client/components/*`:
- **If client version exists**: `src/client/components/ui/Button.astro` → Import resolves to client version
- **If client version doesn't exist**: Import resolves to base component

**This means you can override ANY base component without changing imports throughout your codebase!**

---

## Two Approaches to Client Components

### Approach 1: Override Base Components

**When to use:**
- You want to modify an existing component's behavior
- You need to add variants or features to a base component
- You want to maintain the same API/interface

**How to do it:**
1. Create file at `src/client/components/[path]/[component].astro`
2. Match the path structure of the base component
3. The import `~/components/[path]/[component].astro` will automatically resolve to your version

**Example:** See `src/client/components/ui/Button.astro`
- Overrides: `src/components/ui/Button.astro`
- Adds: New "ghost" variant
- Preserves: All base functionality

```astro
---
// src/client/components/ui/Button.astro
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; // Added ghost
  // ... other props from base
}
---
<!-- Same structure as base, with ghost variant styles added -->
```

**Usage in pages/layouts:**
```astro
---
// For NEW variants added in override (e.g., ghost):
import Button from '~/client/components/ui/Button.astro';
// ↑ Import directly from client for TypeScript to recognize new variant types

// For base variants (primary, secondary, outline):
import Button from '~/components/ui/Button.astro';
// ↑ Auto-resolves at runtime, works for existing variants
---

<Button variant="ghost">Click Me</Button>
```

**TypeScript Consideration:**
The Vite plugin resolves imports at **runtime**, but TypeScript checks types at **compile time**.
When you add new variants (like "ghost") in an override, TypeScript won't know about them unless
you import directly from `~/client/components/`. For existing variants, either import works.

### Approach 2: Create Custom Components

**When to use:**
- You need completely new functionality
- Component is client-specific and won't be in base template
- You're composing multiple base components

**How to do it:**
1. Create file at `src/client/components/custom/[YourComponent].astro`
2. Import base components as needed
3. Build your custom component

**Example:** See `src/client/components/custom/ClientHero.astro`
- New component that doesn't override anything
- Composes: Button + Headline base components
- Adds: Client-specific hero layout

```astro
---
// src/client/components/custom/ClientHero.astro
import Button from '~/components/ui/Button.astro';
import Headline from '~/components/ui/Headline.astro';
---

<section class="client-hero">
  <Headline title={title} subtitle={subtitle} />
  <Button variant="primary">Get Started</Button>
</section>
```

**Usage in pages/layouts:**
```astro
---
import ClientHero from '~/client/components/custom/ClientHero.astro';
---

<ClientHero title="Welcome" />
```

---

## Directory Structure

```
src/client/components/
├── ui/                    # Overrides for base UI components
│   └── Button.astro       # Example: Override with ghost variant
├── widgets/               # Overrides for base widget components
├── common/                # Overrides for common components
└── custom/                # Client-specific custom components
    └── ClientHero.astro   # Example: Custom hero component
```

**Important Note about Pages:**
- Pages always go in `src/pages/` (Astro's routing requirement)
- The `src/client/` directory is ONLY for components, not pages
- Client-specific pages should be created in `src/pages/` like any other page

---

## Best Practices

### When Overriding Components

1. **Preserve the base API**: Keep the same prop interface when possible
2. **Extend, don't replace**: Add features rather than removing base functionality
3. **Copy the base first**: Start by copying the base component, then modify
4. **Document changes**: Add comments explaining what's different from base
5. **Test thoroughly**: Ensure your override doesn't break existing pages

### When Creating Custom Components

1. **Use base components**: Compose from the existing component library
2. **Follow naming conventions**: Use descriptive names like `ClientHero`, `ClientFeatures`
3. **Use theme variables**: Stick to CSS variables for colors and fonts
4. **Support dark mode**: Use `:global(.dark)` selectors
5. **Make it responsive**: Follow mobile-first design patterns

### Theme Integration

Always use theme CSS variables defined in `src/components/CustomStyles.astro`:

```css
.my-component {
  color: var(--aw-color-primary);           /* Primary brand color */
  background: var(--aw-color-bg-page);      /* Page background */
  font-family: var(--aw-font-heading);      /* Heading font */
}
```

Available variables:
- Colors: `--aw-color-primary`, `--aw-color-secondary`, `--aw-color-accent`
- Text: `--aw-color-text-heading`, `--aw-color-text-default`, `--aw-color-text-muted`
- Backgrounds: `--aw-color-bg-page`
- Fonts: `--aw-font-sans`, `--aw-font-heading`

---

## Examples

### Example 1: Override Button with New Variant

```astro
---
// src/client/components/ui/Button.astro
// Adds "danger" variant to base Button
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  // ... rest of props
}
---
<!-- Same structure as base -->
<style>
  /* Copy base styles */
  .btn { /* ... */ }
  .btn-primary { /* ... */ }

  /* Add new variant */
  .btn-danger {
    background-color: #dc2626;
    color: white;
    border-color: #dc2626;
  }
</style>
```

### Example 2: Custom Feature Section

```astro
---
// src/client/components/custom/ClientFeatures.astro
import Features from '~/components/widgets/Features.astro';

const features = [
  { title: "Feature 1", icon: "tabler:check" },
  { title: "Feature 2", icon: "tabler:check" },
];
---

<section class="client-features">
  <div class="custom-header">
    <h2>Our Amazing Features</h2>
  </div>
  <Features items={features} columns={3} />
</section>

<style>
  .client-features {
    padding: 4rem 0;
    background: var(--aw-color-bg-page);
  }
  .custom-header {
    text-align: center;
    margin-bottom: 2rem;
  }
</style>
```

---

## Removing Overrides

To remove an override and return to using the base component:
1. Delete the file from `src/client/components/`
2. No code changes needed - imports automatically resolve back to base
3. Clear cache: `rm -rf .astro node_modules/.vite`
4. Rebuild: `npm run build`

---

## Troubleshooting

### Override Not Working

1. **Check file path**: Must exactly match base component path structure
2. **Check file extension**: Use `.astro` for Astro components
3. **Clear cache**: Delete `.astro` and `node_modules/.vite` directories
4. **Restart dev server**: Stop and restart `npm run dev`

### Import Errors

If you see import errors:
- Ensure base component exists at the path you're importing from
- Check TypeScript paths in `tsconfig.json`
- Verify Vite plugin is loaded in `astro.config.mts`

### Build Errors

If build fails with component errors:
- Check that all overrides have valid syntax
- Ensure all imported components exist
- Verify all props match expected types

---

## Getting Help

- Check base component source in `src/components/` for reference
- Review base component README: `src/components/README.md`
- See template guide: `TEMPLATE_GUIDE.md`
- Look at example overrides in this directory
