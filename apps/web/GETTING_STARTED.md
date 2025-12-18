# Getting Started with CNAR Sugu Web Application

## Quick Start

### Prerequisites
- Node.js 18 or higher
- pnpm 8 or higher

### Installation

From the monorepo root:
```bash
pnpm install
```

### Development

Start the development server:
```bash
# From monorepo root
pnpm dev

# Or specifically for web app
pnpm --filter @cnarsugu/web dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# From monorepo root
pnpm build

# Or specifically for web app
pnpm --filter @cnarsugu/web build
```

### Start Production Server

```bash
pnpm --filter @cnarsugu/web start
```

## Environment Configuration

Copy `.env.example` to `.env.local` and configure:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v2
NEXT_PUBLIC_API_VERSION=v2

# Environment
NODE_ENV=development
```

## Available Routes

- `/` - Home page with product overview
- `/auto-prestige` - Auto Prestige insurance page
- `/moto` - Motorcycle insurance page
- `/multirisk-pro` - Professional multi-risk insurance page
- `/iac` - Personal accident insurance page

## Project Structure

```
apps/web/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   ├── providers.tsx # Redux Provider
│   │   └── [product]/    # Product pages
│   ├── components/       # React components (to be added)
│   └── lib/             # Utilities
│       └── utils.ts     # Helper functions
├── public/              # Static assets
└── [config files]       # Configuration files
```

## Key Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + RTK Query
- **Shared Packages**: @cnarsugu/* monorepo packages

## Performance Features

### Image Optimization
- Automatic image optimization with Next.js Image component
- AVIF and WebP format support
- Responsive image sizes

### ISR (Incremental Static Regeneration)
- Product pages revalidate every 1 hour
- Improved performance and SEO
- Stale-while-revalidate strategy

### Caching
- Static assets cached for 1 year
- Product pages cached with revalidation
- Security headers on all routes

## Development Tips

### Type Checking
```bash
pnpm --filter @cnarsugu/web type-check
```

### Linting
```bash
pnpm --filter @cnarsugu/web lint
```

### Verify Setup
```bash
cd apps/web
node verify-setup.js
```

## Shared Packages

This app uses shared packages from the monorepo:

- `@cnarsugu/types` - TypeScript type definitions
- `@cnarsugu/schemas` - Zod validation schemas
- `@cnarsugu/store` - Redux store and RTK Query APIs
- `@cnarsugu/hooks` - Custom React hooks
- `@cnarsugu/utils` - Utility functions

Changes to these packages will automatically be reflected in the web app during development.

## Next Steps

1. Implement product pages (Tasks 26-30)
2. Create enrollment flow (Task 31)
3. Implement payment flow (Task 32)
4. Add confirmation page (Task 33)
5. Create UI components (Task 34)

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, you can specify a different port:
```bash
PORT=3001 pnpm dev
```

### Type Errors
Run type checking to identify issues:
```bash
pnpm type-check
```

### Build Errors
Clear the Next.js cache:
```bash
rm -rf .next
pnpm build
```

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
