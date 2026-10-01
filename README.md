# astro-builder-lift-html

Builder.io pages rendered in Astro. Custom components are React when the visual editor needs a React component, and interactive pieces that ship to visitors are web components via [lift-html](https://github.com/JLarky/lift-html).

Builder allows us to use custom React components on the page, but you don't just hydrate that one small component. You have to send React and Builder React SDK and a lot of code that might not even be used on that page. With the approach used in this repo (of conditionally hydrating the page), we can send just the JavaScript that is used on the page.

Live at [astro-builder-lift-html.vercel.app](https://astro-builder-lift-html.vercel.app). The React FAQ at `/react-faq` is also registered for Builder as `FaqReact` (React as-is) and `FaqLift` (lift-html).

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
