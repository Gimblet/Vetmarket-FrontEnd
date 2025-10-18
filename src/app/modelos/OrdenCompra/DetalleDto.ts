export interface DetalleDto {
  nombre: string;
  precio: number;
  total: number;
  cantidad: number;
  
  fechaCita?: Date | string;
  idServicio?: number;
  idMascota?: number;
  
  idUsuario: number;
  
  idProducto?: number; 
}