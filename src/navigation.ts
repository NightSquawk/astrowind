import { DEFAULT_LOCALE, type Locale } from './i18n/config';
import { getUiStrings } from './i18n/ui';
import { normalizeLocale } from './i18n/utils';
import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

const navText = {
  en: {
    homes: 'Homes',
    saas: 'SaaS',
    startup: 'Startup',
    mobileApp: 'Mobile App',
    personal: 'Personal',
    pages: 'Pages',
    features: 'Features (Anchor Link)',
    services: 'Services',
    pricing: 'Pricing',
    about: 'About us',
    contact: 'Contact',
    terms: 'Terms',
    privacy: 'Privacy policy',
    landing: 'Landing',
    leadGeneration: 'Lead Generation',
    sales: 'Long-form Sales',
    clickThrough: 'Click-Through',
    product: 'Product Details (or Services)',
    preLaunch: 'Coming Soon or Pre-Launch',
    subscription: 'Subscription',
    blog: 'Blog',
    blogList: 'Blog List',
    article: 'Article',
    articleMdx: 'Article (with MDX)',
    categoryPage: 'Category Page',
    tagPage: 'Tag Page',
    widgets: 'Widgets',
    download: 'Download',
  },
  es: {
    homes: 'Inicio',
    saas: 'SaaS',
    startup: 'Startup',
    mobileApp: 'App móvil',
    personal: 'Personal',
    pages: 'Páginas',
    features: 'Características',
    services: 'Servicios',
    pricing: 'Precios',
    about: 'Sobre nosotros',
    contact: 'Contacto',
    terms: 'Términos',
    privacy: 'Privacidad',
    landing: 'Landing',
    leadGeneration: 'Generación de leads',
    sales: 'Ventas long-form',
    clickThrough: 'Click-through',
    product: 'Detalles del producto',
    preLaunch: 'Próximamente',
    subscription: 'Suscripción',
    blog: 'Blog',
    blogList: 'Lista del blog',
    article: 'Artículo',
    articleMdx: 'Artículo (MDX)',
    categoryPage: 'Página de categoría',
    tagPage: 'Página de etiqueta',
    widgets: 'Widgets',
    download: 'Descargar',
  },
} satisfies Record<Locale, Record<string, string>>;

export const getHeaderData = (requestedLocale: Locale | string = DEFAULT_LOCALE) => {
  const locale = normalizeLocale(requestedLocale);
  const t = navText[locale];

  return {
    links: [
      {
        text: t.homes,
        links: [
          {
            text: t.saas,
            href: getPermalink('/homes/saas', 'page', locale),
          },
          {
            text: t.startup,
            href: getPermalink('/homes/startup', 'page', locale),
          },
          {
            text: t.mobileApp,
            href: getPermalink('/homes/mobile-app', 'page', locale),
          },
          {
            text: t.personal,
            href: getPermalink('/homes/personal', 'page', locale),
          },
        ],
      },
      {
        text: t.pages,
        links: [
          {
            text: t.features,
            href: getPermalink('/#features', 'page', locale),
          },
          {
            text: t.services,
            href: getPermalink('/services', 'page', locale),
          },
          {
            text: t.pricing,
            href: getPermalink('/pricing', 'page', locale),
          },
          {
            text: t.about,
            href: getPermalink('/about', 'page', locale),
          },
          {
            text: t.contact,
            href: getPermalink('/contact', 'page', locale),
          },
          {
            text: t.terms,
            href: getPermalink('/terms', 'page', locale),
          },
          {
            text: t.privacy,
            href: getPermalink('/privacy', 'page', locale),
          },
        ],
      },
      {
        text: t.landing,
        links: [
          {
            text: t.leadGeneration,
            href: getPermalink('/landing/lead-generation', 'page', locale),
          },
          {
            text: t.sales,
            href: getPermalink('/landing/sales', 'page', locale),
          },
          {
            text: t.clickThrough,
            href: getPermalink('/landing/click-through', 'page', locale),
          },
          {
            text: t.product,
            href: getPermalink('/landing/product', 'page', locale),
          },
          {
            text: t.preLaunch,
            href: getPermalink('/landing/pre-launch', 'page', locale),
          },
          {
            text: t.subscription,
            href: getPermalink('/landing/subscription', 'page', locale),
          },
        ],
      },
      {
        text: t.blog,
        links: [
          {
            text: t.blogList,
            href: getBlogPermalink(locale),
          },
          {
            text: t.article,
            href: getPermalink('get-started-website-with-astro-tailwind-css', 'post', locale),
          },
          {
            text: t.articleMdx,
            href: getPermalink('markdown-elements-demo-post', 'post', locale),
          },
          {
            text: t.categoryPage,
            href: getPermalink('tutorials', 'category', locale),
          },
          {
            text: t.tagPage,
            href: getPermalink('astro', 'tag', locale),
          },
        ],
      },
      {
        text: t.widgets,
        href: '#',
      },
    ],
    actions: [{ text: t.download, href: 'https://github.com/arthelokyo/astrowind', target: '_blank' }],
  };
};

