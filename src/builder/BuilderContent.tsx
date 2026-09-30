import { Content, type BuilderContent } from '@builder.io/sdk-react';
import { customComponents } from './builder-registry';
import { OptionsProvider } from './OptionsProvider';

interface PageProps {
	apiKey: string;
	model: string;
	content: BuilderContent | null;
	isEditing: boolean;
}

export default function Page(props: PageProps) {
	if (!props.content) {
		return (
			<>
				<h1>404</h1>
				<p>Make sure you have your content published at Builder.io.</p>
			</>
		);
	}
	return (
		<OptionsProvider isEditing={props.isEditing}>
			<Content
				content={props.content}
				apiKey={props.apiKey}
				model={props.model}
				customComponents={customComponents}
			/>
		</OptionsProvider>
	);
}
