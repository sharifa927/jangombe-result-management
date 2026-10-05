Project deployment guide

Overview
- `backend-spring`: Spring Boot backend (port 3001)
- Frontend: Angular static build served by nginx in container (port 80 -> 4200 local)

Quick start (docker-compose):

```bash
docker-compose build
docker-compose up
```

Notes
- To use Postgres for production, update `docker-compose.yml` backend env for `SPRING_DATASOURCE_URL`.
- The default H2 file DB is persisted under `backend-spring/data` when running the backend container.

Render backend with a Vercel frontend
- Set `CORS_ALLOWED_ORIGINS` on Render to the exact deployed frontend origin, for example `https://jangombe-school.vercel.app`. Add any production custom domain as another comma-separated origin; do not include paths or a trailing slash.
- Set `SESSION_COOKIE_SAME_SITE` to `none` and `SESSION_COOKIE_SECURE` to `true` so browsers send the `JSESSIONID` cookie on cross-site HTTPS API requests.
- The session cookie remains HttpOnly. Angular's credentials interceptor sends it on API requests; CORS allows credentials only from configured origins and local development origins.
