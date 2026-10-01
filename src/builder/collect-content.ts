/**
 * Walk Builder JSON for custom component names. The walk is generic so
 * Columns, uiBlocks, symbols, and A/B variations are covered without
 * per-block knowledge.
 */
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
		const record = node as Record<string, unknown>;
		const component = record.component;
		if (
			record['@type'] === '@builder.io/sdk:Element' &&
			component &&
			typeof component === 'object'
		) {
			const name = (component as Record<string, unknown>).name;
			if (typeof name === 'string') components.add(name);
		}
		for (const value of Object.values(record)) walk(value);
	};
	walk(root);
	return components;
}
