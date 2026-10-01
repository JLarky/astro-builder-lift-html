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
	// Null content is an empty canvas, not an in-component 404.
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
