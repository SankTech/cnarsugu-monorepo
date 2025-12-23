# Multi-stage build for Next.js web app (Web-only deployment)
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.15.4

# Copy workspace configuration and all package.json files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/schemas/package.json ./packages/schemas/
COPY packages/store/package.json ./packages/store/
COPY packages/hooks/package.json ./packages/hooks/
COPY packages/utils/package.json ./packages/utils/

# Install all dependencies including dev dependencies for build
RUN NODE_ENV=development pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies and workspace files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy all source code
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/
COPY tsconfig.base.json ./
COPY turbo.json ./

# Install pnpm
RUN npm install -g pnpm@8.15.4

# Re-install dependencies to ensure workspace symlinks are correct
# We use the cached node_modules from deps but need to reconstruct local links
RUN pnpm install --frozen-lockfile

# Build from root using the same command that works locally
# Build from root using the same command that works locally
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_VERSION
ARG NEXT_PUBLIC_API_KEY
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_VERSION
ARG NEXT_PUBLIC_PAYMENT_CALLBACK_URL
ARG NEXT_PUBLIC_ENABLE_LEGACY_PRODUCTS
ARG NEXT_PUBLIC_ENABLE_DEBUG_MODE

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_API_VERSION=$NEXT_PUBLIC_API_VERSION \
    NEXT_PUBLIC_API_KEY=$NEXT_PUBLIC_API_KEY \
    NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME \
    NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION \
    NEXT_PUBLIC_PAYMENT_CALLBACK_URL=$NEXT_PUBLIC_PAYMENT_CALLBACK_URL \
    NEXT_PUBLIC_ENABLE_LEGACY_PRODUCTS=$NEXT_PUBLIC_ENABLE_LEGACY_PRODUCTS \
    NEXT_PUBLIC_ENABLE_DEBUG_MODE=$NEXT_PUBLIC_ENABLE_DEBUG_MODE

RUN pnpm run build:web

# Development image for hot reloading
FROM base AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm@8.15.4
EXPOSE 3000
CMD ["pnpm", "run", "dev", "--filter=@cnarsugu/web"]

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]