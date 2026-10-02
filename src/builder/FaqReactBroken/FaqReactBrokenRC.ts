import { createBuilderComponent } from '../define-component';
import { faqInputs, faqPropsSchema } from '../faq-inputs';
import FaqReactBroken from './FaqReactBroken';

export const { builderComponent, propsType } = createBuilderComponent(
	{
		name: 'FaqReactBroken',
		friendlyName: 'FAQ React Broken',
		component: FaqReactBroken,
		inputs: faqInputs,
	},
	faqPropsSchema,
);

export type Props = typeof propsType;
