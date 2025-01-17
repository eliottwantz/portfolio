export const allTags = [
	"Sveltekit",
	"Next.js",
	"Alpine.js",
	"Postgres",
	"Tailwindcss",
	"Laravel",
	"Livewire",
	"Stripe",
	"Go",
	"OpenAI",
	"ElevenLabs",
	"Prisma",
	"Turso",
	"TypeScript",
	"Kysely",
	"Python",
	"Langchain",
	"Ollama",
	"AI",
] as const;
export type Tag = (typeof allTags)[number];

export const constructTagsOfPost = (tags: Tag[]): Tag[] => [...new Set(tags)];
