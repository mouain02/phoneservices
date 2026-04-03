# Vercel Deployment Checklist

Use this checklist when frontend shows: "Cannot reach the API server. Make sure backend is running and API URL is correct."

## 1) Deploy Frontend (Vercel)

Set these environment variables in the Vercel project settings:

- `REACT_APP_API_URL=https://<your-backend-domain>`
- or `VITE_API_BASE_URL=https://<your-backend-domain>/api`

Rules:

- Use `https` in production.
- Do not use `localhost` in production.
- Include `/api` suffix.

Example:

- `REACT_APP_API_URL=https://phoneservices-api.onrender.com`

## 2) Deploy Backend

Your backend host can be Render, Railway, Fly.io, VPS, or any Node host.

Set backend environment variables:

- `MONGO_URI=<your-production-mongo-uri>`
- `JWT_SECRET=<long-random-secret>`
- `JWT_REFRESH_SECRET=<long-random-secret>`
- `CORS_ORIGIN=https://<your-frontend-domain>`

If your backend supports wildcard CORS patterns, you may also allow Vercel previews:

- `CORS_ORIGIN=https://<your-frontend-domain>,https://*.vercel.app`

Important:

- If you use cookies with credentials, do not use `*` as CORS origin.
- Keep frontend and backend both on `https` to avoid mixed-content blocking.

## 3) Health Check

After backend deployment, verify this URL directly in browser:

- `https://<your-backend-domain>/api/health`

Expected: JSON success response (for example status "ok").

If this fails, frontend cannot work regardless of UI settings.

## 4) Validate From Frontend

After setting env vars, trigger a redeploy of frontend and backend.

Then:

- Open browser DevTools -> Network.
- Trigger login/action that calls the API.
- Verify request URL starts with `https://<your-backend-domain>/api`.
- Verify response is not blocked by CORS.

## 5) Common Failure Patterns

- Frontend env still points to `http://localhost:5000/api`.
- Backend CORS only allows local origin.
- Frontend is `https`, backend URL is `http` (mixed content blocked).
- Environment variable changed but no redeploy performed.

## 6) Security Checklist

- Rotate any leaked secrets immediately.
- Do not commit real `.env` values.
- Keep a `.env.example` with placeholders only.

Example placeholders:

- `JWT_SECRET=replace-with-long-random-value`
- `JWT_REFRESH_SECRET=replace-with-long-random-value`
- `ADMIN_PASSWORD=replace-me`
