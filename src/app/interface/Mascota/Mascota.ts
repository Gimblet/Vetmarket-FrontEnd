import { Usuario } from '../Usuario/Usuario';

export interface MascotaCreateRequest {
  nombre: string;
  edad: number;
  peso: number;
  especie: string;
  raza: string;
  idUsuario: number;
}

export interface MascotaUpdateRequest {
  nombre: string;
  edad: number;
  peso: number;
  especie: string;
  raza: string;
}

export interface Mascota {
  idMascota: number;
  nombre: string;
  edad: number;
  peso: number;
  especie: string;
  raza: string;
  // usuario?: Usuario;
  idUsuario: number;
}
