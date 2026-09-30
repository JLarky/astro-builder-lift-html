import { useId, useMemo, useState, type KeyboardEvent } from 'react';
import styles from './styles.module.css';

type FaqItem = {
	id: string;
	question: string;
	answer: string;
};

type FaqTab = {
	id: string;
	label: string;
	items: FaqItem[];
};

const TABS: FaqTab[] = [
	{
		id: 'rendering',
		label: 'Rendering',
		items: [
			{
				id: 'hydrate',
				question: 'Does this FAQ hydrate?',
				answer:
					'Yes. Astro server-renders this React component, then client:load hydrates it. After that, React owns tab changes, accordion toggles, and search.',
			},
			{
				id: 'builder',
				question: 'Does this page use Builder.io?',
				answer:
					'No. The published Builder.io page stays on /builder-demo. This FAQ is a separate React island and does not register a Builder component.',
			},
			{
				id: 'first-paint',
				question: 'What is in the server HTML?',
				answer:
					'The tab buttons, the search field, and the questions for the active tab. The first answer in Rendering starts open. Other categories are not in the panel until you select them.',
			},
		],
	},
	{
		id: 'tabs',
		label: 'Tabs',
		items: [
			{
				id: 'memory',
				question: 'Do open answers survive a tab switch?',
				answer:
					'Yes. Each category keeps its own list of open questions. Leave Tabs, open something else, and come back: the same answers are still expanded.',
			},
			{
				id: 'keys',
				question: 'How do keyboard users change tabs?',
				answer:
					'Focus a tab, then use Left and Right arrow keys. Home jumps to the first category and End jumps to the last. The selected tab is the only one in the tab order.',
			},
			{
				id: 'badges',
				question: 'Why do the counts change when I search?',
				answer:
					'Each badge is the number of questions in that category that match the query. A zero means that tab has no match, but the tab stays so you can open its empty state.',
			},
		],
	},
	{
		id: 'answers',
		label: 'Answers',
		items: [
			{
				id: 'multi',
				question: 'Can more than one answer be open?',
				answer:
					'Yes. Opening one answer does not close the others. Expand all opens every question currently visible in this tab. Collapse all closes those same visible questions.',
			},
			{
				id: 'hidden',
				question: 'What happens to an open answer that search hides?',
				answer:
					'It stays open in state, but it leaves the list until the query matches it again. Clear the search and the answer is expanded exactly as you left it.',
			},
			{
				id: 'refresh',
				question: 'Does a refresh keep my place?',
				answer:
					'No. Open questions live in component state. A reload returns to Rendering with “Does this FAQ hydrate?” expanded and the search field empty.',
			},
		],
	},
	{
		id: 'search',
		label: 'Search',
		items: [
			{
				id: 'fields',
				question: 'Which text is searched?',
				answer:
					'The question and the answer, in every category, without case sensitivity. Matching letters are highlighted in the visible questions and answers.',
			},
			{
				id: 'stay',
				question: 'Why do empty tabs stay on screen?',
				answer:
					'Hiding a tab while the pointer is on it makes the row jump. The tab remains, its badge goes to zero, and the panel explains that nothing in that category matched.',
			},
			{
				id: 'clear',
				question: 'How do I reset the filter?',
				answer:
					'Clear the field with the × button or by deleting the text. Every category returns to its full list, and answers you had opened are still open.',
			},
		],
	},
];

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function Highlight({ text, query }: { text: string; query: string }) {
	const needle = query.trim();
	if (!needle) return text;
	const parts = text.split(new RegExp(`(${escapeRegExp(needle)})`, 'ig'));
	return parts.map((part, index) =>
		part.toLowerCase() === needle.toLowerCase() ? (
			<mark key={index} className={styles.mark}>
				{part}
			</mark>
		) : (
			part
		),
	);
}

function matches(item: FaqItem, query: string) {
	if (!query) return true;
	return `${item.question}\n${item.answer}`.toLowerCase().includes(query);
}

