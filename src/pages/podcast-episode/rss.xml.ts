import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from 'astrowind:config';

export async function GET(context: any) {
	const episodes = await getCollection('podcast-episodes');
	const sortedEpisodes = episodes.sort((a, b) => 
		b.data.episodeNumber - a.data.episodeNumber
	);

	// Get podcast name from config if available, otherwise use default
	// Clients should configure this via TemplateConfig
	const podcastName = 'Podcast'; // TODO: Get from config.podcast?.name

	return rss({
		title: `${podcastName} | ${SITE.title}`,
		description: `${SITE.description} - ${podcastName} episodes`,
		site: context.site,
		items: sortedEpisodes.map((episode) => ({
			title: episode.data.title,
			description: episode.data.description,
			pubDate: episode.data.pubDate,
			link: `/podcast-episode/${episode.slug}`,
		})),
		customData: `<language>en-us</language>`,
	});
}
