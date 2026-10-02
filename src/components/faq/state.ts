import type { FaqTopic } from './topics';

export type OpenByTopic = Record<string, number | null>;

export function nextTopicIndex(current: number, length: number, key: string) {
	if (length <= 0) return null;
	const last = length - 1;
	if (key === 'ArrowRight') return current === last ? 0 : current + 1;
	if (key === 'ArrowLeft') return current === 0 ? last : current - 1;
	if (key === 'Home') return 0;
	if (key === 'End') return last;
	return null;
}

export function toggledOpen(current: number | null | undefined, index: number) {
	return current === index ? null : index;
}

export function keptOpenCount(
	openByTopic: OpenByTopic,
	currentId: string,
	topicList: readonly Pick<FaqTopic, 'id'>[],
) {
	return topicList.reduce((count, topic) => {
		if (topic.id === currentId) return count;
		return openByTopic[topic.id] == null ? count : count + 1;
	}, 0);
}

export function rememberedLabel(remembered: number) {
	if (remembered === 0) return 'None kept open';
	if (remembered === 1) return '1 kept open';
	return `${remembered} kept open`;
}

export function expandedLabel(open: boolean) {
	return open ? 'Expanded' : 'Collapsed';
}

export function topicChipLabel(label: string, index: number, length: number) {
	return `${label} · ${index + 1} of ${length}`;
}

export function isPristine(
	topicIndex: number,
	openByTopic: OpenByTopic,
	topicList: readonly Pick<FaqTopic, 'id'>[],
) {
	return (
		topicIndex === 0 &&
		topicList.every((topic) => openByTopic[topic.id] == null)
	);
}
