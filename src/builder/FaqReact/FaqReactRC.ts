import { createBuilderComponent } from '../define-component';
import { faqInputs, faqPropsSchema } from '../faq-inputs';
import FaqReact from './FaqReact';

export const { builderComponent, propsType } = createBuilderComponent(
	{
		name: 'FaqReact',
		friendlyName: 'FAQ (React escape hatch)',
		component: FaqReact,
		inputs: faqInputs,
	},
	faqPropsSchema,
);

export type Props = typeof propsType;
