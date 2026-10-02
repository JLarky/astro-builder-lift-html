import { useId, useState } from 'react';
import { resolveFaqItems, type FaqCmsItem } from './items';
import styles from './faq.module.css';
import { Chevron, FaqHint, HtmlAnswer } from './parts';
import { expandedLabel, toggledOpen } from './state';

export default function Faq({
	title,
	items,
}: {
	title?: string;
	items?: FaqCmsItem[];
}) {
	const uid = useId();
	const list = resolveFaqItems(items);
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const heading = title?.trim();
	const pristine = openIndex == null;

	function reset() {
		setOpenIndex(null);
	}

	return (
		<section className={styles.root} aria-label="FAQ">
			{heading ? <p className={styles.title}>{heading}</p> : null}
			<div className={styles.panel}>
				<div className={styles.list}>
					{list.map((item, index) => {
						const open = openIndex === index;
						const questionId = `${uid}-q-${index}`;
						const answerId = `${uid}-a-${index}`;
						return (
							<div className={styles.item} key={`${item.question}-${index}`}>
								<button
									className={styles.question}
									id={questionId}
									type="button"
									aria-expanded={open}
									aria-controls={answerId}
									onClick={() =>
										setOpenIndex((current) => toggledOpen(current, index))
									}
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
					<span className={openIndex == null ? styles.chip : styles.chipOn}>
						{expandedLabel(openIndex != null)}
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
