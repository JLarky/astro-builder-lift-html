import { topics, type FaqAnswerPart } from './topics';

export type FaqCmsItem = {
	question: string;
	answer: string;
};

function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

function answerPartsToHtml(parts: readonly FaqAnswerPart[]) {
	return parts
		.map((part) =>
			typeof part === 'string'
				? escapeHtml(part)
				: `<a href="${escapeHtml(part.href)}">${escapeHtml(part.text)}</a>`,
		)
		.join('');
}

export const defaultFaqItems: FaqCmsItem[] = topics.flatMap((topic) =>
	topic.items.map((item) => ({
		question: item.question,
		answer: answerPartsToHtml(item.answer),
	})),
);

export function resolveFaqItems(items: FaqCmsItem[] | undefined) {
	return items ?? defaultFaqItems;
}
