import { createBuilderComponent } from '../define-component';
import * as v from 'valibot';
import FaqReact from './FaqReact';

export const { builderComponent, propsType } = createBuilderComponent(
	{
		name: 'FaqReact',
		friendlyName: 'FAQ (React escape hatch)',
		component: FaqReact,
		inputs: [
			{
				name: 'title',
				type: 'string',
				friendlyName: 'Title',
				helperText: 'Optional heading. Topics and answers are built in.',
			},
		],
	},
	v.object({
		title: v.optional(v.string()),
	}),
);

export type Props = typeof propsType;
