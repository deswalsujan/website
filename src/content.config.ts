// Defines the "blog" content collection: markdown files in src/content/blog/,
// each validated against this schema (title, date, description, optional series/part/parts).
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		date: z.date(),
		description: z.string(),
		series: z.string().optional(),
		part: z.number().optional(),
		parts: z.number().optional(),
		repo: z.string().optional(),
	}),
});

export const collections = { blog };
