import type { Rfq, RfqDestinatario } from "../services/mock.data";

export function puedeCotizar(
  rfq: Rfq,
  empresaId: string | null,
  destinatarios: RfqDestinatario[]
): boolean {
  if (!empresaId) return false;
  if (!rfq.privada) return true;
  return destinatarios.some((d) => d.rfqId === rfq.id && d.empresaId === empresaId);
}