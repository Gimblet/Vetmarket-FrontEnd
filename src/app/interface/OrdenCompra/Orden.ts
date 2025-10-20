import { DetalleOrden } from "./DetalleOrden";
import { Usuario } from "../Usuario/Usuario";

export interface Orden {
    numeroOrden: number;
    fecha: Date | string;
    total: number;
    comisionTotal: number;
    usuario: Usuario;
    detalle: DetalleOrden[];
}