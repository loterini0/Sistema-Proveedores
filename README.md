# Sistema Proveedores

Plataforma B2B para gestion de proveedores y solicitudes de cotizacion (RFQ).

## Stack
- Backend: Node.js + Express + TypeScript
- Mobile/Web: React Native + Expo
- DB: PostgreSQL + Drizzle ORM
- CI/CD: GitHub Actions

## Levantar el proyecto

```bash
npm install
cp apps/api/.env.example apps/api/.env
docker compose up -d postgres
cd apps/api && npm run db:migrate
npm run dev:api
```

## Verificar
```bash
curl http://localhost:3000/health
# {"status":"ok","version":"0.1.0","env":"development"}
```

## Auth (ya implementado)
```bash
# Registro
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Tu Nombre","email":"tu@email.com","password":"12345678"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","password":"12345678"}'
```

## Links
- Repo: https://github.com/loterini0/Sistema-Proveedores
- Rama de trabajo: develop
- Ver CONTRIBUTING.md para tareas por persona
