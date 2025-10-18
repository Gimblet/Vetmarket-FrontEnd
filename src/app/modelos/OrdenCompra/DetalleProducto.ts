import { Producto } from "../Producto/Producto";
import { DetalleOrden } from "./DetalleOrden";

export interface DetalleProducto extends DetalleOrden {
  cantidad: number;
  producto: Producto;
}