export type FaqAnswerPart =
	string | { href: string; text: string } | { html: string };

export type FaqItem = {
	question: string;
	answer: FaqAnswerPart[];
};

export type FaqTopic = {
	id: string;
	label: string;
	summary: string;
	items: FaqItem[];
};

export const topics: FaqTopic[] = [
	{
		id: 'start',
		label: 'Start',
		summary: 'What this page is, and how it sits next to the other demo.',
		items: [
			{
				question: 'What am I looking at?',
				answer: [
					'A React island on its own route. The topic row, the open answer, and the readout under the questions are all React state.',
				],
			},
			{
				question: 'Where is the Builder demo?',
				answer: [
					'There is no dedicated /builder-demo page. Published Builder entries are served by the catch-all route at the URL path on the entry. The ',
					{ href: '/#builder-pages', text: 'homepage' },
					' and the README cover that route and the __builder_editing__ gate. This FAQ does not fetch Builder content and does not mount the counter.',
				],
			},
			{
				question: 'Does the homepage ship this JavaScript?',
				answer: [
					'The homepage only links here. The React code for the FAQ hydrates on this page.',
				],
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
				answer: [
					'The question list swaps immediately. Come back to a topic and the answer you opened there is still open.',
				],
			},
			{
				question: 'Can several answers be open at once?',
				answer: [
					'One answer per topic. Opening a second question in the same topic collapses the first. Other topics keep their own.',
				],
			},
			{
				question: 'What does Reset do?',
				answer: [
					'It returns to Start and collapses every topic, so the same clicks can be shown again from a clean slate.',
				],
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
				answer: [
					'Focus the topic row, then press Left or Right. Home selects the first topic and End selects the last. Focus wraps at either end.',
				],
			},
			{
				question: 'How do I open an answer?',
				answer: [
					'Tab to a question and press Enter or Space. The same keys collapse it. The readout under the list updates either way.',
				],
			},
			{
				question: 'What is exposed to assistive tech?',
				answer: [
					'The topic row is a tablist. Each question is a button with an expanded state, and the answer region is labelled by that button.',
				],
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
				answer: [
					'Install dependencies with bun install, then start the dev server with bun dev. This page is /react-faq.',
				],
			},
			{
				question: 'What does CI check?',
				answer: [
					'Formatting via bun run fmt:check, then bun run check for the Astro type checker. Both run on pull requests.',
				],
			},
			{
				question: 'Which files are the FAQ?',
				answer: [
					'The island is src/components/faq. The route is src/pages/react-faq.astro. The homepage card is the link in.',
				],
			},
		],
	},
];
