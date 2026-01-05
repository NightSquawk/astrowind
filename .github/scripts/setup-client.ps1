# Client setup script for AstroWind Template (PowerShell)
# This script helps set up a new client repository from the template

Write-Host "🚀 Setting up AstroWind template for client..." -ForegroundColor Cyan

# Create client directories if they don't exist
Write-Host "📁 Creating client directory structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "src/client/components" | Out-Null
New-Item -ItemType Directory -Force -Path "src/client/layouts" | Out-Null
New-Item -ItemType Directory -Force -Path "src/client/pages" | Out-Null
New-Item -ItemType Directory -Force -Path "src/client/assets/images" | Out-Null
New-Item -ItemType Directory -Force -Path "src/client/styles" | Out-Null

# Create example files
Write-Host "📝 Creating example files..." -ForegroundColor Yellow

# Create example config
if (-not (Test-Path "src/client/config.yaml.example")) {
    @"
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
"@ | Out-File -FilePath "src/client/config.yaml.example" -Encoding UTF8
    Write-Host "✅ Created src/client/config.yaml.example" -ForegroundColor Green
}

# Create README for client directory
if (-not (Test-Path "src/client/README.md")) {
    @"
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
"@ | Out-File -FilePath "src/client/README.md" -Encoding UTF8
    Write-Host "✅ Created src/client/README.md" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update src/config.yaml with your client's information"
Write-Host "2. Update theme colors in src/config.yaml → theme section"
Write-Host "3. Replace images in src/assets/images/ with client branding"
Write-Host "4. Update src/components/Logo.astro with client logo"
Write-Host "5. Add client content to src/content/"
Write-Host ""
Write-Host "See TEMPLATE_GUIDE.md for detailed instructions." -ForegroundColor Yellow
