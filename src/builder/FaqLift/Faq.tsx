import { useId } from 'react';
import { Chevron, FaqHint, HtmlAnswer } from '../../components/faq/parts';
import styles from '../../components/faq/faq.module.css';
import {
	expandedLabel,
	isPristine,
	type OpenByTopic,
} from '../../components/faq/state';
import { resolveFaqItems } from '../../components/faq/items';
import { useSafeToModify } from '../OptionsProvider';
import type { Props } from './FaqLiftRC';

const topicId = 'faq';
const topicList = [{ id: topicId }];
const initialOpen: OpenByTopic = {};

function Faq({ title, items }: Props) {
	const uid = useId();
	const safeToModify = useSafeToModify();
	const heading = title?.trim();
	const list = resolveFaqItems(items);

	return (
		<my-faq
			class={styles.root}
			aria-label="FAQ"
			safe-to-modify={safeToModify ? 'true' : 'false'}
		>
			{heading ? <p className={styles.title}>{heading}</p> : null}
			<div
				className={styles.panel}
				id={`${uid}-panel-${topicId}`}
				data-target="my-faq:panel"
				data-topic-id={topicId}
			>
				<div className={styles.list}>
					{list.map((item, index) => {
						const questionId = `${uid}-${topicId}-q-${index}`;
						const answerId = `${uid}-${topicId}-a-${index}`;
						return (
							<div className={styles.item} key={`${item.question}-${index}`}>
								<button
									className={styles.question}
									id={questionId}
									type="button"
									aria-expanded={false}
									aria-controls={answerId}
									data-target="my-faq:question"
									data-topic-id={topicId}
									data-item-index={index}
								>
									<span className={styles.index}>
										{String(index + 1).padStart(2, '0')}
									</span>
									<span className={styles.questionText}>{item.question}</span>
									<Chevron />
								</button>
								<div
									className={styles.answer}
									id={answerId}
									role="region"
									aria-labelledby={questionId}
									inert
									data-target="my-faq:answer"
									data-topic-id={topicId}
									data-item-index={index}
									data-open-class={styles.answerOpen}
								>
									<div className={styles.answerInner}>
										<div className={styles.answerBody}>
											<HtmlAnswer html={item.answer} />
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
					<span
						className={styles.chip}
						data-target="my-faq:expanded-chip"
						data-on-class={styles.chipOn}
						data-off-class={styles.chip}
					>
						{expandedLabel(false)}
					</span>
				</div>
				<FaqHint />
				<button
					className={styles.reset}
					type="button"
					disabled={isPristine(0, initialOpen, topicList)}
					data-target="my-faq:reset"
				>
					Reset
				</button>
			</div>
		</my-faq>
	);
}

export default Faq;
