import { createEffect, createSignal } from 'solid-js';
import { liftSolid, useAttributes } from '@lift-html/solid';
import { findTarget } from '@lift-html/incentive';
import {
	expandedLabel,
	isPristine,
	keptOpenCount,
	nextTopicIndex,
	rememberedLabel,
	toggledOpen,
	topicChipLabel,
	type OpenByTopic,
} from '../../../../components/faq/state';

const element = 'my-faq';

function listTargets<T extends HTMLElement>(
	root: HTMLElement,
	name: string,
	ctor: new () => T,
): T[] {
	const tag = root.tagName.toLowerCase();
	const found: T[] = [];
	for (const node of root.querySelectorAll(`[data-target~="${tag}:${name}"]`)) {
		if (node instanceof ctor && node.closest(tag) === root) found.push(node);
	}
	return found;
}

function ownedTarget(root: HTMLElement, start: Element, name: string) {
	const tag = root.tagName.toLowerCase();
	const match = start.closest(`[data-target~="${tag}:${name}"]`);
	if (!(match instanceof HTMLElement)) return undefined;
	if (match.closest(tag) !== root) return undefined;
	return match;
}

function setChip(node: HTMLElement | undefined, on: boolean, text: string) {
	if (!node) return;
	const onClass = node.dataset.onClass;
	const offClass = node.dataset.offClass;
	if (onClass) node.classList.toggle(onClass, on);
	if (offClass) node.classList.toggle(offClass, !on);
	node.textContent = text;
}

function replayEntrance(panel: HTMLElement) {
	panel.style.animation = 'none';
	void panel.offsetWidth;
	panel.style.animation = '';
}

const MyFaqClass = liftSolid(element, {
	observedAttributes: ['safe-to-modify'] as const,
	init(onCleanup) {
		const host = this;
		const attributes = useAttributes(this);
		const controller = new AbortController();
		onCleanup(() => controller.abort());
		const [topicIndex, setTopicIndex] = createSignal(0);
		const [openByTopic, setOpenByTopic] = createSignal<OpenByTopic>({});
		let focusFromKeyboard = false;
		let previousTopicId: string | null = null;

		host.addEventListener(
			'click',
			(event) => {
				if (!(event.target instanceof Element)) return;
				const reset = ownedTarget(host, event.target, 'reset');
				if (reset instanceof HTMLButtonElement) {
					if (reset.disabled) return;
					focusFromKeyboard = false;
					setTopicIndex(0);
					setOpenByTopic({});
					return;
				}
				const question = ownedTarget(host, event.target, 'question');
				if (question instanceof HTMLButtonElement) {
					const topicId = question.dataset.topicId;
					const index = Number(question.dataset.itemIndex);
					if (!topicId || Number.isNaN(index)) return;
					setOpenByTopic((prev) => ({
						...prev,
						[topicId]: toggledOpen(prev[topicId], index),
					}));
					return;
				}
				const tab = ownedTarget(host, event.target, 'tab');
				if (!(tab instanceof HTMLButtonElement)) return;
				const index = Number(tab.dataset.topicIndex);
				if (Number.isNaN(index)) return;
				focusFromKeyboard = false;
				setTopicIndex(index);
			},
			controller,
		);

		host.addEventListener(
			'keydown',
			(event) => {
				if (!(event instanceof KeyboardEvent)) return;
				if (!(event.target instanceof Element)) return;
				const tablist = findTarget(host, 'tablist', HTMLElement);
				if (!tablist?.contains(event.target)) return;
				const tabs = listTargets(host, 'tab', HTMLButtonElement);
				const next = nextTopicIndex(topicIndex(), tabs.length, event.key);
				if (next == null) return;
				event.preventDefault();
				focusFromKeyboard = true;
				setTopicIndex(next);
			},
			controller,
		);

		createEffect(() => {
			const canWrite = attributes['safe-to-modify'] === 'true';
			const index = topicIndex();
			const open = openByTopic();
			if (!canWrite) return;

			const tabs = listTargets(host, 'tab', HTMLButtonElement);
			const panels = listTargets(host, 'panel', HTMLElement);
			const questions = listTargets(host, 'question', HTMLButtonElement);
			const answers = listTargets(host, 'answer', HTMLElement);
			const current = tabs[index];
			const currentId = current?.dataset.topicId ?? '';
			const topicIds = tabs.map((tab) => ({ id: tab.dataset.topicId ?? '' }));
			const openIndex = open[currentId] ?? null;
			const remembered = keptOpenCount(open, currentId, topicIds);

			tabs.forEach((tab, tabIndex) => {
				const selected = tabIndex === index;
				tab.setAttribute('aria-selected', selected ? 'true' : 'false');
				tab.tabIndex = selected ? 0 : -1;
			});

			panels.forEach((panel) => {
				const active = panel.dataset.topicId === currentId;
				panel.hidden = !active;
				if (
					active &&
					previousTopicId !== null &&
					previousTopicId !== currentId
				) {
					replayEntrance(panel);
				}
			});
			previousTopicId = currentId;

			questions.forEach((button) => {
				const topicId = button.dataset.topicId ?? '';
				const itemIndex = Number(button.dataset.itemIndex);
				const expanded = open[topicId] === itemIndex;
				button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
			});

			answers.forEach((answer) => {
				const topicId = answer.dataset.topicId ?? '';
				const itemIndex = Number(answer.dataset.itemIndex);
				const expanded = open[topicId] === itemIndex;
				const openClass = answer.dataset.openClass;
				if (openClass) answer.classList.toggle(openClass, expanded);
				answer.inert = !expanded;
			});

			const topicChip = findTarget(host, 'topic-chip');
			if (topicChip) {
				topicChip.textContent = topicChipLabel(
					current?.dataset.topicLabel ?? '',
					index,
					tabs.length,
				);
			}
			setChip(
				findTarget(host, 'expanded-chip'),
				openIndex != null,
				expandedLabel(openIndex != null),
			);
			setChip(
				findTarget(host, 'remembered-chip'),
				remembered > 0,
				rememberedLabel(remembered),
			);

			const reset = findTarget(host, 'reset', HTMLButtonElement);
			if (reset) reset.disabled = isPristine(index, open, topicIds);

			if (focusFromKeyboard) {
				focusFromKeyboard = false;
				current?.focus();
				current?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
			}
		});
	},
});

declare module '@lift-html/core' {
	interface KnownElements {
		[element]: typeof MyFaqClass & {
			props: { 'safe-to-modify': `${boolean}` };
		};
	}
}
