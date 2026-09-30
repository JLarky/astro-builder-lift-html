import { type RegisteredComponent } from '@builder.io/sdk-react';
import Counter from './Counter';
import { createBuilderComponent } from '../define-component';
import * as v from 'valibot';

// export const CounterComponent = {
// 	name: 'Counter',
// 	component: Counter,
// 	inputs: [
// 		{
// 			name: 'initialCount',
// 			type: 'number',
// 		},
// 	],
// } satisfies RegisteredComponent;

export const { builderComponent, propsType } = createBuilderComponent(
	{
		name: 'Counter',
		component: Counter,
		inputs: [
			{
				name: 'initialCount',
				type: 'number',
			},
		],
	},
	v.object({
		initialCount: v.number(),
	}),
);

export type Props = typeof propsType;
