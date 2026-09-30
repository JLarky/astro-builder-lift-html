import { createEffect, createSignal } from 'solid-js';
import { liftSolid, useAttributes } from '@lift-html/solid';
import { targetRefs } from '@lift-html/incentive';

const targets = {
	inc: HTMLButtonElement,
	dec: HTMLButtonElement,
	count: HTMLSpanElement,
};

const MyCounterClass = liftSolid('my-counter', {
	observedAttributes: ['initial-count', 'safe-to-modify'],
	init(onCleanup) {
		const refs = targetRefs(this, targets);
		if (!refs.count) {
			throw new Error('Count element not found');
		}
		const countElement = refs.count;
		if (!refs.dec) {
			throw new Error('Dec button not found');
		}
		if (!refs.inc) {
			throw new Error('Inc button not found');
		}
		const controller = new AbortController();
		onCleanup(() => controller.abort());
		const attributes = useAttributes(this);
		const safeToModify = () => attributes['safe-to-modify'] === 'true';
		const [count, setCount] = createSignal(Number(attributes['initial-count']));
		createEffect(() => {
			const newCount = Number(attributes['initial-count']);
			setCount(newCount);
		});
		createEffect(() => {
			if (safeToModify()) {
				countElement.textContent = count().toString();
			}
		});
		refs.dec.addEventListener(
			'click',
			() => {
				setCount(count() - 1);
			},
			controller,
		);
		refs.inc.addEventListener(
			'click',
			() => {
				setCount(count() + 1);
			},
			controller,
		);
	},
});

declare module '@lift-html/core' {
	interface KnownElements {
		'my-counter': typeof MyCounterClass & {
			props: { 'initial-count': number; 'safe-to-modify': `${boolean}` };
		};
	}
}
