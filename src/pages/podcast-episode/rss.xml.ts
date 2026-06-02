import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { METADATA, SITE } from 'astrowind:config';
import { getContentSlug } from '~/utils/content-slug';

export async function GET() {
  const episodes = await getCollection('podcast-episodes');
  const sortedEpisodes = episodes.sort((a, b) => b.data.episodeNumber - a.data.episodeNumber);

  // Get podcast name from config if available, otherwise use default
  // Clients should configure this via TemplateConfig
  const podcastName = 'Podcast'; // TODO: Get from config.podcast?.name

  return rss({
    title: `${podcastName} | ${SITE.name}`,
    description: `${METADATA.description} - ${podcastName} episodes`,
    site: import.meta.env.SITE,
    items: sortedEpisodes.map((episode) => ({
      title: episode.data.title,
      description: episode.data.description,
      pubDate: episode.data.pubDate,
      link: `/podcast-episode/${getContentSlug(episode)}`,
    })),
    customData: `<language>en-us</language>`,
  });
}
