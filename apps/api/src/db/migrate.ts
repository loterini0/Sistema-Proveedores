import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

const DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:5432/sistema_proveedores';

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  
  // Test connection first
  const client = await pool.connect();
  console.log('Connected to database!');
  client.release();

  const db = drizzle(pool);
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  console.log('Migrations done!');
  await pool.end();
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
