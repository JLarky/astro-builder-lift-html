import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
	type KeyboardEvent,
	type ReactNode,
} from 'react';
import {
	albums,
	formatMatchedFields,
	genres,
	matchedFields,
	matchesQuery,
	noteOnlyMatch,
	queryTokens,
	type Album,
} from './catalog';
import styles from './LiveSearch.module.css';

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function Highlight({ text, query }: { text: string; query: string }) {
	const tokens = queryTokens(query);
	if (tokens.length === 0) return text;
	const pattern = tokens
		.slice()
		.sort((a, b) => b.length - a.length)
		.map(escapeRegExp)
		.join('|');
	const parts = text.split(new RegExp(`(${pattern})`, 'ig'));
	const tokenSet = new Set(tokens.map((token) => token.toLowerCase()));
	return parts.map((part, index) =>
		tokenSet.has(part.toLowerCase()) ? (
			<mark key={index} className={styles.mark}>
				{part}
			</mark>
		) : (
			part
		),
	);
}

function AlbumRow({
	album,
	query,
	selected,
	optionId,
	rowRef,
	onSelect,
}: {
	album: Album;
	query: string;
	selected: boolean;
	optionId: string;
	rowRef?: (node: HTMLLIElement | null) => void;
	onSelect: () => void;
}) {
	const showNote = noteOnlyMatch(album, query);
	return (
		<li
			id={optionId}
			role="option"
			aria-selected={selected}
			ref={rowRef}
			className={styles.row}
			onMouseDown={(event) => {
				event.preventDefault();
				onSelect();
			}}
		>
			<div className={styles.rowTop}>
				<span className={styles.rowTitle}>
					<Highlight text={album.title} query={query} />
				</span>
				<span className={styles.genre}>
					<Highlight text={album.genre} query={query} />
				</span>
			</div>
			<p className={styles.rowMeta}>
				<Highlight text={album.artist} query={query} />
				<span aria-hidden="true"> · </span>
				<Highlight text={String(album.year)} query={query} />
			</p>
			{showNote ? (
				<p className={styles.rowNote}>
					<Highlight text={album.note} query={query} />
				</p>
			) : null}
		</li>
	);
}

function Detail({
	album,
	query,
	position,
	total,
}: {
	album: Album;
	query: string;
	position: number;
	total: number;
}) {
	const matched = matchedFields(album, query);
	const summary = formatMatchedFields(matched);
	return (
		<article className={styles.detail} aria-live="off">
			<p className={styles.eyebrow}>
				{position} of {total}
			</p>
			<h2 className={styles.detailTitle}>
				<Highlight text={album.title} query={query} />
			</h2>
			<p className={styles.detailArtist}>
				<Highlight text={album.artist} query={query} />
			</p>
			<p className={styles.detailMeta}>
				<Highlight text={String(album.year)} query={query} />
				<span className={styles.genre}>
					<Highlight text={album.genre} query={query} />
				</span>
			</p>
			<p className={styles.detailNote}>
				<Highlight text={album.note} query={query} />
			</p>
			{summary ? (
				<p className={styles.matched}>{summary}</p>
			) : (
				<p className={styles.matched}>Full shelf</p>
			)}
		</article>
	);
}

