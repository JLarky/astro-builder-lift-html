import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import {
	componentFolder,
	discoveredComponents,
	type RegisteredName,
} from './builder-registry';

/**
 * Server-only. `getBuilderContent` selects from this map. Do not import it
 * from the React registry: the editing island bundles the registry for the
 * browser, and these loaders are Astro script components.
 *
 * An empty array means the component has no lifted element.
 */
const loaderModules = import.meta.glob<AstroComponentFactory>(
	'./*/wc/Loader.astro',
	{ eager: true, import: 'default' },
);

const loadersByFolder = new Map<string, AstroComponentFactory[]>();
for (const [path, loader] of Object.entries(loaderModules)) {
	const folder = componentFolder(path);
	const list = loadersByFolder.get(folder) ?? [];
	list.push(loader);
	loadersByFolder.set(folder, list);
}

const knownFolders = new Set(discoveredComponents.map((entry) => entry.folder));
for (const folder of loadersByFolder.keys()) {
	if (!knownFolders.has(folder)) {
		throw new Error(`${folder}/wc/Loader.astro has no definition.ts`);
	}
}

export const wcLoaders = Object.fromEntries(
	discoveredComponents.map(({ folder, component }) => [
		component.name,
		loadersByFolder.get(folder) ?? [],
	]),
) satisfies Record<RegisteredName, AstroComponentFactory[]>;
