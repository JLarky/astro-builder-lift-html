import {
	fetchOneEntry,
	getBuilderSearchParams,
	type BuilderContent,
} from '@builder.io/sdk-react';
import { collectContent } from './collect-content';
import { BUILDER_API_KEY, BUILDER_MODEL } from './config';

const PUBLIC_TIMEOUT_MS = 3_000;
const PREVIEW_TIMEOUT_MS = 10_000;

export type PageResult =
	| { kind: 'ok'; content: BuilderContent; components: Set<string> }
	| { kind: 'not-found' }
	| { kind: 'unavailable'; message: string };

/**
 * `previewing` uses a longer timeout so the editor is not failed by a slow API.
 */
export async function loadPage(
	urlPath: string,
	url: URL,
	options: {
		previewing: boolean;
		/** Optional fetch override. Production omits it. */
		fetch?: typeof fetch;
	},
): Promise<PageResult> {
	const { previewing } = options;
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
		const { components } = collectContent(content);
		return { kind: 'ok', content, components };
	} catch (error) {
		console.error('Builder fetch failed', error);
		return { kind: 'unavailable', message: errorMessage(error) };
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
