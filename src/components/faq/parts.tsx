import { Fragment } from 'react';
import styles from './faq.module.css';
import type { FaqAnswerPart } from './topics';

export function AnswerBody({ parts }: { parts: readonly FaqAnswerPart[] }) {
	return parts.map((part, index) =>
		typeof part === 'string' ? (
			<Fragment key={index}>{part}</Fragment>
		) : (
			<a key={index} href={part.href}>
				{part.text}
			</a>
		),
	);
}

export function Chevron() {
	return (
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
	);
}

export function FaqHint() {
	return (
		<p className={styles.hint}>
			<kbd>←</kbd>
			<kbd>→</kbd> topics
			<span className={styles.hintGap} />
			<kbd>Enter</kbd> answer
		</p>
	);
}
