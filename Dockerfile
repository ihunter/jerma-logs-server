FROM node:22.16.0-slim AS base

ARG PORT=3000
ENV PORT=$PORT
ENV NODE_ENV=production

# Node.js app lives here
WORKDIR /usr/src/app

# Throw-away build stage to reduce size of final image
FROM base as build

# Install build dependencies that might be needed for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install node modules
COPY --link package-lock.json package.json ./

RUN npm ci --include=dev --prefer-offline --no-audit

# Copy application code
COPY --link . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# Final stage for app image
FROM base

# Create non-root user for security
RUN groupadd --gid 1001 --system nodejs && \
    useradd --uid 1001 --system --gid nodejs nodejs

# Install only production runtime dependencies if needed
RUN apt-get update && apt-get install -y \
    dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Copy built application
COPY --from=build --chown=nodejs:nodejs /usr/src/app /usr/src/app

# Switch to non-root user
USER nodejs

ENTRYPOINT ["dumb-init", "--"]

CMD [ "node", "dist/app.js" ]