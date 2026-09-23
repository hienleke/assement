FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY knexfile.cjs ./
COPY src ./src

EXPOSE 3000

CMD ["sh", "-c", "npx knex migrate:latest --knexfile knexfile.cjs && node src/server.js"]
