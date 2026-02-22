import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    isFeatured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    seo: z
      .object({
        image: z.object({
          src: z.string(),
          alt: z.string(),
        }),
      })
      .optional(),
  }),
});

export const collections = { projects };
