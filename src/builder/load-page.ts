import {
	fetchOneEntry,
	getBuilderSearchParams,
	type BuilderContent,
} from '@builder.io/sdk-react';
import { getCache, waitUntil } from '@vercel/functions';
import { collectContent } from './collect-content';
import { BUILDER_API_KEY, BUILDER_MODEL } from './config';

const PUBLIC_TIMEOUT_MS = 3_000;
const PREVIEW_TIMEOUT_MS = 10_000;
const FALLBACK_TTL_SECONDS = 7 * 24 * 60 * 60;

export type PageResult =
	| {
			kind: 'ok';
			content: BuilderContent;
			components: Set<string>;
			tags: string[];
			stale: boolean;
	  }
	| { kind: 'not-found' }
	| { kind: 'unavailable'; message: string };

/**
 * `previewing` uses a longer timeout and never reads or writes the public
 * fallback. `cacheable` is false for any Builder query string, so a draft
 * fetched via `builder.overrides` cannot become the visitor fallback.
 */
export async function loadPage(
	urlPath: string,
	url: URL,
	options: {
		previewing: boolean;
		cacheable: boolean;
		/** Optional fetch override. Production omits it; tests use it to simulate outages. */
		fetch?: typeof fetch;
	},
): Promise<PageResult> {
	const { previewing, cacheable } = options;
	try {
		const content = await fetchOneEntry({
			model: BUILDER_MODEL,
			apiKey: BUILDER_API_KEY,
			userAttributes: { urlPath },
			options: getBuilderSearchParams(url.searchParams),
			enrich: true,
			fetch: options.fetch,
			fetchOptions: {
				signal: AbortSignal.timeout(
					previewing ? PREVIEW_TIMEOUT_MS : PUBLIC_TIMEOUT_MS,
				),
			},
		});
		if (!content) return { kind: 'not-found' };
		const described = describe(content);
		if (
			cacheable &&
			content.published !== 'draft' &&
			content.published !== 'archived'
		) {
			rememberContent(urlPath, content, described.tags);
		}
		return { kind: 'ok', ...described, stale: false };
	} catch (error) {
		console.error('Builder fetch failed', error);
		if (cacheable) {
			const stale = await readFallback(urlPath);
			if (stale) {
				return { kind: 'ok', ...describe(stale), stale: true };
			}
		}
		return { kind: 'unavailable', message: errorMessage(error) };
	}
}

function describe(content: BuilderContent) {
	const { components, entryIds } = collectContent(content);
	if (typeof content.id === 'string') entryIds.add(content.id);
	const tags = [
		'builder:model:page',
		...[...entryIds].map((id) => `builder:entry:${id}`),
	];
	return { content, components, tags };
}

function fallbackKey(urlPath: string) {
	return `builder:page:${urlPath}`;
}

function rememberContent(
	urlPath: string,
	content: BuilderContent,
	tags: string[],
) {
	try {
		const write = getCache()
			.set(fallbackKey(urlPath), content, {
				ttl: FALLBACK_TTL_SECONDS,
				tags,
			})
			.catch((error: unknown) => {
				console.error('Failed to store Builder fallback content', error);
			});
		waitUntil(write);
	} catch (error) {
		console.error('Failed to store Builder fallback content', error);
	}
}

async function readFallback(urlPath: string): Promise<BuilderContent | null> {
	try {
		const value = await getCache().get(fallbackKey(urlPath));
		if (!value || typeof value !== 'object') return null;
		return value as BuilderContent;
	} catch (error) {
		console.error('Failed to read Builder fallback content', error);
		return null;
	}
}

function errorMessage(error: unknown) {
	if (error instanceof Error) {
		if (error.name === 'TimeoutError' || error.name === 'AbortError') {
			return 'Builder took too long to respond.';
		}
		return error.message;
	}
	return 'Builder is unavailable.';
}

export async function expireFallback(tags: string[]) {
	if (tags.length === 0) return;
	await getCache().expireTag(tags);
}
