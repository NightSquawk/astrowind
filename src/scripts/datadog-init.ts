import type { datadogRum } from '@datadog/browser-rum';
import { observeAnalyticsConsent } from '../utils/analytics-consent';
import { canTrackLocation, type DatadogConfig } from '../utils/datadog-config';
import { sanitizeRumEvent } from '../utils/datadog-privacy';
import { initDatadogRUMEvents } from './datadog-rum';

let started = false;

export function initDatadogRUM() {
  if (started || typeof window === 'undefined') return;
  const element = document.getElementById('datadog-config');
  if (!element?.textContent) return;
  let config: DatadogConfig;
  try {
    config = JSON.parse(element.textContent);
  } catch {
    return;
  }
  if (!canTrackLocation(config, window.location)) return;
  started = true;

  let granted = false;
  let rum: typeof datadogRum | undefined;
  let loading: Promise<void> | undefined;
  let stopEvents: (() => void) | undefined;
  const applyConsent = () => {
    if (!rum) return;
    rum.setTrackingConsent(granted ? 'granted' : 'not-granted');
    stopEvents?.();
    stopEvents = granted ? initDatadogRUMEvents(rum) : undefined;
  };

  observeAnalyticsConsent((consent) => {
    granted = consent;
    if (rum) return applyConsent();
    // Do not even load the SDK until analytics consent has been granted.
    if (!granted || loading) return;
    loading = import('@datadog/browser-rum')
      .then(({ datadogRum: sdk }) => {
        sdk.init({
          applicationId: config.applicationId,
          clientToken: config.clientToken,
          site: config.site,
          service: config.service,
          env: config.env,
          version: config.version,
          trackingConsent: 'not-granted',
          sessionSampleRate: 100,
          sessionReplaySampleRate: 0,
          defaultPrivacyLevel: 'mask',
          trackAnonymousUser: false,
          trackUserInteractions: true,
          trackResources: true,
          trackLongTasks: true,
          beforeSend: sanitizeRumEvent,
        });
        rum = sdk;
        // Consent may have been withdrawn while the import was in flight.
        applyConsent();
      })
      .catch(() => {
        console.warn('[Datadog RUM] SDK could not load; analytics remains disabled.');
      });
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDatadogRUM);
  else initDatadogRUM();
}
