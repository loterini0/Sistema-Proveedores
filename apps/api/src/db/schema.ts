import { pgTable, uuid, varchar, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const rfqStatusEnum = pgEnum('rfq_status', [
  'draft',
  'active',
  'closed',
  'awarded',
  'cancelled',
]);
export const userRoleEnum = pgEnum('user_role', ['admin', 'editor', 'viewer']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  verifyToken: varchar('verify_token', { length: 255 }),
  resetToken: varchar('reset_token', { length: 255 }),
  resetTokenExpiresAt: timestamp('reset_token_expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const empresas = pgTable('empresas', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  razonSocial: varchar('razon_social', { length: 255 }).notNull(),
  nit: varchar('nit', { length: 20 }).unique(),
  sector: varchar('sector', { length: 100 }),
  sectorNivel2: varchar('sector_nivel2', { length: 100 }),
  descripcion: text('descripcion'),
  ciudad: varchar('ciudad', { length: 100 }),
  departamento: varchar('departamento', { length: 100 }),
  telefono: varchar('telefono', { length: 20 }),
  website: varchar('website', { length: 255 }),
  logoUrl: varchar('logo_url', { length: 500 }),
  activo: boolean('activo').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productos = pgTable('productos', {
  id: uuid('id').defaultRandom().primaryKey(),
  empresaId: uuid('empresa_id')
    .references(() => empresas.id)
    .notNull(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  descripcion: text('descripcion'),
  precio: varchar('precio', { length: 50 }),
  imagenUrl: varchar('imagen_url', { length: 500 }),
  activo: boolean('activo').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const rfqs = pgTable('rfqs', {
  id: uuid('id').defaultRandom().primaryKey(),
  compradorId: uuid('comprador_id')
    .references(() => users.id)
    .notNull(),
  empresaCompradorId: uuid('empresa_comprador_id').references(() => empresas.id),
  titulo: varchar('titulo', { length: 255 }).notNull(),
  descripcion: text('descripcion').notNull(),
  cantidad: varchar('cantidad', { length: 100 }),
  presupuesto: varchar('presupuesto', { length: 100 }),
  fechaLimite: timestamp('fecha_limite'),
  privada: boolean('privada').default(true).notNull(),
  status: rfqStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const cotizaciones = pgTable('cotizaciones', {
  id: uuid('id').defaultRandom().primaryKey(),
  rfqId: uuid('rfq_id')
    .references(() => rfqs.id)
    .notNull(),
  proveedorId: uuid('proveedor_id')
    .references(() => users.id)
    .notNull(),
  empresaProveedorId: uuid('empresa_proveedor_id').references(() => empresas.id),
  precioUnitario: varchar('precio_unitario', { length: 100 }),
  precioTotal: varchar('precio_total', { length: 100 }),
  plazoEntrega: varchar('plazo_entrega', { length: 100 }),
  condicionesPago: text('condiciones_pago'),
  observaciones: text('observaciones'),
  ganadora: boolean('ganadora').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const rfqDestinatarios = pgTable('rfq_destinatarios', {
  id: uuid('id').defaultRandom().primaryKey(),
  rfqId: uuid('rfq_id')
    .references(() => rfqs.id)
    .notNull(),
  empresaId: uuid('empresa_id')
    .references(() => empresas.id)
    .notNull(),
});
