# PhoneServices Monorepo

This project is now split into two independent apps:

- `client/` -> React frontend (Vite)
- `server/` -> Node.js + Express backend (MongoDB)

## Final Structure

```text
root
  client/
    package.json
    src/
    public/
    vite.config.js
    .env.example
    .env.vercel.example
  server/
    package.json
    server.js
    routes/
    controllers/
    middleware/
    models/
    config/
    scripts/
    data/
    .env.example
    .env.render.example
  README.md
```

## Local Development

### Quick Start (from repo root)

```bash
npm run install:all
npm run dev:server
npm run dev:client
```

Use two terminals for the `dev:server` and `dev:client` commands.

### 1) Start Backend

```bash
cd server
npm install
npm run dev
```

Backend runs on `http://localhost:5000` by default.

Phone dataset import:

```bash
cd server
npm run import:phones
```

Default file location: `server/data/phones.csv`

### 2) Start Frontend

```bash
cd client
npm install
npm start
```

Frontend runs on `http://localhost:5173` by default.

## Environment Variables

### Frontend (`client/.env`)

Use either variable:

```env
REACT_APP_API_URL=http://localhost:5000
# or
VITE_API_BASE_URL=http://localhost:5000/api
```

`REACT_APP_API_URL` is normalized automatically to `.../api` when needed.

### Backend (`server/.env`)

```env
MONGO_URI=mongodb://127.0.0.1:27017/phoneservices
PORT=5000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=replace_with_secure_secret
JWT_REFRESH_SECRET=replace_with_secure_refresh_secret
```

## Deployment

- Frontend: deploy `client/` to Vercel
- Backend: deploy `server/` to Render
- MongoDB: configure `MONGO_URI` in Render environment variables

## Notes

- CORS is enabled on backend and configured via `CORS_ORIGIN`.
- Backend imports no frontend files; default catalog data is now owned by `server/data/defaultCatalog.js`.
