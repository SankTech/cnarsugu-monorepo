# CNAR Sugu Web Application

Next.js web application for CNAR Sugu insurance platform.

## Features

- **Auto Prestige**: Car insurance with multiple coverage formulas
- **Moto**: Motorcycle insurance for all categories
- **Multirisque Pro**: Professional multi-risk insurance packages
- **IAC**: Personal accident insurance

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit with RTK Query
- **Shared Packages**: Monorepo packages (@cnarsugu/*)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

From the monorepo root:

```bash
pnpm install
```

### Development

```bash
# From monorepo root
pnpm dev

# Or specifically for web app
pnpm --filter @cnarsugu/web dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Build

```bash
# From monorepo root
pnpm build

# Or specifically for web app
pnpm --filter @cnarsugu/web build
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v2
NEXT_PUBLIC_API_VERSION=v2
```

## Project Structure

```
apps/web/
├── src/
│   ├── app/              # App router pages
│   │   ├── layout.tsx    # Root layout with Redux Provider
│   │   ├── page.tsx      # Home page
│   │   ├── auto-prestige/
│   │   ├── moto/
│   │   ├── multirisk-pro/
│   │   └── iac/
│   ├── components/       # React components
│   └── lib/             # Utilities and helpers
├── public/              # Static assets
└── next.config.ts       # Next.js configuration
```

## Shared Packages

This app uses shared packages from the monorepo:

- `@cnarsugu/types`: TypeScript type definitions
- `@cnarsugu/schemas`: Zod validation schemas
- `@cnarsugu/store`: Redux store and RTK Query APIs
- `@cnarsugu/hooks`: Custom React hooks
- `@cnarsugu/utils`: Utility functions

## Performance Optimizations

- Image optimization with Next.js Image component
- Incremental Static Regeneration (ISR) for product pages
- Code splitting and lazy loading
- Optimized package imports

## License

Proprietary - CNAR Sugu
