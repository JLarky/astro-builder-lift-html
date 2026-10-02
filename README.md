# astro-builder-lift-html

Builder.io pages rendered in Astro. Custom components are React when the visual editor needs a React component, and interactive pieces that ship to visitors are web components via [lift-html](https://github.com/JLarky/lift-html).

Live at [astro-builder-lift-html.vercel.app](https://astro-builder-lift-html.vercel.app).

## Video

Walkthrough: [https://youtube.com/live/gFVBliU7k5k](https://youtube.com/live/gFVBliU7k5k).

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
