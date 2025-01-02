<script lang="ts">
    import type { Tag } from '@/data/tags';
    import { getProjectsByTag } from '@/utils/data-utils';
    import type { CollectionEntry } from 'astro:content';

    export let tags: { name: Tag; slug: string }[];
    export let posts: CollectionEntry<'projects'>[];

    let filteredTags: { name: Tag; slug: string }[] = tags;
    let searchTerm = '';

    const filterTags = () => {
        if (!searchTerm) {
            filteredTags = tags;
            return;
        }
        filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };
</script>

<form class="mb-6 sm:mb-8 max-w-96" on:submit|preventDefault={filterTags}>
    <label class="sr-only" for="search">Search</label>
    <div class="relative flex items-center">
        <input
            type="text"
            id="search"
            name="search"
            bind:value={searchTerm}
            on:input={filterTags}
            class="block w-full px-4 py-2 rounded-md border border-gray-300 text-sm focus:outline-gray-500 focus:outline-2 focus:border-gray-300 dark:text-neutral-900"
            placeholder="Search tags..."
        />
        <div class="absolute text-gray-300 right-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                ><path
                    fill="currentColor"
                    d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
                ></path></svg
            >
        </div>
    </div>
</form>

{#each filteredTags as tag}
    {@const postCount = getProjectsByTag(posts, tag.slug).length}
    <a class="mb-10 flex justify-between items-start gap-8 group sm:mb-12" href={`/tags/${tag.slug}`}>
        <div class="grow">
            <h2
                class="text-xl leading-tight font-serif font-medium group-hover:underline group-hover:decoration-dashed group-hover:underline-offset-4 group-hover:decoration-1 sm:text-2xl"
            >
                {tag.name}
            </h2>
            <div class="mt-1 text-sm leading-normal">
                {postCount}
                {postCount === 1 ? 'post' : 'posts'}
            </div>
        </div>
        <div class="hidden font-serif italic opacity-0 transition group-hover:opacity-100 sm:inline-flex sm:gap-1 sm:items-center sm:shrink-0">
            View Tag Archive <span>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="fill-current w-4 h-4">
                    <path
                        d="M4.286 12c0-0.533 0.432-0.964 0.964-0.964v0h11.172l-4.14-4.138c-0.175-0.175-0.283-0.416-0.283-0.683 0-0.533 0.432-0.965 0.965-0.965 0.267 0 0.508 0.108 0.683 0.283v0l5.785 5.785c0.175 0.175 0.283 0.416 0.283 0.683s-0.108 0.508-0.283 0.683l-5.785 5.785c-0.175 0.175-0.416 0.283-0.683 0.283-0.533 0-0.965-0.432-0.965-0.965 0-0.267 0.108-0.508 0.283-0.683v0l4.14-4.138h-11.172c-0.533 0-0.964-0.432-0.964-0.964v0z"
                    ></path>
                </svg>
            </span>
        </div>
    </a>
{/each}
