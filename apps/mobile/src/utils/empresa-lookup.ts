
import type { Empresa } from "../services/mock.data";

export function nombreProveedor(empresaId: string, empresas: Empresa[]): string {
  return empresas.find((e) => e.id === empresaId)?.razonSocial ?? "Proveedor desconocido";
}