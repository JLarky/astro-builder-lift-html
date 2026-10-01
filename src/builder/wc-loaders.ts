import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import CounterLoader from './Counters/wc/Loader.astro';
import FaqLiftLoader from './FaqLift/wc/Loader.astro';
import type { RegisteredName } from './builder-registry';

/**
 * Server-only. `getBuilderContent` selects from this map. Do not import it
 * from the React registry: the editing island bundles the registry for the
 * browser, and these loaders are Astro script components.
 *
 * An empty array means the component has no lifted element. `astro check`
 * fails when a registered component is missing from this map.
 */
export const wcLoaders = {
	Counter: [CounterLoader],
	FaqReact: [],
	FaqLift: [FaqLiftLoader],
} satisfies Record<RegisteredName, AstroComponentFactory[]>;
