import { createBuilderComponent } from '../define-component';
import { faqInputs, faqPropsSchema } from '../faq-inputs';
import Faq from './Faq';

export const { builderComponent, propsType } = createBuilderComponent(
	{
		name: 'FaqLift',
		friendlyName: 'FAQ (lift-html)',
		component: Faq,
		inputs: faqInputs,
	},
	faqPropsSchema,
);

export type Props = typeof propsType;
