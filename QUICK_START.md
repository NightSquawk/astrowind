# Quick Start Guide

## For New Clients

### 1. Clone the Template
```bash
git clone <template-repo-url> client-name
cd client-name
```

### 2. Run Setup Script
```bash
# On Linux/Mac
bash .github/scripts/setup-client.sh

# On Windows
powershell .github/scripts/setup-client.ps1
```

### 3. Configure Your Site

Edit `src/config.yaml`:

```yaml
site:
  name: "Your Client Name"
  site: "https://yourclient.com"

theme:
  colors:
    primary: 'rgb(YOUR_PRIMARY_COLOR)'
    secondary: 'rgb(YOUR_SECONDARY_COLOR)'
    accent: 'rgb(YOUR_ACCENT_COLOR)'
```

### 4. Update Branding

- Replace logo in `src/components/Logo.astro`
- Add images to `src/assets/images/`
- Update favicons in `src/assets/favicons/`

### 5. Add Content

- Blog posts: `src/content/post/`
- Campaigns: `src/content/campaigns/`
- Coupons: `src/content/coupons/`
- Podcast episodes: `src/content/podcast-episodes/`

### 6. Install & Run

```bash
npm install
npm run dev
```

## Customization Levels

### Level 1: Config Only (Recommended)
✅ Update `src/config.yaml`  
✅ Add content  
✅ Replace images  
❌ No code changes

### Level 2: Custom Components
✅ Create `src/client/components/YourComponent.astro`  
✅ Import and use in pages

### Level 3: Custom Pages
✅ Create `src/client/pages/your-page.astro`  
✅ Use base layouts and components

### Level 4: Theme Extensions
✅ Extend `tailwind.config.js`  
✅ Add `src/client/styles/custom.css`

## Common Tasks

### Change Brand Colors
Edit `src/config.yaml` → `theme.colors`

### Add Custom Font
1. `npm install @fontsource-variable/your-font`
2. Import in `src/components/CustomStyles.astro`
3. Update `theme.fonts` in config

### Override Component
Copy to `src/client/components/` with same path

### Add Custom Page
Create in `src/client/pages/` or `src/pages/`

## Component Usage

```astro
---
import Button from '~/components/ui/Button.astro';
import Features from '~/components/widgets/Features.astro';
---

<Button variant="primary" href="/signup">Get Started</Button>

<Features 
  title="Why Choose Us"
  items={[...]}
/>
```

## Theme Variables

All components use these CSS variables (configured in `config.yaml`):

- `--aw-color-primary`
- `--aw-color-secondary`
- `--aw-color-accent`
- `--aw-color-text-heading`
- `--aw-color-text-default`
- `--aw-color-text-muted`
- `--aw-color-bg-page`
- `--aw-font-sans`
- `--aw-font-heading`

## Documentation

- **Full Guide:** `TEMPLATE_GUIDE.md`
- **Components:** `src/components/README.md`
- **Client Overrides:** `src/client/README.md`

## Need Help?

1. Check `TEMPLATE_GUIDE.md` for detailed instructions
2. Review `src/components/README.md` for component docs
3. Look at existing pages in `src/pages/` for examples
