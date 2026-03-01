FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN node ace build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/build .
RUN npm ci --production
ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 3333
CMD ["node", "bin/server.js"]
