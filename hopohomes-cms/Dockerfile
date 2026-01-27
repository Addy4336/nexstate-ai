# ================================
# HOPO Homes CMS - Dockerfile
# Multi-stage build for Next.js with Bun
# ================================

# Base stage
FROM oven/bun:1 AS base
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Dependencies stage
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Build stage
FROM base AS build
COPY package.json bun.lock* ./
RUN bun install

# Copy source code
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1-slim AS production

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 -g nodejs nextjs

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built application
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/package.json ./

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT}/ || exit 1

# Start the application
CMD ["bun", "server.js"]
