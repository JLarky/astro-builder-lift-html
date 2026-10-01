/** Paths a Builder entry targets, from `query` urlPath rules and `data.url`. */
export function urlPathsOf(entry: unknown): string[] {
	if (!entry || typeof entry !== 'object') return [];
	const record = entry as Record<string, unknown>;
	const paths = new Set<string>();
	const query = record.query;
	if (Array.isArray(query)) {
		for (const item of query) {
			if (!item || typeof item !== 'object') continue;
			const rule = item as Record<string, unknown>;
			if (rule.property !== 'urlPath') continue;
			addPathValues(paths, rule.value);
		}
	}
	const data = record.data;
	if (data && typeof data === 'object') {
		addPathValues(paths, (data as Record<string, unknown>).url);
	}
	return [...paths];
}

function addPathValues(paths: Set<string>, value: unknown) {
	if (typeof value === 'string') {
		const normalized = normalizeUrlPath(value);
		if (normalized) paths.add(normalized);
		return;
	}
	if (Array.isArray(value)) {
		for (const item of value) addPathValues(paths, item);
	}
}

export function normalizeUrlPath(value: string): string | null {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
	if (withSlash === '/') return '/';
	return withSlash.replace(/\/+$/, '');
}
