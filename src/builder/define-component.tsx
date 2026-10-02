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
	issues?: readonly v.BaseIssue<unknown>[];
	children?: React.ReactNode;
}) {
	const firstIssue = issues?.[0]?.message;
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
			{issues && issues.length > 0 ? (
				<div>
					{issues.length} issue{issues.length === 1 ? '' : 's'}
					{firstIssue ? `: ${firstIssue}` : ''}
				</div>
			) : null}
			{children}
		</div>
	);
}

/** Schema produced by `v.object({...})`. */
type ValibotObjectSchema = v.ObjectSchema<
	v.ObjectEntries,
	v.ErrorMessage<v.ObjectIssue> | undefined
>;

/**
 * Compare Builder input names with Valibot object-schema keys.
 * Called once from `createBuilderComponent`, and only in development.
 * Returns the mismatch message instead of throwing, so SSR can render it
 * in place of the component.
 */
function checkBuilderInputsMatchSchema(
	name: string,
	inputs: readonly { name: string }[],
	schema: ValibotObjectSchema,
): string | undefined {
	const schemaKeys = new Set(Object.keys(schema.entries));
	const inputNames = new Set(inputs.map((input) => input.name));
	const inputsNotInSchema = [...inputNames].filter(
		(inputName) => !schemaKeys.has(inputName),
	);
	const schemaFieldsWithoutInput = [...schemaKeys].filter(
		(key) => !inputNames.has(key),
	);

	if (inputsNotInSchema.length === 0 && schemaFieldsWithoutInput.length === 0) {
		return;
	}

	const parts = [
		inputsNotInSchema.length > 0
			? `inputs not in the schema: ${inputsNotInSchema.join(', ')}`
			: undefined,
		schemaFieldsWithoutInput.length > 0
			? `schema fields with no input: ${schemaFieldsWithoutInput.join(', ')}`
			: undefined,
	].filter((part) => part !== undefined);
	const message = `${name}: Builder inputs and Valibot schema keys do not match. ${parts.join('. ')}.`;
	console.error(message);
	return message;
}

export function createBuilderComponent<
	const N extends string,
	T extends ValibotObjectSchema,
>(definition: Omit<RegisteredComponent, 'name'> & { name: N }, inputSchema: T) {
	const { component, inputs = [], name } = definition;
	const schemaMismatch = import.meta.env.DEV
		? checkBuilderInputsMatchSchema(name, inputs, inputSchema)
		: undefined;
	const ResolvedComponent =
		component as React.ComponentType<BuilderPassthroughProps>;

	const builderComponent = React.memo(function BuilderComponent({
		attributes,
		// builderBlock,
		// builderState,
		children,
		...rest
	}: BuilderPassthroughProps) {
		if (schemaMismatch) {
			return <InvalidProps error={schemaMismatch}>{children}</InvalidProps>;
		}
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
