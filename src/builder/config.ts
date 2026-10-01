import { isPreviewing } from '@builder.io/sdk-react';

export const BUILDER_MODEL = 'page';

/** Public demo space. `PUBLIC_BUILDER_API_KEY` overrides this when set. */
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
