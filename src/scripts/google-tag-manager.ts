/* eslint-disable prefer-rest-params -- Google requires an Arguments queue entry. */
import { observeAnalyticsConsent } from '../utils/analytics-consent';

const element = document.getElementById('gtm-config');
if (element?.textContent) {
  const config = JSON.parse(element.textContent) as { id: string; hostname: string };
  if (/^GTM-[A-Z0-9]+$/.test(config.id) && location.protocol === 'https:' && location.hostname === config.hostname) {
    let loaded = false;
    observeAnalyticsConsent((granted) => {
      if (!granted && !loaded) return;
      window.dataLayer = window.dataLayer || [];
      const consent = function (..._args: unknown[]) {
        window.dataLayer?.push(arguments);
      };
      consent('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
      if (!granted || loaded) return;
      loaded = true;
      // Cloudflare's Google tag gateway must be disabled before enabling this loader.
      // Every container tag must also enforce analytics consent on withdrawal.
      if (Array.from(document.scripts).some((script) => script.src.includes(`id=${config.id}`))) return;
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${config.id}`;
      document.head.appendChild(script);
    });
  }
}
