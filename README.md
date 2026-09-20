# DSA Visualizer

An interactive learning app for exploring data structures, algorithms, interview
patterns, and problem-solving techniques step by step.

## Development

Install [Bun](https://bun.sh), then run:

```sh
bun install
bun run dev
```

The development server listens on port 8080.

Before opening a pull request, run the validation suite:

```sh
bun run lint
bun run typecheck
bun run build
```

Build and serve the static production output locally:

```sh
bun run start
```

The production build is written to `out/`. It can be deployed to any static host; no Next.js
server is required.

## Project structure

- `src/app/` contains App Router routes, metadata, and global styles. Route wrappers retain
  build-time metadata and static route generation, while visible page content is mounted through
  `ClientOnly` and rendered in the browser.
- `src/app/**/_components/` contains UI that belongs to a single route. The underscore keeps
  these folders out of the routing tree.
- `src/components/layout/` contains the application shell, navigation, and theme controls.
- `src/components/content/` contains page compositions shared by multiple routes.
- `src/components/ui/` contains shadcn primitives, while `src/components/viz/` contains reusable
  visualization components.
- `src/data/` contains serializable learning content, while `src/lib/` contains reusable logic and
  visualization state.

## Deployment

Run `bun run build` and deploy the generated `out/` directory. Vercel can detect and deploy the
static export automatically; other static hosts should use `out/` as their publish directory.

## Social preview image

The shared 1200 × 630 preview is `src/app/opengraph-image.png`, with its editable source in
`public/og-image.svg`. After editing the SVG, regenerate the PNG:

```sh
node --input-type=module -e "import sharp from 'sharp'; await sharp('public/og-image.svg').png().toFile('src/app/opengraph-image.png');"
```

The root layout sets the production domain to `https://algoviz1.vercel.app`. Pages inherit the
shared image and use their own title and description for Open Graph and Twitter previews.

## Built with

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
