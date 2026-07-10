# Builds and runs the NestJS API (apps/api-lms) for the "single command"
# docker compose startup. Build context is the repo root (see docker-compose.yml)
# because this is an npm workspaces monorepo: local packages
# (@cerios/database, @cerios/shared-types) must be present to install/build.
FROM node:24-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm ci

RUN npm run build -w packages/shared-types \
	&& npm run build -w packages/database \
	&& npx prisma generate --schema packages/database/prisma/schema.prisma \
	&& npm run build -w apps/api-lms

ENV NODE_ENV=production
EXPOSE 3000

# Apply pending migrations, seed sample data (idempotent), then start the API.
CMD ["sh", "-c", "npm run prisma:deploy -w packages/database && npm run prisma:seed -w packages/database && node apps/api-lms/dist/main.js"]
