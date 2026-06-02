/**
 * JSON-LD Schema.org Helper Utilities
 *
 * These utilities help generate structured data for SEO.
 * See: https://schema.org/ and https://developers.google.com/search/docs/appearance/structured-data
 */

export interface ImageObject {
  '@type': 'ImageObject';
  url: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface PostalAddress {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

export interface ContactPoint {
  '@type': 'ContactPoint';
  telephone?: string;
  contactType?: string;
  email?: string;
  areaServed?: string;
  availableLanguage?: string[];
}

export interface OpeningHoursSpecification {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}

export interface GeoCoordinates {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

export interface Person {
  '@type': 'Person';
  name: string;
  url?: string;
  image?: string | ImageObject;
  sameAs?: string[];
  jobTitle?: string;
  email?: string;
}

/**
 * Generate Organization schema
 * @see https://schema.org/Organization
 */
export function createOrganizationSchema(data: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  email?: string;
  telephone?: string;
  address?: Partial<PostalAddress>;
  sameAs?: string[];
  founder?: Person;
  foundingDate?: string;
}) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
  };

  if (data.logo) schema.logo = data.logo;
  if (data.description) schema.description = data.description;
  if (data.email) schema.email = data.email;
  if (data.telephone) schema.telephone = data.telephone;
  if (data.sameAs) schema.sameAs = data.sameAs;
  if (data.founder) schema.founder = data.founder;
  if (data.foundingDate) schema.foundingDate = data.foundingDate;

  if (data.address) {
    schema.address = {
      '@type': 'PostalAddress',
      ...data.address,
    };
  }

  return schema;
}

/**
 * Generate LocalBusiness schema
 * @see https://schema.org/LocalBusiness
 */
export function createLocalBusinessSchema(data: {
  name: string;
  description?: string;
  url: string;
  telephone?: string;
  email?: string;
  image?: string | string[];
  address?: Partial<PostalAddress>;
  geo?: { latitude: number; longitude: number };
  openingHours?: OpeningHoursSpecification[];
  priceRange?: string;
  servesCuisine?: string;
  acceptsReservations?: boolean;
  paymentAccepted?: string[];
  currenciesAccepted?: string;
}) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    url: data.url,
  };

  if (data.description) schema.description = data.description;
  if (data.telephone) schema.telephone = data.telephone;
  if (data.email) schema.email = data.email;
  if (data.image) schema.image = data.image;
  if (data.priceRange) schema.priceRange = data.priceRange;
  if (data.servesCuisine) schema.servesCuisine = data.servesCuisine;
  if (data.acceptsReservations !== undefined) schema.acceptsReservations = data.acceptsReservations;
  if (data.paymentAccepted) schema.paymentAccepted = data.paymentAccepted;
  if (data.currenciesAccepted) schema.currenciesAccepted = data.currenciesAccepted;

  if (data.address) {
    schema.address = {
      '@type': 'PostalAddress',
      ...data.address,
    };
  }

  if (data.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: data.geo.latitude,
      longitude: data.geo.longitude,
    };
  }

  if (data.openingHours && data.openingHours.length > 0) {
    schema.openingHoursSpecification = data.openingHours;
  }

  return schema;
}

/**
 * Generate Article schema (for blog posts, news articles)
 * @see https://schema.org/Article
 */
export function createArticleSchema(data: {
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished: string;
  dateModified?: string;
  author: Person | Person[];
  publisher: {
    name: string;
    logo?: string;
  };
  url: string;
  keywords?: string[];
  articleSection?: string;
  wordCount?: number;
}) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    datePublished: data.datePublished,
    author: data.author,
    url: data.url,
  };

  if (data.description) schema.description = data.description;
  if (data.image) schema.image = data.image;
  if (data.dateModified) schema.dateModified = data.dateModified;
  if (data.keywords) schema.keywords = data.keywords.join(', ');
  if (data.articleSection) schema.articleSection = data.articleSection;
  if (data.wordCount) schema.wordCount = data.wordCount;

  schema.publisher = {
    '@type': 'Organization',
    name: data.publisher.name,
  };

  if (data.publisher.logo) {
    schema.publisher.logo = {
      '@type': 'ImageObject',
      url: data.publisher.logo,
    };
  }

  return schema;
}

/**
 * Generate Product schema
 * @see https://schema.org/Product
 */
