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

type ValibotSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

function isValibotObjectSchema(
	schema: ValibotSchema,
): schema is v.ObjectSchema<
	v.ObjectEntries,
	v.ErrorMessage<v.ObjectIssue> | undefined
> {
	return schema.type === 'object' && schema.reference === v.object;
}

/**
 * Compare Builder input names with Valibot object-schema keys.
 * Called once from `createBuilderComponent`, and only in development.
 */
function checkBuilderInputsMatchSchema(
	name: string,
	inputs: readonly { name: string }[],
	schema: ValibotSchema,
) {
	if (!isValibotObjectSchema(schema)) {
		console.warn(
			`${name}: skipped Builder inputs/schema check because the schema is not a Valibot object schema (v.object); got type "${schema.type}".`,
		);
		return;
	}

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
	throw new Error(message);
}

export function createBuilderComponent<
	const N extends string,
	T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(definition: Omit<RegisteredComponent, 'name'> & { name: N }, inputSchema: T) {
	const { component, inputs = [], name } = definition;
	if (import.meta.env.DEV) {
		checkBuilderInputsMatchSchema(name, inputs, inputSchema);
	}
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
