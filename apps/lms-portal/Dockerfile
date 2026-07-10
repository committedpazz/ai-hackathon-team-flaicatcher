# Builds the React/Vite portal (apps/lms-portal) and serves the static output
# via nginx, for the "single command" docker compose startup. Build context
# is the repo root (see docker-compose.yml) so the @cerios/shared-types
# workspace package is available.
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm ci
RUN npm run build -w packages/shared-types

# Vite inlines import.meta.env values at build time, so the API URL the
# browser will call must be provided as a build arg (docker-compose.yml
# passes VITE_API_URL from the root .env file).
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build -w apps/lms-portal

FROM nginx:alpine AS runtime
COPY --from=build /app/apps/lms-portal/dist /usr/share/nginx/html
COPY apps/lms-portal/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
