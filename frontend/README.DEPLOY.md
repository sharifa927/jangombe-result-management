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
