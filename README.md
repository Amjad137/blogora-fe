## Blogora Frontend (Next.js)

Blogora FE is a Next.js App Router application built with TypeScript, TailwindCSS, Radix/shadcn UI, TanStack Query, Axios, and Zustand. It consumes the Blogora API and provides authentication, posts management, comments, likes, and a responsive UI.

### Tech Stack

- Next.js 15 (App Router), React 19 RC
- TypeScript, TailwindCSS, Radix UI/shadcn components
- TanStack Query & Table, Axios, Zustand

### Prerequisites

- Node.js >= 18.17.0 (Node 20 recommended)
- Yarn 1.x
- Running Blogora API (see `blogora-api`)

### Environment Variables

Create `.env.local` (or run `yarn env:copy:dev`):

```env
# API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_API_VERSION=v1

# AWS S3 for images/uploads (required at build-time by next.config.ts)
NEXT_PUBLIC_S3_BUCKET_NAME=your-bucket
NEXT_PUBLIC_AWS_REGION=ap-south-1
```

Note: `next.config.ts` will throw if S3 variables are missing to avoid misconfigured builds.

### Install & Run

```bash
yarn
yarn dev
# open http://localhost:3000
```

### Build & Start

```bash
yarn build
yarn start
```

### Useful Scripts

- `yarn dev`: start dev server (copies env: `yarn env:copy:dev`)
- `yarn build`, `yarn start`: production build and start
- `yarn lint`, `yarn lint:fix`: linting
- `yarn format`, `yarn format:fix`: Prettier
- `yarn release:*`: version bump and export `src/version.ts`

### Project Structure

```
src/
  app/                 # App Router routes and layouts
  components/          # UI, shared components (Radix/shadcn)
  config/              # Axios and env config
  dto/                 # Typed DTOs shared across services
  hooks/               # React hooks (auth, data, etc.)
  providers/           # React Query, Auth providers
  services/            # API service wrappers (Axios)
  stores/              # Zustand stores
  styles/              # Global styles
  utils/               # Utilities (error handler, s3 helpers, etc.)
```

### Backend Integration

Ensure the API is running at `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8000/api`). Swagger is available at `http://localhost:8000/api/docs` in non‑production.

### Notes

- Using React 19 RC and Next 15 for modern features. Pin versions to avoid upstream breaking changes.
- Images are served from S3; ensure the bucket and region envs are set both locally and in hosting.
