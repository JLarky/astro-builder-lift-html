import {
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type KeyboardEvent,
	type ReactNode,
} from 'react';
import styles from './faq.module.css';

type FaqItem = {
	question: string;
	answer: ReactNode;
};

type FaqTopic = {
	id: string;
	label: string;
	summary: string;
	items: FaqItem[];
};

const topics: FaqTopic[] = [
	{
		id: 'start',
		label: 'Start',
		summary: 'What this page is, and how it sits next to the other demo.',
		items: [
			{
				question: 'What am I looking at?',
				answer:
					'A React island on its own route. The topic row, the open answer, and the readout under the questions are all React state.',
			},
			{
				question: 'Where is the Builder demo?',
				answer: (
					<>
						It stays on <a href="/builder-demo">/builder-demo</a>. This FAQ does
						not fetch Builder content and does not mount the counter.
					</>
				),
			},
			{
				question: 'Does the homepage ship this JavaScript?',
				answer:
					'The homepage only links here. The React code for the FAQ hydrates on this page.',
			},
		],
	},
	{
		id: 'answers',
		label: 'Answers',
		summary: 'How a topic keeps the answer you opened.',
		items: [
			{
				question: 'What happens when I change topics?',
				answer:
					'The question list swaps immediately. Come back to a topic and the answer you opened there is still open.',
			},
			{
				question: 'Can several answers be open at once?',
				answer:
					'One answer per topic. Opening a second question in the same topic collapses the first. Other topics keep their own.',
			},
			{
				question: 'What does Reset do?',
				answer:
					'It returns to Start and collapses every topic, so the same clicks can be shown again from a clean slate.',
			},
		],
	},
	{
		id: 'keyboard',
		label: 'Keyboard',
		summary: 'The same switching, without the pointer.',
		items: [
			{
				question: 'How do I move between topics?',
				answer:
					'Focus the topic row, then press Left or Right. Home selects the first topic and End selects the last. Focus wraps at either end.',
			},
			{
				question: 'How do I open an answer?',
				answer:
					'Tab to a question and press Enter or Space. The same keys collapse it. The readout under the list updates either way.',
			},
			{
				question: 'What is exposed to assistive tech?',
				answer:
					'The topic row is a tablist. Each question is a button with an expanded state, and the answer region is labelled by that button.',
			},
		],
	},
	{
		id: 'run',
		label: 'Run',
		summary: 'Where the code lives, and how to start the site.',
		items: [
			{
				question: 'How do I run it locally?',
				answer:
					'Install dependencies with bun install, then start the dev server with bun dev. This page is /react-faq.',
			},
			{
				question: 'What does CI check?',
				answer:
					'Formatting via bun run fmt:check, then bun run check for the Astro type checker. Both run on pull requests.',
			},
			{
				question: 'Which files are the FAQ?',
				answer:
					'The island is src/components/faq. The route is src/pages/react-faq.astro. The homepage card is the link in.',
			},
		],
	},
];

function keptOpenCount(
	openByTopic: Record<string, number | null>,
	currentId: string,
) {
	return topics.reduce((count, topic) => {
		if (topic.id === currentId) return count;
		return openByTopic[topic.id] == null ? count : count + 1;
	}, 0);
}

