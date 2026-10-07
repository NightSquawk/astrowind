import { expect, it } from 'vitest';
import { buildRedirectDestination } from '../../src/utils/redirect-destination';
it('preserves configured parameters and merges campaign parameters', () => {
  const destination = buildRedirectDestination(
    { destination: '/contact?offer=demo', utmParams: { utm_source: 'default' } },
    new URL('https://example.com/go?utm_source=visitor&utm_campaign=test')
  );
  expect(destination?.pathname).toBe('/contact');
  expect(destination?.searchParams.get('offer')).toBe('demo');
  expect(destination?.searchParams.get('utm_source')).toBe('visitor');
});
it('never accepts a destination from a query parameter', () => {
  const destination = buildRedirectDestination(
    { destination: '/contact' },
    new URL('https://example.com/redirect?source=/go&dest=https://evil.test&type=permanent')
  );
  expect(destination?.toString()).toBe('https://example.com/contact');
});
it('rejects unknown short links and non-HTTP configured destinations', () => {
  expect(buildRedirectDestination(null, new URL('https://example.com'))).toBeUndefined();
  for (const destination of ['javascript:alert(1)', 'data:text/html,x', '//evil.test', 'https://']) {
    expect(buildRedirectDestination({ destination }, new URL('https://example.com'))).toBeUndefined();
  }
});
