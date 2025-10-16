import { Orden } from "./Orden";

export interface DetalleOrden {
    idDetalle: number;
    nombre: string;
    precio: number;
    total: number;
    comision: number;
    orden: Orden;
}