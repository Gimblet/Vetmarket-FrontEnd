import { Mascota } from "../Mascota/Mascota";
import { Servicio } from "../Servicio/Servicio";
import { DetalleOrden } from "./DetalleOrden";

export interface DetalleServicio extends DetalleOrden {
  fechaCita: Date | string;
  servicio: Servicio;
  mascota: Mascota;
}