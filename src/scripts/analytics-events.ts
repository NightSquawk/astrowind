import { initDatadogRUMEvents } from './datadog-rum';

/** Use the same consent-scoped, non-identifying interactions for GA4 and RUM. */
export function initAnalyticsEvents(): () => void {
  return initDatadogRUMEvents({
    addAction: (name, context) => window.gtag?.('event', name, context),
  });
}
