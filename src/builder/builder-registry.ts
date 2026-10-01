import type { Reactify, KnownElements } from '@lift-html/core';
import { type RegisteredComponent } from '@builder.io/sdk-react';
import { builderComponent as CounterComponent } from './Counters/CounterRC';

export const customComponents = [
	//
	CounterComponent,
] satisfies RegisteredComponent[];

export type RegisteredName = (typeof customComponents)[number]['name'];

declare module 'react' {
	namespace JSX {
		interface IntrinsicElements extends Reactify<
			React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
			KnownElements
		> {}
	}
}
