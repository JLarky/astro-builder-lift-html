import { createBuilderComponent } from '../define-component';
import * as v from 'valibot';
import Faq from './Faq';

export const { builderComponent, propsType } = createBuilderComponent(
	{
		name: 'FaqLift',
		friendlyName: 'FAQ (lift-html)',
		component: Faq,
		canHaveChildren: true,
		inputs: [
			{
				name: 'title',
				type: 'string',
				friendlyName: 'Title',
				helperText:
					'Optional heading. Drop Builder blocks inside to edit the FAQ text in the CMS.',
			},
		],
	},
	v.object({
		title: v.optional(v.string()),
	}),
);

export type Props = typeof propsType;
