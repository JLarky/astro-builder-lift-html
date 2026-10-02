import { createBuilderComponent } from '../define-component';
import * as v from 'valibot';
import Faq from './Faq';

export const { builderComponent, propsType } = createBuilderComponent(
	{
		name: 'FaqLift',
		friendlyName: 'FAQ (lift-html)',
		component: Faq,
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
