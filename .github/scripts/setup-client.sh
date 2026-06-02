#!/bin/bash
# Client setup script for AstroWind Template
# This script helps set up a new client repository from the template

echo "🚀 Setting up AstroWind template for client..."

# Create client directories if they don't exist
echo "📁 Creating client directory structure..."
mkdir -p src/client/components
mkdir -p src/client/layouts
mkdir -p src/client/pages
mkdir -p src/client/assets/images
mkdir -p src/client/styles

# Create example files
echo "📝 Creating example files..."

# Create example config
if [ ! -f "src/client/config.yaml.example" ]; then
  cat > src/client/config.yaml.example << 'EOF'
# Example client configuration
# Copy this to src/config.yaml and customize for your client

site:
  name: "Your Client Name"
  site: "https://yourclient.com"
  base: "/"
  trailingSlash: ignore
  googleSiteVerificationId: ""

theme:
  colors:
    primary: 'rgb(1 97 239)'      # Your brand primary color
    secondary: 'rgb(1 84 207)'    # Your brand secondary color
    accent: 'rgb(109 40 217)'     # Your brand accent color
    text:
      heading: 'rgb(0 0 0)'
      default: 'rgb(16 16 16)'
      muted: 'rgb(16 16 16 / 66%)'
    textDark:
      heading: 'rgb(247, 248, 248)'
      default: 'rgb(229 236 246)'
      muted: 'rgb(229 236 246 / 66%)'
    background:
      page: 'rgb(255 255 255)'
      pageDark: 'rgb(3 6 32)'
  fonts:
    sans: 'Inter Variable'
    serif: 'Inter Variable'
    heading: 'Inter Variable'
  selection:
    light:
      background: 'lavender'
    dark:
      background: 'black'
      color: 'snow'
EOF
  echo "✅ Created src/client/config.yaml.example"
fi

# Create README for client directory
if [ ! -f "src/client/README.md" ]; then
  cat > src/client/README.md << 'EOF'
# Client-Specific Customizations

This directory is for client-specific files that override or extend the base template.

## Directory Structure

- `components/` - Custom components that override base components
- `layouts/` - Custom layouts
- `pages/` - Custom pages
- `assets/` - Client-specific assets (images, etc.)
- `styles/` - Client-specific CSS

## Override System

To override a base component, create a file in this directory with the same path structure.

**Example:** To override `src/components/ui/Button.astro`, create `src/client/components/ui/Button.astro`.

The client version will automatically be used instead of the base component.

## Best Practices

1. Only override when necessary
2. Document why you're overriding
3. Consider extending base components rather than replacing them
4. Keep client-specific code minimal
EOF
  echo "✅ Created src/client/README.md"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update src/config.yaml with your client's information"
echo "2. Update theme colors in src/config.yaml → theme section"
echo "3. Replace images in src/assets/images/ with client branding"
echo "4. Update src/components/Logo.astro with client logo"
echo "5. Add client content to src/content/"
echo ""
echo "See TEMPLATE_GUIDE.md for detailed instructions."
