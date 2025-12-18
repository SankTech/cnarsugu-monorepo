# Multi-stage build for Next.js web app (Web-only deployment)
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.15.4

# Copy only web app and shared packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/schemas/package.json ./packages/schemas/
COPY packages/store/package.json ./packages/store/
COPY packages/hooks/package.json ./packages/hooks/
COPY packages/utils/package.json ./packages/utils/

# Install dependencies (web-focused)
RUN pnpm install --frozen-lockfile --filter=@cnarsugu/web...

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Copy only necessary files for web build
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/
COPY tsconfig.base.json ./
COPY turbo.json ./

# Install pnpm
RUN npm install -g pnpm@8.15.4

# Build shared packages first
RUN pnpm run build --filter=@cnarsugu/types
RUN pnpm run build --filter=@cnarsugu/schemas
RUN pnpm run build --filter=@cnarsugu/store
RUN pnpm run build --filter=@cnarsugu/hooks
RUN pnpm run build --filter=@cnarsugu/utils

# Build the web app
RUN pnpm run build --filter=@cnarsugu/web

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

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/web/server.js"]