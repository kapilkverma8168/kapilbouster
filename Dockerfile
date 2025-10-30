# Stage 1: Build
FROM node:18-slim AS builder


WORKDIR /app

# Set build-time memory allocation to avoid heap crashes
ENV NODE_OPTIONS="--max-old-space-size=4092"

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:18-slim

WORKDIR /app

# Install a lightweight static file server
RUN npm install -g serve

# Copy the built files from the builder stage
COPY --from=builder /app/build ./build

# Expose the port and start the server
EXPOSE 4008
CMD ["serve", "-s", "build", "-l", "4008"]

