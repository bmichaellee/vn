FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/package.json
COPY apps/pwa/package.json apps/pwa/package.json
RUN bun install --frozen-lockfile

COPY . .

ARG GIT_COMMIT=dev
ENV GIT_COMMIT=$GIT_COMMIT
ENV NODE_ENV=production

ENV VITE_API_URL=
RUN bun run --cwd apps/pwa build && \
    if [ "$INCLUDE_LAB" = "true" ]; then bun run --cwd apps/lab build; else rm -rf apps/lab; fi

EXPOSE 3000
WORKDIR /app/apps/api
CMD ["bun", "run", "src/index.ts"]
