import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, pool } from './index';
import { users, empresas, productos, categorias } from './schema';

async function main() {
  console.log('Sembrando datos de demo...');

  const cats = await db.select().from(categorias);
  const catByNombre = (nombre: string) => cats.find((c) => c.nombre === nombre)?.id;

  const empresasSeed = [
    {
      email: 'demo-construccion@proveedores.co',
      nombre: 'Admin Demo',
      razonSocial: 'Ferretería y Materiales del Eje SAS',
      categoria: 'Construccion',
      ciudad: 'Manizales', departamento: 'Caldas',
      descripcion: 'Materiales de construcción y ferretería para obra civil.',
      destacada: true, verificada: true,
      productos: [
        { nombre: 'Cemento gris 50kg', precio: '32000' },
        { nombre: 'Varilla corrugada 3/8"', precio: '18500' },
        { nombre: 'Ladrillo tolete x100', precio: '145000' },
      ],
    },
    {
      email: 'demo-tecnologia@proveedores.co',
      nombre: 'Admin Demo',
      razonSocial: 'TecnoSuministros del Café',
      categoria: 'Tecnologia',
      ciudad: 'Pereira', departamento: 'Risaralda',
      descripcion: 'Equipos de cómputo y suministros de oficina.',
      destacada: true, verificada: true,
      productos: [
        { nombre: 'Laptop 14" 8GB RAM', precio: '2450000' },
        { nombre: 'Resma papel carta x500', precio: '15000' },
      ],
    },
    {
      email: 'demo-agro@proveedores.co',
      nombre: 'Admin Demo',
      razonSocial: 'Agroinsumos del Eje',
      categoria: 'Agroindustria',
      ciudad: 'Armenia', departamento: 'Quindio',
      descripcion: 'Insumos agrícolas para cultivos de café y plátano.',
      destacada: true, verificada: true,
      productos: [
        { nombre: 'Fertilizante NPK 25kg', precio: '98000' },
        { nombre: 'Guantes de nitrilo x100', precio: '42000' },
      ],
    },
    {
      email: 'demo-textil@proveedores.co',
      nombre: 'Admin Demo',
      razonSocial: 'Textiles Manizales',
      categoria: 'Textil',
      ciudad: 'Manizales', departamento: 'Caldas',
      descripcion: 'Confección y venta de textiles al por mayor.',
      destacada: false, verificada: true,
      productos: [{ nombre: 'Tela lino x metro', precio: '22000' }],
    },
    {
      email: 'demo-alimentos@proveedores.co',
      nombre: 'Admin Demo',
      razonSocial: 'Distribuidora de Alimentos Caldas',
      categoria: 'Alimentos',
      ciudad: 'Manizales', departamento: 'Caldas',
      descripcion: 'Distribución de alimentos no perecederos.',
      destacada: false, verificada: false, // ejemplo de una PENDIENTE de revisión
      productos: [{ nombre: 'Arroz x bulto 50kg', precio: '135000' }],
    },
  ];

  for (const e of empresasSeed) {
    const [existingUser] = await db.select().from(users).where(eq(users.email, e.email)).limit(1);
    if (existingUser) {
      console.log(`Ya existe: ${e.razonSocial}, saltando.`);
      continue;
    }

    const passwordHash = await bcrypt.hash('Demo1234!', 12);
    const [user] = await db
      .insert(users)
      .values({ nombre: e.nombre, email: e.email, passwordHash, emailVerified: true })
      .returning();

    const [empresa] = await db
      .insert(empresas)
      .values({
        userId: user.id,
        razonSocial: e.razonSocial,
        categoriaId: catByNombre(e.categoria) ?? null,
        ciudad: e.ciudad,
        departamento: e.departamento,
        descripcion: e.descripcion,
        destacada: e.destacada,
        verificada: e.verificada,
      })
      .returning();

    for (const p of e.productos) {
      await db.insert(productos).values({
        empresaId: empresa.id,
        nombre: p.nombre,
        precio: p.precio,
        imagenUrl: `https://picsum.photos/seed/${empresa.id}-${p.nombre.replace(/\s/g, '')}/400`,
      });
    }

    console.log(`Creado: ${e.razonSocial} (${e.destacada ? 'destacada' : 'normal'}, ${e.verificada ? 'verificada' : 'pendiente'})`);
  }

  console.log('Listo.');
  await pool.end();
}

main().catch((err) => {
  console.error('Seed falló:', err);
  process.exit(1);
});