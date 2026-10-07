# Consent gated browser analytics

The shared template uses Datadog Browser SDK 7.15.0. It waits for explicit Termly analytics consent before importing the SDK, starts with tracking disabled, and stops collection and custom listeners on withdrawal. Missing configuration, missing CMP, preview hosts and non-HTTPS origins fail closed.

## Configuration

Set PUBLIC_DATADOG_APPLICATION_ID and PUBLIC_DATADOG_CLIENT_TOKEN during astro build, plus PUBLIC_TERMLY_CMP_WEBSITE_UUID. Use the browser client token, never a Datadog API key. The default Datadog site is us3.datadoghq.com. Set PUBLIC_DATADOG_SERVICE for each application. PUBLIC_DATADOG_ALLOWED_HOSTS defaults to the canonical site hostname in src/config.yaml. PUBLIC_DATADOG_VERSION defaults to the build git SHA. Wrangler runtime vars do not reach prerendered HTML.

Site forks may pass public defaults through the DatadogRUM config prop and the TermlyCMP websiteUUID prop. Include Termly first in head. A bundled script is same-origin and cannot rely on Termly auto-blocking; the explicit consent bridge is required. The default footer shows Cookie preferences when the CMP is configured. Custom footers should include a `.termly-display-preferences` control; site defaults can enable the standard footer through its consentPreferences prop.

## Collection and retention

Session sampling is 100% after consent, with Session Replay and persistent anonymous visitor tracking disabled. Full masking is set. Configure the existing Datadog Sessions retention filter to 20% and keep error sessions at 100%; do not add a second rule beside a 100% default. Built-in page metrics count all ingested views before retention and still undercount visitors without analytics consent or with blockers.

Native RUM handles page views. Custom labels must use data-analytics-action, data-analytics-form or data-analytics-section with fixed non-personal values. Automatic contact events contain only contact type and sanitized page path. Queries and fragments, including UTMs, are stripped. Email, phone and UUID redaction is a safeguard, not complete PII detection. Do not collect user/subscriber identities with these defaults.

GA4 now uses a direct consent-gated loader instead of Partytown. Disable automatic/history page views and other unwanted Enhanced Measurement capture in the GA4 account to avoid duplicate or unsanitized events. GTM tags must enforce consent and withdrawal. Disable any Cloudflare gateway injection before enabling the local GTM loader. Clarity project IDs should remain unset until a separate recording review is complete.

Redirects are immediate server 307/308 responses using configured destinations. Minimal Worker logs record the configured path/category. Browser redirect analytics are no longer used; forwarding those counts to Datadog requires a separate export.

## Validation

Run npm run test:analytics, npm run build and npm run check. Tests cover missing CMP/configuration, consent changes and SDK import races, preview exclusion, redaction, interaction cleanup/navigation and trusted redirect handling. Check homepage/blog, themes and mobile navigation in the browser. Before activation, verify grant/decline/withdrawal and actual cookies/intake on the production hostname and inspect payloads in the intended Datadog app. Account resources, provider disclosures and retention are site-specific launch work.
