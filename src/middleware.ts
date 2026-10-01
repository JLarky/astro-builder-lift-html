import { defineMiddleware } from 'astro:middleware';
import { isUncachedBuilderRequest } from './builder/config';

export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();
	// handleCache applies cache headers after middleware returns, so opting out
	// here still wins if a page called cache.set({ maxAge }) during render.
	if (isUncachedBuilderRequest(context.url)) {
		context.cache.set(false);
		response.headers.set('Cache-Control', 'private, no-store');
	}
	return response;
});
