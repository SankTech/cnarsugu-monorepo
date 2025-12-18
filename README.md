# CNAR Sugu Insurance Platform - Monorepo

Modern insurance subscription platform with Next.js web application and React Native mobile application.

## 🏗️ Project Structure

```
cnarsugu-monorepo/
├── apps/
│   ├── web/              # Next.js web application
│   └── mobile/           # React Native mobile application
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── schemas/          # Zod validation schemas
│   ├── store/            # Redux Toolkit store and RTK Query
│   ├── hooks/            # Shared React hooks
│   ├── utils/            # Shared utilities
│   ├── eslint-config/    # Shared ESLint configuration
│   ├── prettier-config/  # Shared Prettier configuration
│   └── typescript-config/# Shared TypeScript configuration
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install dependencies
pnpm install
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run specific app
pnpm --filter web dev
pnpm --filter mobile dev

# Build all apps
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## 📦 Packages

### Applications

- **web**: Next.js 14+ web application with App Router
- **mobile**: React Native 0.74+ mobile application with Expo

### Shared Packages

- **@cnarsugu/types**: TypeScript type definitions
- **@cnarsugu/schemas**: Zod validation schemas
- **@cnarsugu/store**: Redux Toolkit store with RTK Query
- **@cnarsugu/hooks**: Shared React hooks
- **@cnarsugu/utils**: Utility functions and constants
- **@cnarsugu/eslint-config**: ESLint configuration
- **@cnarsugu/prettier-config**: Prettier configuration
- **@cnarsugu/typescript-config**: TypeScript configuration

## 🛠️ Tech Stack

### Web
- Next.js 14+
- React 18+
- TypeScript 5+
- Tailwind CSS + shadcn/ui
- Redux Toolkit + RTK Query

### Mobile
- React Native 0.74+
- Expo 51+
- TypeScript 5+
- NativeWind
- Redux Toolkit + RTK Query

### Shared
- Turborepo (monorepo orchestration)
- pnpm (package management)
- Zod (validation)
- Vitest (testing)

## 📝 Scripts

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps and packages
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code
- `pnpm format` - Format all code with Prettier
- `pnpm clean` - Clean all build artifacts and node_modules

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

Private - CNAR Sugu Insurance Platform
