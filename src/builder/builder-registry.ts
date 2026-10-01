import type { Reactify, KnownElements } from '@lift-html/core';
import { type RegisteredComponent } from '@builder.io/sdk-react';

export function componentFolder(path: string) {
	const folder = /^\.\/([^/]+)\//.exec(path)?.[1];
	if (!folder) {
		throw new Error(`Unexpected component path: ${path}`);
	}
	return folder;
}

const definitions = import.meta.glob<RegisteredComponent>('./*/definition.ts', {
	eager: true,
	import: 'builderComponent',
});

const folderByName = new Map<string, string>();

export const discoveredComponents: {
	folder: string;
	component: RegisteredComponent;
}[] = [];

for (const [path, component] of Object.entries(definitions)) {
	const folder = componentFolder(path);
	const existing = folderByName.get(component.name);
	if (existing) {
		throw new Error(
			`Duplicate Builder component name "${component.name}" in ${existing} and ${folder}`,
		);
	}
	folderByName.set(component.name, folder);
	discoveredComponents.push({ folder, component });
}

export const customComponents = discoveredComponents.map(
	(entry) => entry.component,
) satisfies RegisteredComponent[];

export type RegisteredName = (typeof customComponents)[number]['name'];

declare module 'react' {
	namespace JSX {
		interface IntrinsicElements extends Reactify<
			React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
			KnownElements
		> {}
	}
}
