import { isPreviewing } from '@builder.io/sdk-react';

export const BUILDER_MODEL = 'page';

/**
 * Public API key for the demo Builder space. Set PUBLIC_BUILDER_API_KEY to use
 * another space; the key is public by design because the editor runs in the browser.
 */
const DEMO_PUBLIC_API_KEY = 'dbca46c0d48940b09ef11fa8978c6dea';

export const BUILDER_API_KEY =
	import.meta.env.PUBLIC_BUILDER_API_KEY ||
	process.env.PUBLIC_BUILDER_API_KEY ||
	DEMO_PUBLIC_API_KEY;

/**
 * `isEditing()` from the SDK only returns true inside the editor iframe, so it
 * is useless during SSR. Preview mode is `builder.preview=` and does work on
 * the server via `isPreviewing(searchParams)`.
 */
export function getRequestMode(url: URL) {
	const sp = url.searchParams;
	const editing =
		sp.has('__builder_editing__') || sp.has('builder.frameEditing');
	const previewing = editing || isPreviewing(sp);
	return { editing, previewing };
}

/**
 * Any Builder query (`builder.*` or `__builder_editing__`) must skip the public
 * cache. Editor URLs carry overrides and preview flags that would otherwise be
 * stored under a cache key and reused.
 */
export function isUncachedBuilderRequest(url: URL) {
	if (url.searchParams.has('__builder_editing__')) return true;
	for (const key of url.searchParams.keys()) {
		if (key.startsWith('builder.')) return true;
	}
	return false;
}
