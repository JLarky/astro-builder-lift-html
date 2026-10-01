import type { BuilderBlock } from '@builder.io/sdk-react';

/**
 * Walk Builder JSON for custom component names. The walk is generic so
 * Columns, uiBlocks, symbols, and A/B variations are covered without
 * per-block knowledge.
 */
function isBuilderBlock(node: object): node is BuilderBlock {
	return '@type' in node && node['@type'] === '@builder.io/sdk:Element';
}

export function collectComponents(root: unknown) {
	const components = new Set<string>();
	const seen = new WeakSet<object>();
	const walk = (node: unknown): void => {
		if (!node || typeof node !== 'object' || seen.has(node)) return;
		seen.add(node);
		if (Array.isArray(node)) {
			node.forEach(walk);
			return;
		}
		if (isBuilderBlock(node)) {
			const name = node.component?.name;
			if (typeof name === 'string') components.add(name);
		}
		for (const value of Object.values(node)) walk(value);
	};
	walk(root);
	return components;
}
