/// <reference types="astro/client-image" />

interface ImportMetaEnv {
	readonly PUBLIC_VERCEL_ANALYTICS_ID: string;
	readonly PUBLIC_BUILDER_API_KEY?: string;
}

declare namespace NodeJS {
	interface ProcessEnv {
		PUBLIC_BUILDER_API_KEY?: string;
		BUILDER_WEBHOOK_SECRET?: string;
	}
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
