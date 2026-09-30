import { useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { catalog, type CatalogItem } from './items';
import styles from './styles.module.css';

function Highlight({ text, query }: { text: string; query: string }) {
	if (!query) return text;
	const lower = text.toLowerCase();
	const needle = query.toLowerCase();
	const nodes: ReactNode[] = [];
	let cursor = 0;
	let index = lower.indexOf(needle, cursor);
	let key = 0;
	while (index !== -1) {
		if (index > cursor) nodes.push(text.slice(cursor, index));
		nodes.push(
			<mark key={key++} className={styles.mark}>
				{text.slice(index, index + needle.length)}
			</mark>,
		);
		cursor = index + needle.length;
		index = lower.indexOf(needle, cursor);
	}
	if (cursor < text.length) nodes.push(text.slice(cursor));
	return nodes;
}

function matches(item: CatalogItem, query: string) {
	return `${item.title} ${item.category} ${item.blurb}`
		.toLowerCase()
		.includes(query);
}

export default function SearchWidget() {
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState('');
	const normalized = query.trim();
	const results = useMemo(() => {
		if (!normalized) return catalog;
		const needle = normalized.toLowerCase();
		return catalog.filter((item) => matches(item, needle));
	}, [normalized]);

	function clear() {
		setQuery('');
		inputRef.current?.focus();
	}

	const status = !normalized
		? `${catalog.length} components`
		: results.length === 0
			? `No matches for “${normalized}”`
			: results.length === 1
				? `1 match for “${normalized}”`
				: `${results.length} matches for “${normalized}”`;

	return (
		<section className={styles.widget} aria-label="Component search">
			<div className={styles.field}>
				<label className={styles.label} htmlFor={inputId}>
					Search components
				</label>
				<div className={styles.controls}>
					<input
						id={inputId}
						ref={inputRef}
						className={styles.input}
						type="text"
						role="searchbox"
						value={query}
						placeholder="Try dialog, overlay, or keyboard"
						autoComplete="off"
						spellCheck={false}
						onChange={(event) => setQuery(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === 'Escape' && query) {
								event.preventDefault();
								clear();
							}
						}}
					/>
					{query ? (
						<button type="button" className={styles.clear} onClick={clear}>
							Clear
						</button>
					) : null}
				</div>
			</div>
			<p className={styles.status} aria-live="polite">
				{status}
			</p>
			{results.length === 0 ? (
				<div className={styles.empty}>
					<p className={styles.emptyTitle}>Nothing matches that search.</p>
					<p className={styles.emptyBody}>
						“{normalized}” is not in any title, category, or description.
					</p>
					<button type="button" className={styles.showAll} onClick={clear}>
						Show all components
					</button>
				</div>
			) : (
				<ul className={styles.list}>
					{results.map((item) => (
						<li key={item.id} className={styles.card}>
							<p className={styles.category}>
								<Highlight text={item.category} query={normalized} />
							</p>
							<h2 className={styles.title}>
								<Highlight text={item.title} query={normalized} />
							</h2>
							<p className={styles.blurb}>
								<Highlight text={item.blurb} query={normalized} />
							</p>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
