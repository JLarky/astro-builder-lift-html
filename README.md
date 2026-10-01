# astro-builder-lift-html

A visual CMS like [Builder.io](https://www.builder.io/) makes every piece of a page editable and interactive, but sending all that interactivity as JavaScript makes the bundle grow with every interactive part, which does not scale. The floor is already high because the Builder SDK and React ship as baseline, and it is hard to keep the bundle small as you scale with components: it is hard to make it so that you are not paying for components sometimes, even if they are not on that page. The interactive editor keeps full functionality; the smaller bundle is for the production page. This demo shows the alternative: interactive components as web components via [lift-html](https://github.com/JLarky/lift-html), so the bundle drops from 300 kilobytes gzipped to 10 kilobytes gzipped.

Live at [astro-builder-lift-html.vercel.app](https://astro-builder-lift-html.vercel.app). The homepage links to the demos.

## Start the development server

```sh
bun install
bun dev
```

## Build local preview

Local preview uses the Node adapter instead of Vercel:

```sh
bun run build-preview
bun run preview
```

## Builder pages

`src/pages/[...slug].astro` serves every path except static routes such as `/`. The Builder `urlPath` is the request path. `fetchOneEntry` gets `getBuilderSearchParams` and `enrich: true`, so preview overrides and inlined Symbols are in the server render.

| Request                                                             | Result                                                                                                       |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Published page                                                      | 200.                                                                                                         |
| Unknown path                                                        | HTTP 404 with the not-found page.                                                                            |
| Trailing slash                                                      | Redirect to the path without the slash (`trailingSlash: 'never'`).                                           |
| `builder.preview`, `builder.frameEditing`, or `__builder_editing__` | Missing content still renders `<Content>` so the editor has an empty canvas. `client:idle` hydrates the SDK. |

Editing loads every lift-html loader. A published page loads only the loaders for custom components in that content (including components nested in Symbols and variations). `astro check` fails if a registered component has no `wcLoaders` entry.

In the Builder page model, set the preview URL to this site's origin and the dynamic URL to `origin + targeting urlPath`.
