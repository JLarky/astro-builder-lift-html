import {
	topics,
	type FaqAnswerPart,
	type FaqItem,
	type FaqTopic,
} from './topics';

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
		.map((part) => {
			if (typeof part === 'string') return escapeHtml(part);
			if ('html' in part) return part.html;
			return `<a href="${escapeHtml(part.href)}">${escapeHtml(part.text)}</a>`;
		})
		.join('');
}

export const defaultFaqItems: FaqCmsItem[] = topics[0].items.map((item) => ({
	question: item.question,
	answer: answerPartsToHtml(item.answer),
}));

function cmsItemsToFaqItems(items: readonly FaqCmsItem[]): FaqItem[] {
	return items.map((item) => ({
		question: item.question,
		answer: item.answer ? [{ html: item.answer }] : [],
	}));
}

export function topicsFor(items?: FaqCmsItem[]): FaqTopic[] {
	if (!items?.length) return topics;
	return topics.map((topic, index) =>
		index === 0 ? { ...topic, items: cmsItemsToFaqItems(items) } : topic,
	);
}
