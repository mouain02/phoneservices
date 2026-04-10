# PhoneServices Monorepo

This project is now split into two independent apps:

- `frontend/` -> React frontend (Vite)
- `backend/` -> Node.js + Express backend (MongoDB)

## Final Structure

```text
root
  frontend/
    package.json
    src/
    public/
    vite.config.js
  backend/
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
npm run dev:backend
npm run dev:frontend
```

Use two terminals for the `dev:backend` and `dev:frontend` commands.

### 1) Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000` by default.

Mobile API device sync:

```bash
cd backend
npm run fetch:mobileapi
```

### 2) Start Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:8080` by default.
If port 8080 is busy, Vite will automatically use the next free port.

## Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)

```env
MONGODB_URI=mongodb+srv://<db-user>:<db-password>@<cluster-host>/phoneservices?retryWrites=true&w=majority
PORT=5000
CORS_ORIGIN=http://localhost:8080
JWT_SECRET=replace_with_secure_secret
JWT_REFRESH_SECRET=replace_with_secure_refresh_secret
TRUST_PROXY=false
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=1000
REQUEST_BODY_LIMIT=15mb
```

Recommended local CORS value for current Vite config:

```env
CORS_ORIGIN=http://localhost:8080,http://127.0.0.1:8080
```

## Deployment

- Frontend: deploy `frontend/` to Vercel
- Backend: deploy `backend/` to Render
- MongoDB: configure `MONGODB_URI` with your MongoDB Atlas connection string in Render environment variables

## Notes

- CORS is enabled on backend and configured via `CORS_ORIGIN`.
- Backend imports no frontend files; default catalog data is now owned by `backend/data/defaultCatalog.js`.