export const getFooterData = (requestedLocale: Locale | string = DEFAULT_LOCALE) => {
  const locale = normalizeLocale(requestedLocale);
  const t = getUiStrings(locale);

  return {
    links: [
      {
        title: locale === 'es' ? 'Producto' : 'Product',
        links: [
          { text: locale === 'es' ? 'Características' : 'Features', href: '#' },
          { text: locale === 'es' ? 'Seguridad' : 'Security', href: '#' },
          { text: locale === 'es' ? 'Equipo' : 'Team', href: '#' },
          { text: locale === 'es' ? 'Empresas' : 'Enterprise', href: '#' },
          { text: locale === 'es' ? 'Historias de clientes' : 'Customer stories', href: '#' },
          { text: locale === 'es' ? 'Precios' : 'Pricing', href: '#' },
          { text: locale === 'es' ? 'Recursos' : 'Resources', href: '#' },
        ],
      },
      {
        title: 'Platform',
        links: [
          { text: 'Developer API', href: '#' },
          { text: 'Partners', href: '#' },
          { text: 'Atom', href: '#' },
          { text: 'Electron', href: '#' },
          { text: 'AstroWind Desktop', href: '#' },
        ],
      },
      {
        title: locale === 'es' ? 'Soporte' : 'Support',
        links: [
          { text: 'Docs', href: '#' },
          { text: locale === 'es' ? 'Foro comunitario' : 'Community Forum', href: '#' },
          { text: locale === 'es' ? 'Servicios profesionales' : 'Professional Services', href: '#' },
          { text: 'Skills', href: '#' },
          { text: 'Status', href: '#' },
        ],
      },
      {
        title: locale === 'es' ? 'Empresa' : 'Company',
        links: [
          { text: locale === 'es' ? 'Acerca de' : 'About', href: '#' },
          { text: 'Blog', href: '#' },
          { text: locale === 'es' ? 'Empleos' : 'Careers', href: '#' },
          { text: 'Press', href: '#' },
          { text: locale === 'es' ? 'Inclusión' : 'Inclusion', href: '#' },
          { text: locale === 'es' ? 'Impacto social' : 'Social Impact', href: '#' },
          { text: 'Shop', href: '#' },
        ],
      },
    ],
    secondaryLinks: [
      { text: t.footerLabels.terms, href: getPermalink('/terms', 'page', locale) },
      { text: t.footerLabels.privacy, href: getPermalink('/privacy', 'page', locale) },
    ],
    socialLinks: [
      { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
      { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
      { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
      { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
      { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/arthelokyo/astrowind' },
    ],
    footNote: `
    Made by <a class="text-blue-600 underline dark:text-muted" href="https://github.com/arthelokyo"> Arthelokyo</a> · All rights reserved.
  `,
  };
};

export const headerData = getHeaderData(DEFAULT_LOCALE);
export const footerData = getFooterData(DEFAULT_LOCALE);
