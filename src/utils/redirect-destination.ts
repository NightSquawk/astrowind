import type { Redirect } from '../data/redirects';

/** Only destinations from our configuration are trusted; query strings cannot supply one. */
export function buildRedirectDestination(redirect: Redirect | null, requestUrl: URL): URL | undefined {
  if (!redirect || !/^(https?:\/\/|\/(?!\/))/i.test(redirect.destination)) return;
  let destination: URL;
  try {
    destination = new URL(redirect.destination, requestUrl.origin);
  } catch {
    return;
  }
  if (!['http:', 'https:'].includes(destination.protocol)) return;
  for (const [key, value] of Object.entries(redirect.utmParams || {})) {
    if (value) destination.searchParams.set(key, value);
  }
  requestUrl.searchParams.forEach((value, key) => {
    if (!['source', 'dest', 'type', 'category'].includes(key)) destination.searchParams.set(key, value);
  });
  return destination;
}
