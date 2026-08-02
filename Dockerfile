# Stage 1: Install dependencies
FROM node:26-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package manifests to leverage Docker caching
COPY package.json package-lock.json* ./
RUN corepack enable
RUN npm i -g pnpm
RUN pnpm install

# Stage 2: Build the application
FROM node:26-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for production build optimization
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN corepack enable
RUN npm i -g pnpm
RUN pnpm build

# Stage 3: Runner environment
FROM node:26-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security compliance
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set up the appropriate directories and copy standalone files
COPY --from=builder /app/public ./public

# Automatically leverage standalone output formatting
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 7000
ENV PORT=7000
ENV HOSTNAME="0.0.0.0"

# Execute utilizing the built-in standalone server entrypoint
CMD ["node", "server.js"]
