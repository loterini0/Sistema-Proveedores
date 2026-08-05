// Este archivo existe únicamente para cargar las variables de entorno ANTES
// que cualquier otro módulo (como db/index.ts, que crea el Pool de Postgres
// al importarse). No debe tener imports propios: si los tuviera, TypeScript
// los "hoistearía" por encima de este código, reproduciendo el mismo bug
// que estamos arreglando (dotenv cargando después de que el Pool ya se
// construyó con DATABASE_URL undefined).
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('dotenv').config();
}
