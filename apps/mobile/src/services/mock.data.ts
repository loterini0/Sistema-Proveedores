//tipos base

export type UserRole = "admin" | "editor" | "viewer";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
}

export interface Empresa {
  id: string;
  userId: string;
  razonSocial: string;
  nit: string;
  sector: string;
  sectorNivel2: string;
  ciudad: string;
  departamento: string;
}

export interface Producto {
  id: string;
  empresaId: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
}

export type RfqStatus = "draft" | "active" | "closed" | "awarded" | "cacelled";

export interface Rfq {
  id: string;
  compradorId: string;
  titulo: string;
  descripcion: string;
  privada: boolean;
  status: RfqStatus;
  fechaLimite: string;
}

export interface Cotizacion {
  id: string;
  rfqId: string;
  proveedorId: string; // empresas.id de quien cotiza
  precioTotal: number;
  plazoEntrega: string;
  ganadora: boolean;
}

export interface RfqDestinatario {
  id: string;
  rfqId: string;
  empresaId: string;
}

// Mocks

export const mockUsuarios: Usuario[] = [
  {
    id: "usr-001",
    nombre: "Carlos Restrepo",
    email: "carlos@ferreteriaandina.co",
    emailVerified: true,
    role: "admin",
  },
  {
    id: "usr-002",
    nombre: "Laura Gomez",
    email: "laura@tecnosuministros.co",
    emailVerified: true,
    role: "admin",
  },
  {
    id: "usr-003",
    nombre: "Andres Osorio",
    email: "andres@agroinsumoseje.co",
    emailVerified: false,
    role: "editor",
  },
];

export const mockEmpresas: Empresa[] = [
  {
    id: "emp-001",
    userId: "usr-001",
    razonSocial: "Ferreteria Andina S.A",
    nit: "900123456-1",
    sector: "Construccion",
    sectorNivel2: "Materiales y ferreteria",
    ciudad: "Manizales",
    departamento: "Caldas",
  },
  {
    id: "emp-002",
    userId: "usr-002",
    razonSocial: "TecnoSuminstros del cafe",
    nit: "900987654-3",
    sector: "Contruccion",
    sectorNivel2: "Equipos de computo y oficina",
    ciudad: "Pereira",
    departamento: "Risaralda",
  },
  {
    id: "emp-003",
    userId: "usr-003",
    razonSocial: "Distribuidora Agroinsumos del Eje",
    nit: "901234567-8",
    sector: "Agroindustria",
    sectorNivel2: "Insumos agricolas",
    ciudad: "Armenia",
    departamento: "Quindio",
  },
];

export const mockProductos: Producto[] = [
  {
    id: "prod-001",
    empresaId: "emp-001",
    nombre: "Cemento gris 50 KG",
    descripcion: "Cemento tipo UG para construccion general",
    precio: 32000,
    imagenUrl: "https://picsum.photos/seed/prod-001/400",
  },
  {
    id: "prod-002",
    empresaId: "emp-001",
    nombre: 'Varilla corrugada 3/8"',
    descripcion: "Varilla de refuerzo estructural, 6 metros",
    precio: 18500,
    imagenUrl: "https://picsum.photos/seed/prod-002/400",
  },
  {
    id: "prod-003",
    empresaId: "emp-002",
    nombre: 'Laptop 14" 8GB RAM',
    descripcion: "Equipo portatil para oficina, procesador Intel i5",
    precio: 2450000,
    imagenUrl: "https://picsum.photos/seed/prod-003/400",
  },
  {
    id: "prod-004",
    empresaId: "emp-002",
    nombre: "Resma papel carta",
    descripcion: "Resma de 500 hojas tamaño carta, 75g",
    precio: 15000,
    imagenUrl: "https://picsum.photos/seed/prod-004/400",
  },
  {
    id: "prod-005",
    empresaId: "emp-003",
    nombre: "Fertilizante NPK 25 KG",
    descripcion: "Fertilizante compuesto para cultivos de cafe y platano",
    precio: 98000,
    imagenUrl: "https://picsum.photos/seed/prod-005/400",
  },
  {
    id: "prod-006",
    empresaId: "emp-003",
    nombre: "Guante de nitrilo caja x100",
    descripcion: "Guantes desechables para compuestos de agroquimicos",
    precio: 42000,
    imagenUrl: "https://picsum.photos/seed/prod-006/400",
  },
];

export const mockRfqs: Rfq[] = [
  {
    id: "rfq-001",
    compradorId: "emp-002",
    titulo: "Compra de materiales para obra civil",
    descripcion:
      "Requerimos cemento y varillas para proyecto de vivienda en Manizales",
    privada: false,
    status: "active",
    fechaLimite: "2026-07-20T23:59:59.000Z",
  },
  {
    id: "rfq-002",
    compradorId: "emp-001",
    titulo: "Equipo de computo para nueva sede",
    descripcion:
      "Cotizacion de laptops y suminstros de oficina para 15 puestos de trabajo",
    privada: true, //solo visible para las empresas listadas en rfq_destinatarios
    status: "awarded",
    fechaLimite: "2026-07-05T23:59:59.000Z",
  },
  {
    id: "rfq-003",
    compradorId: "emp-003",
    titulo: "Insumos agricolas temporada 2026-B",
    descripcion: "Fertilizante y elementos de seguridad para personal de campo",
    privada: false,
    status: "closed",
    fechaLimite: "2026-06-01T23:59:59.000Z",
  },
];

// rfq-002 es privada --> solo tecno suminstros fue invitada a cotizar

export const mockRfqDestinatarios: RfqDestinatario[] = [
  { id: "rfqdest-001", rfqId: "rfq-002", empresaId: "emp-002" },
];

export const mockCotizaciones: Cotizacion[] = [
  {
    id: "cot-001",
    rfqId: "rfq-001",
    proveedorId: "emp-001",
    precioTotal: 15650000,
    plazoEntrega: "5 dias habiles",
    ganadora: false, //rfq-001 sigue "active", aun no hay decision
  },

  {
    id: "cot-002",
    rfqId: "rfq-002",
    proveedorId: "emp-002",
    precioTotal: 37200000,
    plazoEntrega: "10 dias habiles",
    ganadora: true, //rfq-002 está "award" y esta fue la cotizacion ganadora
  },

  {
    id: "cot-003",
    rfqId: "rfq-003",
    proveedorId: "emp-003",
    precioTotal: 8420000,
    plazoEntrega: "7 dias habiles",
    ganadora: false, //rfq-003 quedo "closed" sin adjudicar
  },
];