export default function LiveSearch() {
	const inputId = useId();
	const listId = useId();
	const hintId = useId();
	const [query, setQuery] = useState('');
	const [activeIndex, setActiveIndex] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const activeRef = useRef<HTMLLIElement>(null);
	const setActiveNode = useCallback((node: HTMLLIElement | null) => {
		activeRef.current = node;
	}, []);

	const results = useMemo(
		() => albums.filter((album) => matchesQuery(album, query)),
		[query],
	);
	const safeIndex =
		results.length === 0 ? 0 : Math.min(activeIndex, results.length - 1);
	const active = results[safeIndex];
	const filtering = queryTokens(query).length > 0;

	useEffect(() => {
		const node = activeRef.current;
		const list = listRef.current;
		if (!node || !list) return;
		const nodeRect = node.getBoundingClientRect();
		const listRect = list.getBoundingClientRect();
		if (nodeRect.top < listRect.top) {
			list.scrollTop -= listRect.top - nodeRect.top;
		} else if (nodeRect.bottom > listRect.bottom) {
			list.scrollTop += nodeRect.bottom - listRect.bottom;
		}
	}, [active?.id]);

	function updateQuery(next: string) {
		setQuery(next);
		setActiveIndex(0);
	}

	function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (results.length === 0) return;
			setActiveIndex((index) => Math.min(index + 1, results.length - 1));
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (results.length === 0) return;
			setActiveIndex((index) => Math.max(index - 1, 0));
		} else if (event.key === 'Escape' && query) {
			event.preventDefault();
			updateQuery('');
		}
	}

	let countLabel = `${albums.length} records`;
	if (filtering && results.length === 0) countLabel = 'No matches';
	else if (filtering && results.length === 1) countLabel = '1 match';
	else if (filtering) countLabel = `${results.length} matches`;

	let body: ReactNode;
	if (!active) {
		body = (
			<div className={styles.empty} role="status">
				<p className={styles.emptyTitle}>
					No records match “
					<span className={styles.queryText}>{query.trim()}</span>”
				</p>
				<p className={styles.emptyCopy}>
					Try a title, an artist, a year, or one of the genres above.
				</p>
				<button
					type="button"
					className={styles.emptyClear}
					onClick={() => {
						updateQuery('');
						inputRef.current?.focus();
					}}
				>
					Clear search
				</button>
			</div>
		);
	} else {
		body = (
			<div className={styles.layout}>
				<ul
					id={listId}
					role="listbox"
					aria-label="Matching records"
					ref={listRef}
					className={styles.list}
				>
					{results.map((album, index) => (
						<AlbumRow
							key={album.id}
							album={album}
							query={query}
							selected={index === safeIndex}
							optionId={`${listId}-${album.id}`}
							rowRef={index === safeIndex ? setActiveNode : undefined}
							onSelect={() => setActiveIndex(index)}
						/>
					))}
				</ul>
				<Detail
					album={active}
					query={query}
					position={safeIndex + 1}
					total={results.length}
				/>
			</div>
		);
	}

	return (
		<div className={styles.root}>
			<div className={styles.toolbar}>
				<label className={styles.label} htmlFor={inputId}>
					Search records
				</label>
				<p className={styles.count} aria-live="polite">
					{countLabel}
				</p>
			</div>
			<div className={styles.field}>
				<input
					id={inputId}
					ref={inputRef}
					className={styles.input}
					role="combobox"
					aria-autocomplete="list"
					aria-expanded={results.length > 0}
					aria-controls={active ? listId : undefined}
					aria-activedescendant={active ? `${listId}-${active.id}` : undefined}
					aria-describedby={hintId}
					placeholder="Try night, Sol, piano, 2019…"
					value={query}
					autoFocus
					autoComplete="off"
					autoCorrect="off"
					spellCheck={false}
					onChange={(event) => updateQuery(event.target.value)}
					onKeyDown={onKeyDown}
				/>
				{query ? (
					<button
						type="button"
						className={styles.clear}
						onMouseDown={(event) => event.preventDefault()}
						onClick={() => updateQuery('')}
					>
						Clear
					</button>
				) : null}
			</div>
			<div className={styles.chips} role="group" aria-label="Filter by genre">
				{genres.map((genre) => {
					const pressed =
						query.trim().toLowerCase() === genre.name.toLowerCase();
					const chipQuery = pressed ? '' : genre.name;
					return (
						<button
							key={genre.name}
							type="button"
							className={styles.chip}
							aria-pressed={pressed}
							onMouseDown={(event) => event.preventDefault()}
							onClick={() => updateQuery(chipQuery)}
						>
							{genre.name}
							<span className={styles.chipCount}>{genre.count}</span>
						</button>
					);
				})}
			</div>
			<p id={hintId} className={styles.hint}>
				<kbd>↑</kbd>
				<kbd>↓</kbd> move the selection
				<span aria-hidden="true"> · </span>
				<kbd>Esc</kbd> clears
			</p>
			{body}
		</div>
	);
}
