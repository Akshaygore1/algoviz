# DSA Visualizer

An interactive learning app for exploring data structures, algorithms, interview
patterns, and problem-solving techniques step by step.

## Development

Install Node.js and npm, then run:

```sh
npm install
npm run dev
```

The development server listens on port 8080. You can also use Bun with
`bun install` and `bun run dev`.

For a production build:

```sh
npm run build
```

Run the production server locally with `npm start` after building.

## Deployment

Import the repository into Vercel. Vercel detects Next.js automatically and
uses `npm run build`; no adapter or worker configuration is required.

## Built with

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
