export interface DetalleVentaDTO {
  detalleId: number;
  ordenId: number;
  tipoItem: string;
  nombreItem: string;
  fecha: Date | string;
  precio: number;
  total: number;
  cantidad: number;
}