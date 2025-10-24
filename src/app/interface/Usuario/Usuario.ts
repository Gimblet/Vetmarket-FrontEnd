import { Mascota } from "../Mascota/Mascota";
import { Orden } from "../OrdenCompra/Orden";
import { Producto } from "../producto/Producto";
import { Servicio } from "../Servicio/Servicio";
import { Rol } from "./Rol";

export interface Usuario {
  idUsuario: number
  nombre: string
  apellido: string
  numeroDocumento: string
  telefono: string
  direccion: string
  correo: string
  ruc?: string
  username: string
  password?: string

  rol: Rol

  producto?: Producto;
  orden?: Orden;
  servicio?: Servicio;
  mascotas?: Mascota;
}