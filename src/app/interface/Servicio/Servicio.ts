export interface ServicioRequestDTO {
  precio: number;
  nombre: string;
  descripcion: string;
  idUsuario: number;
  // se deben agregar los atributos correspondientes
}

export interface ServicioResponseDTO {
  idServicio: number;
  precio: number;
  nombre: string;
  descripcion: string;
  idUsuario: number;
  nombreUsuario: string;
  apellido: string;
  telefono: string;
}
