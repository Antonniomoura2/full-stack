FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY .env.sample .env

COPY package*.json ./
RUN npm install --force

EXPOSE 3000

CMD ["node", "dist/main.js"]
