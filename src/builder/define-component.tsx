import type { RegisteredComponent } from '@builder.io/sdk-react';
import React from 'react';
import * as v from 'valibot';

type BuilderPassthroughProps = {
	attributes?: Record<string, unknown>;
	children?: React.ReactNode;
};

function InvalidProps({
	error,
	issues,
	children,
}: {
	attributes?: unknown;
	error: string;
	issues: readonly v.BaseIssue<unknown>[];
	children?: React.ReactNode;
}) {
	const firstIssue = issues[0]?.message;
	return (
		<div
			data-failure="failed-to-load"
			data-error={error}
			style={{
				background: '#ffe4e6',
				border: '2px solid #e11d48',
				color: '#9f1239',
				padding: '12px 16px',
				margin: '12px 0',
				fontFamily: 'ui-monospace, monospace',
				fontWeight: 700,
			}}
		>
			<div>{error}</div>
			<div>
				{issues.length} issue{issues.length === 1 ? '' : 's'}
				{firstIssue ? `: ${firstIssue}` : ''}
			</div>
			{children}
		</div>
	);
}

export function createBuilderComponent<
	const N extends string,
	T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(definition: Omit<RegisteredComponent, 'name'> & { name: N }, inputSchema: T) {
	const { component, inputs = [], name } = definition;
	const ResolvedComponent =
		component as React.ComponentType<BuilderPassthroughProps>;

	const builderComponent = React.memo(function BuilderComponent({
		attributes,
		// builderBlock,
		// builderState,
		children,
		...rest
	}: BuilderPassthroughProps) {
		const result = v.safeParse(inputSchema, rest);
		if (result.success) {
			return (
				<ResolvedComponent
					attributes={attributes}
					// builderBlock={builderBlock}
					// builderState={builderState}
					{...(result.output as Record<string, unknown>)}
				>
					{children}
				</ResolvedComponent>
			);
		}
		console.error(
			`${name} props are invalid`,
			result.issues,
			'see more in data-failure="failed-to-load"',
		);
		return (
			<InvalidProps
				attributes={attributes}
				error={`${name} props are invalid`}
				issues={result.issues}
			>
				{children}
			</InvalidProps>
		);
	});
	builderComponent.displayName = `Builder:${name}`;
	return {
		builderComponent: {
			...definition,
			inputs,
			component: builderComponent,
		} satisfies RegisteredComponent,
		InputSchema: inputSchema,
		propsType: null as unknown as v.InferOutput<T> & BuilderPassthroughProps,
	};
}
