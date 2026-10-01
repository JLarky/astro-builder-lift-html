# astro-builder-lift-html

A visual CMS like [Builder.io](https://www.builder.io/) makes every piece of a page editable and interactive, but sending all that interactivity as JavaScript makes the bundle grow with every interactive part, which does not scale. The floor is already high because the Builder SDK and React ship as baseline, and it is hard to keep the bundle small as you scale with components: it is hard to make it so that you are not paying for components sometimes, even if they are not on that page. The interactive editor keeps full functionality; the smaller bundle is for the production page. This demo shows the alternative: interactive components as web components via [lift-html](https://github.com/JLarky/lift-html), so the bundle drops from 300 kilobytes gzipped to 10 kilobytes gzipped.

Live at [astro-builder-lift-html.vercel.app](https://astro-builder-lift-html.vercel.app). The homepage links to the demos.

## Start the development server

```sh
bun install
bun dev
```

## Build local preview

Local preview uses the Node adapter instead of Vercel, and the in-memory route cache instead of `cacheVercel()`:

```sh
bun run build-preview
bun run preview
```

Copy `.env.example` to `.env` if you want a Builder space other than the demo key baked into `src/builder/config.ts`.

## Builder pages

`src/pages/[...slug].astro` serves every path except static routes such as `/`. The Builder `urlPath` is the request path. `fetchOneEntry` gets `getBuilderSearchParams` and `enrich: true`, so preview overrides and inlined Symbols are in the server render.

| Request                                                             | Result                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Published page                                                      | 200. `Cache-Control` is left to the host; the route cache sets `Vercel-CDN-Cache-Control` (or `CDN-Cache-Control` under `memoryCache`) for 1 hour, stale-while-revalidate for 1 day, tagged `builder:model:page` and `builder:entry:<id>`. |
| Unknown path                                                        | HTTP 404, cached for 60 seconds. `/file.php` never calls Builder.                                                                                                                                                                          |
| Trailing slash                                                      | Redirect to the path without the slash (`trailingSlash: 'never'`, 301 for GET).                                                                                                                                                            |
| `builder.preview`, `builder.frameEditing`, or `__builder_editing__` | Not cached (`private, no-store`). Missing content still renders `<Content>` so the editor has an empty canvas. `client:idle` hydrates the SDK.                                                                                             |
| Builder down, no fallback                                           | HTTP 503, `Retry-After: 30`, not cached. A previous good response can render with `X-Content-Source: fallback`.                                                                                                                            |

Editing loads every lift-html loader. A published page loads only the loaders for custom components in that content (including components nested in Symbols and variations). `astro check` fails if a registered component has no `wcLoaders` entry.

In the Builder page model, set the preview URL to this site's origin and the dynamic URL to `origin + targeting urlPath`.

### Publish webhook

`POST /api/builder-webhook` purges the entry tag and each `urlPath` from `newValue` and `previousValue` (so a renamed page drops the old URL and the new URL's cached 404). It also expires the runtime-cache fallback for those tags. Set `BUILDER_WEBHOOK_SECRET` and send it as `x-builder-webhook-secret`, `Authorization: Bearer …`, or `?secret=`. Leave the webhook payload enabled. `builder:model:page` is on every public page if you need to purge the model by hand. Adapter ISR is intentionally off: it strips editor query params.
