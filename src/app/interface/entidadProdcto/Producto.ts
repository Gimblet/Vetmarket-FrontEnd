import { Usuario } from '../Usuario/Usuario';

export interface Producto {
  idProducto: number
  precio: number
  stock: number
  nombre: string
  descripcion: string
  imagen: string
  usuario:Usuario
};
