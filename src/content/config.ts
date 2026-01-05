import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.string().url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});

const podcastEpisodes = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		episodeNumber: z.number(),
		pubDate: z.coerce.date(),
		description: z.string(),
		eventInfo: z.object({
			date: z.string(),
			time: z.string(),
			location: z.string(),
			address: z.string(),
			format: z.string(),
			joinInstructions: z.string(),
			joinPhone: z.string().optional(),
		}).optional(),
		image: z.string().optional(),
		imageAlt: z.string().optional(),
		backgroundImage: z.string().optional(),
		youtubeUrl: z.string().optional(),
		spotifyUrl: z.string().optional(),
		appleUrl: z.string().optional(),
		amazonUrl: z.string().optional(),
		deezerUrl: z.string().optional(),
		nextEpisodeSlug: z.string().optional(),
		nextEpisodeTitle: z.string().optional(),
		previousEpisodeSlug: z.string().optional(),
		previousEpisodeTitle: z.string().optional(),
		seoTitle: z.string().optional(),
		seoDescription: z.string().optional(),
	}),
});

const campaigns = defineCollection({
	type: 'content',
	schema: z.object({
		id: z.string(),
		title: z.string(),
		shortUrl: z.string().optional(),
		description: z.string(),
		startDate: z.coerce.date(),
		endDate: z.coerce.date(),
		heroImage: z.string().optional(),
		heroImageAlt: z.string().optional(),
		utmParams: z.object({
			utm_source: z.string().optional(),
			utm_medium: z.string().optional(),
			utm_campaign: z.string().optional(),
			utm_term: z.string().optional(),
			utm_content: z.string().optional(),
		}).optional(),
		coupons: z.array(z.string()).optional(),
		seoTitle: z.string().optional(),
		seoDescription: z.string().optional(),
	}),
});

const coupons = defineCollection({
	type: 'content',
	schema: z.object({
		code: z.string(),
		title: z.string(),
		shortUrl: z.string().optional(),
		discountType: z.enum(['percent', 'fixed', 'bogo', 'free']),
		discountValue: z.number(),
		description: z.string(),
		expirationDate: z.coerce.date(),
		timezone: z.string().optional().default('America/Los_Angeles'), // Default to Pacific timezone
		terms: z.string().optional(),
		applicableServices: z.array(z.string()).optional(),
		heroImage: z.string().optional(),
		heroImageAlt: z.string().optional(),
		ctaUrl: z.string().optional(),
		ctaText: z.string().optional(),
		campaignId: z.string().optional(),
		destinationType: z.enum(['coupon_page', 'contact', 'custom']).default('coupon_page'),
		utmParams: z.object({
			utm_source: z.string().optional(),
			utm_medium: z.string().optional(),
			utm_campaign: z.string().optional(),
			utm_term: z.string().optional(),
			utm_content: z.string().optional(),
		}).optional(),
		campaignLinks: z.record(z.object({
			shortUrl: z.string(),
			utmParams: z.object({
				utm_source: z.string().optional(),
				utm_medium: z.string().optional(),
				utm_campaign: z.string().optional(),
				utm_term: z.string().optional(),
				utm_content: z.string().optional(),
			}).optional(),
		})).optional(),
		seoTitle: z.string().optional(),
		seoDescription: z.string().optional(),
	}),
});

export const collections = {
  post: postCollection,
  'podcast-episodes': podcastEpisodes,
  'campaigns': campaigns,
  'coupons': coupons,
};
