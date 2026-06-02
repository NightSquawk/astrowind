import { z } from 'astro/zod';

export const MuxConfigSchema = z.object({
  enabled: z.boolean().default(true),
  tokenId: z.string().optional(),
  tokenSecret: z.string().optional(),
  defaultPlayerSettings: z
    .object({
      autoplay: z.boolean().default(false),
      muted: z.boolean().default(false),
      loop: z.boolean().default(false),
      controls: z.boolean().default(true),
      preload: z.enum(['auto', 'metadata', 'none']).default('metadata'),
    })
    .optional(),
  analytics: z
    .object({
      trackPlayback: z.boolean().default(true),
      trackEngagement: z.boolean().default(true),
    })
    .optional(),
});

export type MuxConfig = z.infer<typeof MuxConfigSchema>;
