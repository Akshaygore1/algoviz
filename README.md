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

Run the production server locally after building:

```sh
bun run start
```

## Project structure

- `src/app/` contains App Router routes, metadata, and global styles. Keep `page.tsx` files as
  Server Components unless browser-only behavior is required.
- `src/app/**/_components/` contains UI that belongs to a single route. The underscore keeps
  these folders out of the routing tree.
- `src/components/layout/` contains the application shell, navigation, and theme controls.
- `src/components/content/` contains page compositions shared by multiple routes.
- `src/components/ui/` contains shadcn primitives, while `src/components/viz/` contains reusable
  visualization components.
- `src/data/` contains serializable learning content, while `src/lib/` contains reusable logic and
  visualization state.

## Deployment

Import the repository into Vercel. Vercel detects Next.js automatically and
uses the Bun lockfile and `bun run build`; no adapter or worker configuration is required.

## Built with

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
