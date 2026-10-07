import { describe, expect, it } from 'vitest';
import type { RumEvent } from '@datadog/browser-rum';
import {
  analyticsPath,
  sanitizeAnalyticsText,
  sanitizeAnalyticsUrl,
  sanitizeRumEvent,
} from '../../src/utils/datadog-privacy';
import { canTrackLocation, type DatadogConfig } from '../../src/utils/datadog-config';
const config: DatadogConfig = {
  applicationId: 'test-app',
  clientToken: 'test-token',
  service: 'test',
  site: 'us3.datadoghq.com',
  env: 'production',
  allowedHosts: ['example.com'],
};

describe('production configuration', () => {
  it('requires an exact production hostname, HTTPS, and complete config', () => {
    expect(canTrackLocation(config, { hostname: 'example.com', protocol: 'https:' })).toBe(true);
    for (const hostname of [
      'localhost',
      '127.0.0.1',
      'example.com.evil.test',
      'preview.workers.dev',
      'preview.pages.dev',
      'www.example.com',
    ]) {
      expect(canTrackLocation(config, { hostname, protocol: 'https:' })).toBe(false);
    }
    expect(canTrackLocation(config, { hostname: 'example.com', protocol: 'http:' })).toBe(false);
    expect(canTrackLocation(undefined, { hostname: 'example.com', protocol: 'https:' })).toBe(false);
    expect(canTrackLocation({ ...config, clientToken: '' }, { hostname: 'example.com', protocol: 'https:' })).toBe(
      false
    );
  });
});
describe('privacy', () => {
  it('drops credentials, query values, fragments, and contact URL schemes', () => {
    expect(sanitizeAnalyticsUrl('https://name:pass@example.com/blog/article?email=person@example.net#secret')).toBe(
      'https://example.com/blog/article'
    );
    expect(sanitizeAnalyticsUrl('mailto:person@example.net')).toBe('');
    expect(sanitizeAnalyticsUrl('tel:+15551234567')).toBe('');
    expect(sanitizeAnalyticsUrl('')).toBe('');
  });
  it('preserves public blog slugs while redacting obvious identifiers', () => {
    expect(analyticsPath('/blog/my-article-2026')).toBe('/blog/my-article-2026');
    expect(analyticsPath('/users/person%40example.net')).toBe('/users/_redacted');
    expect(analyticsPath('/people/12345678')).toBe('/people/_redacted');
  });
  it('redacts contact details and URL queries from errors', () => {
    const text = sanitizeAnalyticsText(
      'person@example.net +1 (555) 123-4567 failed https://example.com/api?token=secret'
    );
    expect(text).not.toContain('person@example.net');
    expect(text).not.toContain('123-4567');
    expect(text).not.toContain('token=secret');
  });
  it('sanitizes resource, view and referrer URLs without losing the page dimension', () => {
    const event = {
      type: 'resource',
      view: { url: 'https://example.com/blog/one?secret=x', referrer: 'https://search.example/?q=private' },
      resource: { url: 'https://example.com/api?access_token=private' },
    } as RumEvent;
    expect(sanitizeRumEvent(event)).toBe(true);
    expect(event.view.name).toBe('/blog/one');
    expect(JSON.stringify(event)).not.toMatch(/secret|private|access_token/);
  });
  it('accepts action events with no target', () => {
    const event = { type: 'action', view: { url: 'https://example.com/' }, action: { type: 'scroll' } } as RumEvent;
    expect(sanitizeRumEvent(event)).toBe(true);
  });
});
