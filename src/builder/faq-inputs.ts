import * as v from 'valibot';
import { defaultFaqItems } from '../components/faq/items';

export const faqItemSchema = v.object({
	question: v.optional(v.string(), ''),
	answer: v.optional(v.string(), ''),
});

export const faqPropsSchema = v.object({
	title: v.optional(v.string()),
	items: v.optional(v.array(faqItemSchema)),
});

export const faqInputs = [
	{
		name: 'title',
		type: 'string',
		friendlyName: 'Title',
		helperText: 'Optional heading.',
	},
	{
		name: 'items',
		type: 'list',
		friendlyName: 'Questions',
		helperText: 'Questions and answers edited in the CMS.',
		defaultValue: defaultFaqItems,
		subFields: [
			{ name: 'question', type: 'string', friendlyName: 'Question' },
			{ name: 'answer', type: 'html', friendlyName: 'Answer' },
		],
	},
];
