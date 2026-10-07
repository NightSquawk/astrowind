import type { RumEvent } from '@datadog/browser-rum';

/** Stable public page names, without query strings, fragments, or obvious identifiers. */
export function analyticsPath(pathname: string): string {
  return pathname
    .split('/')
    .map((part) => {
      let decoded = part;
      try {
        decoded = decodeURIComponent(part);
      } catch {
        /* Keep malformed paths harmless. */
      }
      if (/@|\b[0-9a-f]{8}-[0-9a-f-]{27,}\b/i.test(decoded) || /^\d{6,}$/.test(decoded)) return '_redacted';
      return part;
    })
    .join('/');
}

export function sanitizeAnalyticsUrl(value: string): string {
  if (!value) return '';
  try {
    const url = new URL(value, window.location.origin);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    return `${url.origin}${analyticsPath(url.pathname)}`;
  } catch {
    return '';
  }
}

export function sanitizeAnalyticsText(value: string): string {
  return value
    .replace(/https?:\/\/[^\s<>"']+/gi, (url) => sanitizeAnalyticsUrl(url))
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email]')
    .replace(/(?:\+?\d[\d ().-]{7,}\d)/g, '[number]');
}

export function sanitizeRumEvent(event: RumEvent): boolean {
  event.view.url = sanitizeAnalyticsUrl(event.view.url);
  event.view.referrer = sanitizeAnalyticsUrl(event.view.referrer || '');
  // Keep blog slugs distinct while excluding query parameters from metric dimensions.
  event.view.name = new URL(event.view.url || window.location.origin).pathname;
  if (event.type === 'resource') event.resource.url = sanitizeAnalyticsUrl(event.resource.url);
  if (event.type === 'error') {
    event.error.message = sanitizeAnalyticsText(event.error.message);
    if (event.error.stack) event.error.stack = sanitizeAnalyticsText(event.error.stack);
    for (const cause of event.error.causes || []) {
      cause.message = sanitizeAnalyticsText(cause.message);
      if (cause.stack) cause.stack = sanitizeAnalyticsText(cause.stack);
    }
    if (event.error.resource) event.error.resource.url = sanitizeAnalyticsUrl(event.error.resource.url);
  }
  if (event.type === 'action' && event.action.target)
    event.action.target.name = sanitizeAnalyticsText(event.action.target.name);
  return true;
}
