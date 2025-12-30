import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
    hero: z.string().optional(),
    heroAlt: z.string().optional(),
    heroWidth: z.number().optional(),
    heroHeight: z.number().optional()
  })
});

export const collections = { posts };
