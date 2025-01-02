import type { CollectionEntry } from "astro:content";
import { slugify } from "./common-utils";

export function sortItemsByDateDesc(
	itemA: CollectionEntry<"projects">,
	itemB: CollectionEntry<"projects">,
) {
	return (
		new Date(itemB.data.publishDate).getTime() -
		new Date(itemA.data.publishDate).getTime()
	);
}

export function getAllTags(posts: CollectionEntry<"projects">[]) {
	const tags = [
		...new Set(posts.flatMap((post) => post.data.tags || []).filter(Boolean)),
	];
	return tags
		.map((tag) => {
			return {
				name: tag,
				slug: slugify(tag),
			};
		})
		.filter((obj, pos, arr) => {
			return arr.map((mapObj) => mapObj.slug).indexOf(obj.slug) === pos;
		});
}

// export function getPostsByTag(posts: CollectionEntry<'projects'>[], tagSlug: string) {
//     const filteredPosts: CollectionEntry<'blog'>[] = posts.filter((post) => (post.data.tags || []).map((tag) => slugify(tag)).includes(tagSlug));
//     return filteredPosts;
// }
