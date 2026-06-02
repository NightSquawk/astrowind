import type { Locale } from './config';

export const UI_STRINGS: Record<
  Locale,
  {
    languageSwitcherLabel: string;
    mainNavigationLabel: string;
    rssFeedLabel: string;
    footerLabels: {
      terms: string;
      privacy: string;
    };
    blog: {
      title: string;
      subtitle: string;
      categoryTitle: (category: string, page: number) => string;
      tagTitle: (tag: string, page: number) => string;
      tagHeading: (tag: string) => string;
      pageTitle: (page: number) => string;
    };
  }
> = {
  en: {
    languageSwitcherLabel: 'Change language',
    mainNavigationLabel: 'Main navigation',
    rssFeedLabel: 'RSS Feed',
    footerLabels: {
      terms: 'Terms',
      privacy: 'Privacy Policy',
    },
    blog: {
      title: 'The Blog',
      subtitle:
        'A statically generated blog example with news, tutorials, resources and other interesting content related to AstroWind',
      categoryTitle: (category, page) => `Category '${category}'${page > 1 ? ` — Page ${page}` : ''}`,
      tagTitle: (tag, page) => `Posts by tag '${tag}'${page > 1 ? ` — Page ${page}` : ''}`,
      tagHeading: (tag) => `Tag: ${tag}`,
      pageTitle: (page) => `Blog${page > 1 ? ` — Page ${page}` : ''}`,
    },
  },
  es: {
    languageSwitcherLabel: 'Cambiar idioma',
    mainNavigationLabel: 'Navegación principal',
    rssFeedLabel: 'Feed RSS',
    footerLabels: {
      terms: 'Términos',
      privacy: 'Política de privacidad',
    },
    blog: {
      title: 'El Blog',
      subtitle:
        'Un blog generado estáticamente con noticias, tutoriales, recursos y otro contenido interesante relacionado con AstroWind',
      categoryTitle: (category, page) => `Categoría '${category}'${page > 1 ? ` — Página ${page}` : ''}`,
      tagTitle: (tag, page) => `Publicaciones con etiqueta '${tag}'${page > 1 ? ` — Página ${page}` : ''}`,
      tagHeading: (tag) => `Etiqueta: ${tag}`,
      pageTitle: (page) => `Blog${page > 1 ? ` — Página ${page}` : ''}`,
    },
  },
};

export const getUiStrings = (locale: Locale) => UI_STRINGS[locale] ?? UI_STRINGS.en;
