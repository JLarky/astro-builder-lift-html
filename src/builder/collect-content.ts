/**
 * Walk published Builder JSON for custom component names and inlined Symbol
 * entry ids. The walk is generic so Columns, uiBlocks, symbols, and A/B
 * variations are all covered without per-block knowledge.
 */
export function collectContent(root: unknown) {
	const components = new Set<string>();
	const entryIds = new Set<string>();
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
			const info = component as Record<string, unknown>;
			if (typeof info.name === 'string') components.add(info.name);
			const options = info.options;
			if (options && typeof options === 'object') {
				const symbol = (options as Record<string, unknown>).symbol;
				if (symbol && typeof symbol === 'object') {
					const entry = (symbol as Record<string, unknown>).entry;
					if (typeof entry === 'string') entryIds.add(entry);
				}
			}
		}
		for (const value of Object.values(record)) walk(value);
	};
	walk(root);
	return { components, entryIds };
}
