import { Children, useId } from 'react';
import { AnswerBody, Chevron, FaqHint } from '../../components/faq/parts';
import styles from '../../components/faq/faq.module.css';
import {
	expandedLabel,
	isPristine,
	keptOpenCount,
	rememberedLabel,
	topicChipLabel,
	type OpenByTopic,
} from '../../components/faq/state';
import { topics } from '../../components/faq/topics';
import { useSafeToModify } from '../OptionsProvider';
import type { Props } from './FaqLiftRC';

const initialOpen: OpenByTopic = {};

function Faq({ title, children }: Props) {
	const uid = useId();
	const safeToModify = useSafeToModify();
	const heading = title?.trim();
	const topic = topics[0];
	const remembered = keptOpenCount(initialOpen, topic.id, topics);
	const hasChildren = Children.count(children) > 0;

	return (
		<my-faq
			class={styles.root}
			aria-label="Tabbed FAQ"
			safe-to-modify={safeToModify ? 'true' : 'false'}
		>
			{heading ? <p className={styles.title}>{heading}</p> : null}
			{hasChildren ? <div className={styles.panel}>{children}</div> : null}
			<div
				className={styles.tabs}
				role="tablist"
				aria-label="FAQ topics"
				data-target="my-faq:tablist"
			>
				{topics.map((item, index) => {
					const selected = index === 0;
					return (
						<button
							key={item.id}
							className={styles.tab}
							id={`${uid}-tab-${item.id}`}
							type="button"
							role="tab"
							aria-selected={selected}
							aria-controls={`${uid}-panel-${item.id}`}
							tabIndex={selected ? 0 : -1}
							data-target="my-faq:tab"
							data-topic-id={item.id}
							data-topic-index={index}
							data-topic-label={item.label}
						>
							{item.label}
							<span className={styles.count}>{item.items.length}</span>
						</button>
					);
				})}
			</div>

			{topics.map((item, topicIndex) => (
				<div
					key={item.id}
					className={styles.panel}
					id={`${uid}-panel-${item.id}`}
					role="tabpanel"
					aria-labelledby={`${uid}-tab-${item.id}`}
					hidden={topicIndex === 0 ? undefined : true}
					data-target="my-faq:panel"
					data-topic-id={item.id}
				>
					<p className={styles.summary}>{item.summary}</p>
					<div className={styles.list}>
						{item.items.map((entry, index) => {
							const questionId = `${uid}-${item.id}-q-${index}`;
							const answerId = `${uid}-${item.id}-a-${index}`;
							return (
								<div className={styles.item} key={entry.question}>
									<button
										className={styles.question}
										id={questionId}
										type="button"
										aria-expanded={false}
										aria-controls={answerId}
										data-target="my-faq:question"
										data-topic-id={item.id}
										data-item-index={index}
									>
										<span className={styles.index}>
											{String(index + 1).padStart(2, '0')}
										</span>
										<span className={styles.questionText}>
											{entry.question}
										</span>
										<Chevron />
									</button>
									<div
										className={styles.answer}
										id={answerId}
										role="region"
										aria-labelledby={questionId}
										inert
										data-target="my-faq:answer"
										data-topic-id={item.id}
										data-item-index={index}
										data-open-class={styles.answerOpen}
									>
										<div className={styles.answerInner}>
											<div className={styles.answerBody}>
												<AnswerBody parts={entry.answer} />
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			))}

			<div className={styles.footer}>
				<div className={styles.chips} aria-live="polite">
					<span className={styles.chip} data-target="my-faq:topic-chip">
						{topicChipLabel(topic.label, 0, topics.length)}
					</span>
					<span
						className={styles.chip}
						data-target="my-faq:expanded-chip"
						data-on-class={styles.chipOn}
						data-off-class={styles.chip}
					>
						{expandedLabel(false)}
					</span>
					<span
						className={remembered === 0 ? styles.chip : styles.chipOn}
						data-target="my-faq:remembered-chip"
						data-on-class={styles.chipOn}
						data-off-class={styles.chip}
					>
						{rememberedLabel(remembered)}
					</span>
				</div>
				<FaqHint />
				<button
					className={styles.reset}
					type="button"
					disabled={isPristine(0, initialOpen, topics)}
					data-target="my-faq:reset"
				>
					Reset
				</button>
			</div>
		</my-faq>
	);
}

export default Faq;
