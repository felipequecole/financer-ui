FROM node:20-alpine AS base
RUN npm i -g pnpm

FROM base AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
ENV PUBLIC_API_URL="http://api:8000"

RUN pnpm run build
RUN pnpm prune --production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
ENV PUBLIC_API_URL="api:8000"
ENV VITE_API_URL="api:8000"
CMD [ "node", "build" ]