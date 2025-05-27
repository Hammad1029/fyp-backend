# 1. Build stage
FROM node:lts-alpine3.17 AS builder

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npm config set strict-ssl false

# Set working directory
WORKDIR /app

# Copy dependencies files
COPY package*.json ./
COPY tsconfig.json ./
COPY tsup.config.ts ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Install tsup
RUN npm install --save-dev tsup typescript

# Build the TypeScript code using tsup
RUN npm run build

# 2. Runtime stage
FROM node:lts-alpine3.17

# Set working directory
WORKDIR /app

# Copy only what's needed for running
COPY package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Set environment variables
ENV NODE_ENV=production

EXPOSE 3001

# Create startup command that waits for DB and runs migrations before starting app
CMD ["sh", "-c", "npm run db:deploy && npm run seed && node dist/app.mjs"]

