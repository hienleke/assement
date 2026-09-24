# MQTT Backend

Express API that receives MQTT messages and publishes device commands. Postgres stores the `beacons` table through Knex.

## Run

Run every command from the `backend` directory. You need Node.js 22+ and the CA file at `cert/emqxsl-ca.crt`.

1. Install dependencies and create the env file.

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with the broker URL, username, password, and certificate path. Do not commit `.env`. `DATABASE_URL` already points at `localhost:5432`.

2. Start the Postgres container. This creates the `mqtt` database and exposes port `5432`.

```bash
docker compose up -d db
```

3. Apply migrations, then load sample rows. Both commands must be run inside `backend`. Migration and seed files must use the `.cjs` extension.

```bash
npx knex migrate:latest --knexfile knexfile.cjs
npx knex seed:run --knexfile knexfile.cjs
```

`migrate:latest` prints `Batch 1 run: 1 migrations` the first time it creates `beacons`. `seed:run` prints `Ran 1 seed files` when `src/db/seeds/seed_beacons.cjs` is found. A `.js` seed file is ignored and Knex prints `No seed files exist`.

4. Start the server. It listens on `http://localhost:3000` and connects to the MQTT broker.

```bash
npm run dev
```

`npm run dev` restarts when code changes. `npm start` runs once.

To roll back the latest migration:

```bash
npx knex migrate:rollback --knexfile knexfile.cjs
```

## Docker

`docker compose up --build` starts Postgres and the API. The API container runs migrations, then starts the server. Inside Compose, `DATABASE_URL` uses host `db` instead of `localhost`.

## Environment

| Variable | Meaning |
| --- | --- |
| `PORT` | HTTP port, default `3000` |
| `DATABASE_URL` | Postgres connection string |
| `MQTT_URL` | Broker URL (`mqtts://` for TLS) |
| `MQTT_CERTIFICATE` | CA file path, relative to `backend` |
| `MQTT_USERNAME` / `MQTT_PASSWORD` | Broker credentials |
| `MQTT_CLIENT_ID` | MQTT client id |
| `MQTT_TOPIC` | Topic to subscribe to |
| `MQTT_QOS` | Subscribe and publish QoS |

## API

- `GET /messages/stream` streams MQTT messages as Server-Sent Events.
- `GET /messages` returns `{ "count": 0, "messages": [] }`.
- `POST /beacons/:id/led` with `{ "state": "on" }` or `{ "state": "off" }` publishes to `zena/{id}/cmd`.
- `GET /beacons` returns every row from the `beacons` table. `GET /beacons/:id` returns one row, or `404` when that id does not exist.

## Layout

```
src/server.js                 start HTTP and MQTT
src/app.js                    mount routers and middleware
src/config.js                 load .env
src/routes/                   map URL to controller
src/controllers/              handle the request
src/models/                   read and write the database
src/middleware/               validate input and handle errors
src/mqtt/client.js            MQTT connection
src/db/knex.js                Knex client
src/db/migrations/            schema changes (.cjs)
src/db/seeds/                 seed data (.cjs)
knexfile.cjs                  Knex CLI config
docker-compose.yml            Postgres and API
```