export default function Faq() {
	const uid = useId().replace(/:/g, '');
	const [tabId, setTabId] = useState(TABS[0].id);
	const [query, setQuery] = useState('');
	const [openByTab, setOpenByTab] = useState<Record<string, string[]>>({
		rendering: ['hydrate'],
	});

	const normalized = query.trim().toLowerCase();
	const active = TABS.find((tab) => tab.id === tabId) ?? TABS[0];
	const visible = useMemo(
		() => active.items.filter((item) => matches(item, normalized)),
		[active, normalized],
	);
	const counts = useMemo(() => {
		const next: Record<string, number> = {};
		for (const tab of TABS) {
			next[tab.id] = tab.items.filter((item) =>
				matches(item, normalized),
			).length;
		}
		return next;
	}, [normalized]);

	const openIds = openByTab[active.id] ?? [];
	const visibleOpenCount = visible.filter((item) =>
		openIds.includes(item.id),
	).length;
	const otherMatches = TABS.filter(
		(tab) => tab.id !== active.id && counts[tab.id] > 0,
	);

	function selectTab(id: string) {
		setTabId(id);
	}

	function onTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
		const index = TABS.findIndex((tab) => tab.id === tabId);
		let next = index;
		if (event.key === 'ArrowRight') next = (index + 1) % TABS.length;
		else if (event.key === 'ArrowLeft')
			next = (index - 1 + TABS.length) % TABS.length;
		else if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = TABS.length - 1;
		else return;
		event.preventDefault();
		const nextTab = TABS[next];
		setTabId(nextTab.id);
		document.getElementById(`${uid}-tab-${nextTab.id}`)?.focus();
	}

	function toggle(itemId: string) {
		setOpenByTab((prev) => {
			const current = prev[active.id] ?? [];
			const next = current.includes(itemId)
				? current.filter((id) => id !== itemId)
				: [...current, itemId];
			return { ...prev, [active.id]: next };
		});
	}

	function expandVisible() {
		setOpenByTab((prev) => {
			const current = new Set(prev[active.id] ?? []);
			for (const item of visible) current.add(item.id);
			return { ...prev, [active.id]: [...current] };
		});
	}

	function collapseVisible() {
		setOpenByTab((prev) => {
			const hide = new Set(visible.map((item) => item.id));
			const next = (prev[active.id] ?? []).filter((id) => !hide.has(id));
			return { ...prev, [active.id]: next };
		});
	}

	const status =
		visible.length === 0
			? `No matches in ${active.label}`
			: `Showing ${visible.length} of ${active.items.length} in ${active.label}`;

	return (
		<section className={styles.widget} aria-label="Tabbed FAQ">
			<div className={styles.toolbar}>
				<label className={styles.search}>
					<span className={styles.sr}>Search questions and answers</span>
					<input
						className={styles.searchInput}
						type="search"
						value={query}
						placeholder="Search questions and answers"
						onChange={(event) => setQuery(event.target.value)}
						autoComplete="off"
					/>
					{query ? (
						<button
							type="button"
							className={styles.clear}
							onClick={() => setQuery('')}
						>
							<span className={styles.sr}>Clear search</span>
							<span aria-hidden="true">×</span>
						</button>
					) : null}
				</label>
				<div className={styles.bulk}>
					<button
						type="button"
						onClick={expandVisible}
						disabled={
							visible.length === 0 || visibleOpenCount === visible.length
						}
					>
						Expand all
					</button>
					<button
						type="button"
						onClick={collapseVisible}
						disabled={visibleOpenCount === 0}
					>
						Collapse all
					</button>
				</div>
			</div>

			<div
				className={styles.tablist}
				role="tablist"
				aria-label="FAQ categories"
				onKeyDown={onTabKeyDown}
			>
				{TABS.map((tab) => {
					const selected = tab.id === active.id;
					const count = counts[tab.id] ?? 0;
					return (
						<button
							key={tab.id}
							type="button"
							role="tab"
							id={`${uid}-tab-${tab.id}`}
							className={
								count === 0 && normalized ? styles.tabEmpty : styles.tab
							}
							aria-selected={selected}
							aria-controls={`${uid}-panel`}
							tabIndex={selected ? 0 : -1}
							onClick={() => selectTab(tab.id)}
						>
							{tab.label}
							<span className={styles.badge}>{count}</span>
						</button>
					);
				})}
			</div>

			<div
				key={active.id}
				role="tabpanel"
				id={`${uid}-panel`}
				className={styles.panel}
				aria-labelledby={`${uid}-tab-${active.id}`}
			>
				<p className={styles.status} aria-live="polite">
					{status}
				</p>
				{visible.length === 0 ? (
					<p className={styles.empty}>
						Nothing in {active.label} matches “{query.trim()}”.
						{otherMatches.length > 0
							? ` Try ${otherMatches.map((tab) => tab.label).join(', ')}.`
							: ' Try a shorter word.'}
					</p>
				) : (
					<ul className={styles.list}>
						{visible.map((item) => {
							const open = openIds.includes(item.id);
							const answerId = `${uid}-answer-${item.id}`;
							return (
								<li
									key={item.id}
									className={open ? styles.itemOpen : styles.item}
								>
									<h3 className={styles.questionHeading}>
										<button
											type="button"
											className={styles.question}
											aria-expanded={open}
											aria-controls={answerId}
											onClick={() => toggle(item.id)}
										>
											<span className={styles.chevron} aria-hidden="true" />
											<Highlight text={item.question} query={query} />
										</button>
									</h3>
									<div
										className={open ? styles.answerWrapOpen : styles.answerWrap}
									>
										<div className={styles.answerClip}>
											<div
												id={answerId}
												aria-hidden={open ? undefined : true}
												className={styles.answer}
											>
												<Highlight text={item.answer} query={query} />
											</div>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</section>
	);
}
