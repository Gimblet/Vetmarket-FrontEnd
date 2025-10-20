
import { Producto } from "../producto/Producto";
import { DetalleOrden } from "./DetalleOrden";

export interface DetalleProducto extends DetalleOrden {
  cantidad: number;
  producto: Producto;
}