# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Production image, copy all the files and run next
FROM cypress/base:22.15.0 AS runner
WORKDIR /app

LABEL \
  io.hass.version="2025.4.4" \
  io.hass.type="addon" \
  io.hass.arch="amd64"

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends jq && apt-get clean
RUN npx cypress install

COPY run.sh ./
COPY --from=deps /app/node_modules/vendus-export/cypress ./node_modules/vendus-export/cypress
COPY --from=deps /app/node_modules/vendus-export/cypress.config.js ./node_modules/vendus-export
COPY --from=deps /app/node_modules/cypress-downloadfile ./node_modules/vendus-export/node_modules/cypress-downloadfile
COPY --from=deps /app/node_modules/cross-fetch ./node_modules/vendus-export/node_modules/cross-fetch
COPY --from=deps /app/node_modules/fs-extra ./node_modules/vendus-export/node_modules/fs-extra
# COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["./run.sh"]
