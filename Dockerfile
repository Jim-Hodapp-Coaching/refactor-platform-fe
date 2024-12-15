FROM node:18-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

RUN npm install

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Receive the build args from docker-compose.yaml
ARG NEXT_PUBLIC_BACKEND_SERVICE_PROTOCOL
ARG NEXT_PUBLIC_BACKEND_SERVICE_HOST
ARG NEXT_PUBLIC_BACKEND_SERVICE_PORT
ARG NEXT_PUBLIC_BACKEND_API_VERSION
ARG FRONTEND_SERVICE_INTERFACE
ARG FRONTEND_SERVICE_PORT

# And convert them to environment variables for runtime
ENV NEXT_PUBLIC_BACKEND_SERVICE_PROTOCOL=$NEXT_PUBLIC_BACKEND_SERVICE_PROTOCOL
ENV NEXT_PUBLIC_BACKEND_SERVICE_HOST=$NEXT_PUBLIC_BACKEND_SERVICE_HOST
ENV NEXT_PUBLIC_BACKEND_SERVICE_PORT=$NEXT_PUBLIC_BACKEND_SERVICE_PORT
ENV NEXT_PUBLIC_BACKEND_API_VERSION=$NEXT_PUBLIC_BACKEND_API_VERSION

RUN echo "NEXT_PUBLIC_BACKEND_SERVICE_PROTOCOL: ${NEXT_PUBLIC_BACKEND_SERVICE_PROTOCOL}"
RUN echo "NEXT_PUBLIC_BACKEND_SERVICE_HOST: ${NEXT_PUBLIC_BACKEND_SERVICE_HOST}"
RUN echo "NEXT_PUBLIC_BACKEND_SERVICE_HOST: ${NEXT_PUBLIC_BACKEND_SERVICE_PORT}"
RUN echo "NEXT_PUBLIC_BACKEND_SERVICE_HOST: ${NEXT_PUBLIC_BACKEND_API_VERSION}"
RUN echo "FRONTEND_SERVICE_INTERFACE: ${FRONTEND_SERVICE_INTERFACE}}"
RUN echo "FRONTEND_SERVICE_PORT: ${FRONTEND_SERVICE_PORT}}"

RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder /app/package.json ./

USER nextjs

# Expose the port Next.js runs on
EXPOSE $FRONTEND_SERVICE_PORT

ENV HOSTNAME=$FRONTEND_SERVICE_INTERFACE
ENV PORT=$FRONTEND_SERVICE_PORT

# Run the app using JSON array notation
CMD ["node", "server.js"]
