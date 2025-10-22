import { Mascota } from "../Mascota/Mascota";
import { ServicioResponseDTO } from "../Servicio/Servicio";
import { DetalleOrden } from "./DetalleOrden";

export interface DetalleServicio extends DetalleOrden {
  fechaCita: Date | string;
  servicio: ServicioResponseDTO;
  mascota: Mascota;
}