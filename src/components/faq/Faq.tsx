import {
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type KeyboardEvent,
} from 'react';
import styles from './faq.module.css';
import { AnswerBody, Chevron, FaqHint } from './parts';
import {
	expandedLabel,
	isPristine,
	keptOpenCount,
	nextTopicIndex,
	rememberedLabel,
	toggledOpen,
	topicChipLabel,
	type OpenByTopic,
} from './state';
import { topics } from './topics';

export default function Faq({ title }: { title?: string }) {
	const uid = useId();
	const [topicIndex, setTopicIndex] = useState(0);
	const [openByTopic, setOpenByTopic] = useState<OpenByTopic>({});
	const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
	const pendingFocus = useRef(false);
	const topic = topics[topicIndex];
	const openIndex = openByTopic[topic.id] ?? null;
	const remembered = keptOpenCount(openByTopic, topic.id, topics);
	const pristine = isPristine(topicIndex, openByTopic, topics);
	const heading = title?.trim();

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
		const next = nextTopicIndex(topicIndex, topics.length, event.key);
		if (next == null) return;
		event.preventDefault();
		selectTopic(next, true);
	}

	function toggle(topicId: string, index: number) {
		setOpenByTopic((prev) => ({
			...prev,
			[topicId]: toggledOpen(prev[topicId], index),
		}));
	}

	function reset() {
		pendingFocus.current = false;
		setTopicIndex(0);
		setOpenByTopic({});
	}

	return (
		<section className={styles.root} aria-label="Tabbed FAQ">
			{heading ? <p className={styles.title}>{heading}</p> : null}
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
									<Chevron />
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
										<div className={styles.answerBody}>
											<AnswerBody parts={item.answer} />
										</div>
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
						{topicChipLabel(topic.label, topicIndex, topics.length)}
					</span>
					<span className={openIndex == null ? styles.chip : styles.chipOn}>
						{expandedLabel(openIndex != null)}
					</span>
					<span className={remembered === 0 ? styles.chip : styles.chipOn}>
						{rememberedLabel(remembered)}
					</span>
				</div>
				<FaqHint />
				<button
					className={styles.reset}
					type="button"
					onClick={reset}
					disabled={pristine}
				>
					Reset
				</button>
			</div>
		</section>
	);
}
