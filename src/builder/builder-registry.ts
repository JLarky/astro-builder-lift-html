import type { Reactify, KnownElements } from '@lift-html/core';
import { type RegisteredComponent } from '@builder.io/sdk-react';
import { builderComponent as CounterComponent } from './Counters/CounterRC';
import { builderComponent as FaqLiftComponent } from './FaqLift/FaqLiftRC';
import { builderComponent as FaqReactComponent } from './FaqReact/FaqReactRC';
import { builderComponent as FaqReactBrokenComponent } from './FaqReactBroken/FaqReactBrokenRC';

export const customComponents = [
	//
	CounterComponent,
	FaqReactComponent,
	FaqReactBrokenComponent,
	FaqLiftComponent,
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
