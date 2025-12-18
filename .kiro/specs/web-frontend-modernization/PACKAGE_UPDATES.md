# Package Updates Summary

This document outlines the key packages that will be added/updated in the modernization project.

## Root Dependencies

```json
{
  "devDependencies": {
    "turbo": "^2.0.0",
    "@changesets/cli": "^2.27.0",
    "typescript": "^5.3.0",
    "prettier": "^3.1.0",
    "eslint": "^8.56.0"
  }
}
```

## Shared Packages

### packages/store

**New Package** - Redux Toolkit state management

```json
{
  "name": "@cnarsugu/store",
  "dependencies": {
    "@reduxjs/toolkit": "^2.0.0",
    "redux": "^5.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-redux": "^9.0.0"
  }
}
```

### packages/types

**New Package** - Shared TypeScript types

```json
{
  "name": "@cnarsugu/types",
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

### packages/schemas

**New Package** - Zod validation schemas

```json
{
  "name": "@cnarsugu/schemas",
  "dependencies": {
    "zod": "^3.22.0"
  }
}
```

### packages/hooks

**New Package** - Shared React hooks

```json
{
  "name": "@cnarsugu/hooks",
  "dependencies": {
    "react-redux": "^9.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "@cnarsugu/store": "workspace:*"
  }
}
```

### packages/utils

**New Package** - Utility functions

```json
{
  "name": "@cnarsugu/utils",
  "dependencies": {
    "date-fns": "^3.0.0",
    "isomorphic-dompurify": "^2.0.0"
  }
}
```

### packages/ui

**New Package** - Shared UI components (optional for later)

```json
{
  "name": "@cnarsugu/ui",
  "dependencies": {
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "peerDependencies": {
    "react": "^18.0.0"
  }
}
```

## Web Application (apps/web)

**New Application** - Next.js web app

```json
{
  "name": "@cnarsugu/web",
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^9.0.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "framer-motion": "^11.0.0",
    "tailwindcss": "^3.4.0",
    "@cnarsugu/store": "workspace:*",
    "@cnarsugu/types": "workspace:*",
    "@cnarsugu/schemas": "workspace:*",
    "@cnarsugu/hooks": "workspace:*",
    "@cnarsugu/utils": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0"
  }
}
```

### Key shadcn/ui Components to Install

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add progress
```

## Mobile Application (apps/mobile)

**Updated Application** - React Native with Expo

### Packages to Update

```json
{
  "name": "@cnarsugu/mobile",
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.74.0",
    "expo": "~51.0.0",
    "react-redux": "^9.0.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/native-stack": "^6.9.0",
    "react-native-screens": "~3.31.0",
    "react-native-safe-area-context": "4.10.0",
    "nativewind": "^4.0.0",
    "@shopify/flash-list": "^1.6.0",
    "expo-secure-store": "~13.0.0",
    "@cnarsugu/store": "workspace:*",
    "@cnarsugu/types": "workspace:*",
    "@cnarsugu/schemas": "workspace:*",
    "@cnarsugu/hooks": "workspace:*",
    "@cnarsugu/utils": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0"
  }
}
```

### Packages to Remove

```json
{
  "remove": [
    "easy-peasy",
    "@react-native-async-storage/async-storage"
  ]
}
```

## Testing Packages

### Unit & Integration Testing

```json
{
  "devDependencies": {
    "vitest": "^1.2.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/react-native": "^12.4.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "msw": "^2.0.0",
    "fast-check": "^3.15.0"
  }
}
```

### E2E Testing

```json
{
  "devDependencies": {
    "@playwright/test": "^1.41.0",
    "detox": "^20.0.0"
  }
}
```

## Migration Strategy

### Phase 1: Setup Monorepo
1. Install Turborepo: `pnpm add -Dw turbo`
2. Create `turbo.json` configuration
3. Create `pnpm-workspace.yaml`
4. Set up folder structure

### Phase 2: Create Shared Packages
1. Create each package folder
2. Initialize package.json for each
3. Install dependencies
4. Build and test

### Phase 3: Create Web App
1. Run `npx create-next-app@latest apps/web`
2. Install dependencies
3. Configure Tailwind and shadcn/ui
4. Link shared packages

### Phase 4: Update Mobile App
1. Update React Native and Expo versions
2. Install new dependencies
3. Remove old dependencies
4. Link shared packages
5. Update imports

### Phase 5: Testing
1. Install testing dependencies
2. Configure test runners
3. Write tests

## Key Configuration Files

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Root package.json Scripts

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean && rm -rf node_modules",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  }
}
```