export function createProductSchema(data: {
  name: string;
  description?: string;
  image?: string | string[];
  sku?: string;
  brand?: string;
  offers?: {
    price: number;
    priceCurrency: string;
    availability?: string;
    url?: string;
    validFrom?: string;
    validThrough?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  review?: Array<{
    author: string;
    datePublished: string;
    reviewBody: string;
    reviewRating: {
      ratingValue: number;
      bestRating?: number;
    };
  }>;
}) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
  };

  if (data.description) schema.description = data.description;
  if (data.image) schema.image = data.image;
  if (data.sku) schema.sku = data.sku;

  if (data.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: data.brand,
    };
  }

  if (data.offers) {
    schema.offers = {
      '@type': 'Offer',
      price: data.offers.price,
      priceCurrency: data.offers.priceCurrency,
    };

    if (data.offers.availability) schema.offers.availability = data.offers.availability;
    if (data.offers.url) schema.offers.url = data.offers.url;
    if (data.offers.validFrom) schema.offers.validFrom = data.offers.validFrom;
    if (data.offers.validThrough) schema.offers.validThrough = data.offers.validThrough;
  }

  if (data.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.aggregateRating.ratingValue,
      reviewCount: data.aggregateRating.reviewCount,
      bestRating: data.aggregateRating.bestRating || 5,
      worstRating: data.aggregateRating.worstRating || 1,
    };
  }

  if (data.review && data.review.length > 0) {
    schema.review = data.review.map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.author,
      },
      datePublished: r.datePublished,
      reviewBody: r.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.reviewRating.ratingValue,
        bestRating: r.reviewRating.bestRating || 5,
      },
    }));
  }

  return schema;
}

/**
 * Generate FAQPage schema
 * @see https://schema.org/FAQPage
 */
export function createFAQSchema(data: {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

/**
 * Generate WebSite schema with SearchAction
 * @see https://schema.org/WebSite
 */
export function createWebSiteSchema(data: { name: string; url: string; searchUrl?: string }) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
  };

  if (data.searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: data.searchUrl,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
}

/**
 * Generate BreadcrumbList schema
 * @see https://schema.org/BreadcrumbList
 */
export function createBreadcrumbSchema(data: {
  items: Array<{
    name: string;
    url: string;
  }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate VideoObject schema
 * @see https://schema.org/VideoObject
 */
export function createVideoSchema(data: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string;
  width?: number;
  height?: number;
}) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: data.name,
    description: data.description,
    thumbnailUrl: data.thumbnailUrl,
    uploadDate: data.uploadDate,
  };

  if (data.contentUrl) schema.contentUrl = data.contentUrl;
  if (data.embedUrl) schema.embedUrl = data.embedUrl;
  if (data.duration) schema.duration = data.duration;

  if (data.width && data.height) {
    schema.width = data.width;
    schema.height = data.height;
  }

  return schema;
}

/**
 * Generate Event schema
 * @see https://schema.org/Event
 */
export function createEventSchema(data: {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location: {
    name: string;
    address?: Partial<PostalAddress>;
  };
  image?: string | string[];
  offers?: {
    price: number;
    priceCurrency: string;
    availability?: string;
    url?: string;
  };
  performer?: Person | Person[];
  organizer?: {
    name: string;
    url?: string;
  };
}) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.name,
    startDate: data.startDate,
  };

  if (data.description) schema.description = data.description;
  if (data.endDate) schema.endDate = data.endDate;
  if (data.image) schema.image = data.image;
  if (data.performer) schema.performer = data.performer;

  schema.location = {
    '@type': 'Place',
    name: data.location.name,
  };

  if (data.location.address) {
    schema.location.address = {
      '@type': 'PostalAddress',
      ...data.location.address,
    };
  }

  if (data.offers) {
    schema.offers = {
      '@type': 'Offer',
      price: data.offers.price,
      priceCurrency: data.offers.priceCurrency,
      availability: data.offers.availability || 'https://schema.org/InStock',
    };

    if (data.offers.url) schema.offers.url = data.offers.url;
  }

  if (data.organizer) {
    schema.organizer = {
      '@type': 'Organization',
      name: data.organizer.name,
    };

    if (data.organizer.url) schema.organizer.url = data.organizer.url;
  }

  return schema;
}
