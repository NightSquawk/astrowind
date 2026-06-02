import { DEFAULT_LOCALE, LOCALE_CONFIG, SUPPORTED_LOCALES, type Locale } from './config';

export const isLocale = (value: string | undefined | null): value is Locale =>
  !!value && SUPPORTED_LOCALES.includes(value as Locale);

export const normalizeLocale = (value: string | undefined | null): Locale => (isLocale(value) ? value : DEFAULT_LOCALE);

export const getLocaleConfig = (locale: string | undefined | null) => LOCALE_CONFIG[normalizeLocale(locale)];

export const trimLocaleSlash = (path = '') => path.replace(/^\/+|\/+$/g, '');

export const getLocaleFromPathname = (pathname = ''): Locale => {
  const firstSegment = trimLocaleSlash(pathname).split('/')[0];
  return normalizeLocale(firstSegment);
};

export const stripLocaleFromPathname = (pathname = ''): string => {
  const cleanPath = trimLocaleSlash(pathname);
  if (!cleanPath) return '/';

  const segments = cleanPath.split('/');
  if (isLocale(segments[0])) {
    segments.shift();
  }

  return segments.length ? `/${segments.join('/')}` : '/';
};

export const localizePathname = (pathname = '/', locale: string | undefined | null = DEFAULT_LOCALE): string => {
  const normalizedLocale = normalizeLocale(locale);
  const pathWithoutLocale = stripLocaleFromPathname(pathname);
  const cleanPath = trimLocaleSlash(pathWithoutLocale);

  return cleanPath ? `/${normalizedLocale}/${cleanPath}` : `/${normalizedLocale}/`;
};

export const getAlternateLocaleLinks = (pathname = '/') =>
  SUPPORTED_LOCALES.map((locale) => ({
    locale,
    label: LOCALE_CONFIG[locale].label,
    shortLabel: LOCALE_CONFIG[locale].shortLabel,
    language: LOCALE_CONFIG[locale].language,
    href: localizePathname(pathname, locale),
  }));
