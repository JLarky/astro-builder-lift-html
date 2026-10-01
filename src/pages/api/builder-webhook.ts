import { timingSafeEqual } from 'node:crypto';
import type { APIRoute } from 'astro';
import { expireFallback } from '../../builder/load-page';
import { urlPathsOf } from '../../builder/url-paths';

export const prerender = false;

export const POST: APIRoute = async ({ request, cache }) => {
	if (!authorized(request)) {
		return new Response('Unauthorized', { status: 401 });
	}

	let body: unknown;
	try {
		const text = await request.text();
		body = text ? JSON.parse(text) : {};
	} catch {
		return new Response('Bad request', { status: 400 });
	}

	const record =
		body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
	const tags = new Set<string>();
	const paths = new Set<string>();
	for (const entry of [record.newValue, record.previousValue]) {
		if (!entry || typeof entry !== 'object') continue;
		const id = (entry as { id?: unknown }).id;
		if (typeof id === 'string' && id) tags.add(`builder:entry:${id}`);
		for (const path of urlPathsOf(entry)) paths.add(path);
	}

	console.info('Builder webhook', {
		operation: record.operation ?? null,
		modelName: record.modelName ?? null,
		tags: [...tags],
		paths: [...paths],
	});

	try {
		if (cache.enabled) {
			if (tags.size > 0) await cache.invalidate({ tags: [...tags] });
			await Promise.all([...paths].map((path) => cache.invalidate({ path })));
		}
		await expireFallback([...tags]);
	} catch (error) {
		console.error('Builder webhook purge failed', error);
		return new Response('Purge failed', { status: 500 });
	}

	return new Response(null, { status: 204 });
};

function authorized(request: Request) {
	const expected = process.env.BUILDER_WEBHOOK_SECRET;
	if (!expected) return false;
	return safeEqual(providedSecret(request), expected);
}

function providedSecret(request: Request) {
	const header = request.headers.get('x-builder-webhook-secret');
	if (header) return header;
	const authorization = request.headers.get('authorization');
	if (authorization?.toLowerCase().startsWith('bearer ')) {
		return authorization.slice('bearer '.length).trim();
	}
	return new URL(request.url).searchParams.get('secret') ?? '';
}

function safeEqual(provided: string, expected: string) {
	const left = Buffer.from(provided);
	const right = Buffer.from(expected);
	const lengthMatch = left.length === right.length;
	return timingSafeEqual(lengthMatch ? left : right, right) && lengthMatch;
}
