FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY knexfile.cjs alias-register.js alias-hooks.js ./
COPY src ./src

EXPOSE 3000

CMD ["sh", "-c", "npx knex migrate:latest --knexfile knexfile.cjs && node --import ./alias-register.js src/server.js"]
