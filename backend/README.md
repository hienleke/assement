# MQTT Backend

API Express nhận tin nhắn từ broker MQTT (EMQX Cloud) và đẩy ra cho client qua HTTP. Postgres dùng cho health check và các migration sau này.

## Yêu cầu

- Node.js 22+
- PostgreSQL 16 (local hoặc Docker)
- File CA certificate của EMQX tại `cert/emqxsl-ca.crt`

## Cài đặt

```bash
cd backend
npm install
cp .env.example .env
```

Sửa `.env`: điền `MQTT_URL`, `MQTT_USERNAME`, `MQTT_PASSWORD` và đường dẫn certificate. Không commit file `.env`.

## Chạy local

Bật Postgres:

```bash
docker compose up -d db
```

Chạy migration (khi đã có file trong `src/db/migrations`), rồi start server:

```bash
npm run migrate
npm run dev
```

`npm run dev` tự restart khi sửa code. `npm start` chạy một lần, không watch.

Server lắng nghe `http://localhost:3000`.

## Chạy bằng Docker

`docker compose` dựng cả Postgres và API. Container API tự chạy migration rồi start server. Certificate được mount vào `/certs/emqxsl-ca.crt`.

```bash
docker compose up --build
```

## Biến môi trường

| Biến | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `PORT` | `3000` | Cổng HTTP |
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5432/mqtt` | Chuỗi kết nối Postgres |
| `MQTT_URL` | `mqtt://localhost:1883` | URL broker (`mqtts://` khi dùng TLS) |
| `MQTT_CERTIFICATE` | `cert/emqxsl-ca.crt` | Đường dẫn file CA, tính từ thư mục gốc backend |
| `MQTT_USERNAME` | | Username broker |
| `MQTT_PASSWORD` | | Password broker |
| `MQTT_CLIENT_ID` | `assessment-backend-<pid>` | Client id MQTT |
| `MQTT_TOPIC` | `test` | Topic subscribe |
| `MQTT_QOS` | `0` | QoS khi subscribe |

## API

### `GET /health`

Kiểm tra Postgres và trạng thái kết nối MQTT.

```json
{
  "ok": true,
  "database": "up",
  "mqtt": {
    "connected": true,
    "url": "mqtts://your-broker.emqxsl.com:8883",
    "topic": "test"
  }
}
```

### `GET /messages`

Trả danh sách tin đã lưu. Hiện tại luôn rỗng vì tin MQTT chỉ được stream realtime, chưa ghi vào database.

```json
{ "count": 0, "messages": [] }
```

### `GET /messages/stream`

Server-Sent Events. Mỗi client giữ một kết nối mở.

- Ngay khi kết nối: event `ready` với `{ "ok": true, "topic": "..." }`.
- Mỗi tin MQTT: event `message` với `{ "topic", "payload", "receivedAt" }`. `payload` là JSON nếu parse được, nếu không thì là chuỗi.
- Heartbeat `: ping` mỗi 15 giây.

```bash
curl -N http://localhost:3000/messages/stream
```

## Cấu trúc

```
src/
  server.js              # start HTTP + MQTT, tắt kết nối khi SIGINT/SIGTERM
  app.js                 # Express, CORS, JSON, error handler
  config.js              # đọc .env
  routes/
    health.routes.js
    message.routes.js
  mqtt/client.js         # kết nối TLS, subscribe, fan-out listener
  db/
    knex.js              # Knex client
    migrations/          # file migration (.cjs)
```

## Scripts

| Lệnh | Việc làm |
| --- | --- |
| `npm run dev` | Chạy server với `--watch` |
| `npm start` | Chạy server |
| `npm run migrate` | `knex migrate:latest` |
| `npm run migrate:rollback` | Rollback migration gần nhất |
