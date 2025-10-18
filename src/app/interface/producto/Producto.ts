import {SafeUrl} from '@angular/platform-browser';

export type Producto = {
  idProducto: number;
  precio: number;
  stock: number;
  nombre: string;
  descripcion: string;

  // IMAGEN
  imagen: SafeUrl;

  // DATOS DE VETERINARIA

  idUsuario: number;
  ruc: string;
  username: string;
  correo: string;
  telefono: string;
  direccion: string;
};
