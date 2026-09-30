import { useEffect, useState } from 'react';
import { Content, isEditing } from '@builder.io/sdk-react';
import { CounterComponent } from './builder-registry';

interface PageProps {
	apiKey: string;
	model: string;
	content: any;
	search?: string;
}

export default function Page(props: PageProps) {
	const [editing, setEditing] = useState(false);
	useEffect(() => {
		setEditing(isEditing(props.search));
	}, [props.search]);

	if (!props.content && !editing) {
		return (
			<>
				<h1>404</h1>
				<p>Make sure you have your content published at Builder.io.</p>
			</>
		);
	}
	return (
		<>
			<Content
				content={props.content}
				apiKey={props.apiKey}
				model={props.model}
				customComponents={[CounterComponent]}
			/>
		</>
	);
}
