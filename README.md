# astro-builder-lift-html

Builder.io pages rendered in Astro. Custom components are React when the visual editor needs a React component, and interactive pieces that ship to visitors are web components via [lift-html](https://github.com/JLarky/lift-html).

A visual CMS like [Builder.io](https://www.builder.io/) makes every piece of a page editable and interactive, but sending all that interactivity as JavaScript makes the bundle grow with every interactive part, which does not scale. The floor is already high because the Builder SDK and React ship as baseline, and it is hard to keep the bundle small as you scale with components: it is hard to make it so that you are not paying for components sometimes, even if they are not on that page. The interactive editor keeps full functionality; the smaller bundle is for the production page. This demo shows the alternative: interactive components as web components via lift-html, so the bundle drops from 300 kilobytes gzipped to 10 kilobytes gzipped.

Live at [astro-builder-lift-html.vercel.app](https://astro-builder-lift-html.vercel.app). The homepage explains the two component patterns and links to the plain React tabbed FAQ at `/react-faq`, the repo, lift-html, and Builder.io. Published Builder `page` entries are served by the catch-all at the URL path stored on the entry. `src/pages/builder-demo.astro` is gone.

## Video

<!-- TODO: YOUTUBE_VIDEO_URL -->

Walkthrough: [TODO_YOUTUBE_VIDEO_URL](TODO_YOUTUBE_VIDEO_URL). Replace `TODO_YOUTUBE_VIDEO_URL` when the recording is published. The same token is the `YOUTUBE_VIDEO_URL` constant in `src/pages/index.astro`. The homepage shows "Video coming soon" until that constant is an `https://` URL.

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

## Custom components

The convention in [PR #37](https://github.com/JLarky/astro-builder-lift-html/pull/37) (open, not merged) is one folder per component. `src/builder/<Folder>/definition.ts` supplies the Builder registration. An optional `src/builder/<Folder>/wc/Loader.astro` supplies the lifted element. That PR auto-discovers both with `import.meta.glob`, so adding a component does not mean editing `customComponents` and `wcLoaders` by hand. A definition with no `wc/Loader.astro` gets an empty loader list. Discovery is in flight on #37.

On main those lists are still written by hand. Counter is `src/builder/Counters/CounterRC.ts`, registered from `src/builder/builder-registry.ts`. `src/builder/wc-loaders.ts` maps the component name to loader modules. An empty array means the component has no lifted element. `astro check` fails when a registered name is missing from that map.

### lift-html and the React escape hatch

The lift-html pattern is what Counter does. The React component registered with Builder renders a `<my-counter>` element and passes inputs as attributes (`initial-count`, `safe-to-modify`). `src/builder/Counters/wc/Loader.astro` imports the Solid class built with `liftSolid` from `@lift-html/solid` (`src/builder/Counters/wc/solid/Counter.tsx`). That script upgrades the element in the browser. A published page includes the loader and does not hydrate the Builder React tree, so the click handlers are the web component, not React.

The escape hatch is a React component registered as a Builder custom component with no web component and no loader. The editor hydrates `BuilderContent` while `__builder_editing__` is set, so that React component can run in the editor. A published page server-renders it and does not ship that component's React to the client, so it is not interactive there. FAQ demos are being added to show both patterns. `/react-faq` is a plain React island (`client:load` on its own route), not one of those Builder registrations.

## Builder pages

[PR #36](https://github.com/JLarky/astro-builder-lift-html/pull/36) (merged) added `src/pages/[...slug].astro` and removed the hard-coded `builder-demo` page. `getBuilderContent` in `src/builder/builder.ts` calls `fetchOneEntry` for the `page` model with `userAttributes.urlPath` set to the request path. `BuilderContentAstro` in `src/components/BuilderContentAstro.astro` renders the result. The API key is `src/config.ts` (`PUBLIC_BUILDER_API_KEY`, otherwise the demo public key).

Editing is `searchParams.has('__builder_editing__')`. SDK `isEditing()` only returns true inside the editor iframe, so it is not used during SSR. The route does not check a `builder.editing` param.

When `__builder_editing__` is present, `getBuilderContent` returns every `wcLoaders` entry, and `BuilderContentAstro` hydrates `BuilderContent` with `client:idle`. A published response walks the Builder JSON with `collectComponents` and returns only the loaders for names that appear in that entry. The React tree is rendered without a client directive. If there is no content and the request is not editing, the route rewrites to `/404`.

## CI

The workflow job is "Format and astro check" (`.github/workflows/ci.main.ts`, generated to `.github/workflows/ci.generated.yml`). It runs `bun run fmt:check`, then `bun run check`.

`check` is `astro check --minimumFailingSeverity warning` in `package.json`. [PR #42](https://github.com/JLarky/astro-builder-lift-html/pull/42) (merged) set that flag. `@astrojs/check` defaults the failing severity to `error`, so warnings used to exit 0. `warning` makes the process exit non-zero on a warning or an error. Hints still do not fail the check.

## Open pull requests

These are open. None of them are merged.

- [#38](https://github.com/JLarky/astro-builder-lift-html/pull/38) — in development, `createBuilderComponent` checks that Builder `inputs` names match the keys of the Valibot object schema. A mismatch is thrown instead of rendering with a silent name mismatch.
- [#37](https://github.com/JLarky/astro-builder-lift-html/pull/37) — auto-discover `src/builder/<Folder>/definition.ts` and optional `wc/Loader.astro`.
- [#40](https://github.com/JLarky/astro-builder-lift-html/pull/40) — `BuilderContent` accepts `outlet`, `footer`, and `header` and passes those slot children through `OptionsProvider`.
