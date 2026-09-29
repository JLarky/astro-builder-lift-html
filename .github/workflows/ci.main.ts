#!/usr/bin/env bun
import { YAML } from 'bun';
import { workflow } from '@jlarky/gha-ts/workflow-types';
import { checkout, setupBun } from '@jlarky/gha-ts/actions';
import { generateWorkflow } from '@jlarky/gha-ts/cli';

const wf = workflow({
	name: 'CI',
	on: {
		push: { branches: ['main'] },
		pull_request: {},
	},
	jobs: {
		check: {
			name: 'Format and astro check',
			'runs-on': 'ubuntu-latest',
			steps: [
				checkout(),
				setupBun({ 'bun-version': '1.4.2' }),
				{
					name: 'Install dependencies',
					run: 'bun install --frozen-lockfile',
				},
				{
					name: 'Check formatting',
					run: 'bun run fmt:check',
				},
				{
					name: 'Astro check',
					run: 'bun run check',
				},
			],
		},
	},
});

await generateWorkflow(wf, YAML.stringify, import.meta.url);