export default function Faq() {
	const uid = useId();
	const [topicIndex, setTopicIndex] = useState(0);
	const [openByTopic, setOpenByTopic] = useState<Record<string, number | null>>(
		{},
	);
	const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
	const pendingFocus = useRef(false);
	const topic = topics[topicIndex];
	const openIndex = openByTopic[topic.id] ?? null;
	const remembered = keptOpenCount(openByTopic, topic.id);
	const isPristine =
		topicIndex === 0 && topics.every((item) => openByTopic[item.id] == null);

	useLayoutEffect(() => {
		if (!pendingFocus.current) return;
		pendingFocus.current = false;
		const tab = tabRefs.current[topicIndex];
		tab?.focus();
		tab?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
	}, [topicIndex]);

	function selectTopic(index: number, fromKeyboard: boolean) {
		pendingFocus.current = fromKeyboard;
		setTopicIndex(index);
	}

	function onTabListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
		const last = topics.length - 1;
		let next = topicIndex;
		if (event.key === 'ArrowRight') {
			next = topicIndex === last ? 0 : topicIndex + 1;
		} else if (event.key === 'ArrowLeft') {
			next = topicIndex === 0 ? last : topicIndex - 1;
		} else if (event.key === 'Home') {
			next = 0;
		} else if (event.key === 'End') {
			next = last;
		} else {
			return;
		}
		event.preventDefault();
		selectTopic(next, true);
	}

	function toggle(topicId: string, index: number) {
		setOpenByTopic((prev) => ({
			...prev,
			[topicId]: prev[topicId] === index ? null : index,
		}));
	}

	function reset() {
		pendingFocus.current = false;
		setTopicIndex(0);
		setOpenByTopic({});
	}

	const rememberedLabel =
		remembered === 0
			? 'None kept open'
			: remembered === 1
				? '1 kept open'
				: `${remembered} kept open`;

	return (
		<section className={styles.root} aria-label="Tabbed FAQ">
			<div
				className={styles.tabs}
				role="tablist"
				aria-label="FAQ topics"
				onKeyDown={onTabListKeyDown}
			>
				{topics.map((item, index) => {
					const selected = index === topicIndex;
					return (
						<button
							key={item.id}
							ref={(node) => {
								tabRefs.current[index] = node;
							}}
							className={styles.tab}
							id={`${uid}-tab-${item.id}`}
							type="button"
							role="tab"
							aria-selected={selected}
							aria-controls={selected ? `${uid}-panel-${item.id}` : undefined}
							tabIndex={selected ? 0 : -1}
							onClick={() => selectTopic(index, false)}
						>
							{item.label}
							<span className={styles.count}>{item.items.length}</span>
						</button>
					);
				})}
			</div>

			<div
				key={topic.id}
				className={styles.panel}
				id={`${uid}-panel-${topic.id}`}
				role="tabpanel"
				aria-labelledby={`${uid}-tab-${topic.id}`}
			>
				<p className={styles.summary}>{topic.summary}</p>
				<div className={styles.list}>
					{topic.items.map((item, index) => {
						const open = openIndex === index;
						const questionId = `${uid}-${topic.id}-q-${index}`;
						const answerId = `${uid}-${topic.id}-a-${index}`;
						return (
							<div className={styles.item} key={item.question}>
								<button
									className={styles.question}
									id={questionId}
									type="button"
									aria-expanded={open}
									aria-controls={answerId}
									onClick={() => toggle(topic.id, index)}
								>
									<span className={styles.index}>
										{String(index + 1).padStart(2, '0')}
									</span>
									<span className={styles.questionText}>{item.question}</span>
									<span className={styles.chevron} aria-hidden="true">
										<svg viewBox="0 0 20 20" width="16" height="16">
											<path
												d="M5 7.5 10 12.5 15 7.5"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.8"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</span>
								</button>
								<div
									className={
										open
											? `${styles.answer} ${styles.answerOpen}`
											: styles.answer
									}
									id={answerId}
									role="region"
									aria-labelledby={questionId}
									inert={open ? undefined : true}
								>
									<div className={styles.answerInner}>
										<div className={styles.answerBody}>{item.answer}</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className={styles.footer}>
				<div className={styles.chips} aria-live="polite">
					<span className={styles.chip}>
						{topic.label} · {topicIndex + 1} of {topics.length}
					</span>
					<span className={openIndex == null ? styles.chip : styles.chipOn}>
						{openIndex == null ? 'Collapsed' : 'Expanded'}
					</span>
					<span className={remembered === 0 ? styles.chip : styles.chipOn}>
						{rememberedLabel}
					</span>
				</div>
				<p className={styles.hint}>
					<kbd>←</kbd>
					<kbd>→</kbd> topics
					<span className={styles.hintGap} />
					<kbd>Enter</kbd> answer
				</p>
				<button
					className={styles.reset}
					type="button"
					onClick={reset}
					disabled={isPristine}
				>
					Reset
				</button>
			</div>
		</section>
	);
}
