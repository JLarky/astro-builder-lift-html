import { fetchOneEntry, getBuilderSearchParams } from '@builder.io/sdk-react';
import { apiKey } from '../config';
import { collectComponents } from './collect-content';
import { wcLoaders } from './wc-loaders';

function isLoaderName(
	name: string,
): name is Extract<keyof typeof wcLoaders, string> {
	return Object.hasOwn(wcLoaders, name);
}

function loadersFor(content: unknown, isEditing: boolean) {
	const selected = isEditing
		? Object.values(wcLoaders).flat()
		: [...collectComponents(content)].flatMap((name) =>
				isLoaderName(name) ? wcLoaders[name] : [],
			);
	return [...new Set(selected)];
}

export async function getBuilderContent(
	model: string,
	urlPath: string,
	searchParams: URLSearchParams,
) {
	/**
	 * `isEditing()` from the SDK only returns true inside the editor iframe, so it
	 * is useless during SSR. Editing is the `builder.editing` search param.
	 */
	const isEditing = searchParams.has('__builder_editing__');
	const content = await fetchOneEntry({
		model,
		apiKey,
		userAttributes: { urlPath },
		options: getBuilderSearchParams(searchParams),
		enrich: true,
	});

	return { content, isEditing, loaders: loadersFor(content, isEditing) };
}
