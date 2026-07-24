# Contributing Guide

## Team

| Dev | Rol | Enfoque |
|-----|-----|---------|
| Lotero| Revisor y Apoyo | Revisa PRs de ambos equipos. Nada se mergea sin su aprobacion |
| Jeronimo | Backend | Endpoints core conectados a DB |
| Gabriel | Backend Support | Apoya a Jeronimo, endpoints simples |
| Samuel | Mobile Lead | Arquitectura mobile, navegacion, componentes base |
| Alejandro | Mobile Dev | Pantallas RFQ y empresas |

---

## Setup inicial (todos)

```bash
# 1. Clonar el repo
git clone https://github.com/loterini0/Sistema-Proveedores.git
cd Sistema-Proveedores

# 2. Instalar dependencias
npm install

# 3. Variables de entorno
cp apps/api/.env.example apps/api/.env

# 4. Levantar base de datos con Docker
docker compose up -d postgres

# 5. Correr migraciones
cd apps/api && npm run db:migrate

# 6. Verificar que funciona
curl http://localhost:3000/health

# 7. Levantar API
npm run dev:api
```
---

## Flujo de trabajo Git

### Ramas
- main — produccion, solo via PR aprobado por Juan
- develop — integracion, solo via PR aprobado por Juan
- feature/RF-XXX-descripcion — una rama por requerimiento

### Crear una rama
```bash
git checkout develop
git pull origin develop
git checkout -b feature/RF-AUTH-01-user-registration
```

### Commits (en ingles, conventional commits)
feat(auth): add user registration endpoint
fix(rfq): correct file upload validation
chore: update dependencies
test(empresa): add search endpoint tests

### Abrir un PR
1. Push de tu rama a origin
2. Abrir PR hacia develop en GitHub
3. El CI debe pasar (tests + lint)
4. Asignar a Lotero como reviewer
5. Esperar aprobacion antes de mergear

---

## Ejemplo de endpoint terminado

Ver como referencia:
- Servicio: apps/api/src/services/auth.service.ts
- Controller: apps/api/src/controllers/auth.controller.ts
- Ruta: apps/api/src/routes/auth.routes.ts

El patron es siempre:
1. Logica de negocio en service (conecta a DB con Drizzle)
2. Controller solo recibe request y llama al service
3. Ruta registra el endpoint y aplica middlewares

---

## Estructura del proyecto
apps/
api/
src/
controllers/   Request/response
routes/        Endpoints
middleware/    Auth, validacion, uploads
services/      Logica de negocio + DB
db/            Schema + migraciones
types/         Schemas Zod
mobile/
app/             Pantallas (Expo Router)
src/
services/      Llamadas a la API
store/         Estado global (Zustand)
components/    Componentes reutilizables
