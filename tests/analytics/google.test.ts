import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  consent: undefined as undefined | ((granted: boolean) => void),
  events: vi.fn(),
  stop: vi.fn(),
}));
vi.mock('../../src/utils/analytics-consent', () => ({
  observeAnalyticsConsent: (callback: (granted: boolean) => void) => {
    mocks.consent = callback;
    callback(false);
  },
}));
vi.mock('../../src/scripts/analytics-events', () => ({ initAnalyticsEvents: mocks.events }));
const listeners: EventListener[] = [];
beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  mocks.consent = undefined;
  mocks.events.mockReturnValue(mocks.stop);
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  Reflect.deleteProperty(window, 'gtag');
  delete window.dataLayer;
  history.replaceState({}, '', '/');
  const original = document.addEventListener.bind(document);
  vi.spyOn(document, 'addEventListener').mockImplementation((name, callback, options) => {
    if (name === 'astro:page-load') listeners.push(callback as EventListener);
    original(name, callback, options);
  });
});
afterEach(() => {
  for (const listener of listeners.splice(0)) document.removeEventListener('astro:page-load', listener);
  mocks.consent?.(false);
});
function config(id: string, elementId: string, hostname = 'example.com') {
  const element = document.createElement('script');
  element.type = 'application/json';
  element.id = elementId;
  element.textContent = JSON.stringify({ id, hostname });
  document.head.append(element);
}
function queue() {
  return (window.dataLayer || []).map((args) => Array.from(args as ArrayLike<unknown>));
}

it('keeps GA4 disabled on previews and before consent', async () => {
  config('G-TEST', 'google-analytics-config', 'production.example');
  await import('../../src/scripts/google-analytics');
  expect(mocks.consent).toBeUndefined();
  expect(document.querySelector('script[src]')).toBeNull();
  vi.resetModules();
  document.getElementById('google-analytics-config')!.remove();
  config('G-TEST', 'google-analytics-config');
  await import('../../src/scripts/google-analytics');
  expect(document.querySelector('script[src]')).toBeNull();
  expect(window.gtag).toBeUndefined();
  expect(Reflect.get(window, 'ga-disable-G-TEST')).toBe(true);
});
it('sends one sanitized GA4 page view per navigation and stops on withdrawal', async () => {
  config('G-TEST', 'google-analytics-config');
  history.replaceState({}, '', '/blog/?email=private@example.com#private');
  await import('../../src/scripts/google-analytics');
  mocks.consent!(true);
  expect(document.querySelectorAll('script[src]')).toHaveLength(1);
  const views = () => queue().filter((args) => args[0] === 'event' && args[1] === 'page_view');
  expect(views()).toHaveLength(1);
  expect(views()[0][2]).toMatchObject({ page_location: 'https://example.com/blog/' });
  document.dispatchEvent(new Event('astro:page-load'));
  expect(views()).toHaveLength(1);
  history.pushState({}, '', '/about/?secret=hidden');
  document.dispatchEvent(new Event('astro:page-load'));
  expect(views()).toHaveLength(2);
  mocks.consent!(false);
  expect(Reflect.get(window, 'ga-disable-G-TEST')).toBe(true);
  expect(mocks.stop).toHaveBeenCalled();
  history.pushState({}, '', '/contact/');
  document.dispatchEvent(new Event('astro:page-load'));
  expect(views()).toHaveLength(2);
  mocks.consent!(true);
  expect(document.querySelectorAll('script[src]')).toHaveLength(1);
  expect(views()).toHaveLength(3);
  expect(JSON.stringify(queue())).not.toMatch(/private@|secret=hidden/);
});
it('loads GTM only after consent and sends withdrawal to the container', async () => {
  config('GTM-TEST', 'gtm-config');
  await import('../../src/scripts/google-tag-manager');
  expect(document.querySelector('script[src]')).toBeNull();
  mocks.consent!(true);
  expect(document.querySelectorAll('script[src]')).toHaveLength(1);
  mocks.consent!(false);
  expect(queue().at(-1)).toEqual([
    'consent',
    'update',
    {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    },
  ]);
  mocks.consent!(true);
  expect(document.querySelectorAll('script[src]')).toHaveLength(1);
});
