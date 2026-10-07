/* eslint-disable prefer-rest-params -- Google requires an Arguments queue entry. */
import { observeAnalyticsConsent } from '../utils/analytics-consent';
import { sanitizeAnalyticsUrl, sanitizeAnalyticsText } from '../utils/datadog-privacy';
import { initAnalyticsEvents } from './analytics-events';

const element = document.getElementById('google-analytics-config');
if (element?.textContent) {
  const config = JSON.parse(element.textContent) as { id: string; hostname: string };
  if (/^G-[A-Z0-9]+$/.test(config.id) && location.protocol === 'https:' && location.hostname === config.hostname) {
    let loaded = false;
    let granted = false;
    let lastPage = '';
    const disable = `ga-disable-${config.id}`;
    let stopEvents: (() => void) | undefined;
    Reflect.set(window, disable, true);
    const pageView = () => {
      const page = sanitizeAnalyticsUrl(location.href);
      if (!granted || page === lastPage) return;
      lastPage = page;
      window.gtag?.('event', 'page_view', {
        page_location: page,
        page_referrer: sanitizeAnalyticsUrl(document.referrer),
        page_title: sanitizeAnalyticsText(document.title),
      });
    };
    observeAnalyticsConsent((consent) => {
      granted = consent;
      Reflect.set(window, disable, !consent);
      stopEvents?.();
      if (!consent) {
        lastPage = '';
        window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
        return;
      }
      if (!loaded) {
        loaded = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function (..._args: unknown[]) {
          window.dataLayer?.push(arguments);
        };
        window.gtag('consent', 'default', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
        window.gtag('js', new Date());
        window.gtag('config', config.id, {
          send_page_view: false,
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
        });
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${config.id}`;
        document.head.appendChild(script);
      }
      window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
      stopEvents = initAnalyticsEvents();
      pageView();
    });
    document.addEventListener('astro:page-load', pageView);
  }
}
