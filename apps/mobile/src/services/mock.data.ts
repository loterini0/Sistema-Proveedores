//tipos base

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  referencePrice: number;
}

export interface Company {
  id: string;
  name: string;
  ruc: string;
  category: string;
  city: string;
  calification: number;
  verify: boolean;
  products: Product[];
}

export type RfqState = "abierto" | "en_revision" | "cerrado";

export interface RfqItem {
  id: string;
  productName: string;
  amount: number;
  unit: string;
}

export interface Rfq {
  id: string;
  title: string;
  description: string;
  state: RfqState;
  applicantCompanyId: string;
  creationDate: string;
  limitDate: string;
  items: RfqItem[];
}

export type contributionState = "pendiente" | "aceptada" | "rechazada";

export interface Price {
  id: string;
  rfqId: string;
  supplierCompanyId: string;
  totalAmount: number;
  badge: string;
  state: contributionState;
  dispatchDate: string;
  notes: string;
}

// Mocks

export const mockCompany: Company[] = [
  {
    id: "comp-001",
    name: "Ferreteria Andina S.A",
    ruc: "900123456-1",
    category: "Materiales de construccion",
    city: "Manizales",
    calification: 4.6,
    verify: true,
    products: [
      {
        id: "prod-001",
        name: "Cemento gris 50KG",
        category: "Contruccion",
        unit: "bulto",
        referencePrice: 32000,
      },
      {
        id: "prod-002",
        name: 'Varilla corrugada 3/8"',
        category: "Contruccion",
        unit: "unidad",
        referencePrice: 18500,
      },
    ],
  },
  {
    id: "comp-002",
    name: "TecnoSuministros del Café",
    ruc: "900987654-3",
    category: "Tecnologia e insumos de oficina",
    city: "Pereira",
    calification: 4.2,
    verify: true,
    products: [
      {
        id: "prod-003",
        name: 'laptop 14" 8GB RAM',
        category: "Tecnologia",
        unit: "unidad",
        referencePrice: 2450000,
      },
      {
        id: "prod-004",
        name: "Resma papel carta",
        category: "Oficina",
        unit: "resma",
        referencePrice: 15000,
      },
    ],
  },
  {
    id: "comp-003",
    name: "Distribuidora Agroinsumos del Eje",
    ruc: "901234567-8",
    category: "Agroindustria",
    city: "Armenia",
    calification: 3.9,
    verify: false,
    products: [
      {
        id: "prod-005",
        name: "Fertilizante NPK 25KG",
        category: "Agroindustria",
        unit: "bulto",
        referencePrice: 98000,
      },
      {
        id: "prod-006",
        name: "Guantes de nitrilo caja x100",
        category: "Seguridad industrial",
        unit: "caja",
        referencePrice: 42000,
      },
    ],
  },
];

export const mockRfqs: Rfq[] = [
  {
    id: "rfq-001",
    title: "Compra de materiales para obra civil",
    description:
      "Requerimos cemento y varillas para proyecto de viviendo den Manizales",
    state: "abierto",
    applicantCompanyId: "comp-002",
    creationDate: "2026-06-20T10:00:00.000Z",
    limitDate: "2026-07-20T23:59:59.000Z",
    items: [
      {
        id: "item-001",
        productName: "Cemento gris 50KG",
        amount: 200,
        unit: "bulto",
      },
      {
        id: "item-002",
        productName: 'Varilla corrugada 3/8"',
        amount: 500,
        unit: "unidad",
      },
    ],
  },
  {
    id: "rfq-002",
    title: "Equipos de computo para nueva sede",
    description:
      "Cotizacion de laptops y suministros de oficina para 15 puestos de trabajo",
    state: "en_revision",
    applicantCompanyId: "comp-001",
    creationDate: "2026-06-15T09:30:00.000Z",
    limitDate: "2026-07-05T23:59:59.000Z",
    items: [
      {
        id: "item-003",
        productName: 'Laptop 14" 8GB RAM',
        amount: 15,
        unit: "unidad",
      },
      {
        id: "item-004",
        productName: "Resma papel carta",
        amount: 30,
        unit: "resma",
      },
    ],
  },
  {
    id: "rfq-003",
    title: "Insumos agrícolas temporada 2026-B",
    description: "Fertilizante y elementos de seguridad para personal de campo",
    state: "cerrado",
    applicantCompanyId: "emp-003",
    creationDate: "2026-05-10T08:00:00.000Z",
    limitDate: "2026-06-01T23:59:59.000Z",
    items: [
      {
        id: "item-005",
        productName: "Fertilziante NPK 25KG",
        amount: 80,
        unit: "bulto",
      },
      {
        id: "item-006",
        productName: "Guantes de nitrilo caja x100",
        amount: 20,
        unit: "caja",
      },
    ],
  },
];

export const mockContribution: Price[] = [
  {
    id: "pri-001",
    rfqId: "rfq-001",
    supplierCompanyId: "emp-001",
    totalAmount: 15650000,
    badge: "COP",
    state: "pendiente",
    dispatchDate: "2026-06-25T14:00:00.000Z",
    notes: "Entrega en obra incluida, tiempo estimado 5 dias habiles",
  },
  {
    id: "pri-002",
    rfqId: "rfq-002",
    supplierCompanyId: "emp-002",
    totalAmount: 37200000,
    badge: "COP",
    state: "aceptada",
    dispatchDate: "2026-06-18T11:20:00.000Z",
    notes: "Incluye instalacion de software base y garantia de 12 meses",
  },
  {
    id: "pri-003",
    rfqId: "rfq-003",
    supplierCompanyId: "emp-003",
    totalAmount: 8420000,
    badge: "COP",
    state: "rechazada",
    dispatchDate: "2026-05-15T16:45:00.000Z",
    notes: "Precio por encima del presupuesto asignado para la temporada",
  },
];
