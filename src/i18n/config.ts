export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALES = ['en', 'es'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_FALLBACKS = {
  es: 'en',
} satisfies Partial<Record<Locale, Locale>>;

export const LOCALE_CONFIG: Record<
  Locale,
  {
    label: string;
    shortLabel: string;
    language: string;
    textDirection: 'ltr' | 'rtl';
    openGraphLocale: string;
  }
> = {
  en: {
    label: 'English',
    shortLabel: 'EN',
    language: 'en-US',
    textDirection: 'ltr',
    openGraphLocale: 'en_US',
  },
  es: {
    label: 'Español',
    shortLabel: 'ES',
    language: 'es',
    textDirection: 'ltr',
    openGraphLocale: 'es_ES',
  },
};

export const SITEMAP_I18N_LOCALES: Record<Locale, string> = {
  en: LOCALE_CONFIG.en.language,
  es: LOCALE_CONFIG.es.language,
};
