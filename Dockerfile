FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN mkdir -p dist/infrastructure/grpc/proto && cp -R src/infrastructure/grpc/proto/* dist/infrastructure/grpc/proto/

FROM node:20-alpine AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/app.js"]
